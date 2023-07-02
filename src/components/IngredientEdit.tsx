import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { Ingredient } from "../model/model";
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material";

const IngredientEdit: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  const fetchIngredient = () =>
    api
      .get(`/api/ingredients/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);

  const ingredientQuery = useQuery<Ingredient, AxiosError<any>>({
    queryKey: ["ingredient", name],
    queryFn: fetchIngredient,
  });

  const [ingredientData, setIngredientData] = useState<Ingredient | null>(null);

  useEffect(() => {
    if (ingredientQuery.data) {
      setIngredientData(ingredientQuery.data);
    }
  }, [ingredientQuery.data]);

  const updateIngredientMutation = useMutation<
    any,
    AxiosError<any>,
    Ingredient
  >(
    (updatedIngredient: Ingredient) =>
      api.patch(
        `/api/ingredients/${updatedIngredient.name}`,
        updatedIngredient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    {
      onMutate: async (newData) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["ingredient", name]);

        // Snapshot the previous value
        const previousIngredient = queryClient.getQueryData<Ingredient>([
          "ingredient",
          name,
        ]);

        // Optimistically update to the new value
        queryClient.setQueryData(["ingredient", name], newData);
        // await queryClient.invalidateQueries(["ingredient"]);

        // Return a rollback function to revert to the old value if necessary
        return () =>
          queryClient.setQueryData(["ingredient", name], previousIngredient);
      },
      // On success, invalidate the query to refetch and make sure we have latest ingredient.
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["my-ingredients"] });
        navigate(`/my-ingredients/${name}`);
      },
      // If the mutation fails, use the rollback function we returned above
      onError: (error, newData, rollback: any) => rollback(),
    }
  );

  if (ingredientQuery.isLoading) return <CircularProgress />;
  if (ingredientQuery.isError) {
    return (
      <Alert severity="error">
        {ingredientQuery.error.response?.data.message}
      </Alert>
    );
  }

  if (updateIngredientMutation.isLoading) return <CircularProgress />;
  if (updateIngredientMutation.isError) {
    return (
      <Alert severity="error">
        {updateIngredientMutation.error.response?.data.message}
      </Alert>
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setIngredientData((prevData) => {
      if (prevData) {
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
      }
      return prevData;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (ingredientData) {
      updateIngredientMutation.mutate(ingredientData);
    }
  };

  const handleCancel = () => {
    navigate(`/my-ingredients/${name}`);
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
      >
        Update
      </Button>
      <Button variant="outlined" onClick={handleCancel} sx={{ mt: 3, mb: 2 }}>
        Cancel
      </Button>
    </Box>
  );
};

export default IngredientEdit;
