import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

const LoadingButton = ({
  type,
  onClick,
  loading,
  color,
  sx,
  children,
  maxWidth,
  isVisible,
  disabled,
  fullWidth
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        visibility:isVisible?"block":"hidden"
      }}
    >
      {loading ? (
        <CircularProgress color={color} sx={{ mt: 2 }} />
      ) : (
        <Button
          type={type}
          variant="contained"
          fullWidth={fullWidth}
          sx={sx}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      )}
    </div>
  );
};

LoadingButton.defaultProps = {
  loading: false,
  color: "secondary",
  name: "Button",
  maxWidth: "100em",
  isVisible:true,
  disabled:false,
  fullWidth:true
};

export default LoadingButton;