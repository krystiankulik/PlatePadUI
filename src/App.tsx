import React from 'react';
import './App.css';
import {LogIn} from "./components/LogIn";
import {SignUp} from "./components/Signup";
import {ConfirmEmail} from "./components/ConfirmEmail";
import {MenuDrawer} from "./components/MenuDrawer";
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";

function App() {

    const theme = createTheme({
        palette: {
            primary: {
                main: "#f5ab8d",
            },
            secondary: {
                main: "#f76b1b"
            }
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                    <MenuDrawer>
                        <LogIn/>
                        <SignUp/>
                        <ConfirmEmail/>
                    </MenuDrawer>
            </BrowserRouter>
        </ThemeProvider>

    );
}

export default App;
