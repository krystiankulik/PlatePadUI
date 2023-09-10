import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);

  const signUpUser = async () => {
    const response = await api.post("/api/auth/signup", {
      email: email,
      password: password,
    });
    return response.data;
  };

  const { isLoading: isSignUpLoading, mutate: mutateSignUp } = useMutation(signUpUser, {
    onSuccess: () => {
      navigate("/confirm-email");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setErrorMessage(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setEmail(data.get("email")?.toString());
    setPassword(data.get("password")?.toString());
    setConfirmPassword(data.get("confirmPassword")?.toString());
    setErrorMessage(undefined);
  };

  useEffect(    () => {     
    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
      
      if(email && password) {
        mutateSignUp();
      }
      
  }, [email, password, confirmPassword]);

  const wrapCallStatus = (component: any) => (
    <Box sx={{ margin: "1rem" }}>{component}</Box>
  );

  const renderCallStatus = () => {
    if (isSignUpLoading) {
      return wrapCallStatus(<CircularProgress />);
    }
    if (errorMessage) {
      return wrapCallStatus(<Alert severity="error">{errorMessage}</Alert>);
    }
    return null;
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          margin: "2rem",
          padding: "3rem",
          boxShadow: "inset 0 0 8px #4b4a4a",
          borderRadius: "10px",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {renderCallStatus()}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: "white" }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};