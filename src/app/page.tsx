import Image from "next/image";
import styles from "./page.module.css";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

const LandingPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Parking Session Tracker
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Monitor and manage your parking sessions easily
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link href="/login">
            <Button variant="contained" color="primary" size="large">
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;
``;
