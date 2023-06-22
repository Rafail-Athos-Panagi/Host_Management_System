import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import InputText from '../UI/Input/InputText';
import Button from '@mui/material/Button';
import useInput from '../../hooks/use-input';
import {
  notEmpty
} from "../../Regex/Regex";
import ChildModal from '../UI/Modal/ChildModal';

export default function AddTodo({ handleClose }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalInformation, setModalInformation] = useState([]);

  const isNotEmpty = (value) => notEmpty.test(value);

  const {
    value: todoByValue,
    isValid: todoByIsValid,
    hasError: todoByHasError,
    valueChangeHandler: todoByChangeHandler,
    inputBlurHandler: todoByBlurHandler,
    reset: resetTodoBy,
  } = useInput(isNotEmpty);

  const {
    value: descriptionValue,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescription,
  } = useInput(isNotEmpty);

  const {
    value: dueDateValue,
    isValid: dueDateIsValid,
    hasError: dueDateHasError,
    valueChangeHandler: dueDateChangeHandler,
    inputBlurHandler: dueDateBlurHandler,
    reset: resetDueDate,
  } = useInput(isNotEmpty);

  const {
    value: forValue,
    isValid: forIsValid,
    hasError: forHasError,
    valueChangeHandler: forChangeHandler,
    inputBlurHandler: forBlurHandler,
    reset: resetFor,
  } = useInput(isNotEmpty);

  useEffect(() => {
    const updatedModalInformation = {
      ToBeDoneBy: todoByValue,
      DueDate: dueDateValue,
      For: forValue,
      description: descriptionValue,
    }
    setModalInformation(updatedModalInformation);
  }, [dueDateValue, forValue, descriptionValue, todoByValue]);

  let formIsValid = false;

  if (todoByIsValid && dueDateIsValid && forIsValid && descriptionIsValid)
    formIsValid = true;

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }
    addToDatabase();
    handleClose();
  }

  const addToDatabase = async () => {

    try {
      const request = {
        method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "todolist",
          values: `(DEFAULT,"${descriptionValue}","${dueDateValue}","${todoByValue}","${forValue}",DEFAULT)`
        }),
      };

      const res = await fetch(`/api/insert`, request);
      const data = await res.json()
      if (data.sqlMessage) {
        console.log(data.sqlMessage);
      }
    }
    catch (error) {
      console.error(error);
    }


    resetDescription("");
    resetDueDate("");
    resetFor("");
    resetTodoBy("");
    resetOpenModal();
  };

  const resetOpenModal = () => {
    setOpenModal(false);
  }

  return (
    <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
    >

      <h2 style={{ marginBottom: "20px" }}>Add new todo</h2>

      <div style={{ display: "flex" }} >
        <InputText
          enableResizing={false}
          required={true}
          label="For who"
          id="todoForWhatWho"
          type="text"
          value={forValue}
          onChange={forChangeHandler}
          onBlur={forBlurHandler}
          hasError={forHasError}
        />

        <InputText
          enableResizing={false}
          required={true}
          label="Due Date"
          id="dueDateTodo"
          type="date"
          value={dueDateValue}
          onChange={dueDateChangeHandler}
          onBlur={dueDateBlurHandler}
          hasError={dueDateHasError}
        />
      </div>
      <div style={{ display: "flex" }} >
        <InputText
          enableResizing={false}
          required={true}
          label="By who"
          id="todoBy"
          type="text"
          value={todoByValue}
          onChange={todoByChangeHandler}
          onBlur={todoByBlurHandler}
          hasError={todoByHasError}
        />
        <InputText
          enableResizing={false}
          required={true}
          label="Description"
          id="todoDescription"
          type="text"
          value={descriptionValue}
          onChange={descriptionChangeHandler}
          onBlur={descriptionBlurHandler}
          hasError={descriptionHasError}
          multiline
          minRows="3"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="success" disabled={!formIsValid} >Add todo</Button>
      </div>
    </Box>
  )
}
