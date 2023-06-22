import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import InputSelect from '../UI/Input/InputSelect';
import InputText from '../UI/Input/InputText';
import Button from '@mui/material/Button';
import useInput from '../../hooks/use-input';
import {
    validDescription,
    notEmpty
  } from "../../Regex/Regex";
import ChildModal from '../UI/Modal/ChildModal';

export default function EditTodo({ refreshTable,handleClose,editValues }) {
    const [openModal, setOpenModal] = useState(false);
    const [modalInformation, setModalInformation] = useState([]);

    const isNotEmpty = (value) => notEmpty.test(value);
    const noHtmlTags = (value) => validDescription.test(value);

    const {
        value: todoByValue,
        isValid: todoByIsValid,
        hasError: todoByHasError,
        valueChangeHandler: todoByChangeHandler,
        inputBlurHandler: todoByBlurHandler,
        reset: resetTodoBy,
    } = useInput(isNotEmpty,editValues.byWho);

    const {
        value: descriptionValue,
        isValid: descriptionIsValid,
        hasError: descriptionHasError,
        valueChangeHandler: descriptionChangeHandler,
        inputBlurHandler: descriptionBlurHandler,
        reset: resetDescription,
    } = useInput(isNotEmpty,editValues.description);

    const {
        value: dueDateValue,
        isValid:dueDateIsValid,
        hasError: dueDateHasError,
        valueChangeHandler: dueDateChangeHandler,
        inputBlurHandler: dueDateBlurHandler,
        reset: resetDueDate,
    } = useInput(isNotEmpty,editValues.dueDate.substring(0,10));

    const {
        value: forValue,
        isValid: forIsValid,
        hasError: forHasError,
        valueChangeHandler: forChangeHandler,
        inputBlurHandler: forBlurHandler,
        reset: resetFor,
    } = useInput(isNotEmpty,editValues.forWho);

    useEffect(() => {
        const updatedModalInformation = {
          ToBeDoneBy:todoByValue,
          DueDate:dueDateValue,
          For:forValue,
          description: descriptionValue,
        }
        setModalInformation(updatedModalInformation);
      }, [dueDateValue,forValue, descriptionValue,todoByValue]);

    let formIsValid = false;

    if (todoByIsValid && dueDateIsValid && forIsValid && descriptionIsValid)
      formIsValid = true;

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setOpenModal(true);
        if (!formIsValid) {
          return;
        }
    }

    const updateDatabase = async () => {
        
        try{
            const request = {
              method: "post",
              credentials: "include", 
              mode: "cors", redirect: "follow",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ table: "TODOLIST",
                                    columns:`description="${descriptionValue}",dueDate="${dueDateValue}",byWho="${todoByValue}",forWho="${forValue}"`,
                                  where:`todoID=${editValues.todoID}`}),
            };
          
          const res = await fetch(`/api/update`, request);
          const data = await res.json()
        
          if(data.sqlMessage)
          {
            console.log(data.sqlMessage);
          }
        }
          catch(error)
          {
            console.error(error)
          }

        handleClose();
      };
    
      const resetOpenModal = () => {
        setOpenModal(false);
      }

  return (
    <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
        noValidate
        autoComplete="off"
        onSubmit={onSubmitHandler}
        >

        <h2 style={{ marginBottom: "20px" }}>Edit todo task</h2>

        <div style={{ display: "flex" }} >
        <InputText
                enableResizing={false}
                required={true}
                label="For what/who"
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
            <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => {refreshTable();handleClose()}}>Cancel</Button>
            <Button type="submit" variant="contained" color="success"  disabled={!formIsValid} >Save Changes</Button>
        </div>
        {openModal && <ChildModal shouldOpen={openModal} informationObject={modalInformation} databaseHandler={updateDatabase} resetOpenModal={resetOpenModal} message={"Are you sure you want to keep these changes"} />}
    </Box>
  )
}
