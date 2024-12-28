import { nanoid } from "nanoid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackbarMsg = (props) => {
  const { open = false, message = "", onClose = null, severity = null, anchorOrigin = null } = props;
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      key={nanoid(5)}
      autoHideDuration={5000}
      anchorOrigin={{ "vertical": "top", "horizontal": "center" }}
    >
      <Alert onClose={onClose} severity={severity || "success"} sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMsg;
