import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import AttachMoney from "@mui/icons-material/AttachMoney";
import CreditCard from "@mui/icons-material/CreditCard";
import Star from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

export const Home = () => {
  return (
    <Box
      sx={{ backgroundColor: "#2b2b2b", color: "#ffffff", textAlign: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "#2b2b2b",
          height: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
        }}
      >
        <Typography variant="h4" component="div">
          Wallet
        </Typography>
        <Box>
          <Link href="#" color="inherit" sx={{ mr: 4 }}>
            Sign up
          </Link>
          <Button
            variant="contained"
            href="https://www.animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-saas&utm_medium=figma-samples"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ backgroundColor: "#bfaff2", borderRadius: 2 }}
          >
            Log in
          </Button>
        </Box>
      </Box>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="div" gutterBottom>
              SaaS Landing Page Template
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.4, mb: 4 }}>
              This is a template Figma file, turned into code using Anima. Learn
              more at AnimaApp.com
            </Typography>
            <Button
              variant="contained"
              href="https://animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-pets&utm_medium=figma-samples"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ backgroundColor: "#f8d57e", borderRadius: 2 }}
            >
              Get started
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#333333",
                borderRadius: 2,
                height: 446,
                backgroundImage:
                  "url(https://cdn.animaapp.com/projects/6244654aadb8856e2018d330/files/1000x892.gif)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: "#2b2b2b", py: 4 }}>
        <Container>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              mb: 4,
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <img src="logos.png" alt="Logos" style={{ width: "80%" }} />
          </Box>
          <Box
            sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.2)" }}
          />
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            backgroundColor: "#fdf5df",
            borderRadius: 2,
            height: 500,
            backgroundImage: "url(/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Container>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <CreditCard sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                Customizable card
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.4 }}>
                Custom your own card for your exact incomes and expenses needs.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <AttachMoney sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                No payment fee
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.4 }}>
                Transfer your payment all over the world with no payment fee.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <AccountBalanceWallet sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                All in one place
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.4 }}>
                The right place to keep your credit and debit cards, boarding
                passes & more.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ py: 8 }}>
        <Box sx={{ backgroundColor: "#bfaff2", borderRadius: 2, p: 4 }}>
          <Typography variant="body1" sx={{ opacity: 0.4, mb: 2 }}>
            Johnny Owens
          </Typography>
          <Avatar
            alt="Johnny Owens"
            src="mask-group.png"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h6" component="div" gutterBottom>
            “Wallet is a great product! All of my most important information is
            there - credit cards, transit cards, boarding passes, tickets, and
            more. And I don't need to worry because it's all in one place!
            thanks!”
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            {[...Array(5)].map((_, index) => (
              <Star key={index} sx={{ color: "#2b2b2b", fontSize: 20 }} />
            ))}
          </Box>
        </Box>
      </Container>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="div" gutterBottom>
              Questions? <br /> Let’s talk
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.4, mb: 4 }}>
              Contact us through our 24/7 live chat. We’re always happy to help!
            </Typography>
            <Button
              variant="contained"
              href="https://animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-pets&utm_medium=figma-samples"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ backgroundColor: "#f8d57e", borderRadius: 2 }}
            >
              Get started
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#333333",
                borderRadius: 2,
                height: 400,
                backgroundImage:
                  "url(https://cdn.animaapp.com/projects/630dc37cacb332ac4dee2e04/files/1000x800.gif)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: "#2b2b2b", py: 4 }}>
        <Container>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
              mb: 4,
            }}
          />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="div" gutterBottom>
                Wallet
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Typography variant="body1">© Wallet 2022</Typography>
                <Link href="#" color="inherit">
                  Privacy policy
                </Link>
                <Link href="#" color="inherit">
                  Cookies policy
                </Link>
                <Link href="#" color="inherit">
                  Terms of use
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                Updates right to your Inbox
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  variant="outlined"
                  placeholder="Email Address"
                  sx={{
                    backgroundColor: "#333333",
                    borderRadius: 2,
                    mr: 2,
                    input: { color: "#ffffff", opacity: 0.4 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton>
                          <AccountBalanceWallet />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  href="https://animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-pets&utm_medium=figma-samples"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ backgroundColor: "#bfaff2", borderRadius: 2 }}
                >
                  Send
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;