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
             Register
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleForm}
              sx={{ mt: 1 }}
            >
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
    
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/login">
                    <MuiLink variant="body2">
                      Already have an account? Log in
                    </MuiLink>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
      </Container>
    );
}
