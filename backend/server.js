import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Post } from "./models.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const router = express.Router();

/* Middleware Setup */
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

/* Database Setup */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

/* Utility Functions */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

/* Auth Routes */
router.post("/auth/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, passwordHash });

    return res.status(201).json({
      message: "Signup successful",
      token: generateToken(newUser),
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    return res.json({
      message: "Login successful",
      token: generateToken(user),
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* Post Routes */
router.get("/posts", async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    return res.status(500).json({ message: "Failed to load posts" });
  }
});

router.post("/posts", requireAuth, async (req, res) => {
  try {
    const { text, imageUrl } = req.body;
    if (!text && !imageUrl)
      return res.status(400).json({ message: "Post must have text or image" });

    const post = await Post.create({
      authorId: req.user.id,
      authorName: req.user.username,
      text,
      imageUrl,
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ message: "Failed to create post" });
  }
});

router.post("/posts/:id/like", requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const index = post.likes.findIndex((like) => String(like) === String(userId));

    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();
    return res.json(post);
  } catch (error) {
    console.error("Like toggle error:", error);
    return res.status(500).json({ message: "Failed to update like" });
  }
});

router.post("/posts/:id/comment", requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Empty comment" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      userId: req.user.id,
      username: req.user.username,
      text,
      createdAt: new Date(),
    });

    await post.save();
    return res.json(post);
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ message: "Failed to add comment" });
  }
});

router.delete("/posts/:id", requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.authorId) !== String(req.user.id))
      return res.status(403).json({ message: "Unauthorized to delete this post" });

    await Post.deleteOne({ _id: post._id });
    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ message: "Failed to delete post" });
  }
});

/* App Mount */
app.use("/api", router);

/* Server Setup */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
