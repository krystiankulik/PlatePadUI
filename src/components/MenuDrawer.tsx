import * as React from "react";

import { MenuBook, ShoppingBasket } from "@mui/icons-material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
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
import { useQueryClient } from "@tanstack/react-query";
import { ReactElement, useState } from "react";
import { isMobile } from "react-device-detect";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ReactComponent as PlatePadLogo } from "../assets/platePadLogo.svg";
import useAuthToken from "../logic/useAuthToken";
import { ConfirmEmail } from "./ConfirmEmail";
import IngredientDetail from "./IngredientDetail";
import IngredientEdit from "./IngredientEdit";
import { Ingredients } from "./Ingredients";
import { LandingPage } from "./LandingPage";
import { LogIn } from "./LogIn";
import RecipeDetail from "./RecipeDetail";
import { Recipes } from "./Recipes";
import { SignUp } from "./Signup";
import { IngredientCreate } from "./IngredientCreate";
import { RecipeCreate } from "./RecipeCreate";
import RecipeEdit from "./RecipeEdit";
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
  const queryClient = useQueryClient();

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

  const getMainPageNavigation = () => {
    return isLoggedIn ? (
      <Navigate to="/my-recipes" />
    ) : (
      <Navigate to="/welcome" />
    );
  };

  const getRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={getMainPageNavigation()} />
        <Route path="/welcome" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/global-ingredients" element={<Ingredients global={true}/>} />
        <Route path="/my-ingredients" element={<Ingredients global={false}/>} />
        <Route path="/my-ingredients/:name" element={<IngredientDetail />} />
        <Route path="/my-ingredients/:name/edit" element={<IngredientEdit />} />
        <Route path="/my-ingredients/create" element={<IngredientCreate />} />
        <Route path="/my-recipes" element={<Recipes />} />
        <Route path="/my-recipes/:name" element={<RecipeDetail />} />
        <Route path="/my-recipes/:name/edit" element={<RecipeEdit />} />
        <Route path="/my-recipes/create" element={<RecipeCreate />} />
      </Routes>
    );
  };

  const renderMenuItem = (
    text: string,
    onClick: () => void,
    getIcon: () => ReactElement
  ) => {
    return (
      <ListItem key={text} disablePadding>
        <ListItemButton onClick={onClick}>
          <ListItemIcon>{getIcon()}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const myRecipesLink = () =>
    renderMenuItem("My Recipes", openRecipes, () => <MenuBook />);

  const myIngredientsLink = () =>
    renderMenuItem("My Ingredients", openIngredients, () => <ShoppingBasket />);

  const globalRecipesLink = () =>
    renderMenuItem(
      "PlatePad Recipes",
      () => {},
      () => <MenuBook />
    );

  const globalIngredientsLink = () =>
    renderMenuItem(
      "PlatePad Ingredients",
      () => navigate("/global-ingredients"),
      () => <ShoppingBasket />
    );

  const logInLink = () =>
    renderMenuItem(
      "Log In",
      () => navigate("/login"),
      () => <LoginIcon />
    );

  const signUpLink = () =>
    renderMenuItem(
      "Sign Up",
      () => navigate("/signup"),
      () => <AppRegistrationIcon />
    );

  const logOutLink = () =>
    renderMenuItem(
      "Log Out",
      () => {
        removeToken();
        queryClient.removeQueries();
        navigate("/");
      },
      () => <ConfirmationNumberIcon />
    );

  const confirmAccountLink = () =>
    renderMenuItem(
      "Confirm Account",
      () => navigate("/confirm-email"),
      () => <ConfirmationNumberIcon />
    );

  const drawerFoldIcon = () => (
    <IconButton onClick={handleDrawerClose}>
      {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  );

  const myDataLinks = () => {
    if (!isLoggedIn) {
      return null;
    }
    return (
      <>
        <Divider />
        <List>
          {myRecipesLink()}
          {myIngredientsLink()}
        </List>
      </>
    );
  };

  const handleLogoCancel = () => {
    navigate(`/`);
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        style={{ boxShadow: "inset 0 -10px 10px -10px #888", height: "4rem" }}
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
            <div style={{ width: "6rem", marginLeft: "1rem", cursor: "pointer" }} onClick={handleLogoCancel}>
              <PlatePadLogo />
            </div>
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
        <DrawerHeader>{drawerFoldIcon()}</DrawerHeader>
        {myDataLinks()}
        <Divider />
        <List>
          {globalRecipesLink()}
          {globalIngredientsLink()}
        </List>
        <Divider />
        <List>
          {!isLoggedIn && logInLink()}
          {!isLoggedIn && signUpLink()}
          {isLoggedIn && logOutLink()}
          {!isLoggedIn && confirmAccountLink()}
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
          {getRoutes()}
        </Box>
      </Main>
    </Box>
  );
}
