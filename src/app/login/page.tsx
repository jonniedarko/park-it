"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { LockOutlined } from "@mui/icons-material";
import {
  Grid,
  Box,
  Avatar,
  Link as MuiLink,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  CssBaseline,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

function Page() {
  const { user, setUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ message: null });
  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();
    setError({ message: null });
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError({
        message:
          response.status === 401
            ? "Invalid email or password"
            : "An Unknown error occured",
      });
      //@todo add snackbar notification
      return console.log(response.statusText);
    }
    const body = await response.json?.();
    const loggedinUser = body?.user || null;
    setUser(loggedinUser);
    return router.replace("/dashboard");
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleForm} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Typography color="error">{error.message ?? " "}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register">
                  <MuiLink variant="body2" component="span">
                    {"Don't have an account? Sign Up"}
                  </MuiLink>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Page;
