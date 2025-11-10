import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import Feed from "./feed/Feed.jsx";

/* Root Application Component */
export default function App() {
  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mini Social App
          </Typography>

          {/* Navigation Links */}
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/feed">
            Feed
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Box>
    </>
  );
}
