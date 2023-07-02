import React from "react";
import {
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Ingredient } from "../model/model";
import useAuthToken from "../logic/useAuthToken";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const Ingredients: React.FC = () => {
  const { token } = useAuthToken();
  const navigate = useNavigate();

  const fetchIngredients = () =>
    api
      .get("/api/ingredients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);

  const { isLoading, isError, data, error } = useQuery<Ingredient[], Error>({
    queryKey: ["my-ingredients"],
    queryFn: fetchIngredients,
  });

  const renderData = () =>
    data ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fats</TableCell>
              <TableCell align="right">Proteins</TableCell>
              <TableCell align="right">Carbs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((ingredient) => (
              <TableRow key={ingredient.name}>
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() => navigate(`/ingredients/${ingredient.name}`)}
                  style={{ cursor: "pointer" }}
                >
                  {ingredient.displayName}
                </TableCell>
                <TableCell align="right">{ingredient.macro.calories}</TableCell>
                <TableCell align="right">{ingredient.macro.fats}</TableCell>
                <TableCell align="right">{ingredient.macro.proteins}</TableCell>
                <TableCell align="right">
                  {ingredient.macro.carbohydrates}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : null;

  if (isError && isAxiosError(error)) {
    if (!error.response) {
      navigate("/login");
    } else {
      return <Alert severity="error">{error.response?.data.message}</Alert>;
    }
  }

  const renderLoading = () =>
    isLoading ? (
      <div>
        <CircularProgress />
      </div>
    ) : null;

  return (
    <>
      {renderLoading()}
      {renderData()}
    </>
  );
};
