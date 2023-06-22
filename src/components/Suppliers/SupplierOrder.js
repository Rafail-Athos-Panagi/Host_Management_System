import React, { useEffect, useState } from 'react';
import InputText from "../UI/Input/InputText";
import InputSelect from '../UI/Input/InputSelect';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Items from "./Items";
import useInput from '../../hooks/use-input';
import {
    notEmpty,
} from "../../Regex/Regex";
import Loading from '../UI/Loading/Loading';
import Username from '../../hooks/user-context';
import logging from '../../hooks/logging-hook';
import Swal from 'sweetalert2';

export default function SupplierOrder(props) {
    const isNotEmpty = (value) => notEmpty.test(value);

    
    const [isLoading, setIsLoading] = useState(true); //is Loading state for hwen we are waiting for data to be set
    const [supplierData, setSupplierData] = useState([]); // all of the supplier Data
    const [supplierList, setSupplierList] = useState([]); // List of the names of the suppliers
    const [supplierProducts, setSupplierProducts] = useState([]); // The products in items component
    const [order, setOrder] = useState([]); // The array containing the final order that will be used to get sent
    const [showInformation, setShowInformation] = useState(false); // when dropdown gets value it will show products
    const [idDelivery, setIdDelivery] = useState(''); // id of supplier so it can show the correct products it wont work with variable
    const [comments, setComments] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); //error message
    const { username } = React.useContext(Username);
    
    // This useEffect gets the necessary data we need for the ordering of suppliers and we place it in the supplierData
    useEffect(() => {
        console.log("useEffect")
        setIsLoading(true);
        const request = {
            method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ select: " supplierID,supplierName,supplierEmail", from: "suppliers", where:"deleted=false" }),
        };
        fetch(`/api/select`, request).then(function (res) {
            res.json().then(function (data) {
                data.sqlMessage ? console.log(data.sqlMessage) : setSupplierData(data);setIsLoading(false);
            });
        });
      
    }, [props.supplierdata]);




    // The query will run only when idDelivery actually has a value which it doesnt at the start. It gets a value on line 122
    // this useEffect gets used so we can get the supplier products based on the selection on the dropdown by the user
    useEffect(() => {
        if (idDelivery) {

            const request = {
                method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ select: "*", from: "supplier_products", where: `supplierID = ${idDelivery}` }),
            };
            fetch(`/api/select`, request).then(function (res) {
                res.json().then(function (data) {
                    data.sqlMessage ? console.log(data.sqlMessage) : setSupplierProducts(data);setShowInformation(true);
                });
            });
        }
    }, [idDelivery]);


    //This useEffect is to set the dropdown list options correctly cause we are using InputSelect and it needs label and value

    useEffect(() => {
        setSupplierList(supplierData.map((data) => {
            return {
                label: data.supplierName,
                value: data.supplierName,
            };
        }));
    }, [supplierData])


    //This useEffect initialises our order with the names and prices and 0 quantity 
    useEffect(() => {
        setOrder(supplierProducts.map((data) => {
            return {
                productName: data.productName,
                price: data.price,
                quantity: 0
            }
        }))
    }, [supplierProducts])

    // The custom hook for the dropdown values
    const {
        value: supplierValue,
        isValid: supplierIsValid,
        hasError: supplierHasError,
        valueChangeHandler: supplierValueChangeHandler,
        inputBlurHandler: supplierBlurHandler,
        reset: resetSupplier,
    } = useInput(isNotEmpty);


    // This together with the <Items> component helps us update our order everytime the user makes a change in teh quantity field
    const orderQuantitySetting = (productNameToDatabase, quantityData) => {
        const tempOrder = order.map((item) => {
            if (item.productName === productNameToDatabase) {
                return {
                    ...item,
                    quantity: +quantityData
                }
            }
            return item;
        });
        setOrder(tempOrder);
    };

    // This useEffect only works when the user actually selected a value.And triggers when he does
    // Once he selects a value we present him with the details of the supplier and the products he provides
    // if the id of the supplier is > 0 then it means we actually have someone and we set the Id of the supplier here
    // so that the correct products load
    let supplierID;
    useEffect(() => {
        if (notEmpty.test(supplierValue)) {
            setSupplierProducts([]);
            const idSupplier = supplierData.filter((data) =>
                data.supplierName === supplierValue
            )
            if (idSupplier.length > 0) {
                [{ supplierID: supplierID }] = idSupplier;

                setIdDelivery(supplierID);
            }
            else
                console.log("No id");

        }
    }, [supplierValue]);


    // Async await might not be needed .So this is the final form.Basically when the user clicks order then this function will get triggered
    // TODO add email
    // For now we have 2 queries . One creates the order we have to add the information for now we only provide the supplierID correctly
    // The 2nd query gets the order we just created and returns us the order id so we can use it in the order_details table query
    const orderHandler = async event => {
        event.preventDefault();
        setErrorMessage("");

        const choice = await Swal.fire({
            title: 'Place order?',
            text: "Are you sure you want to place this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then(result => {
            if (result.isConfirmed)
                return true;
            return false;
        });

        if (!choice) return;

        let totalPrice = 0;
        let totalQuantity = 0;
        let insertID = 0;
        let values = "";
        
        try {

            order.forEach(value => {
                if(value.quantity>0)
                {
                totalPrice = totalPrice + value.price * value.quantity
                totalQuantity = totalQuantity + value.quantity
                }
            }
                
            );
            if (totalQuantity === 0){
                setErrorMessage("You have not specified any quantity!");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'You have not specified any quantity!',

                })
                return;
            }

            const request = {
                method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ table: "orders(supplierID,orderStatus,orderTotalPrice,orderDate,arrivalDate,comments)", values: `(${idDelivery},"Pending",${totalPrice},CURRENT_TIMESTAMP,NULL,"${comments}")` }),
            };
            fetch(`/api/insert`, request).then(function (res) {
                res.json().then(function (data) {
                    if (typeof data === "undefined"){
                        setErrorMessage("Order creation failed!");
                        return;
                    }
                    logging(`${username}`, "Insert", `${data.insertID}` ,"orders", `New Order for supplier ${idDelivery}`);

                    order.forEach(value => {
                        if (value.quantity !== 0 && value.quantity !== "" && value.quantity !== null && value.quantity !== undefined && value.quantity >0) {
                            values = values.concat(`(${data.insertID},${value.quantity},${value.price},"${value.productName}"),`)
                        }
                    });

                    values = values.substring(0, values.length - 1);
                    const request2 = {
                        method: "post",
                        credentials: "include", 
                        mode: "cors", redirect: "follow",

                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            table: "order_details",
                            values: values
                        }),
                    };

                    fetch(`/api/insert`, request2).then(function (res) {
                        res.json().then(function (data) {
                            if (data.sqlMessage)
                                console.log(data.sqlMessage);
                            
                        })
                    })
                });
            });
        } catch (error) {
            console.error(error)
        }
        resetStuff(false);
        Swal.fire({
            title: 'Order placed!',
            text: "Order has been placed successfully!",
            icon: 'success',
            confirmButtonColor: '#3085d6',
        });
    };

    function resetStuff(value) {
        setComments("");
        resetSupplier("");
        setShowInformation(value);
    }


    return (
        <div><Box component="form" sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
            noValidate
            autoComplete="off"
            onSubmit={orderHandler}>
            <h2 style={{ marginBottom: "20px" }}>Order from Supplier</h2>
            <div style={{ display: "flex" }}>
                {isLoading && <Loading />}
                {!isLoading && <InputSelect
                    enableResizing={false}
                    required={true}
                    label="Product Type"
                    id="productType"
                    selection={supplierList}
                    value={supplierValue}
                    onChange={supplierValueChangeHandler}
                    onBlur={supplierBlurHandler}
                    hasError={supplierHasError}
                />}
            </div>
            {showInformation && <div>
                <InputText
                    label="Supplier Email"
                    type="text"
                    id="supplierEmailOrder"
                    value={supplierData.find((data) => data.supplierName === supplierValue)?.supplierEmail}
                    shouldBeReadOnly={true}
                />
                {(supplierProducts.map((data, keyValue) => {
                    return (
                        <Items
                            key={keyValue}
                            productName={data.productName}
                            price={data.price}
                            onQuantityChangeHandler={orderQuantitySetting}
                        />)
                }))}
                <InputText
                    label="Comments"
                    type="text"
                    id="orderComments"
                    value={comments}
                    onChange={(e)=>setComments(e.target.value)}
                    onBlur={(e)=>setComments(e.target.value)}
                    multiline
                    minRows="3"
                />
                <br/>
                <p style={{color:"red", fontSize:"18px"}}>{errorMessage}</p>
                <Button type="submit" variant="contained"
                    color="success">Order</Button>
            </div>
            }
        </Box></div>
    )
}