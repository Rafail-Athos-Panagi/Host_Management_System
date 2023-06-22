import React, { useContext, useEffect, useState } from "react";
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
  onlyNumbers,
} from "../../Regex/Regex";
import logging from "../../hooks/logging-hook";
import Username from "../../hooks/user-context";
import Swal from "sweetalert2";
import InputSelect from "../UI/Input/InputSelect";

const isNotEmpty = (value) => value.trim() !== "";
const isEmail = (value) => validEmail.test(value);
const isPhoneNumber = (value) => validPhoneNumber.test(value);
const isPostal_Zip_Code = (value) => validPostal_Zip_Code.test(value);
const isNotNumber = (value) => onlyNumbers.test(value);

export default function EditSupplier({ handleClose, editValues, refresh }) {
  const [inputs, setInputs] = useState([]);
  const [showInputs, setShowInputs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [prevValues, setPrevValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { username } = useContext(Username);

  useEffect(() => {
    const request = {
      method: "post",
      credentials: "include",
      mode: "cors",
      redirect: "follow",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        select: "*",
        from: "supplier_products",
        where: `supplierID=${editValues[0]}`,
      }),
    };
    fetch(`/api/select`, request).then(function (res) {
      res.json().then(function (data) {
        data.sqlMessage
          ? console.log(data.sqlMessage)
          : setInputs(
              data.map((products) => {
                return {
                  productName: products.productName,
                  productPrice: products.price,
                  productUnit: products.productUnit,
                  productDeleted: products.deleted,
                  productNamehasError: false,
                  productUnithasError: false,
                  productPricehasError: false,
                  productNameisTouched: false,
                  productUnitisTouched: false,
                  productPriceisTouched: false,
                  productNameisValid: true,
                  productPriceisValid: true,
                  productUnitisValid: true,
                };
              })
            );
        let temp = [...data];
        temp = temp.filter((item) => item.deleted === 0);
        setShowInputs(
          temp.map((products) => {
            return {
              productName: products.productName,
              productPrice: products.price,
              productUnit: products.productUnit,
              productDeleted: products.deleted,
              productNamehasError: false,
              productUnithasError: false,
              productPricehasError: false,
              productNameisTouched: false,
              productUnitisTouched: false,
              productPriceisTouched: false,
              productNameisValid: true,
              productPriceisValid: true,
              productUnitisValid: true,
            };
          })
        );
        setPrevValues(
          temp.map((prev) => {
            return {
              prID: Math.floor(Math.random() * 10001),
              prevProductName: prev.productName,
              newValue: "",
              deleted: prev.productDeleted,
            };
          })
        );
      });
    });
  }, [editValues]);

  const addNewItemHandler = () => {
    const inputData = [
      ...inputs,
      {
        productName: "",
        productPrice: "",
        productUnit: "",
        productDeleted: 0,
        productNamehasError: false,
        productPricehasError: false,
        productUnithasError: false,
        productNameisTouched: false,
        productPriceisTouched: false,
        productUnitisTouched: false,
        productNameisValid: false,
        productPriceisValid: false,
        productUnitisValid: false,
      },
    ];
    setInputs(inputData);
    const showData = [
      ...showInputs,
      {
        productName: "",
        productPrice: "",
        productUnit: "",
        productDeleted: 0,
        productNamehasError: false,
        productPricehasError: false,
        productUnithasError: false,
        productNameisTouched: false,
        productPriceisTouched: false,
        productUnitisTouched: false,
        productNameisValid: false,
        productPriceisValid: false,
        productUnitisValid: false,
      },
    ];
    setShowInputs(showData);

    const newChange = [
      {
        prID: Math.floor(Math.random() * 10001),
        prevProductName: "",
        newValue: "",
        deleted: 0,
      },
    ];
    setPrevValues((prev) => [...prev, ...newChange]);
  };

  const inputChangeHandler = (index, event) => {
    const values = [...showInputs];
    const valuesInput = [...inputs];
    const changeValues = [...prevValues];
    let counter = 0;
    let prIndex;
    let findIndex;
    let counter1 = 0;
    let prIndex1;
    let findIndex1;
    for (let item of changeValues) {
      if (item.deleted === 1) {
      } else {
        if (counter === index) {
          prIndex = item.prID;
          break;
        } else {
          counter = counter + 1;
        }
      }
    }

    findIndex = changeValues.findIndex((item) => item.prID === prIndex);

    for (let item of inputs) {
      if (item.productDeleted === 1) {
      } else {
        if (counter1 === index) {
          prIndex1 = item.productName;
          break;
        } else {
          counter1 = counter1 + 1;
        }
      }
    }

    findIndex1 = valuesInput.findIndex((item) => item.productName === prIndex1);

    if (event.target.name === "productName") {
      changeValues[findIndex]["newValue"] = event.target.value;
    }
    values[index][event.target.name] = event.target.value;
    valuesInput[findIndex1][event.target.name] = event.target.value;
    setInputs(valuesInput);
    setPrevValues(changeValues);

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

    showInputs[index][event.target.name + "hasError"] =
      values[index][event.target.name + "isTouched"] &&
      !values[index][event.target.name + "isValid"];

    setShowInputs(values);
  };

  const blurChangeHandler = (index, event) => {
    const values = [...showInputs];
    values[index][event.target.name + "isTouched"] = true;
    showInputs[index][event.target.name + "hasError"] =
      values[index][event.target.name + "isTouched"] &&
      !values[index][event.target.name + "isValid"];
    setShowInputs(values);
  };

  const deleteNewItemHandler = (index) => {
    const showList = [...showInputs];
    const changeList = [...prevValues];
    const prName = showList[index].productName;
    const prIndex = inputs.findIndex((item) => item.productName === prName);
    const prIndex1 = prevValues.findIndex(
      (item) => item.newValue === prName || item.prevProductName === prName
    );
    const inputList = [...inputs];
    showList.splice(index, 1);
    inputList[prIndex].productDeleted = 1;
    changeList[prIndex1].deleted = 1;
    setShowInputs(showList);
    setPrevValues(changeList);
  };

  const {
    value: supplierNameValue,
    isValid: supplierNameIsValid,
    hasError: supplierNameHasError,
    valueChangeHandler: supplierNameChangeHandler,
    inputBlurHandler: supplierNameBlurHandler,
    reset: resetSupplierName,
  } = useInput(isNotEmpty, editValues[1]);

  const {
    value: addressValue,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddress,
  } = useInput(isNotEmpty, editValues[2]);

  const {
    value: streetNumberValue,
    isValid: streetNumberIsValid,
    hasError: streetNumberHasError,
    valueChangeHandler: streetNumberChangeHandler,
    inputBlurHandler: streetNumberBlurHandler,
    reset: resetStreetNumber,
  } = useInput(isNotNumber, editValues[3]);

  const {
    value: cityValue,
    isValid: cityIsValid,
    hasError: cityHasError,
    valueChangeHandler: cityChangeHandler,
    inputBlurHandler: cityBlurHandler,
    reset: resetCity,
  } = useInput(isNotEmpty, editValues[4]);

  const {
    value: postal_Zip_CodeValue,
    isValid: postal_Zip_CodeIsValid,
    hasError: postal_Zip_CodeHasError,
    valueChangeHandler: postal_Zip_CodeChangeHandler,
    inputBlurHandler: postal_Zip_CodeBlurHandler,
    reset: resetPostal_Zip_Code,
  } = useInput(isNotEmpty && isPostal_Zip_Code, editValues[5]);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isNotEmpty && isEmail, editValues[6]);

  const {
    value: phoneNumberValue,
    isValid: phoneNumberIsValid,
    hasError: phoneNumberHasError,
    valueChangeHandler: phoneNumberChangeHandler,
    inputBlurHandler: phoneNumberBlurHandler,
    reset: resetPhoneNumber,
  } = useInput(isNotEmpty && isPhoneNumber, editValues[7]);

  let firstSaveCheck =
    supplierNameIsValid &&
    addressIsValid &&
    cityIsValid &&
    postal_Zip_CodeIsValid &&
    emailIsValid &&
    phoneNumberIsValid &&
    streetNumberIsValid;

  let secondSaveCheck = true;
  let disableCheck = true;

  showInputs.map((data, i) => {
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

  if (showInputs.length !== 0) {
    disableCheck = firstSaveCheck && secondSaveCheck;
  } else {
    disableCheck = firstSaveCheck;
  }

  console.log(inputs);
  console.log(prevValues);
  console.log(showInputs);

  const submitHandler = async (event) => {
    event.preventDefault();

    await Swal.fire({
      title: "Are you sure you want to edit this Supplier?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isDenied) {
        return;
      }
    });

    let firstFormValidation = false;
    let isMultipleInputValid = false;
    let Products = [];
    let ProductsInsert = [];

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

    if (showInputs.length !== 0) {
      showInputs.map((data, i) => {
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

    if (showInputs.length !== 0) {
      if (!firstFormValidation || !isMultipleInputValid) {
        return;
      }
    } else {
      if (!firstFormValidation) {
        return;
      }
    }

    console.log(showInputs);
    console.log(inputs);
    console.log(prevValues);

    const filteredInsert = prevValues.filter(
      (item) => item.prevProductName === ""
    );
    const filteredUpdate = prevValues.filter(
      (item) => item.prevProductName !== ""
    );

    const updateArray = inputs.filter((item1) =>
      filteredUpdate.some(
        (item2) =>
          item1.productName === item2.prevProductName ||
          item1.productName === item2.newValue
      )
    );

    const insertArray = showInputs.filter((item1) =>
      filteredInsert.some((item2) => item1.productName === item2.newValue)
    );

    console.log(filteredInsert);
    console.log(filteredUpdate);
    console.log(insertArray);
    console.log(updateArray);
    /*  console.log(prevValues); */

    if (inputs.length !== 0) {
      Products = updateArray.map((data, i) => {
        return {
          productID: i,
          productName: data.productName,
          productPrice: data.productPrice,
          productUnit: data.productUnit,
          productDeleted: data.productDeleted,
        };
      });
      ProductsInsert = insertArray.map((data, i) => {
        return {
          productID: i,
          productName: data.productName,
          productPrice: data.productPrice,
          productUnit: data.productUnit,
          productDeleted: data.productDeleted,
        };
      });
    }

    console.log(Products);
    console.log(ProductsInsert);
    console.log(prevValues);

    const updateDatabase = async () => {
      try {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors",
          redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "suppliers",
            columns: `supplierID=${editValues[0]},supplierName="${supplierNameValue}",supplierEmail="${emailValue}",phoneNumber="${phoneNumberValue}",supplierStreetName="${addressValue}",supplierStreetNumber="${streetNumberValue}",supplierCity="${cityValue}",supplierPostalCode=${postal_Zip_CodeValue}`,
            where: `supplierID=${editValues[0]}`,
          }),
        };

        const res = await fetch(`/api/update`, request);
        const data = await res.json();

        if (data.sqlMessage) {
          setErrorMessage(data.sqlMessage);
          return;
        } else {
          logging(`${username}`, `Update Supplier: ${editValues[0]}`);
        }

        Products.map(async (products, i) => {
          const request1 = {
            method: "post",
            credentials: "include",
            mode: "cors",
            redirect: "follow",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table: "supplier_products",
              columns: `productName="${products.productName}",price=${products.productPrice},productUnit="${products.productUnit}",deleted=${products.productDeleted}`,
              where: `supplierID=${editValues[0]} and productName="${prevValues[i].prevProductName}"`,
            }),
          };

          const res = await fetch(`/api/update`, request1);
          const data = await res.json();

          if (data.sqlMessage) {
            setErrorMessage(data.sqlMessage);
            return;
          } else {
            logging(
              `${username}`,
              `Update`,
              `${editValues[0]}`,
              `Edited Supplier: ${supplierNameValue}`
            );
          }
        });

        if (ProductsInsert.length > 0) {
          ProductsInsert.forEach((products) => {
            const request = {
              method: "post",
              credentials: "include",
              mode: "cors",
              redirect: "follow",

              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                table:
                  "supplier_products(supplierID,productName,price,productUnit)",
                values: `(${editValues[0]},"${products.productName}","${products.productPrice}","${products.productUnit}")`,
              }),
            };

            fetch(`/api/insert`, request).then(function (res) {
              res.json().then(function (data) {
                if (data.sqlMessage) {
                  setErrorMessage(data.sqlMessage);
                  return;
                } else {
                  logging(
                    `${username}`,
                    `Update`,
                    `${editValues[0]}`,
                    `Edited Supplier: ${supplierNameValue}`
                  );
                }
              });
            });
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    updateDatabase();

    Swal.fire({
      title: "Edited Supplier successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
    refresh();
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
      <h2 style={{ marginBottom: "20px" }}>Edit Supplier</h2>
      <hr />
      <div
        style={{
          scrollBehavior: "smooth",
          overflowY: "auto",
          maxHeight: "500px",
          paddingRight: "20px",
        }}
      >
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
              { value: "Limassol", label: "Limassol" },
              { value: "Larnaca", label: "Larnaca" },
              { value: "Nicosia", label: "Nicosia" },
              { value: "Paphos", label: "Paphos" },
              { value: "Kyrenia", label: "Kyrenia" },
              { value: "Famagusta", label: "Famagusta" },
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
        {showInputs.length !== 0 &&
          showInputs.map((data, i) => {
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
                  disable={isSaved}
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
                  disable={isSaved}
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
                  disable={isSaved}
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

      <div style={{ display: "flex", marginTop: "10px" }}>
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
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={!disableCheck}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Box>
  );
}
