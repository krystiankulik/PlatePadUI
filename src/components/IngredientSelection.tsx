import React, { useState } from "react";
import { Box, TextField, Autocomplete } from "@mui/material";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api"; // Ensure this is your correct path for api calls
import useAuthToken from "../logic/useAuthToken";
import { Ingredient } from "../model/model";

interface IngredientSelectionProps {
  inputId: string;
  ingredientValue: { amount: number; ingredient: string };
  onChange: (newValue: { amount: number; ingredient: string }) => void;
}

const IngredientSelection: React.FC<IngredientSelectionProps> = ({
  inputId,
  ingredientValue,
  onChange,
}) => {
  const { token } = useAuthToken();
  const [searchTerm, setSearchTerm] = useState("");

  const searchIngredients = debounce((searchValue: string) => {
    setSearchTerm(searchValue);
  }, 300);

  const { data: searchResults = [] } = useQuery<Ingredient[], Error>(
    ["searchIngredients", inputId, searchTerm],
    () =>
      api
        .get(`/api/ingredients?search=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data),
    {
      enabled: !!searchTerm,
      retry: 3,
    }
  );

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Autocomplete
        options={searchResults?.map((it) => it.name) ?? []}
        getOptionLabel={(option) => option}
        value={ingredientValue.ingredient}
        onInputChange={(_, newValue) => searchIngredients(newValue)}
        onChange={(_, newValue) =>
          newValue && onChange({ ...ingredientValue, ingredient: newValue })
        }
        renderInput={(params) => <TextField {...params} label="Ingredient" />}
      />
      <TextField
        label="Amount (g)"
        value={ingredientValue.amount}
        margin="normal"
        onChange={(e) =>
          onChange({ ...ingredientValue, amount: Number(e.target.value) })
        }
      />
    </Box>
  );
};

export default IngredientSelection;
