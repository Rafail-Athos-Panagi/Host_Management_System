import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputText from "../UI/Input/InputText";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useInput from "../../hooks/use-input";
import {
  validEmail,
  validPhoneNumber,
  validPostal_Zip_Code,
  validPrice,
  onlyNumbers
} from "../../Regex/Regex";
import logging from '../../hooks/logging-hook';
import Username from "../../hooks/user-context";
import Swal from "sweetalert2";
import InputSelect from "../UI/Input/InputSelect";


const isNotEmpty = (value) => value.trim() !== "";
const isEmail = (value) => validEmail.test(value);
const isPhoneNumber = (value) => validPhoneNumber.test(value);
const isPostal_Zip_Code = (value) => validPostal_Zip_Code.test(value);
const isNotNumber = (value) => onlyNumbers.test(value);

export default function AddSupplier({ handleClose }) {
  const [inputs, setInputs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { username } = React.useContext(Username);

  const addNewItemHandler = () => {
    const inputData = [
      ...inputs,
      {
        productName: "",
        productPrice: "",
        productUnit: "",
        productNamehasError: false,
        productUnithasError: false,
        productPricehasError: false,
        productNameisTouched: false,
        productUnitisTouched: false,
        productPriceisTouched: false,
        productNameisValid: false,
        productPriceisValid: false,
        productUnitisValid: false,
      },
    ];
    setInputs(inputData);
  };

  const inputChangeHandler = (index, event) => {
    const values = [...inputs];
    values[index][event.target.name] = event.target.value;
    setInputs(values);

    if (event.target.name === "productName") {
      if (event.target.value.trim() !== "") {
        values[index][event.target.name + "isValid"] = true;
      } else {
        values[index][event.target.name + "isValid"] = false;
      }
    } else if (event.target.name === "productPrice") {
      if (
        validPrice.test(event.target.value) &&
        event.target.value.trim() !== ""
      ) {
        values[index][event.target.name + "isValid"] = true;
      } else {
        values[index][event.target.name + "isValid"] = false;
      }
    } else if (event.target.name === "productUnit") {
      if (event.target.value.trim() !== "") {
        values[index][event.target.name + "isValid"] = true;
      } else {
        values[index][event.target.name + "isValid"] = false;
      }
    }

    inputs[index][event.target.name + "hasError"] =
      values[index][event.target.name + "isTouched"] &&
      !values[index][event.target.name + "isValid"];

    setInputs(values);
  };

  const blurChangeHandler = (index, event) => {
    const values = [...inputs];
    values[index][event.target.name + "isTouched"] = true;
    inputs[index][event.target.name + "hasError"] =
      values[index][event.target.name + "isTouched"] &&
      !values[index][event.target.name + "isValid"];
    setInputs(values);
  };

  const deleteNewItemHandler = (index) => {
    const deleteList = [...inputs];
    deleteList.splice(index, 1);
    setInputs(deleteList);
  };

  const {
    value: supplierNameValue,
    isValid: supplierNameIsValid,
    hasError: supplierNameHasError,
    valueChangeHandler: supplierNameChangeHandler,
    inputBlurHandler: supplierNameBlurHandler,
    reset: resetSupplierName,
  } = useInput(isNotEmpty);

  const {
    value: addressValue,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddress,
  } = useInput(isNotEmpty);

  const {
    value: cityValue,
    isValid: cityIsValid,
    hasError: cityHasError,
    valueChangeHandler: cityChangeHandler,
    inputBlurHandler: cityBlurHandler,
    reset: resetCity,
  } = useInput(isNotEmpty);

  const {
    value: postal_Zip_CodeValue,
    isValid: postal_Zip_CodeIsValid,
    hasError: postal_Zip_CodeHasError,
    valueChangeHandler: postal_Zip_CodeChangeHandler,
    inputBlurHandler: postal_Zip_CodeBlurHandler,
    reset: resetPostal_Zip_Code,
  } = useInput(isNotEmpty && isPostal_Zip_Code);

  const {
    value: streetNumberValue,
    isValid: streetNumberIsValid,
    hasError: streetNumberHasError,
    valueChangeHandler: streetNumberChangeHandler,
    inputBlurHandler: streetNumberBlurHandler,
    reset: resetStreetNumber,
  } = useInput(isNotNumber);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isNotEmpty && isEmail);

  const {
    value: phoneNumberValue,
    isValid: phoneNumberIsValid,
    hasError: phoneNumberHasError,
    valueChangeHandler: phoneNumberChangeHandler,
    inputBlurHandler: phoneNumberBlurHandler,
    reset: resetPhoneNumber,
  } = useInput(isNotEmpty && isPhoneNumber);

  let firstSaveCheck = supplierNameIsValid &&
    addressIsValid &&
    cityIsValid &&
    postal_Zip_CodeIsValid &&
    emailIsValid &&
    phoneNumberIsValid &&
    streetNumberIsValid

  let secondSaveCheck = false;
  let disableCheck = false;

  inputs.map((data, i) => {
    if (
      data.productNameisValid &&
      data.productPriceisValid &&
      data.productUnitisValid
    ) {
      secondSaveCheck = true;
    } else {
      secondSaveCheck = false;
    }
  });

  if (inputs.length !== 0) {
    disableCheck = firstSaveCheck && secondSaveCheck;
  }

  else {
    disableCheck = firstSaveCheck
  }

  console.log(firstSaveCheck);
  console.log(secondSaveCheck);
  console.log(disableCheck);

  const submitHandler = async (event) => {
    event.preventDefault();



    let firstFormValidation = false;
    let isMultipleInputValid = false;

    if (
      supplierNameIsValid &&
      addressIsValid &&
      cityIsValid &&
      postal_Zip_CodeIsValid &&
      emailIsValid &&
      phoneNumberIsValid &&
      streetNumberIsValid
    ) {
      firstFormValidation = true;
    }

    console.log(firstFormValidation + " First Form");

    if (inputs.length !== 0) {
      inputs.forEach(data => {
        if (
          data.productNameisValid &&
          data.productPriceisValid &&
          data.productUnitisValid
        ) {
          isMultipleInputValid = true;
        } else {
          isMultipleInputValid = false;
        }
      });
    }

    console.log(isMultipleInputValid + " Second Form");

    if (inputs.length !== 0) {
      if (!firstFormValidation || !isMultipleInputValid) {
        return;
      }
    } else {
      if (!firstFormValidation) {
        return;
      }
    }


    const addToDatabase = async () => {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table:
              "suppliers(supplierID,supplierName,supplierEmail,phoneNumber,supplierStreetName,supplierStreetNumber,supplierCity,supplierPostalCode)",
            values: `(DEFAULT,"${supplierNameValue}","${emailValue}",${phoneNumberValue},"${addressValue}",${streetNumberValue},"${cityValue}",${postal_Zip_CodeValue})`,
          }),
        };

        fetch(`/api/insert`, request).then(function (res) {
          res.json().then(function (data) {

            if (data.sqlMessage) {
              setErrorMessage(data.sqlMessage);
              return;
            } else {
              logging(`${username}`, "Insert", `${data.insertID}`, "suppliers", `Added new supplier: ${supplierNameValue}`);
            }

            inputs.forEach(products => {
              const request = {
                method: "post",
                credentials: "include",
                mode: "cors", redirect: "follow",

                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  table:
                    "supplier_products(supplierID,productName,price,productUnit)",
                  values: `(${data.insertID},"${products.productName}","${products.productPrice}","${products.productUnit}")`,
                }),
              };

              fetch(`/api/insert`, request).then(function (res) {
                res.json().then(function (data) {
                  if (data.sqlMessage) {
                    setErrorMessage(data.sqlMessage);
                    return;
                  } else {
                    logging(`${username}`, "Insert", `${supplierNameValue},${products.productName}`, "supplier_products", `Added new supplier product: ${products.productName} to ${supplierNameValue}`);
                  }
                })

              });
            });
          })
        });
      } catch (error) {
        console.error(error);
      }
    };

    Swal.fire({
      title: 'Are you sure you want to add this supplier?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        addToDatabase();
        Swal.fire({
          title: 'Supplier added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        resetStreetNumber("");
        resetSupplierName("");
        resetAddress("");
        resetCity("");
        resetPostal_Zip_Code("");
        resetEmail("");
        resetPhoneNumber("");
        firstFormValidation = false;
        isMultipleInputValid = false;
        setInputs([]);

      }
    });
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "15ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={submitHandler}
    >
      <h2 style={{ marginBottom: "20px" }}>Add new supplier</h2>
      <hr />
      <div style={{ scrollBehavior: "smooth", overflowY: "auto", maxHeight: "500px", paddingRight: "20px" }}>
        <InputText
          required={true}
          id="supplier_name"
          label="Supplier Name"
          onChange={supplierNameChangeHandler}
          onBlur={supplierNameBlurHandler}
          hasError={supplierNameHasError}
          value={supplierNameValue}
        />
        <InputText
          required={true}
          id="phone_number"
          label="Phone Number"
          enableMaxCharacters={true}
          maxCharacters="8"
          onChange={phoneNumberChangeHandler}
          onBlur={phoneNumberBlurHandler}
          hasError={phoneNumberHasError}
          value={phoneNumberValue}
        />
        <InputText
          required={true}
          type="email"
          id="email"
          label="Email"
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          hasError={emailHasError}
          value={emailValue}
        />
        <div style={{ display: "flex" }}>
          <InputText
            required={true}
            id="address"
            label="Address"
            onChange={addressChangeHandler}
            onBlur={addressBlurHandler}
            hasError={addressHasError}
            value={addressValue}
          />
          <InputText
            required={true}
            id="street_number"
            label="Street Number"
            onChange={streetNumberChangeHandler}
            onBlur={streetNumberBlurHandler}
            hasError={streetNumberHasError}
            value={streetNumberValue}
          />
          <InputSelect
            required={true}
            id="city"
            label="City"
            selection={[
              { value: 'Limassol', label: 'Limassol' },
              { value: 'Larnaca', label: 'Larnaca' },
              { value: 'Nicosia', label: 'Nicosia' },
              { value: 'Paphos', label: 'Paphos' },
              { value: 'Kyrenia', label: 'Kyrenia' },
              { value: 'Famagusta', label: 'Famagusta' },
            ]}
            onChange={cityChangeHandler}
            onBlur={cityBlurHandler}
            hasError={cityHasError}
            value={cityValue}
          />
          <InputText
            required={true}
            id="outlined"
            label="Postal / Zip Code"
            onChange={postal_Zip_CodeChangeHandler}
            onBlur={postal_Zip_CodeBlurHandler}
            hasError={postal_Zip_CodeHasError}
            value={postal_Zip_CodeValue}
            enableMaxCharacters={true}
            maxCharacters="4"
          />
        </div>
        {inputs.length !== 0 &&
          inputs.map((data, i) => {
            return (
              <div key={i} style={{ display: "flex" }}>
                <InputText
                  name="productName"
                  required={true}
                  id="product_Name"
                  label="Product Name"
                  hasError={data.productNamehasError}
                  value={data.productName}
                  onChange={(event) => inputChangeHandler(i, event)}
                  onBlur={(event) => blurChangeHandler(i, event)}
                />
                <InputText
                  name="productPrice"
                  required={true}
                  id="product_Price"
                  value={data.productPrice}
                  hasError={data.productPricehasError}
                  label="Product Price"
                  onChange={(event) => inputChangeHandler(i, event)}
                  onBlur={(event) => blurChangeHandler(i, event)}
                />
                <InputText
                  name="productUnit"
                  required={true}
                  id="product_Unit"
                  label="Product Unit"
                  hasError={data.productUnithasError}
                  value={data.productUnit}
                  onChange={(event) => inputChangeHandler(i, event)}
                  onBlur={(event) => blurChangeHandler(i, event)}
                />
                <div>
                  <Button
                    style={{ marginTop: "1rem" }}
                    variant="outlined"
                    color="error"
                    onClick={() => deleteNewItemHandler(i)}
                  >
                    REMOVE
                  </Button>
                </div>
              </div>
            );
          })}
        <p style={{ color: "red", fontSize: "22px" }}>{errorMessage}</p>

      </div>

      <div style={{ display: "flex", marginTop: "10px", }}>
        <div style={{ display: "flex", width: "20%" }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addNewItemHandler}
          >
            Add new item
          </Button>
        </div>
        <div style={{ display: "flex", width: "80%", justifyContent: "right" }}>
          <Button
            sx={{ marginRight: 5 }}
            variant="outlined"
            color="error"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={submitHandler} disabled={!disableCheck}>
            Add Supplier
          </Button>
        </div>
      </div>
    </Box>
  );
}
