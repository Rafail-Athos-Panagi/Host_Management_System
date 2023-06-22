import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import InputText from "../UI/Input/InputText";
import useInput from "../../hooks/use-input";
import Box from "@mui/material/Box";
import {
  notEmpty
} from "../../Regex/Regex";
import logging from '../../hooks/logging-hook';
import { FileUploader } from "react-drag-drop-files";
import Username from "../../hooks/user-context";
import Swal from "sweetalert2";



export default function AddRecipe({ handleClose, refresh }) {

  const [modalInformation, setModalInformation] = useState([]);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const recipeImageIsValid = useRef(false);
  const isNotEmpty = (value) => notEmpty.test(value);
  const [errorMessage, setErrorMessage] = useState("");
  const {username} = React.useContext(Username);

  const {
    value: recipeNameValue,
    isValid: recipeNameIsValid,
    hasError: recipeNameHasError,
    valueChangeHandler: recipeNameChangeHandler,
    inputBlurHandler: recipeNameBlurHandler,
    reset: resetRecipeName,
  } = useInput(isNotEmpty);

  const {
    value: recipeDescriptionValue,
    isValid: recipeDescriptionIsValid,
    hasError: recipeDescriptionHasError,
    valueChangeHandler: recipeDescriptionChangeHandler,
    inputBlurHandler: recipeDescriptionBlurHandler,
    reset: resetRecipeDescription,
  } = useInput(isNotEmpty);

  const {
    value: dateValue,
    isValid: dateIsValid,
    hasError: dateHasError,
    valueChangeHandler: dateChangeHandler,
    inputBlurHandler: dateBlurHandler,
    reset: resetdate,
  } = useInput(isNotEmpty);

  const {
    value: yieldValue,
    isValid: yieldIsValid,
    hasError: yieldHasError,
    valueChangeHandler: yieldChangeHandler,
    inputBlurHandler: yieldBlurHandler,
    reset: resetyield,
  } = useInput(isNotEmpty);

  const {
    value: shelfLifeValue,
    isValid: shelfLifeIsValid,
    hasError: shelfLifeHasError,
    valueChangeHandler: shelfLifeChangeHandler,
    inputBlurHandler: shelfLifeBlurHandler,
    reset: resetshelfLife,
  } = useInput(isNotEmpty);

  const {
    value: sensitivityValue,
    isValid: sensitivityIsValid,
    hasError: sensitivityHasError,
    valueChangeHandler: sensitivityChangeHandler,
    inputBlurHandler: sensitivityBlurHandler,
    reset: resetsensitivity,
  } = useInput(isNotEmpty);

  const {
    value: remarksValue,
    isValid: remarksIsValid,
    hasError: remarksHasError,
    valueChangeHandler: remarksChangeHandler,
    inputBlurHandler: remarksBlurHandler,
    reset: resetremarks,
  } = useInput(isNotEmpty);

  const {
    value: portionValue,
    isValid: portionIsValid,
    hasError: portionHasError,
    valueChangeHandler: portionChangeHandler,
    inputBlurHandler: portionBlurHandler,
    reset: resetPortion,
  } = useInput(isNotEmpty);

  const {
    value: toolsValue,
    isValid: toolsIsValid,
    hasError: toolsHasError,
    valueChangeHandler: toolsChangeHandler,
    inputBlurHandler: toolsBlurHandler,
    reset: resetTools,
  } = useInput(isNotEmpty);

  const {
    value: procedureValue,
    isValid: procedureIsValid,
    hasError: procedureHasError,
    valueChangeHandler: procedureChangeHandler,
    inputBlurHandler: procedureBlurHandler,
    reset: resetprocedure,
  } = useInput(isNotEmpty);

  const {
    value: ingredientsValue,
    isValid: ingredientsIsValid,
    hasError: ingredientsHasError,
    valueChangeHandler: ingredientsChangeHandler,
    inputBlurHandler: ingredientsBlurHandler,
    reset: resetIngredients,
  } = useInput(isNotEmpty);

  useEffect(() => {
    const updatedModalInformation = {
      RecipeName: recipeNameValue,
      Date: dateValue,
      ShelfLife: shelfLifeValue,
      Tools: toolsValue,
      PortionSize: portionValue,
      Yield: yieldValue,
      Sensitivity: sensitivityValue,
      Remarks: remarksValue,
      Description: recipeDescriptionValue,
      Ingredients: ingredientsValue,
      Procedure: procedureValue
    }
    setModalInformation(updatedModalInformation);
  }, [recipeNameValue, dateValue, shelfLifeValue, toolsValue, portionValue, yieldValue, sensitivityValue, remarksValue, recipeDescriptionValue, ingredientsValue, procedureValue]);



  let formIsValid = false;

  if (recipeNameIsValid && ingredientsIsValid && procedureIsValid)
    formIsValid = true;

  const onSubmitHandler = async event => {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure you want to add this recipe?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        addToDatabase();
      }
    });
    if (!formIsValid) {
      return;
    }

  };

  const addToDatabase = async () => {

    const formData = new FormData();
    formData.set('image', image);
    formData.set("table", "recipes");
    formData.set("values",`(default,"${recipeNameValue}","${imageName}","${recipeDescriptionValue}","${procedureValue}","${ingredientsValue}","${dateValue}","${toolsValue}","${yieldValue}","${portionValue}","${shelfLifeValue}","${sensitivityValue}","${remarksValue}",default)`);

    try {
      const request = {
        method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",
        body: formData
      };

      const res = await fetch(`/api/insert-recipe`, request);
      const data = await res.json()
      if (data.sqlMessage) {
        setErrorMessage(data.sqlMessage);
        Swal.fire({
          title: 'Error!',
          text: data.sqlMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      } else {
        logging(`${username}`, "Insert", `${data.insertID}`, "recipes",`Added new recipe: ${recipeNameValue}`);
        refresh();
        Swal.fire({
          title: 'Recipe added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        handleClose();
      }
    }
    catch (error) {
      console.error(error);
    }



    resetRecipeName("");
    resetRecipeImage();
    resetdate("");
    resetshelfLife("");
    resetTools("");
    resetPortion("");
    resetyield("");
    resetsensitivity("");
    resetremarks("");
    resetRecipeDescription("");
    resetIngredients("");
    resetprocedure("");
  };

  const recipeImageChangeHandler = (file) =>{
    setImage(file);
    setImageName(file.name.replace(/ /g, "_"));
    recipeImageIsValid.current=true;
  }

  
  const resetRecipeImage = () =>{
    setImage(null);
    setImageName(null)
    recipeImageIsValid.current=false;
  } 


  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "30ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
    >
      <h2 style={{ marginBottom: "20px" }}>Add new recipe</h2>
      <hr/>
      <div style={{ scrollBehavior: "smooth", overflowY: "auto", maxHeight: "500px", paddingRight: "20px"}}>
        <div style={{ display: "flex" }}>
          <InputText
            label="Recipe Name"
            type="text"
            id="recipeName"
            value={recipeNameValue}
            onChange={recipeNameChangeHandler}
            onBlur={recipeNameBlurHandler}
            hasError={recipeNameHasError}
          />
          <div style={{width:"50%"}}>
          <FileUploader
            handleChange={recipeImageChangeHandler}
            multiple={false}
            name="file"
            types={["jpg","png","webp","jpeg"]}
            style={{height:"150px"}}
            />
            <small>{imageName? "File uploaded: " + imageName : "No image uploaded"}</small>
            </div>
          
        </div>
        <div style={{ display: "flex"}}>
          <InputText
            label="Date"
            type="text"
            id="recipeDate"
            value={dateValue}
            onChange={dateChangeHandler}
            onBlur={dateBlurHandler}
            hasError={dateHasError}
          />
          <InputText
            label="Shelf Life"
            type="text"
            id="shelfLife"
            value={shelfLifeValue}
            onChange={shelfLifeChangeHandler}
            onBlur={shelfLifeBlurHandler}
            hasError={shelfLifeHasError}
          />
        </div>
        <div style={{ display: "flex", justifyContent:"center" }}>
          <InputText
            label="Tools"
            type="text"
            id="tools"
            value={toolsValue}
            onChange={toolsChangeHandler}
            onBlur={toolsBlurHandler}
            hasError={toolsHasError}
          />
          <InputText
            label="Portion Size"
            type="text"
            id="portion"
            value={portionValue}
            onChange={portionChangeHandler}
            onBlur={portionBlurHandler}
            hasError={portionHasError}
          />
        </div>
        <div style={{ display: "flex"}}>
          <InputText
            label="Yield"
            type="text"
            id="yield"
            value={yieldValue}
            onChange={yieldChangeHandler}
            onBlur={yieldBlurHandler}
            hasError={yieldHasError}
          />
          <InputText
            label="Sensitivity"
            type="text"
            id="sensitivity"
            value={sensitivityValue}
            onChange={sensitivityChangeHandler}
            onBlur={sensitivityBlurHandler}
            hasError={sensitivityHasError}
          />
        </div>
        <div style={{ display: "flex"}}>
          <InputText
            label="Remarks"
            type="text"
            id="remarks"
            value={remarksValue}
            onChange={remarksChangeHandler}
            onBlur={remarksBlurHandler}
            hasError={remarksHasError}
          />
          <InputText
            label="Description"
            type="text"
            id="description"
            value={recipeDescriptionValue}
            onChange={recipeDescriptionChangeHandler}
            onBlur={recipeDescriptionBlurHandler}
            hasError={recipeDescriptionHasError}
          />
        </div>
        <div style={{ display: "flex"}}>
          <InputText
            label="Ingredients"
            type="text"
            id="recipeIngredients"
            value={ingredientsValue}
            onChange={ingredientsChangeHandler}
            onBlur={ingredientsBlurHandler}
            hasError={ingredientsHasError}
            multiline
            minRows="3"
          />
          <InputText
            label="Procedures"
            type="text"
            id="recipeProcedures"
            value={procedureValue}
            onChange={procedureChangeHandler}
            onBlur={procedureBlurHandler}
            hasError={procedureHasError}
            multiline
            minRows="3"
          />
        </div>
      </div>
      <p style={{color:"red", fontSize:"22px"}}>{errorMessage}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button
          sx={{ marginRight: 5 }}
          variant="outlined"
          color="error"
          onClick={() => handleClose()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={!formIsValid}
        >
          Add Recipe
        </Button>
      </div>
    </Box>
  );
}
