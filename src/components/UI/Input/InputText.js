import React, { useRef, useImperativeHandle } from "react";
import { InputAdornment, TextField } from "@mui/material";
import "./InputText.module.css";

const InputText = React.forwardRef((props, ref) => {
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
  const errorMessage = props.hasError ? <p>Please enter a valid {props.label}</p> : " ";
  const maxCharacters = props.maxCharacters ? props.maxCharacters : "";

  return (
    
      <TextField
        disabled={props.disable}
        sx={{ width: resize }}
        required={props.required || false}
        error={props.hasError}
        helperText={errorMessage}
        label={props.label || "Put a label"}
        variant="outlined"
        ref={inputRef}
        type={props.type || "text"}
        name={props.name || props.id}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        minRows={props.minRows}
        multiline={props.multiline}
        inputProps={{ maxLength: maxCharacters,readOnly:props.shouldBeReadOnly || false }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {props.startAdornment}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">{props.endAdornment}</InputAdornment>
          ),
        }}
        InputLabelProps={{ shrink: props.labelSticky }}
      />
  );
});

export default InputText;
