import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ConfirmEmail } from "./components/ConfirmEmail";
import { LogIn } from "./components/LogIn";
import { MenuDrawer } from "./components/MenuDrawer";
import { SignUp } from "./components/Signup";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5*60*1000,
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
        default: "#575757",
      },
      primary: {
        main: "#f5ab8d",
      },
      secondary: {
        main: "#f76b1b",
      },
    },
  });

  return (
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
    </QueryClientProvider>
  );
}

export default App;
