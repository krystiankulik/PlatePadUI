import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../../api";
import useAuthToken from "../../logic/useAuthToken";
import IngredientSelection from "../ingredients/IngredientSelection";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Recipe } from "../../model/model";

type IngredientValue = {
  amount: number;
  ingredient: string;
};

type RecipeEditing = {
  description: string;
  ingredientValues: IngredientValue[];
};

const RecipeEdit: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  const fetchRecipe = () =>
    api
      .get(`/api/recipes/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);

  const recipeQuery = useQuery<Recipe, AxiosError<any>>({
    queryKey: ["recipe", name],
    queryFn: fetchRecipe,
  });

  const [recipeData, setRecipeData] = useState<RecipeEditing>({
    description: "",
    ingredientValues: [],
  });

  useEffect(() => {
    if (recipeQuery.data) {
      setRecipeData({
        description: recipeQuery.data.description,
        ingredientValues: recipeQuery.data.ingredientValues.map(
          (ingredientValue) => ({
            ingredient: ingredientValue?.ingredient?.name ?? "",
            amount: ingredientValue?.amount ?? 0,
          })
        ),
      });
    }
  }, [recipeQuery.data]);

  const updateRecipeMutation = useMutation<any, AxiosError<any>, RecipeEditing>(
    (updatedRecipe: RecipeEditing) =>
      api.patch(`/api/recipes/${name}`, updatedRecipe, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onMutate: async (_newData) => {
        await queryClient.cancelQueries(["recipe", name]);
      },
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["my-recipes"] });
        queryClient.refetchQueries({ queryKey: ["recipe", name] });
        navigate(`/my-recipes/${name}`);
      }
    }
  );

  if (recipeQuery.isLoading || updateRecipeMutation.isLoading)
    return <CircularProgress />;

  if (recipeQuery.isError)
    return (
      <Alert severity="error">{recipeQuery.error.response?.data.message}</Alert>
    );

  if (updateRecipeMutation.isError)
    return (
      <Alert severity="error">
        {updateRecipeMutation.error.response?.data.message}
      </Alert>
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecipeMutation.mutate(recipeData);
  };

  const handleCancel = () => {
    navigate(`/my-recipes/${name}`);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "30rem",
        margin: "auto",
        backgroundColor: "white",
        padding: "3rem",
        boxShadow: "inset 0 0 8px #4b4a4a",
        borderRadius: "10px",
      }}
    >
      <TextField
        label="Description"
        value={recipeData.description}
        margin="normal"
        multiline
        rows={10}
        onChange={(e) =>
          setRecipeData({ ...recipeData, description: e.target.value })
        }
      />
      {recipeData.ingredientValues.map((ingredientValue, index) => (
        <IngredientSelection
          key={index}
          inputId={`ingredient-${index}`}
          ingredientValue={ingredientValue}
          onChange={(newValue) => {
            const newIngredientValues = [...recipeData.ingredientValues];
            newIngredientValues[index] = newValue;
            setRecipeData({
              ...recipeData,
              ingredientValues: newIngredientValues,
            });
          }}
        />
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          setRecipeData({
            ...recipeData,
            ingredientValues: [
              ...recipeData.ingredientValues,
              { amount: 0, ingredient: ""},
            ],
          })
        }
      >
        Add Ingredient
      </Button>
      {recipeData.ingredientValues.length > 1 && (
        <Button
          startIcon={<RemoveIcon />}
          onClick={() =>
            setRecipeData({
              ...recipeData,
              ingredientValues: recipeData.ingredientValues.slice(0, -1),
            })
          }
        >
          Remove Ingredient
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 3, mb: 2 }}
      >
        Update
      </Button>
      <Button variant="outlined" onClick={handleCancel} sx={{ mt: 3, mb: 2 }}>
        Cancel
      </Button>
    </Box>
  );
};

export default RecipeEdit;
