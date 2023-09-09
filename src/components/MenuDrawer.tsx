import * as React from "react";

import { MenuBook, ShoppingBasket } from "@mui/icons-material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { ReactElement, useState } from "react";
import { isMobile } from "react-device-detect";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import useAuthToken from "../logic/useAuthToken";
import { ConfirmEmail } from "./ConfirmEmail";
import IngredientDetail from "./IngredientDetail";
import IngredientEdit from "./IngredientEdit";
import { Ingredients } from "./Ingredients";
import { LogIn } from "./LogIn";
import RecipeDetail from "./RecipeDetail";
import { Recipes } from "./Recipes";
import { SignUp } from "./Signup";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type Props = {
  children: React.ReactNode;
};
export function MenuDrawer(props: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const { isLoggedIn, removeToken } = useAuthToken();

  const openRecipes = () => {
    if (isMobile) {
      setOpen(false);
    }
    navigate("/my-recipes");
  };

  const openIngredients = () => {
    if (isMobile) {
      setOpen(false);
    }
    navigate("/my-ingredients");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const renderMenuItem = (
    text: string,
    link: string,
    getIcon: () => ReactElement
  ) => {
    return (
      <ListItem key={text} disablePadding>
        <ListItemButton onClick={() => navigate(link)}>
          <ListItemIcon>{getIcon()}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        style={{ boxShadow: "inset 0 -10px 10px -10px #888" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon sx={{ color: "#303030" }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "#303030" }}
          >
            <b>PlatePad</b>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: isMobile ? "100vw" : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "100vw" : drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"My Recipes"} disablePadding>
            <ListItemButton onClick={openRecipes}>
              <ListItemIcon>
                <MenuBook />
              </ListItemIcon>
              <ListItemText primary={"My Recipes"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"My Ingredients"} disablePadding>
            <ListItemButton onClick={openIngredients}>
              <ListItemIcon>
                <ShoppingBasket />
              </ListItemIcon>
              <ListItemText primary={"My Ingredients"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {["PlatePad Recipes", "PlatePad Ingredients"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {renderMenuItem("Log In", "/login", () => (
            <LoginIcon />
          ))}
          {renderMenuItem("Sign Up", "/signup", () => (
            <AppRegistrationIcon />
          ))}
          <ListItem key={"logOut"} disablePadding>
            <ListItemButton
              onClick={() => {
                removeToken();
                navigate("/");
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Log Out"} />
            </ListItemButton>
          </ListItem>
          {renderMenuItem("Confirm Account", "/confirm-email", () => (
            <ConfirmationNumberIcon />
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/my-recipes" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/my-recipes" element={<Recipes />} />
            <Route path="/my-ingredients" element={<Ingredients />} />
            <Route
              path="/my-ingredients/:name"
              element={<IngredientDetail />}
            />
            <Route
              path="/my-ingredients/:name/edit"
              element={<IngredientEdit />}
            />
            <Route path="/my-recipes/:name" element={<RecipeDetail />} />
          </Routes>
        </Box>
      </Main>
    </Box>
  );
}
