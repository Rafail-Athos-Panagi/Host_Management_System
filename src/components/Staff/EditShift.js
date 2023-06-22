import React from 'react'
import InputText from "../UI/Input/InputText";
import useInput from "../../hooks/use-input";
import Swal from 'sweetalert2';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function EditShift({ handleClose, editValues, refresh }) {
    const [errorMessage, setErrorMessage] = React.useState("");
    console.log(editValues[0]);
    const nullValue = (value) => true;

    const fetchData = async () => {
        const request = {
            method: "post",
            credentials: "include",
            mode: "cors", redirect: "follow",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                select: "*",
                from: "shift_scheduling",
                where: `staffID=${editValues[0]}`
            }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
            console.log(data.sqlMessage);
        }
        else {
            resetMonday(data[0].monday);
            resetTuesday(data[0].tuesday);
            resetWednesday(data[0].wednesday);
            resetThursday(data[0].thursday);
            resetFriday(data[0].friday);
            resetSaturday(data[0].saturday);
            resetSunday(data[0].sunday);
        }

    }
    const {
        value: mondayValue,
        isValid: mondayIsValid,
        hasError: mondayHasError,
        valueChangeHandler: mondayChangeHandler,
        inputBlurHandler: mondayBlurHandler,
        reset: resetMonday,
    } = useInput(nullValue);

    const {
        value: tuesdayValue,
        isValid: tuesdayIsValid,
        hasError: tuesdayHasError,
        valueChangeHandler: tuesdayChangeHandler,
        inputBlurHandler: tuesdayBlurHandler,
        reset: resetTuesday,
    } = useInput(nullValue);

    const {
        value: wednesdayValue,
        isValid: wednesdayIsValid,
        hasError: wednesdayHasError,
        valueChangeHandler: wednesdayChangeHandler,
        inputBlurHandler: wednesdayBlurHandler,
        reset: resetWednesday,
    } = useInput(nullValue);

    const {
        value: thursdayValue,
        isValid: thursdayIsValid,
        hasError: thursdayHasError,
        valueChangeHandler: thursdayChangeHandler,
        inputBlurHandler: thursdayBlurHandler,
        reset: resetThursday,
    } = useInput(nullValue);

    const {
        value: fridayValue,
        isValid: fridayIsValid,
        hasError: fridayHasError,
        valueChangeHandler: fridayChangeHandler,
        inputBlurHandler: fridayBlurHandler,
        reset: resetFriday,
    } = useInput(nullValue);

    const {
        value: saturdayValue,
        isValid: saturdayIsValid,
        hasError: saturdayHasError,
        valueChangeHandler: saturdayChangeHandler,
        inputBlurHandler: saturdayBlurHandler,
        reset: resetSaturday,
    } = useInput(nullValue);

    const {
        value: sundayValue,
        isValid: sundayIsValid,
        hasError: sundayHasError,
        valueChangeHandler: sundayChangeHandler,
        inputBlurHandler: sundayBlurHandler,
        reset: resetSunday,
    } = useInput(nullValue);

    const updateDatabase = async () => {
        try {
            const request = {
                method: "post",
                credentials: "include",
                mode: "cors", redirect: "follow",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    table: "shift_scheduling",
                    columns: `monday="${mondayValue}", tuesday="${tuesdayValue}", wednesday="${wednesdayValue}", thursday="${thursdayValue}", friday="${fridayValue}", saturday="${saturdayValue}", sunday="${sundayValue}"`,
                    where: `staffID=${editValues[0]}`
                }),
            };

            const res = await fetch(`/api/update`, request);
            const data = await res.json()

            if (data.sqlMessage) {
                console.log(data.sqlMessage);
            }
        }
        catch (error) {
            console.error(error)
        }
        
    };



    const submitHandler = async (event) => {
        event.preventDefault();
        const choice = await Swal.fire({
            title: 'Save changes?',
            showCancelButton: true,
            confirmButtonText: `Save`,
        }).then((result) => {
            if (result.isConfirmed) 
                return true;
            return false;          
        });

        if (!choice) return;

        updateDatabase();
        refresh();
        handleClose();
        Swal.fire({timer: 500,           
            title: 'Saved!',
            icon: 'success',
            showConfirmButton: false,
        });

    }

    React.useEffect(() => {
        fetchData();
    }, []);


    return (
        <Box component="form" sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
            noValidate
            autoComplete="off"
            onSubmit={submitHandler}>

            <h2 style={{ marginBottom: "20px" }}>Edit shift schedule</h2>
            <hr />
            <div style={{ display: "flex", flexDirection: "column" }}>
                <InputText
                    label="Monday"
                    type="text"
                    required={false}
                    id="monday"
                    value={mondayValue}
                    onChange={mondayChangeHandler}
                    onBlur={mondayBlurHandler}
                    multiline
                    minRows="2"
                />
                <InputText
                    label="Tuesday"
                    type="text"
                    required={false}
                    id="tuesday"
                    value={tuesdayValue}
                    onChange={tuesdayChangeHandler}
                    onBlur={tuesdayBlurHandler}
                    multiline
                    minRows="2"
                />
                <InputText
                    label="Wednesday"
                    type="text"
                    required={false}
                    id="wednesday"
                    value={wednesdayValue}
                    onChange={wednesdayChangeHandler}
                    onBlur={wednesdayBlurHandler}
                    multiline
                    minRows="2"
                />
                <InputText
                    label="Thursday"
                    type="text"
                    required={false}
                    id="thursday"
                    value={thursdayValue}
                    onChange={thursdayChangeHandler}
                    onBlur={thursdayBlurHandler}
                    multiline
                    minRows="2"
                />
                <InputText
                    label="Friday"
                    type="text"
                    required={false}
                    id="friday"
                    value={fridayValue}
                    onChange={fridayChangeHandler}
                    onBlur={fridayBlurHandler}
                    multiline
                    minRows="2"
                />
                <InputText
                    label="Saturday"
                    type="text"
                    required={false}
                    id="saturday"
                    value={saturdayValue}
                    onChange={saturdayChangeHandler}
                    onBlur={saturdayBlurHandler}
                    multiline
                    minRows="2"
                />
                <InputText
                    label="Sunday"
                    type="text"
                    required={false}
                    id="sunday"
                    value={sundayValue}
                    onChange={sundayChangeHandler}
                    onBlur={sundayBlurHandler}
                    multiline
                    minRows="2"
                />

                <p style={{ color: "red", fontSize: "22px" }}>{errorMessage}</p>
                <div style={{ display: "flex", marginTop: "10px" }}>

                    <div style={{ width: "50%", justifyContent: "right", display: "flex" }}>
                        <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => handleClose()}>Cancel</Button>
                        <Button type="submit" variant="contained" color="success" >Save Changes</Button>
                    </div>
                </div>
            </div>


        </Box>
    )
}
