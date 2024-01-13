import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
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
  styled
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { api } from "../../api";
import { Ingredient } from "../../model/model";
import { EmptyTablePlaceholder } from "./EmptyTablePlaceholder";

const IngredientsHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  margin: "1rem",
  flexDirection: "row-reverse",
});

const SearchContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

const LoadingContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});


export const GlobalIngredients: React.FC = () => {
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
      .get(`/api/global-ingredients?${params.toString()}`)
      .then((response) => response.data);
  };

  const { isLoading, isError, data, error } = useQuery<Ingredient[], Error>({
    queryKey: ["global-ingredients", searchTerm],
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
                style={{ cursor: "default" }}
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
      return <Alert severity="error">{error.response?.data?.message ?? "Error occured during the fetch :("}</Alert>;
  }

  const renderLoading = () =>
    isLoading ? (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    ) : null;

  return <>{renderContent()}</>;
};
