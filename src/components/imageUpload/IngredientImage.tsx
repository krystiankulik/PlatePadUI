import React from "react";
import { ProductImage } from "./ProductImage";

interface IngredientImageProps {
  width: string | null;
  imageUrl: string | null;
  name: string;
  editable: boolean;
}

export const IngredientImage: React.FC<IngredientImageProps> = ({
  width,
  imageUrl,
  name,
  editable,
}) => {
  return (
    <ProductImage
      width={width}
      name={name}
      imageUrl={imageUrl}
      uploadEndpoint={editable ? `/api/ingredients/${name}/image` : null}
      type="ingredient"
    />
  );
};
