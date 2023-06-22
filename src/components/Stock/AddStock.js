import React, { useEffect, useRef, useState } from 'react';
import Box from "@mui/material/Box";
import InputText from "../UI/Input/InputText";
import InputSelect from '../UI/Input/InputSelect';
import Button from "@mui/material/Button";
import useInput from '../../hooks/use-input';
import Swal from 'sweetalert2';
import {
  validDescription,
  validPositiveFloat,
  notEmpty,
  validPositiveIntegerAllowedEmpty
} from "../../Regex/Regex";
import logging from "../../hooks/logging-hook";
import Username from '../../hooks/user-context';


export default function AddStock({ handleClose }) {

  const [supplierList, setSupplierList] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [idSupplier, setIDSupplier] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalInformation, setModalInformation] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { username } = React.useContext(Username);
  let supplierIDFor;

  const isNotEmpty = (value) => notEmpty.test(value);
  const noHtmlTags = (value) => validDescription.test(value);
  const isPositiveNumber = (value) => validPositiveFloat.test(value);
  const isPositiveEmpty = (value) => validPositiveIntegerAllowedEmpty.test(value);

  //For dropdown of suppliers,product types and units
  useEffect(() => {
    async function fetchSupplierNames() {
      try {
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "supplierID,supplierName",
            from: "suppliers",
            where: "deleted=false"
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          setSupplierList(data);
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    async function fetchProductTypes() {
      try {
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "productType",
            from: "productTypesVariables"
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()
        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          setProductTypes(data);
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    async function fetchUnitTypes() {
      try {
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "unitType",
            from: "unitsVariables"
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          setUnitTypes(data);
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    fetchSupplierNames();
    fetchProductTypes();
    fetchUnitTypes();
  }, []);

  //For dropdown units
  useEffect(() => {
    
  }, []);

  const {
    value: productIDValue,
    isValid: productIDIsValid,
    hasError: productIDHasError,
    valueChangeHandler: productIDChangeHandler,
    inputBlurHandler: productIDBlurHandler,
    reset: resetproductID,
  } = useInput(isPositiveEmpty);

  const {
    value: productTypeValue,
    isValid: productTypeIsValid,
    hasError: productTypeHasError,
    valueChangeHandler: productTypeChangeHandler,
    inputBlurHandler: productTypeBlurHandler,
    reset: resetproductType,
  } = useInput(isNotEmpty);

  const {
    value: productSupplierValue,
    isValid: productSupplierIsValid,
    hasError: productSupplierHasError,
    valueChangeHandler: productSupplierChangeHandler,
    inputBlurHandler: productSupplierBlurHandler,
    reset: resetproductSupplier,
  } = useInput(isNotEmpty);

  const {
    value: productNameValue,
    isValid: productNameIsValid,
    hasError: productNameHasError,
    valueChangeHandler: productNameChangeHandler,
    inputBlurHandler: productNameBlurHandler,
    reset: resetproductName,
  } = useInput(isNotEmpty);

  const {
    value: unitValue,
    isValid: unitIsValid,
    hasError: unitHasError,
    valueChangeHandler: unitChangeHandler,
    inputBlurHandler: unitBlurHandler,
    reset: resetUnit,
  } = useInput(isNotEmpty);

  const {
    value: quantityValue,
    isValid: quantityIsValid,
    hasError: quantityHasError,
    valueChangeHandler: quantityChangeHandler,
    inputBlurHandler: quantityBlurHandler,
    reset: resetquantity,
  } = useInput(isPositiveNumber);

  const {
    value: descriptionValue,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetdescription,
  } = useInput(noHtmlTags);

  useEffect(() => {
    const updatedModalInformation = {
      productID:productIDValue,
      productType: productTypeValue,
      productSupplier: productSupplierValue,
      productName: productNameValue,
      unit: unitValue,
      quantity: quantityValue,
      description: descriptionValue,
    }
    setModalInformation(updatedModalInformation);
  }, [productTypeValue, productSupplierValue, productNameValue, unitValue, quantityValue, descriptionValue,productIDValue]);



  useEffect(() => {

    if (productSupplierValue.trim() !== '') {
      const idSupplier = supplierList.filter((data) =>
        data.supplierName === productSupplierValue
      )
      if (idSupplier.length > 0) {
        const [{ supplierID }] = idSupplier;
        supplierIDFor= supplierID;
        setIDSupplier(supplierIDFor);
      }
      else
        console.log("No id");
    }
  }, [productSupplierValue])

  let formIsValid = false;


  if (productTypeIsValid && productNameIsValid && unitIsValid && quantityIsValid && descriptionIsValid && productSupplierIsValid && productIDIsValid) {
    formIsValid = true;
  }

  const onSubmitHandler = async event => {
    event.preventDefault();

    Swal.fire({
      title: 'Are you sure you want to add this item?',
      text:"Item name: "+productNameValue,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        addToDatabase().then((res) => {
          if(res==="")
            Swal.fire({
              title: 'Item added successfully!',
              text: 'Item name: '+productNameValue,
              icon: 'success',
              confirmButtonText: 'OK'
            });
          else
            Swal.fire({
              title: 'Error!',
              text: res,
              icon: 'error',
              confirmButtonText: 'OK'
            });
        });
        
      }
    });
   
    if (!formIsValid) {
      return;
    }

  };

  const addToDatabase = async () => {

    try {
      const request = {
        method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "stock(barcode,stockName,stockType,stockUnit,stockQuantity,supplierID,description)",
          values: `("${productIDValue}","${productNameValue}","${productTypeValue}","${unitValue}",${quantityValue},${idSupplier},"${descriptionValue}")`
        }),
      };

      const res = await fetch(`/api/insert`, request);
      const data = await res.json();
      if (data.sqlMessage) {
        setErrorMessage(data.sqlMessage);
        return data.sqlMessage;
      } else {
        logging(`${username}`, "Insert", `${data.insertID}`, "stock",`Added new stock: ${productNameValue}`);
        setErrorMessage("");
        return "";
      }
    }
    catch (error) {
      console.error(error)
    }

    resetproductID("");
    resetproductType("");
    resetproductSupplier("");
    resetproductName("");
    resetUnit("");
    resetquantity("");
    resetdescription("");

    resetOpenModal();
  }

  const resetOpenModal = () => {
    setOpenModal(false);
  };

  return (
    <Box component="form" sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}>

      <h2 style={{ marginBottom: "20px" }}>Add new product to stock</h2>
      <hr/>
      <div style={{ display: "flex" }} >
        <InputSelect
          enableResizing={false}
          required={true}
          label="Product Type"
          id="productType"
          selection={productTypes.map(data => {
            return {
              label: data.productType,
              value: data.productType,
            };
          })}
          value={productTypeValue}
          onChange={productTypeChangeHandler}
          onBlur={productTypeBlurHandler}
          hasError={productTypeHasError}
        />

        <InputText
          label="productID"
          type="text"
          id="productID"
          value={productIDValue}
          onChange={productIDChangeHandler}
          onBlur={productIDBlurHandler}
          hasError={productIDHasError}
        />
      </div>
      <div style={{ display: "flex" }}>
        <InputSelect
          enableResizing={false}
          required={false}
          selection={supplierList.map(data => {
            return {
              label: data.supplierName,
              value: data.supplierName,
            };
          })}
          label="productSupplier"
          type="text"
          id="productSuppleir"
          value={productSupplierValue}
          onChange={productSupplierChangeHandler}
          onBlur={productSupplierBlurHandler}
          hasError={productSupplierHasError}
        />
        <InputText
          label="productName"
          type="text"
          required={true}
          id="productName"
          value={productNameValue}
          onChange={productNameChangeHandler}
          onBlur={productNameBlurHandler}
          hasError={productNameHasError}
        />
      </div>
      <div style={{ display: "flex" }}>
        <InputSelect
          enableResizing={false}
          required={true}
          label="Unit"
          id="unit"
          selection={unitTypes.map(data => {
            return {
              label: data.unitType,
              value: data.unitType,
            };
          })}
          value={unitValue}
          onChange={unitChangeHandler}
          onBlur={unitBlurHandler}
          hasError={unitHasError}
        />
        <InputText
          label="Quantity"
          type="text"
          required={true}
          id="Quantity"
          value={quantityValue}
          onChange={quantityChangeHandler}
          onBlur={quantityBlurHandler}
          hasError={quantityHasError}
        />
      </div>
      <InputText
        label="Description"
        type="text"
        required={false}
        id="description"
        value={descriptionValue}
        onChange={descriptionChangeHandler}
        onBlur={descriptionBlurHandler}
        hasError={descriptionHasError}
        multiline
        minRows="3"
      />
      <p style={{color:"red", fontSize:"22px"}}>{errorMessage}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => handleClose()}>Cancel</Button>
        <Button type="submit" variant="contained" color="success" disabled={!formIsValid}>Add item</Button>
      </div>

    </Box>
  )
}
