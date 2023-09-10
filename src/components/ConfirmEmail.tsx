import { Alert, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

interface ConfirmEmailPayload {
  email: string;
  confirmationCode: string;
}

export const ConfirmEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  
  const navigate = useNavigate();

  const callConfirmation = async () => {
    const response = await api.post('/api/auth/confirm-email', {
      email,
      confirmationCode
    });
    return response.data;
  };

  const { isLoading, mutate } = useMutation<any, AxiosError<any>>(
    callConfirmation,
    {
      onSuccess: () => {
        setErrorMessage(undefined);
        navigate("/login");
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          setErrorMessage(error?.response?.data?.message);
        } else {
          console.error(error);
        }
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
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
          {/* You can replace this with a relevant icon */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Confirm Email
        </Typography>
        {isLoading && (
          <Box sx={{ margin: "1rem" }}>
            <CircularProgress />
          </Box>
        )}
        {errorMessage && (
          <Box sx={{ margin: "1rem" }}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
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
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmationCode"
            label="Verification Code"
            id="confirmationCode"
            value={confirmationCode}
            onChange={e => setConfirmationCode(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: "white" }}
          >
            Confirm Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
