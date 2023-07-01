import React from "react";
import { Box, Typography } from "@mui/material";
import { Ingredient } from "../model/model";
import { MacroValues } from "./MacroValues";

interface IngredientsProps {
  ingredients: Ingredient[];
}

export const Ingredients: React.FC<IngredientsProps> = ({ ingredients }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {ingredients.map((ingredient) => (
        <Box
          sx={{
            width: "20rem",
            backgroundColor: "white",
            margin: "2rem",
            padding: "3rem",
            boxShadow: "inset 0 0 8px #4b4a4a",
            borderRadius: "10px",
          }}
          key={ingredient.name}
        >
          <Typography variant="h5">{ingredient.displayName}</Typography>
          <MacroValues
            calories={ingredient.macro.calories}
            fats={ingredient.macro.fats}
            proteins={ingredient.macro.proteins}
            carbs={ingredient.macro.carbohydrates}
          />
        </Box>
      ))}
    </Box>
  );
};
