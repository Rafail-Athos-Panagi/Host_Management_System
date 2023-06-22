import React from 'react'
import InputText from "../UI/Input/InputText";
import useInput from "../../hooks/use-input";
import Swal from 'sweetalert2';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputSelect from '../UI/Input/InputSelect';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function AddShift({ handleClose, refresh, initialweek }) {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [staffList, setStaffList] = React.useState([]);
    const [staffID, setStaffID] = React.useState(null);
    const [staffName, setStaffName] = React.useState("");
    const [staffSurname, setStaffSurname] = React.useState("");
    const [week, setWeek] = React.useState(initialweek);
    const nullValue = (value) => true;

    const fetchStaff = async () => {
        const request = {
            method: "post",
            credentials: "include",
            mode: "cors", redirect: "follow",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                select: "staffID,staffName,staffSurname",
                from: "staff",
                where: "deleted=0"
            }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
            console.log(data.sqlMessage);
        } else if (data.length === 0) {
            setErrorMessage("No staff found"); 
            setStaffList(null);
        
        }else {
            setStaffList(data);
        }
    }

    const fetchData = async () => {
        if (staffID == null || staffID=="") return;
        const request = {
            method: "post",
            credentials: "include",
            mode: "cors", redirect: "follow",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                select: "*",
                from: "shift_scheduling",
                where: `staffID=${staffID} AND week=${week}`
            }),
        };

        const res = await fetch(`/api/select`, request);
        const data = await res.json()

        if (data.sqlMessage) {
            console.log(data.sqlMessage);
        }

        if (data.length === 0) {
            resetMonday("");
            resetTuesday("");
            resetWednesday("");
            resetThursday("");
            resetFriday("");
            resetSaturday("");
            resetSunday("");
        } else {
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
                    values: `(${staffID},"${staffName}","${staffSurname}","${mondayValue}", "${tuesdayValue}", "${wednesdayValue}", "${thursdayValue}", "${fridayValue}", "${saturdayValue}", "${sundayValue}", "${week}") ON DUPLICATE KEY UPDATE monday="${mondayValue}", tuesday="${tuesdayValue}", wednesday="${wednesdayValue}", thursday="${thursdayValue}", friday="${fridayValue}", saturday="${saturdayValue}", sunday="${sundayValue}"`,
                }),
            };

            const res = await fetch(`/api/insert`, request);
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
        Swal.fire({
            timer: 500,
            title: 'Saved!',
            icon: 'success',
            showConfirmButton: false,
        });

    }

    React.useEffect(() => {
        fetchStaff();
    }, []);

    React.useEffect(() => {
        if (staffID != null)
            fetchData();
        if(staffList!= null){
            setStaffName(staffList.find((staff) => staff.staffID === staffID)?.staffName);
            setStaffSurname(staffList.find((staff) => staff.staffID === staffID)?.staffSurname);
        }
    }, [staffID]);

    React.useEffect(() => {
        if (staffID != null)
            fetchData();
    }, [week]);


    return (
        <Box component="form" sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
            noValidate
            autoComplete="off"
            onSubmit={submitHandler}>

            <h2 style={{ marginBottom: "20px" }}>Add Shift Schedule</h2>
            <hr />
            {(staffID == null) && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-staff">{staffList == null ? "No staff found!" : "Select Staff"  }</InputLabel>
                        <Select
                            labelID="select-staff"
                            label={staffList == null ? "No staff found!" : "Select Staff"  }
                            type="text"
                            required={true}
                            id="staffID"
                            value={""}
                            onChange={(event) => setStaffID(event.target.value)}
                            onBlur={(event) => setStaffID(event.target.value)}
                            disabled={staffList == null}
                        >
                            {(staffList != null) && (staffList.map((staff) => (
                                <MenuItem key={staff.staffID} value={staff.staffID}>{staff.staffName + " " + staff.staffSurname}</MenuItem>
                            )))}
                            
                        </Select>
                    </FormControl>
                    {(staffList == null) && <span style={{fontSize:"22px", marginTop:"10px", color:"red"}}>You have no staff members that are active!</span>}
                </div>
            )}
            {(staffID != null) && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: "18px" }}>Currently selected: { staffName + " " + staffSurname}</p>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap:"wrap" }}>
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
                            reset={resetMonday}
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
                            reset={resetTuesday}
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
                            reset={resetWednesday}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap:"wrap" }}>
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
                            reset={resetThursday}
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
                            reset={resetFriday}
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
                            reset={resetSaturday}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap:"wrap" }}>
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
                            reset={resetSunday}
                        />
                        <div style={{width:"10%", minWidth:"100px"}}>
                            <FormControl fullWidth>
                                <InputLabel id="select-week">Select Week</InputLabel>
                                <Select
                                    labelID="select-week"
                                    label="Select Week"
                                    type="text"
                                    required={true}
                                    id="staffID"
                                    value={week}
                                    onChange={(event) => setWeek(event.target.value)}
                                    onBlur={(event) => setWeek(event.target.value)}
                                >
                                    {(() => {
                                        const options = [];
                                        for (let i = 1; i < 53; i++) {
                                            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);

                                        } return options;
                                    })()}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <p style={{ color: "red", fontSize: "22px" }}>{errorMessage}</p>

                    <div style={{ display: "flex", justifyContent: "right" }}>
                        <Button sx={{ marginRight: 5 }} variant="outlined" color="error" onClick={() => handleClose()}>Cancel</Button>
                        <Button type="submit" variant="contained" color="success" >Save Changes</Button>
                    </div>
                </div>)}


        </Box>
    )
}
