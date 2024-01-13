import { Box, Typography } from "@mui/material";

export const EmptyTablePlaceholder: React.FC = () => (
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
