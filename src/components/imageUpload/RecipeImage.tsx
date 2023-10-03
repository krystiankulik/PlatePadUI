import React from "react";
import { ProductImage } from "./ProductImage";

interface RecipeImageProps {
  width: string | null;
  imageUrl: string | null;
  name: string;
  editable: boolean;
}

export const RecipeImage: React.FC<RecipeImageProps> = ({
  width,
  imageUrl,
  name,
  editable
}) => {
  return (
    <ProductImage
      width={width}
      name={name}
      imageUrl={imageUrl}
      uploadEndpoint={editable ? `/api/recipes/${name}/image` : null}
      type="recipe"
    />
  );
};
