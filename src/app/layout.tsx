"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout");

    if (!response.ok) {
      //@todo add snackbar notification
      return console.log(response.statusText);
    }
    return router.replace("/");
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: "light",
      },
    });
  }, []);

  const hideAppBar =
    pathname === "" || pathname === "/" || pathname === "/login";
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ThemeProvider theme={theme}>
          <AuthContextProvider>
            <CssBaseline />
            {hideAppBar ? null : (
              <AppBar position="static" color="primary" enableColorOnDark>
                <Container maxWidth="xl">
                  <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" noWrap>
                        Park It
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                      <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{ mt: "45px" }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={!!anchorElUser}
                        onClose={handleCloseUserMenu}
                      >
                        <MenuItem onClick={handleLogout}>
                          <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Toolbar>
                </Container>
              </AppBar>
            )}
            <Box
              component="main"
              sx={{
                bgcolor: "background.default",
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              {children}
            </Box>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
