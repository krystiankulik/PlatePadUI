import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

type Props = {
  onClick: () => void;
};

export const AddingButton = (props: Props) => {
  return (
    <Fab color="primary" aria-label="add" onClick={props.onClick}>
      <AddIcon />
    </Fab>
  );
};
