import React, { useState, useEffect, useRef } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import InputText from "../UI/Input/InputText";
import useInput from "../../hooks/use-input";
import Box from "@mui/material/Box";
import { notEmpty } from "../../Regex/Regex";
import ChildModal from "../UI/Modal/ChildModal";
import logging from "../../hooks/logging-hook";
import Username from "../../hooks/user-context";
import Swal from "sweetalert2";
import RecipePrint from "./RecipePrint";
import { useReactToPrint } from "react-to-print";

export default function EditRecipe({ handleClose, editValues, refresh }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalInformation, setModalInformation] = useState([]);
  const [printIngredients, setPrintIngredients] = useState([]);
  const [printProcedure, setPrintProcedure] = useState([]);
  const [editMode, setEditMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { username } = React.useContext(Username);

  const isNotEmpty = (value) => notEmpty.test(value);

  useEffect(() => {
    //Get the recipe information that we didnt get from the recipes component cause of efficiency
    async function fetchRecipeInformation() {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors",
          redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select:
              "recipeProcedure,recipeIngredients,recipeDate,recipeTools,recipeYield,recipePortion,recipeShelfLife,recipeSensitivity,recipeRemarks",
            from: "recipes",
            where: `recipeID=${editValues.recipeID}`,
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json();

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        } else {
          resetprocedure(data[0].recipeProcedure);
          resetIngredients(data[0].recipeIngredients);
          resetdate(data[0].recipeDate);
          resetTools(data[0].recipeTools);
          resetyield(data[0].recipeYield);
          resetPortion(data[0].recipePortion);
          resetshelfLife(data[0].recipeShelfLife);
          resetsensitivity(data[0].recipeSensitivity);
          resetremarks(data[0].recipeRemarks);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchRecipeInformation();
  }, []);

  const {
    value: recipeNameValue,
    isValid: recipeNameIsValid,
    hasError: recipeNameHasError,
    valueChangeHandler: recipeNameChangeHandler,
    inputBlurHandler: recipeNameBlurHandler,
    reset: resetRecipeName,
  } = useInput(isNotEmpty, editValues.recipeName);

  const {
    value: recipeDescriptionValue,
    isValid: recipeDescriptionIsValid,
    hasError: recipeDescriptionHasError,
    valueChangeHandler: recipeDescriptionChangeHandler,
    inputBlurHandler: recipeDescriptionBlurHandler,
    reset: resetRecipeDescription,
  } = useInput(isNotEmpty, editValues.recipeDescription);

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
      Procedure: procedureValue,
    };
    setModalInformation(updatedModalInformation);

    let tempIngredients = [...printIngredients];
    let tempProcedure = [...printProcedure];

    tempIngredients = ingredientsValue.split("\n").map((item, index) => {
      return (
        <tr key={index}>
          <td>{item}</td>
        </tr>
      );
    });

    tempProcedure = procedureValue.split("\n").map((item, index) => {
      return (
        <tr style={{ backgroundColor: "yellow" }} key={index}>
          <td>{item}</td>
        </tr>
      );
    });

    setPrintIngredients(tempIngredients);
    setPrintProcedure(tempProcedure);
  }, [
    recipeNameValue,
    dateValue,
    shelfLifeValue,
    toolsValue,
    portionValue,
    yieldValue,
    sensitivityValue,
    remarksValue,
    recipeDescriptionValue,
    ingredientsValue,
    procedureValue,
  ]);

  let formIsValid = false;

  if (
    recipeNameIsValid &&
    dateIsValid &&
    yieldIsValid &&
    shelfLifeIsValid &&
    sensitivityIsValid &&
    remarksIsValid &&
    ingredientsIsValid &&
    portionIsValid &&
    procedureIsValid &&
    /* 3 */ recipeDescriptionIsValid &&
    toolsIsValid
  )
    formIsValid = true;

  if (true) {
    formIsValid = true;
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }
    Swal.fire({
      title: "Are you sure you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        updateDatabase();
        Swal.fire({
          title: "Edited recipe successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const updateDatabase = async () => {
    /* const formData = new FormData();
    formData.append('image', image);
    const request = {
      method: "POST",
      body: "formData"
    };
 
    try{}
    const res = await fetch(`/api/image`, request)
    
    .then(response => {
      console.log('Upload successful');
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    }); */

    try {
      const request = {
        method: "post",
        credentials: "include",
        mode: "cors",
        redirect: "follow",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "recipes",
          columns: `recipeName="${recipeNameValue}",recipeDate="${dateValue}",recipeShelfLife="${shelfLifeValue}",recipeTools="${toolsValue}",recipePortion="${portionValue}",recipeYield="${yieldValue}",recipeSensitivity="${sensitivityValue}",recipeRemarks="${remarksValue}",recipeDescription="${recipeDescriptionValue}",recipeIngredients="${ingredientsValue}",recipeProcedure="${procedureValue}";`,
          where: `recipeID=${editValues.recipeID}`,
        }),
      };

      const res = await fetch(`/api/update`, request);
      const data = await res.json();

      if (data.sqlMessage) {
        setErrorMessage(data.sqlMessage);
        return;
      } else {
        logging(
          `${username}`,
          `Update`,
          `${editValues.recipeID}`,
          `recipes`,
          `Updated Recipe: ${editValues.recipeName}`
        );
      }
    } catch (error) {
      console.error(error);
    }

    handleClose();
    refresh();
  };

  async function handleDelete() {
    async function deleteFromDatabase() {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors",
          redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "recipes",
            columns: `deleted=true`,
            where: `recipeID=${editValues.recipeID}`,
          }),
        };

        const res = await fetch(`/api/update`, request);
        const data = await res.json();

        if (data.sqlMessage) {
          setErrorMessage(data.sqlMessage);
          return;
        } else {
          logging(
            `${username}`,
            "Delete",
            `${editValues.recipeID}`,
            "recipes",
            `Deleted Recipe: ${editValues.recipeName}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    await Swal.fire({
      title: "Are you sure you want to delete this recipe?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFromDatabase().then(() => {
          Swal.fire({
            title: "Recipe deleted successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            handleClose();
          });
        });
      }
    });
  }

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    title: "Recipe",
    pageStyle: `
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    .table-page-break {
      page-break-after: always;
    }
    @page {
      margin: 0;
    }
  }
`,
  });

  const handleButtonClick = () => {
    handlePrint();
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
    >
      <h2 style={{ marginBottom: "20px" }}>View Recipe</h2>
      <Button onClick={handleButtonClick}>Print</Button>
      <div style={{ display: "none" }}>
        <RecipePrint
          ref={componentRef}
          data={modalInformation}
          tableIngredients={printIngredients}
          tableProcedure={printProcedure}
        />
      </div>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox onClick={() => setEditMode(!editMode)} />}
          label="Edit mode"
        />
      </FormGroup>
      <hr />
      <div
        style={{
          scrollBehavior: "smooth",
          overflowY: "auto",
          maxHeight: "500px",
          paddingRight: "20px",
        }}
      >
        <div style={{ display: "flex" }}>
          <InputText
            label="Recipe Name"
            type="text"
            id="recipeName"
            value={recipeNameValue}
            onChange={recipeNameChangeHandler}
            onBlur={recipeNameBlurHandler}
            hasError={recipeNameHasError}
            shouldBeReadOnly={editMode}
          />
          {/* <input
          label="Recipe Image"
          type="file"
          id="recipeImage"
          onChange={recipeImageChangeHandler}
        /> */}
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            label="Date"
            type="text"
            id="recipeDate"
            value={dateValue}
            onChange={dateChangeHandler}
            onBlur={dateBlurHandler}
            hasError={dateHasError}
            shouldBeReadOnly={editMode}
          />
          <InputText
            label="Shelf Life"
            type="text"
            id="shelfLife"
            value={shelfLifeValue}
            onChange={shelfLifeChangeHandler}
            onBlur={shelfLifeBlurHandler}
            hasError={shelfLifeHasError}
            shouldBeReadOnly={editMode}
          />
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            label="Tools"
            type="text"
            id="tools"
            value={toolsValue}
            onChange={toolsChangeHandler}
            onBlur={toolsBlurHandler}
            hasError={toolsHasError}
            shouldBeReadOnly={editMode}
          />
          <InputText
            label="Portion Size"
            type="text"
            id="portion"
            value={portionValue}
            onChange={portionChangeHandler}
            onBlur={portionBlurHandler}
            hasError={portionHasError}
            shouldBeReadOnly={editMode}
          />
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            label="Yield"
            type="text"
            id="yield"
            value={yieldValue}
            onChange={yieldChangeHandler}
            onBlur={yieldBlurHandler}
            hasError={yieldHasError}
            shouldBeReadOnly={editMode}
          />
          <InputText
            label="Sensitivity"
            type="text"
            id="sensitivity"
            value={sensitivityValue}
            onChange={sensitivityChangeHandler}
            onBlur={sensitivityBlurHandler}
            hasError={sensitivityHasError}
            shouldBeReadOnly={editMode}
          />
        </div>
        <div style={{ display: "flex" }}>
          <InputText
            label="Remarks"
            type="text"
            id="remarks"
            value={remarksValue}
            onChange={remarksChangeHandler}
            onBlur={remarksBlurHandler}
            hasError={remarksHasError}
            shouldBeReadOnly={editMode}
          />
          <InputText
            label="Description"
            type="text"
            id="description"
            value={recipeDescriptionValue}
            onChange={recipeDescriptionChangeHandler}
            onBlur={recipeDescriptionBlurHandler}
            hasError={recipeDescriptionHasError}
            shouldBeReadOnly={editMode}
            disabled={true}
          />
        </div>
        <div style={{ display: "flex" }}>
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
            shouldBeReadOnly={editMode}
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
            shouldBeReadOnly={editMode}
          />
        </div>
      </div>
      <p style={{ color: "red", fontSize: "22px" }}>{errorMessage}</p>
      {!editMode && (
        <div style={{ display: "flex", marginTop: "10px" }}>
          <div style={{ width: "50%" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete()}
            >
              Delete Recipe
            </Button>
          </div>

          <div
            style={{ width: "50%", justifyContent: "right", display: "flex" }}
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
              Save changes
            </Button>
          </div>
        </div>
      )}
    </Box>
  );
}
