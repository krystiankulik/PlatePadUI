import { Autocomplete, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { api } from "../../api"; // Ensure this is your correct path for api calls
import useAuthToken from "../../logic/useAuthToken";
import { Ingredient } from "../../model/model";

interface IngredientSelectionProps {
  inputId: string;
  ingredientValue: {
    amount: number;
    ingredient: string;
  };
  onChange: (newValue: {
    amount: number;
    ingredient: string;
  }) => void;
}

const IngredientSelection: React.FC<IngredientSelectionProps> = ({
  inputId,
  ingredientValue,
  onChange,
}) => {
  const { token } = useAuthToken();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = debounce(async (searchValue: string) => {
    setSearchTerm(searchValue);
  }, 300);

  const { isLoading, data, fetchStatus } = useQuery<Ingredient[], Error>(
    ["searchIngredients", inputId, searchTerm],
    async () => {
      if (!searchTerm) {
        return [];
      }

      const ingredientsPromise = api.get(
        `/api/ingredients?search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const globalIngredientsPromise = api.get(
        `/api/global-ingredients?search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const [ingredientsResponse, globalIngredientsResponse] =
        await Promise.all([ingredientsPromise, globalIngredientsPromise]);

      return [...ingredientsResponse.data, ...globalIngredientsResponse.data];
    },
    {
      enabled: !!searchTerm,
      retry: 1,
    }
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const loadingData = isLoading && fetchStatus === "fetching";

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Autocomplete
        options={data?.map((it) => it.name) ?? []}
        getOptionLabel={(option) => option}
        value={ingredientValue.ingredient}
        onInputChange={(_, newValue) => debouncedSearch(newValue)}
        onChange={(_, newValue) =>
          newValue && onChange({ ...ingredientValue, ingredient: newValue })
        }
        loading={loadingData}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Ingredient"
            style={{ width: "200px", marginTop: "8px" }}
          />
        )}
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
