"use client";
import React from "react";

import { useRouter } from "next/navigation";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import { LockOutlined } from "@mui/icons-material";

export default function RegsiterUserPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const handleForm = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return console.log(response.statusText);
    }
    const result = await response.json();
    return router.push("/login");
  };

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleForm} sx={{ mt: 3 }}>
            <Grid container spacing={2} >
              <Grid item xs={6} sm={12} gap={2} spacing={2}>
                <Grid item >
                  <TextField
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item >
                  <TextField
                    required
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login">
                    <MuiLink variant="body2">
                      Already have an account? Sign in
                    </MuiLink>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    );
}
