import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { getCurrentSession } from "@/firebase/auth/login";

const LandingPage = async () => {
  const { user } = await getCurrentSession();
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
        <Box sx={{ width: "100%", position: "relative" }}>
          <Image
            src="/park-it.svg"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="Dall-e generated logo 😄"
          />
        </Box>
        <Typography variant="h2" fontSize="3rem" gutterBottom>
          Session Tracker
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Monitor and manage your parking sessions easily
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link href={user ? "/dashboard" : "/login"}>
            <Button variant="contained" color="primary" size="large">
              {user ? "Go to dashboard" : "Login to Get Started"}
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;
