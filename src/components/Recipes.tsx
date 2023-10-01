import React, { useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { Recipe } from "../model/model";
import { MacroValues } from "./MacroValues";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { AxiosError, isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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

  const renderData = () =>
    data
      ? data.map((recipe) => (
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
            <Typography
              variant="h5"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/my-recipes/${recipe.name}`)}
            >
              {recipe.displayName}
            </Typography>
            <Box style={{paddingTop: "2rem"}}>
              <MacroValues
                calories={recipe.macro.calories}
                fats={recipe.macro.fats}
                proteins={recipe.macro.proteins}
                carbs={recipe.macro.carbohydrates}
              />
            </Box>
          </Box>
        ))
      : null;

  if (isError) {
    if (!error.response) {
      navigate("/login");
    } else {
      return <Alert severity="error">{error.response?.data.message}</Alert>;
    }
  }

  const renderLoading = () =>
    isLoading ? (
      <div>
        <CircularProgress />
      </div>
    ) : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderLoading()}
      {renderData()}
    </Box>
  );
};
