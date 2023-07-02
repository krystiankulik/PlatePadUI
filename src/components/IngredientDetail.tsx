import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useAuthToken from "../logic/useAuthToken";
import { Ingredient } from "../model/model";
import { api } from "../api";
import { AxiosError } from "axios";
import { useState } from "react";

const IngredientDetail: React.FC = () => {
  const { name } = useParams();
  const { token } = useAuthToken();
  const navigate = useNavigate();
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

  const deleteMutation = useMutation<any, AxiosError<any>, string>(
    (name: string) =>
      api.delete(`/api/ingredients/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        handleClose();
        navigate("/my-ingredients");
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

  if (ingredientQuery.isLoading) return <CircularProgress />;
  if (ingredientQuery.isError) {
    return (
      <Alert severity="error">
        {ingredientQuery.error.response?.data.message}
      </Alert>
    );
  }

  if (deleteMutation.isLoading) return <CircularProgress />;
  if (deleteMutation.isError) {
    return (
      <Alert severity="error">
        {deleteMutation.error.response?.data.message}
      </Alert>
    );
  }

  const ingredient = ingredientQuery.data;

  if (!ingredient) {
    return <Alert severity="error">{"Ingredient not found"}</Alert>;
  }

  const handleEdit = () => {
    navigate(`/my-ingredients/${ingredient.name}/edit`);
  };

  const renderDialog = () => (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to delete the ingredient?"}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (name) {
              deleteMutation.mutate(name);
            }
          }}
          color="secondary"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderIngredientDetails = () => (
    <Box
      sx={{
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
        onClick={handleEdit}
        sx={{
          position: "absolute",
          top: 8,
          right: 32,
          minWidth: 10,
          padding: 0,
        }}
      >
        <EditIcon
          sx={{
            width: 16,
            height: 16,
            color: "grey",
            "&:hover": { color: "#5d71e2" },
          }}
        />
      </Button>
      <Button
        onClick={handleClickOpen}
        sx={{
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
            "&:hover": { color: red[500] },
          }}
        />
      </Button>
      <Typography variant="h5" align="center" marginBottom={"2rem"}>
        {ingredient.displayName}
      </Typography>
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
          <Typography variant="body1">
            {ingredient.macro.carbohydrates}
          </Typography>
        </Grid>
      </Grid>
      {renderDialog()}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {ingredient && renderIngredientDetails()}
    </Box>
  );
};

export default IngredientDetail;
