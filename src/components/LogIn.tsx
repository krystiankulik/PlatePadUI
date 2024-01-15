import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, CircularProgress, styled } from "@mui/material";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";

const LogInContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  margin: "0 2rem 2rem 2rem",
  padding: "3rem",
  boxShadow: "inset 0 0 8px #4b4a4a",
  borderRadius: "10px",
  [theme.breakpoints.down("sm")]: {
    margin: "0",
    padding: "30px 10px 30px 10px",
  },
}));

interface LogInResponse {
  identityToken: string;
}

export const LogIn = () => {
  const { setToken, removeToken } = useAuthToken();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const callLogin = async () => {
    const response = await api.post<LogInResponse>("/api/auth/login", {
      email: email,
      password: password,
    });
    return response.data;
  };

  const { isLoading: isLogInLoading, mutate: mutateLogIn } = useMutation<
    LogInResponse,
    AxiosError<any>
  >(callLogin, {
    onSuccess: (data) => {
      setToken(data.identityToken);
      setErrorMessage(undefined);
      navigate("/my-recipes");
    },
    onError: (error) => {
      removeToken();
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
    mutateLogIn();
  };

  const wrapCallStatus = (component: any) => (
    <Box
      sx={{
        margin: "1rem",
      }}
    >
      {component}
    </Box>
  );

  const renderCallStatus = () => {
    if (isLogInLoading) {
      return wrapCallStatus(<CircularProgress />);
    }
    if (errorMessage) {
      return wrapCallStatus(<Alert severity="error">{errorMessage}</Alert>);
    }
    return null;
  };

  return (
    <Container component="main" maxWidth="xs">
      <LogInContainer>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: "white" }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </LogInContainer>
    </Container>
  );
};
