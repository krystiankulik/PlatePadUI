import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Box, CircularProgress, Alert, Typography, Grid, List, ListItem, Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { Recipe } from "../model/model";
import { MacroValues } from "./MacroValues";

const RecipeDetail: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  const fetchRecipe = () =>
    api
      .get(`/api/recipes/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);

  const { isLoading, isError, data, error } = useQuery<Recipe, AxiosError<any>>({
    queryKey: ["recipe", name],
    queryFn: fetchRecipe,
  });

  const deleteMutation = useMutation<any, AxiosError<any>, string>(
    (name: string) =>
      api.delete(`/api/recipes/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["my-recipes"] });
        handleClose();
        navigate("/my-recipes");
      },
    }
  );

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading || deleteMutation.isLoading) return <CircularProgress />;
  if (isError || deleteMutation.isError) {
    const message = isError ? error.response?.data.message : deleteMutation.error?.response?.data.message;
    return <Alert severity="error">{message}</Alert>;
  }

  const handleDelete = () => {
    if (name) {
      deleteMutation.mutate(name);
    }
  };

  const renderDialog = () => (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to delete the recipe?"}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} color="secondary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      style={{
        width: "30rem",
        backgroundColor: "white",
        margin: "2rem",
        padding: "3rem",
        boxShadow: "inset 0 0 8px #4b4a4a",
        borderRadius: "10px",
        position: "relative",
      }}
    >
      <Button
        onClick={handleClickOpen}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          minWidth: 10,
          padding: 0,
        }}
      >
        <DeleteIcon
          sx={{
            width: 16,
            height: 16,
            color: "grey",
            "&:hover": { color: 'red'}
          }}
        />
      </Button>
      <Typography variant="h4" style={{ marginBottom: "2rem" }}>
        {data?.displayName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Description:</Typography>
          {data?.description}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Ingredients:</Typography>
          <List>
            {data?.ingredientValues.map((ingredientValue) => (
              <ListItem key={ingredientValue.ingredient.name}>
                <b>{ingredientValue.ingredient.name}</b> :{" "}
                {ingredientValue.amount}g
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Macros:</Typography>
          <MacroValues
            calories={data?.macro.calories || 0}
            fats={data?.macro.fats || 0}
            proteins={data?.macro.proteins || 0}
            carbs={data?.macro.carbohydrates || 0}
          />
        </Grid>
      </Grid>
      {renderDialog()}
    </Box>
  );
};

export default RecipeDetail;
