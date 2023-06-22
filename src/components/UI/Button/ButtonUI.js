import React from "react";
import { Button } from "@mui/material";

const ButtonUI = (props) => {
  let action = "";

  if (props.action === "success") {
    action = "success";
  } else if (props.action === "cancel") {
    action = "error";
  }

  return (
    <Button
      color={action}
      variant="outlined"
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={!props.valid || false}
    >
      {props.children}
    </Button>
  );
};

export default ButtonUI;
