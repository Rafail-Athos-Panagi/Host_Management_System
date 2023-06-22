import React,{useState,useEffect} from 'react';
import InputText from '../UI/Input/InputText';
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import useInput from '../../hooks/use-input';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    notEmpty,
    validEmail
  } from "../../Regex/Regex";
import Swal from 'sweetalert2';

export default function CreateAccount() {
    const isNotEmpty = (value) => notEmpty.test(value);
    const isValidEmail = (value) => validEmail.test(value);
    const [errorMessage, setErrorMessage] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [showPassword, setShowPassword] = useState("password");

    const {
        value: usernameValue,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        isValid: usernameIsValid,
        hasError: userNameHasError,
        reset: usernameReset,
      } = useInput(isNotEmpty);

    const {
        value: emailValue,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        isValid:emailIsValid,
        hasError: emailHasError,
        reset: emailReset,
    } = useInput(isValidEmail);

    const {
        value: passwordValue,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        isValid:passwordIsValid,
        hasError: passwordHasError,
        reset: passwordReset,
    } = useInput(isNotEmpty);

    const {
        value: confPasswordValue,
        valueChangeHandler: confPasswordChangeHandler,
        inputBlurHandler: confPasswordBlurHandler,
        isValid:confirmPasswordIsValid,
        hasError: confirmPasswordHasError,
        reset: confPasswordReset,
    } = useInput(isNotEmpty);

    let passwordsAreValid=false;

    if(confPasswordValue===passwordValue)
        passwordsAreValid=true;
        
    let formIsValid = false;

  if (usernameIsValid && emailIsValid && passwordsAreValid && passwordIsValid && confirmPasswordIsValid)
    formIsValid = true;

    async function createAccountHandler(event){
        event.preventDefault();

        if(!passwordsAreValid)
            return;

        if (!formIsValid) {
            return;
          }
          setErrorMessage("");
          try{
            const request = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ table: "users(username,password,email)",
                                    values:`("${usernameValue}",SHA2("${passwordValue}",0),"${emailValue}")` }),
            };
          
          const res = await fetch(`/api/insert`, request);
          const data = await res.json()
        
          if(data.sqlMessage){
            if (data.sqlMessage.includes("CHK_name"))
              setErrorMessage("Username must be more than 5 characters!");
              if (data.sqlMessage.includes("CHK_username"))
              setErrorMessage("Username is already in use!");
            else if (data.sqlMessage.includes("CHK_email"))
              setErrorMessage("You have entered an invalid email!");
            else if (data.sqlMessage.includes("users.email"))
              setErrorMessage("This email is already in use!");
            else if (data.sqlMessage.includes("users.PRIMARY"))
              setErrorMessage("That user already exists!");

            Swal.fire({
              title: 'Error!',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          } else {
            Swal.fire({
              title: 'Success!',
              text: 'Account created successfully!',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            setAccounts([...accounts, {username:usernameValue,password:passwordValue,email:emailValue }]);
            usernameReset("");
            emailReset("");
            passwordReset("");
            confPasswordReset("");
          }
        }
          catch(error)
          {
            console.error(error)
          }
    }
    
    function refreshAccounts(){
        try{
            const request = {
              method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({select:"username",
                                    from:"users"}),
            };
          
            fetch(`/api/select`, request).then(function (res) {
                res.json().then(function (data) {
                data.sqlMessage ? console.log(data.sqlMessage) : setAccounts(data);
                })
            });
        } catch(error){
            console.log(error);
        }
    }

    function handleCheckbox(){
      if(showPassword==="password")
        setShowPassword("text");
      else
        setShowPassword("password");
    }

    useEffect(()=>{
        refreshAccounts();
    },[]);

  return (

    <div>
        <br></br>
        <br></br>
        <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
        noValidate
        autoComplete="off"
        onSubmit={createAccountHandler}
        >
        <h4>Create a new account</h4>
        <InputText
            hasError={userNameHasError}
            label="Username"
            required
            id="username"
            value={usernameValue}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
        />
        <InputText
            hasError={emailHasError}
            label="Email"
            required
            id="email"
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
        />
        <InputText
            hasError={passwordHasError}
            label="Password"
            required
            id="password"
            type={showPassword}
            value={passwordValue}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
        />
        <InputText
            hasError={confirmPasswordHasError}
            label="Retype Password"
            required
            id="confPassword"
            type={showPassword}
            value={confPasswordValue}
            onChange={confPasswordChangeHandler}
            onBlur={confPasswordBlurHandler}
        />
        
        <br/>
        <FormControlLabel control={<Checkbox onClick={handleCheckbox} />} label="Show Password"/>
        <br/>
       <Button type="submit" variant="contained" color="success" disabled={!formIsValid}>Add Account</Button>
        </Box>
        <p style={{color:"red", fontSize:"18px"}}>{errorMessage}</p>
        <br></br>
        <Accordion style={{width:"300px"}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Registered Accounts</Typography>
          </AccordionSummary>
          <hr/>
          <AccordionDetails>
            {accounts.map((data,key)=>{
              return <ul key={key}>{data.username}</ul>
            })}
        </AccordionDetails>
      </Accordion>
        
      </div>
  )
}
