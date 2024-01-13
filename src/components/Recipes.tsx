import React, { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  styled,
} from "@mui/material";
import { Recipe } from "../model/model";
import { MacroValues } from "./MacroValues";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AddingButton } from "./AddingButton";
import { RecipeImage } from "./imageUpload/RecipeImage";

const RecipessHeader = styled("div")(() => ({
  display: "flex",
  flexDirection: "row-reverse",
  margin: "1rem",
}));

const LoadingContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));


const NoRecipesTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const Recipes: React.FC = () => {
  const { token } = useAuthToken();
  const navigate = useNavigate();

  const fetchRecipes = () =>
    api
      .get("/api/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);

  const { isLoading, isError, data, error } = useQuery<
    Recipe[],
    AxiosError<any>
  >({
    queryKey: ["my-recipes"],
    queryFn: fetchRecipes,
  });

  const renderRecipes = () => {
    if(!data || data.length === 0) {
      return <NoRecipesTypography variant="h5">You have no recipes yet...</NoRecipesTypography>
    }

   return data.map((recipe) => (
    <Box
      sx={{
        width: "20rem",
        backgroundColor: "white",
        margin: "2rem",
        padding: "3rem",
        boxShadow: "inset 0 0 8px #4b4a4a",
        borderRadius: "10px",
        height: "30rem",
      }}
      key={recipe.name}
    >
      <RecipeImage
        width={"100%"}
        name={recipe.name}
        imageUrl={recipe?.imageUrl ?? null}
        editable={false}
      />
      <Typography
        variant="h5"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/my-recipes/${recipe.name}`)}
      >
        {recipe.displayName}
      </Typography>
      <Box style={{ paddingTop: "2rem" }}>
        <MacroValues
          calories={recipe.macro.calories}
          fats={recipe.macro.fats}
          proteins={recipe.macro.proteins}
          carbs={recipe.macro.carbohydrates}
        />
      </Box>
    </Box>
  ));
    }

  const renderRecipesData = () => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {renderRecipes()}
    </Box>
  );

  const renderContent = () => (
    <div style={{ width: "100%" }}>
      <RecipessHeader>
        <AddingButton
          onClick={() => {
            navigate("/my-recipes/create");
          }}
        />
      </RecipessHeader>
      {renderLoading()}
      {data && renderRecipesData()}
      
    </div>
  );

  if (isError) {
    if (!error.response) {
      navigate("/login");
    } else {
      return <Alert severity="error">{error.response?.data.message}</Alert>;
    }
  }

  const renderLoading = () =>
    isLoading ? (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    ) : null;

  return renderContent();
};
