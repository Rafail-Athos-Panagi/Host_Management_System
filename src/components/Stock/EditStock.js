import React, { useState, useEffect } from 'react';
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
import logging from '../../hooks/logging-hook';
import Username from '../../hooks/user-context';


export default function EditStock({ refresh, handleClose, editValues }) {

  const [supplierList, setSupplierList] = useState([]); // SupplierNames for dropdown
  const [productTypes, setProductTypes] = useState([]); // Product Types for dropdown
  const [unitTypes, setUnitTypes] = useState([]); // Unit Types for dropdown
  const [openModal, setOpenModal] = useState(false);
  const [modalInformation, setModalInformation] = useState([]); // this contains the data
  const [idSupplier, setIDSupplier] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { username } = React.useContext(Username);
  let supplierIDFor;

  const isNotEmpty = (value) => notEmpty.test(value);
  const noHtmlTags = (value) => validDescription.test(value);
  const isPositiveNumber = (value) => validPositiveFloat.test(value);
  const isPositiveEmpty = (value) => validPositiveIntegerAllowedEmpty.test(value);

  // description and barcode fetch
  useEffect(() => {
    async function fetchBarcodeDescription() {
      try {
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "barcode,description",
            from: "stock",
            where: `stockProductID=${editValues[0]}`
          }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
          console.log(data.sqlMessage);
        }
        else {
          resetproductID(data[0].barcode);
          resetdescription(data[0].description);
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    async function fetchSupplierNames() {
      try {
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            select: "supplierID,supplierName",
            from: "suppliers"
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
    fetchBarcodeDescription();
    fetchSupplierNames();
    fetchProductTypes();
    fetchUnitTypes();
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
  } = useInput(isNotEmpty, editValues[2]);

  const {
    value: productSupplierValue,
    isValid: productSupplierIsValid,
    hasError: productSupplierHasError,
    valueChangeHandler: productSupplierChangeHandler,
    inputBlurHandler: productSupplierBlurHandler,
    reset: resetproductSupplier,
  } = useInput(isNotEmpty, editValues[5]);

  const {
    value: productNameValue,
    isValid: productNameIsValid,
    hasError: productNameHasError,
    valueChangeHandler: productNameChangeHandler,
    inputBlurHandler: productNameBlurHandler,
    reset: resetproductName,
  } = useInput(isNotEmpty, editValues[1]);

  const {
    value: unitValue,
    isValid: unitIsValid,
    hasError: unitHasError,
    valueChangeHandler: unitChangeHandler,
    inputBlurHandler: unitBlurHandler,
    reset: resetUnit,
  } = useInput(isNotEmpty, editValues[3]);

  const {
    value: quantityValue,
    isValid: quantityIsValid,
    hasError: quantityHasError,
    valueChangeHandler: quantityChangeHandler,
    inputBlurHandler: quantityBlurHandler,
    reset: resetquantity,
  } = useInput(isPositiveNumber, editValues[4]);

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
      productID: productIDValue,
      productType: productTypeValue,
      productSupplier: productSupplierValue,
      productName: productNameValue,
      unit: unitValue,
      quantity: quantityValue,
      description: descriptionValue,
    }
    setModalInformation(updatedModalInformation);
  }, [productTypeValue, productSupplierValue, productNameValue, unitValue, quantityValue, descriptionValue, productIDValue]);

  useEffect(() => {
    console.log(supplierList);
    console.log(productSupplierValue);
    const supplierid = supplierList.filter((data) =>
      data.supplierName === productSupplierValue
    )
    console.log(supplierid);
    if (supplierid.length > 0) {
      const [{ supplierID }] = supplierid;
      supplierIDFor = supplierID;
      setIDSupplier(supplierIDFor);
    }
    else
      console.log("No id");
  }, [productSupplierValue, openModal, supplierList]);

  let formIsValid = false;

  if (productTypeIsValid && productNameIsValid && unitIsValid && quantityIsValid && descriptionIsValid && productSupplierIsValid && productIDIsValid) {
    formIsValid = true;
  }

  const onSubmitHandler = event => {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure you want to edit this item?',
      text:"Item name: "+productNameValue,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        updateDatabase();
        Swal.fire({
          title: 'Edited item successfully!',
          text: 'Item name: '+productNameValue,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });

    if (!formIsValid) {
      return;
    }
  };

  const updateDatabase = async () => {
    try {
      const request = {
        method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "stock",
          columns: `barcode="${productIDValue}",stockName="${productNameValue}",stockType="${productTypeValue}",stockUnit="${unitValue}",stockQuantity=${quantityValue},supplierID=${idSupplier},description="${descriptionValue}"`,
          where: `stockProductID=${editValues[0]}`
        }),
      };

      const res = await fetch(`/api/update`, request);
      const data = await res.json()

      if (data.sqlMessage) {
        console.log(data.sqlMessage);
      } else {
        logging(`${username}`, "Update", `${editValues[0]}`, "stock",`Edited stock: ${productNameValue}`);
      }
    }
    catch (error) {
      console.error(error)
    }
    handleClose();
  };

  async function handleDelete() {
    async function deleteFromDatabase(){
      try {
        const request = {
          method: "post",
          credentials: "include", 
          mode: "cors", redirect: "follow",
  
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "stock",
            columns: `deleted=true`,
            where: `stockProductID=${editValues[0]}`
          }),
        };
  
        const res = await fetch(`/api/update`, request);
        const data = await res.json()
  
        if (data.sqlMessage) {
          setErrorMessage(data.sqlMessage);
          return;
        } else {
          logging(`${username}`, "Delete", `${editValues[0]}`, "stock", `Deleted stock: ${productNameValue}`);
        }
        
      }
      catch (error) {
        console.error(error)
      }
    }
    await Swal.fire({
      title: 'Are you sure you want to delete this item?',
      text:"Item name: "+productNameValue,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFromDatabase();
        Swal.fire({
          title: 'Deleted item successfully!',
          text: 'Item name: '+productNameValue,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(()=>{
          handleClose();
          refresh();
        });     
      }
    })
  }

  const resetOpenModal = () => {
    setOpenModal(false);
  };


  return (
    <Box component="form" sx={{
      '& .MuiTextField-root': { m: 1 },
    }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}>

      <h2 style={{ marginBottom: "20px" }}>Edit Product Information</h2>
      <hr />
      <div className="d-flex flex-column flex-md-row flex-wrap">
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
          id="productSupplier"
          value={productSupplierValue}
          onChange={productSupplierChangeHandler}
          onBlur={productSupplierBlurHandler}
          hasError={productSupplierHasError}
        />
        <InputText
          label="productName"
          type="text"
          required={true}
          id="productID"
          value={productNameValue}
          onChange={productNameChangeHandler}
          onBlur={productNameBlurHandler}
          hasError={productNameHasError}
          defaultValue="hello"
        />
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
      </div>
      <p style={{ color: "red", fontSize: "22px" }}>{errorMessage}</p>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div style={{ width: "50%" }}>
          <Button variant="contained" color="error" onClick={() => handleDelete()}>Delete from stock</Button>
        </div>

        <div style={{ width: "50%", justifyContent: "right", display: "flex" }}>
          <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => handleClose()}>Cancel</Button>
          <Button type="submit" variant="contained" color="success" disabled={!formIsValid} >Save Changes</Button>
        </div>
      </div>
    

    </Box>
  )
}
