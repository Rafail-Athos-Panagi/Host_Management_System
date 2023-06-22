import React, { useRef, useImperativeHandle } from "react";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";

const InputSelect = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      focus: activate,
    };
  });


  const resize = props.resize ? props.resize : "25ch";
  const errorMessage = props.hasError ? (<p>Please choose a valid {props.label}</p>) : (" ");

  return (
    <div>
      <TextField
        sx={{width: resize}}
        select
        required={props.required || false}
        error={props.hasError}
        helperText={errorMessage}
        label={props.label}
        variant="outlined"
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        InputLabelProps={{ shrink: props.labelSticky }}
      >
        {props.selection.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
});

export default InputSelect;
