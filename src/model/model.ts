export interface Macro {
  carbohydrates: number;
  calories: number;
  fats: number;
  proteins: number;
}

export interface IngredientValue {
  amount: number;
  ingredient: {
    name: string;
    displayName: string;
    macro: Macro;
  };
}

export interface Ingredient {
    name: string;
    displayName: string;
    macro: Macro;
}

export interface Recipe {
  name: string;
  displayName: string;
  macro: Macro;
  description: string;
  ingredientValues: IngredientValue[];
}
