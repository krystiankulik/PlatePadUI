import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import useAuthToken from "../logic/useAuthToken";
import { Ingredient } from "../model/model";
import { AddingButton } from "./AddingButton";

const IngredientsHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  margin: "1rem",
}));

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const LoadingContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const EmptyTablePlaceholder = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100px"
  >
    <Typography variant="h6" color="textSecondary">
      {"No items found."}
    </Typography>
  </Box>
);

export const Ingredients: React.FC = () => {
  const { token } = useAuthToken();
  const navigate = useNavigate();
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchTerm(e.target.value);
  };

  const submitSearch = () => {
    setSearchTerm(inputSearchTerm);
  };

  const fetchIngredients = (searchTerm: string | undefined) => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }

    return api
      .get(`/api/ingredients?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data);
  };

  const { isLoading, isError, data, error } = useQuery<Ingredient[], Error>({
    queryKey: ["my-ingredients", searchTerm],
    queryFn: () => fetchIngredients(searchTerm),
  });

  const renderIngredientsData = () => (
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
          {data?.map((ingredient) => (
            <TableRow key={ingredient.name}>
              <TableCell
                component="th"
                scope="row"
                onClick={() => navigate(`/my-ingredients/${ingredient.name}`)}
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
      {(!data || data.length === 0) && !isLoading && <EmptyTablePlaceholder />}
    </TableContainer>
  );

  const renderContent = () => (
    <div style={{ width: "100%" }}>
      <IngredientsHeader>
        <AddingButton
          onClick={() => {
            navigate("/my-ingredients/create");
          }}
        />
        <SearchContainer>
          <TextField
            value={inputSearchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            color="primary"
            style={{ backgroundColor: "white" }}
            placeholder="Search by display name"
          />
          <IconButton onClick={submitSearch}>
            <SearchIcon color="primary" />
          </IconButton>
        </SearchContainer>
      </IngredientsHeader>
      {renderLoading()}
      {data && renderIngredientsData()}
    </div>
  );

  if (isError && isAxiosError(error)) {
    if (!error.response) {
      navigate("/login");
    } else {
      return <Alert severity="error">{error.response?.data.message}</Alert>;
    }
  }

  const renderLoading = () =>
    isLoading ? (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    ) : null;

  return <>{renderContent()}</>;
};
