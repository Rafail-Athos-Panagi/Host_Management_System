import React, { useState } from 'react'
import "./Account.css"
import InputText from '../UI/Input/InputText';
import Button from "@mui/material/Button";
import useInput from '../../hooks/use-input';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { notEmpty, validEmail } from "../../Regex/Regex";
import Username from '../../hooks/user-context';
import Swal from 'sweetalert2';
import Manual from '../Settings/Manual';

export default function Account() {
    const isNotEmpty = (value) => notEmpty.test(value);
    const isValidEmail = (value) => validEmail.test(value);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState("password");
    const {username} = React.useContext(Username);

    const {
        value: oldPasswordValue,
        valueChangeHandler: oldPasswordChangeHandler,
        inputBlurHandler: oldPasswordBlurHandler,
        isValid: oldPasswordIsValid,
        hasError: oldPasswordHasError,
        reset: oldPasswordReset,
    } = useInput(isNotEmpty);

    const {
        value: newPasswordValue,
        valueChangeHandler: newPasswordChangeHandler,
        inputBlurHandler: newPasswordBlurHandler,
        isValid: newPasswordIsValid,
        hasError: newPasswordHasError,
        reset: newPasswordReset,
    } = useInput(isNotEmpty);

    const {
        value: confirmPasswordValue,
        valueChangeHandler: confirmPasswordChangeHandler,
        inputBlurHandler: confirmPasswordBlurHandler,
        isValid:confirmPasswordIsValid,
        hasError: confirmPasswordHasError,
        reset: confirmPasswordReset,
    } = useInput(isNotEmpty);

    let passwordsAreValid=false;

    if(confirmPasswordValue===newPasswordValue)
        passwordsAreValid=true;
        
    let formIsValid = false;

    if (oldPasswordIsValid && newPasswordIsValid && confirmPasswordIsValid)
        formIsValid = true;

    function handleCheckbox(){
        if(showPassword==="password")
          setShowPassword("text");
        else
          setShowPassword("password");
      }

    const changePasswordHandler = (event) => {
        event.preventDefault();
        setErrorMessage("");
        if (!(oldPasswordIsValid && newPasswordIsValid && confirmPasswordIsValid))
            return;
        
        if(confirmPasswordValue!==newPasswordValue){
            setErrorMessage("Passwords do not match");
            return;
        }

        if(oldPasswordValue===newPasswordValue){
            setErrorMessage("New password cannot be the same as old password");
            return;
        }
        
        const options = {
            method: "POST",
            credentials: 'include',
            mode: 'cors',
            redirect: 'follow',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                oldpassword: oldPasswordValue,
                password: newPasswordValue,
            })
        }

        fetch(`/api/updateaccount`, options).then(function(res){
            res.json().then(function(data){
                if(data.sqlMessage){
                    Swal.fire({
                        title: 'Error!',
                        text: data.sqlMessage,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Password changed successfully',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });
                }
            });
        });
    }

    return (
        <div className="account">
            <div className="box">
                <p className='title'>Account settings</p>

                <div className="interior">
                
                    <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                        noValidate
                        autoComplete="off"
                        onSubmit={changePasswordHandler}
                    >
                        
                        <div className="d-flex flex-row"><h4 className="pe-2">Change your password</h4> <Manual title="Backup Manual" pageNumber={57}/></div>    
                        <InputText
                            hasError={oldPasswordHasError}
                            label="Enter old password"
                            required
                            id="oldpassword"
                            type={showPassword}
                            value={oldPasswordValue}
                            onChange={oldPasswordChangeHandler}
                            onBlur={oldPasswordBlurHandler}
                        />
                        <InputText
                            hasError={newPasswordHasError}
                            label="Enter new password"
                            required
                            id="newpassword"
                            type={showPassword}
                            value={newPasswordValue}
                            onChange={newPasswordChangeHandler}
                            onBlur={newPasswordBlurHandler}
                        />
                        <InputText
                            hasError={confirmPasswordHasError}
                            label="Retype Password"
                            required
                            id="confirmPassword"
                            type={showPassword}
                            value={confirmPasswordValue}
                            onChange={confirmPasswordChangeHandler}
                            onBlur={confirmPasswordBlurHandler}
                        />
                        <p style={{ color: "red", fontSize: "18px" }}>{errorMessage}</p>
                        <br />
                        <FormControlLabel control={<Checkbox onClick={handleCheckbox} />} label="Show Password" />
                        <br />
                        <Button type="submit" variant="contained" color="success" disabled={!formIsValid}>Save Changes</Button>
                    </Box>
                    

                </div>
            </div>
        </div>
    )
}
