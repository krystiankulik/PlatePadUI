import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ConfirmEmail } from "./components/ConfirmEmail";
import { LogIn } from "./components/LogIn";
import { MenuDrawer } from "./components/MenuDrawer";
import { SignUp } from "./components/Signup";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Helmet } from "react-helmet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

function App() {
  const theme = createTheme({
    typography: {
      body1: {
        fontSize: "0.7rem",
      },
      caption: {
        fontSize: "0.8rem",
      },
    },
    palette: {
      background: {
        default: "#3C4247",
      },
      primary: {
        main: "#6ebd92",
      },
      secondary: {
        main: "#63997c",
      },
    },
  });

  const [token, setToken] = useState<string | null>(() => {
    return window.localStorage.getItem("authToken");
  });

  const value = { token, setToken };

  return (
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <AuthContext.Provider value={value}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <MenuDrawer>
                <LogIn />
                <SignUp />
                <ConfirmEmail />
              </MenuDrawer>
            </BrowserRouter>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthContext.Provider>
    </Helmet>
  );
}

export default App;
