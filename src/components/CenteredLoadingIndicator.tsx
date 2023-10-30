"use client";
import React from "react";
import {
  CircularProgress,
  Box
} from "@mui/material";

export function CenteredLoadingIndicator() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <CircularProgress />
    </Box>
  );
}
