import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, CircularProgress, IconButton, Snackbar } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import PlaceholderIcon from "../../assets/placeholder.png";
import useAuthToken from "../../logic/useAuthToken";
import { api } from "../../api";

interface ProductImageProps {
  width: string | null;
  imageUrl: string | null;
  uploadEndpoint: string | null;
  name: string;
  type: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  width,
  imageUrl,
  name,
  type,
  uploadEndpoint,
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => setIsImageLoading(true), [imageUrl]);

  const imageFileToBase64Payload = (
    imageFile: File
  ): Promise<{ image: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        const base64Data = reader.result as string;
        resolve({ image: base64Data.split(",")[1] });
      };
      reader.onerror = reject;
    });
  };

  const mutation = useMutation<any, AxiosError<any>, File>(
    async (imageFile: File) => {
      const payload = await imageFileToBase64Payload(imageFile);
      return api.post(uploadEndpoint!, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        if (type === "ingredient") {
          queryClient.refetchQueries(["ingredient", name]);
          queryClient.refetchQueries(["my-ingredients"]);
        } else if (type === "recipe") {
          queryClient.refetchQueries(["recipe", name]);
          queryClient.refetchQueries(["my-recipes"]);
        }
      },
    }
  );

  const handleImageUpload = () => {
    imageRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 500 * 1024) {
        setErrorMessage("Image size should be less than 500KB.");
        return;
      }

      await mutation.mutateAsync(file);
    }
  };

  const getImage = () => {
    const actualWidth = width ? width : "100%";
    const commonStyles = {
      width: actualWidth,
      height: actualWidth,
      borderRadius: "0.5rem",
      marginBottom: "1rem",
    };

    const conditionalStyles = imageUrl
      ? {}
      : {
          opacity: 0.5,
          padding: "1rem",
        };

    return (
      <>
        <img
          src={imageUrl || PlaceholderIcon}
          alt={name}
          onLoad={() => setIsImageLoading(false)}
          style={{ ...commonStyles, ...conditionalStyles }}
        />
      </>
    );
  };

  return (
    <Box position="relative">
      {getImage()}
      {uploadEndpoint && (
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={handleImageUpload} disabled={mutation.isLoading}>
            {mutation.isLoading || isImageLoading ? (
              <CircularProgress size={24} />
            ) : (
              <CloudUploadIcon color="primary" fontSize="large" />
            )}
          </IconButton>
          <input
            type="file"
            ref={imageRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
            accept="image/*"
          />
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        message={errorMessage}
      />
    </Box>
  );
};

export default ProductImage;
