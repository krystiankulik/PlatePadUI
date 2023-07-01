import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Recipe } from "../model/model";
import { MacroValues } from "./MacroValues";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

export const Recipes: React.FC = () => {
  const { token } = useAuthToken();

  const fetchRecipes = async () =>
    api
      .get("/api/recipes", {
        headers: { Authorization: `Bearer ${token?.trim()}` },
      })
      .then((response) => response.data);

  const { isLoading, isError, data, error } = useQuery<Recipe[], Error>({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (isError && isAxiosError(error)) {
    <div>{error.response?.data}</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {(data ?? []).map((recipe) => (
        <Box
          sx={{
            width: "20rem",
            backgroundColor: "white",
            margin: "2rem",
            padding: "3rem",
            boxShadow: "inset 0 0 8px #4b4a4a",
            borderRadius: "10px",
          }}
          key={recipe.name}
        >
          <Typography variant="h5">{recipe.displayName}</Typography>
          <MacroValues
            calories={recipe.macro.calories}
            fats={recipe.macro.fats}
            proteins={recipe.macro.proteins}
            carbs={recipe.macro.carbohydrates}
          />
        </Box>
      ))}
    </Box>
  );
};
