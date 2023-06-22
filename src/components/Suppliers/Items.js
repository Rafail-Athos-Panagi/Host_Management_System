import React from 'react'
import InputText from '../UI/Input/InputText';
import Box from "@mui/material/Box";
import './Items.css'
import useQualityInput from '../../hooks/quantity-input';

export default function Items(props) {

    const isNumeric = (value) => {
        if (!isNaN(value) && value >= 0)
            return true;
        else
            return false;
    }

    const {
        value: quantityValue,
        hasError: quantityHasError,
        valueChangeHandler: quantityChangeHandler,
    } = useQualityInput(isNumeric, 0, props.productName, props.onQuantityChangeHandler);

    return (
        <Box sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
          noValidate
          autoComplete="off">
            <div style={{ display: "flex" }}>
                <InputText
                    label="Product Name"
                    type="text"
                    id="supplierProductName"
                    value={props.productName}
                    shouldBeReadOnly={true}
                />
                <InputText
                    label="Price"
                    type="text"
                    id="supplierItemPrice"
                    value={props.price}
                    shouldBeReadOnly={true}
                />
                <InputText
                    label="Quantity"
                    type="text"
                    id="orderQuantity"
                    value={quantityValue}
                    onChange={quantityChangeHandler}
                    hasError={quantityHasError}
                />
            </div>
        </Box>

    )
}
