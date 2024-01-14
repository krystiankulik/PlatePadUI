import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { api } from "../../api"; // Ensure this is your correct path for api calls
import useAuthToken from "../../logic/useAuthToken"; // Ensure this is your correct path for token handling
import IngredientSelection from "../ingredients/IngredientSelection";
import { useNavigate } from "react-router-dom";

type IngredientValue = {
  amount: number;
  ingredient: string;
};

type RecipeCreation = {
  name: string;
  displayName: string;
  description: string;
  ingredientValues: IngredientValue[];
};

export const RecipeCreate: React.FC = () => {
  const { token } = useAuthToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [recipeData, setRecipeData] = useState<RecipeCreation>({
    name: "",
    displayName: "",
    description: "",
    ingredientValues: [{ amount: 0, ingredient: ""}],
  });

  const createRecipeMutation = useMutation<
    any,
    AxiosError<any>,
    RecipeCreation
  >(
    (newRecipe: RecipeCreation) =>
      api.post(`/api/recipes`, newRecipe, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["my-recipes"]);
        navigate(`/my-recipes`);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validIngredientValues = recipeData.ingredientValues.filter(
      (ing) => ing.amount !== 0 && ing.ingredient.length > 0
    );
    createRecipeMutation.mutate({
      ...recipeData,
      ingredientValues: validIngredientValues,
    });
  };

  if (createRecipeMutation.isLoading) return <CircularProgress />;
  if (createRecipeMutation.isError) {
    return (
      <Alert severity="error">
        {createRecipeMutation.error.response?.data.message ||
          "An error occurred."}
      </Alert>
    );
  }

  const handleCancel = () => {
    navigate(`/my-recipes`);
  };

  const nameValidationFailed =
    recipeData?.name?.length === 0 && submitAttempted;
  const displayNameValidationFailed =
    recipeData?.displayName?.length === 0 && submitAttempted;

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
        label="Name"
        value={recipeData.name}
        margin="normal"
        onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })}
        required
        error={nameValidationFailed}
        helperText={nameValidationFailed ? "Name is required" : ""}
      />
      <TextField
        label="Display Name"
        value={recipeData.displayName}
        margin="normal"
        onChange={(e) =>
          setRecipeData({ ...recipeData, displayName: e.target.value })
        }
        required
        error={displayNameValidationFailed}
        helperText={
          displayNameValidationFailed ? "Display Name is required" : ""
        }
      />
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
        onClick={() => setSubmitAttempted(true)}
      >
        Create
      </Button>
      <Button variant="outlined" onClick={handleCancel} sx={{ mt: 3, mb: 2 }}>
        Cancel
      </Button>
    </Box>
  );
};
