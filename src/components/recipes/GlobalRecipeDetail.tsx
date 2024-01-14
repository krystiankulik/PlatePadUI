import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import { Recipe } from "../../model/model";
import { MacroValues } from "../MacroValues";
import { RecipeImage } from "../imageUpload/RecipeImage";

const GlobalRecipeDetail: React.FC = () => {
  const { name } = useParams();

  const fetchRecipe = () =>
    api.get(`/api/global-recipes/${name}`).then((response) => response.data);

  const { isLoading, isError, data, error } = useQuery<Recipe, AxiosError<any>>(
    {
      queryKey: ["global-recipe", name],
      queryFn: fetchRecipe,
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  } 

  if (isError) {
    return (
      <Alert severity="error">
        {error.response?.data?.message ?? "Failed to fetch"}
      </Alert>
    );
  }

  return (
    <Box
      style={{
        width: "30rem",
        backgroundColor: "white",
        margin: "2rem",
        padding: "3rem",
        boxShadow: "inset 0 0 8px #4b4a4a",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <RecipeImage
        width={"400px"}
        name={data?.name}
        imageUrl={data?.imageUrl ?? null}
        editable={!global}
      />
      <Typography variant="h4" style={{ marginBottom: "2rem" }}>
        {data?.displayName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Description:</Typography>
          {data?.description}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Ingredients:</Typography>
          <List>
            {data?.ingredientValues.map((ingredientValue) => (
              <ListItem key={ingredientValue.ingredient.name}>
                <b>{ingredientValue.ingredient.displayName}</b> :{" "}
                {ingredientValue.amount}g
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Macros:</Typography>
          <MacroValues
            calories={data?.macro.calories || 0}
            fats={data?.macro.fats || 0}
            proteins={data?.macro.proteins || 0}
            carbs={data?.macro.carbohydrates || 0}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GlobalRecipeDetail;
