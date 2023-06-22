import React,{useState,useEffect} from 'react';
import InputText from '../UI/Input/InputText';
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import useInput from '../../hooks/use-input';
import { notEmpty } from "../../Regex/Regex";

export default function ProductTypes() {

  const isNotEmpty = (value) => notEmpty.test(value);
  const [productTypes,setProductTypes]= useState([]);

  useEffect(() =>{
    async function productTypesFetcher() {
      try{
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({select: "productType",
                                from:"productTypesVariables"}),
        };
      
      const res = await fetch(`/api/select`, request);
      const data = await res.json()
    
      if(data.sqlMessage)
      {
        console.log(data.sqlMessage);
      }
      else
      {
        setProductTypes(data);
      }
    }
      catch(error)
      {
        console.error(error)
      }
    }

    productTypesFetcher();
  },[])

  const {
    value: productTypeSettingsValue,
    valueChangeHandler: productTypeSettingsChangeHandler,
    inputBlurHandler: productTypeSettingsBlurHandler,
    reset: resetProductTypeSettings,
  } = useInput(isNotEmpty);


  const productTypeSetterHandler = async (event) => {
    event.preventDefault();
    if(productTypeSettingsValue.trim()!=='')
    {
      try{
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: "productTypesVariables(productType)",
                                values:`("${productTypeSettingsValue}")` }),
        };
      
      const res = await fetch(`/api/insert`, request);
      const data = await res.json()
    
      if(data.sqlMessage)
      {
        console.log(data.sqlMessage);
      }
      else
      {
        setProductTypes([...productTypes, { productType: productTypeSettingsValue }]);
        resetProductTypeSettings("");
      }
    }
      catch(error)
      {
        console.error(error)
      }
  }
  };

  return (
    <div>
        <br></br>
        <br></br>
        <form onSubmit={productTypeSetterHandler}>
        <h4>Set your Product Types here</h4>
        <InputText
        label="Product Type"
        type="text"
        required={false}
        id="productTypeSettings"
        value={productTypeSettingsValue}
        onChange={productTypeSettingsChangeHandler}
        onBlur={productTypeSettingsBlurHandler}
        />
        <br/>
       <Button type="submit" variant="contained" color="success" disabled={false}>Add Product Type</Button>
        </form>
        <br></br>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Your Current Product Types</Typography>
        </AccordionSummary>
        <hr/>
        <AccordionDetails>
        {productTypes.map((data,key)=>{
          return <ul key={key}>{data.productType}</ul>
        })}
        </AccordionDetails>
      </Accordion>
        
      </div>
  )
}
