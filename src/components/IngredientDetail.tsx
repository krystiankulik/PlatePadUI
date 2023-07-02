import { Alert, Box, CircularProgress, Typography, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { Ingredient } from "../model/model";

const IngredientDetail: React.FC = () => {
  const { name } = useParams();
  const { token } = useAuthToken();

  const fetchIngredients = () =>
    api
      .get("/api/ingredients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);

  const { isLoading, isError, data, error } = useQuery<Ingredient[], Error>({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;

  const ingredient = data.find((ingredient) => ingredient.name === name);

  if(!ingredient) {
    return <Alert severity="error">{'Ingredient not found'}</Alert>
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "30rem",
          backgroundColor: "white",
          margin: "2rem",
          padding: "3rem",
          boxShadow: "inset 0 0 8px #4b4a4a",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" align="center">{ingredient.displayName}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Calories</Typography>
            <Typography variant="body1">{ingredient.macro.calories}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Fats</Typography>
            <Typography variant="body1">{ingredient.macro.fats}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Proteins</Typography>
            <Typography variant="body1">{ingredient.macro.proteins}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Carbs</Typography>
            <Typography variant="body1">{ingredient.macro.carbohydrates}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default IngredientDetail;
