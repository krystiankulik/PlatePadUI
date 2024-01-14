import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import useAuthToken from "../../logic/useAuthToken";
import { Ingredient } from "../../model/model";

export const IngredientCreate: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [nameContainsSpaces, setNameContainsSpaces] = useState(false);

  const [ingredientData, setIngredientData] = useState<Ingredient>({
    name: "",
    displayName: "",
    macro: {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbohydrates: 0,
    },
  });

  const createIngredientMutation = useMutation<
    any,
    AxiosError<any>,
    Ingredient
  >(
    (newIngredient: Ingredient) =>
      api.post(`/api/ingredients`, newIngredient, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["my-ingredients"] });
        navigate(`/my-ingredients`);
      },
    }
  );

  if (createIngredientMutation.isLoading) return <CircularProgress />;
  if (createIngredientMutation.isError) {
    return (
      <Alert severity="error">
        {createIngredientMutation.error.response?.data.message}
      </Alert>
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "name") {
      setNameContainsSpaces(/\s/.test(value)); // Check for spaces in the name
    }

    setIngredientData((prevData) => {
      if (name === "name" || name === "displayName") {
        return {
          ...prevData,
          [name]: value,
        };
      } else if (
        name === "calories" ||
        name === "proteins" ||
        name === "fats" ||
        name === "carbohydrates"
      ) {
        return {
          ...prevData,
          macro: {
            ...prevData.macro,
            [name]: Number(value),
          },
        };
      }
      return prevData;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (nameContainsSpaces) {
      setSubmitAttempted(true);
      return;
    }

    createIngredientMutation.mutate(ingredientData);
  };

  const handleCancel = () => {
    navigate(`/my-ingredients`);
  };

  const nameValidationFailed =
    ingredientData?.name?.length === 0 && submitAttempted;
  const displayNameValidationFailed =
    ingredientData?.displayName?.length === 0 && submitAttempted;

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
        name="name"
        value={ingredientData?.name}
        onChange={handleChange}
        margin="normal"
        required
        error={nameValidationFailed || nameContainsSpaces}
        helperText={
          nameValidationFailed
            ? "Name is required"
            : nameContainsSpaces
            ? "Name should not contain spaces"
            : ""
        }
      />
      <TextField
        label="Display Name"
        name="displayName"
        value={ingredientData?.displayName}
        onChange={handleChange}
        margin="normal"
        required
        error={displayNameValidationFailed}
        helperText={
          displayNameValidationFailed ? "Display Name is required" : ""
        }
      />
      <TextField
        label="Calories"
        name="calories"
        value={ingredientData?.macro.calories || 0}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Fats"
        name="fats"
        value={ingredientData?.macro.fats || 0}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Proteins"
        name="proteins"
        value={ingredientData?.macro.proteins || 0}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Carbs"
        name="carbohydrates"
        value={ingredientData?.macro.carbohydrates || 0}
        onChange={handleChange}
        margin="normal"
      />
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
