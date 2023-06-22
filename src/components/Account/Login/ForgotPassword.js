/* import { useState, useRef, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; */

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { notEmpty } from "../../../Regex/Regex";
import useInput from '../../../hooks/use-input';
import Logo from '../../../assets/img/Logo.webp'
import './Login.css'
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";



const ForgotPassword = (props) => {
  const [emailSubmitted, setEmailSubmitted] = React.useState(false);
  const [codeSubmitted, setCodeSubmitted] = React.useState(false);
  const isNotEmpty = (value) => notEmpty.test(value); // isnot empty check using regex
  const navigate = useNavigate();

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailValue })
    };

    fetch("/api/auth/reset", options);

    Swal.fire({
      title: 'Check your inbox',
      text: 'If an account is associated with this email, you should have received an email to reset your password',
      icon: 'success',
      confirmButtonText: 'Ok'
    });

    setEmailSubmitted(true);
  };

  const handleCodeSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: codeValue, email: emailValue })
    };

    fetch("/api/auth/reset-code", options).then(res => {
      if (res.status === 200) {
        setCodeSubmitted(true);
      } else {
        Swal.fire({
          title: 'Oops!',
          text: 'Invalid code submitted. Please try again.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (passwordValue !== confirmPasswordValue) {
      Swal.fire({
        title: 'Error',
        text: 'Passwords do not match. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const options = {
      method: "POST",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailValue, password: passwordValue, code: codeValue })
    };

    fetch("/api/auth/reset-pass", options).then(res => {
      res.json().then(data => {
        console.log(data);
        if (data.message) {
          Swal.fire({
            title: 'Oops!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        } else if (res.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: 'Your password has been reset. You can now login with your new password.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => { navigate("/login"); });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    });
  };

  const validEmail = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const isEmail = (value) => validEmail.test(value);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(isEmail);

  const {
    value: codeValue,
    isValid: codeIsValid,
    hasError: codeHasError,
    valueChangeHandler: codeChangeHandler,
    inputBlurHandler: codeBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
  } = useInput(isNotEmpty);



  return (
    <div className="login">
      <div className="login-form">
        <img src={Logo} style={{ width: "160px", display: "flex", margin: "auto" }} alt="Logo" />
        <h2 className="title">Host Management System</h2>
        <h2 className="title">Forgot Password</h2>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!emailSubmitted &&
              <Box
                component="form"
                onSubmit={handleEmailSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  size="small"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  value={emailValue}
                  helperText={emailHasError && "Email is invalid"}
                  error={emailHasError}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>

                <div style={{ textAlign: "center" }}>
                  <Link to={"/login"}>Back to login</Link>
                </div>
              </Box>
            }
            {(emailSubmitted && !codeSubmitted) &&
              <Box
                component="form"
                onSubmit={handleCodeSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  size="small"
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label="Code provided in email"
                  name="code "
                  onChange={codeChangeHandler}
                  onBlur={codeBlurHandler}
                  value={codeValue}
                  helperText={codeHasError && "Wrong code entered!"}
                  error={codeHasError}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>


                <div style={{ textAlign: "center" }}>
                  <Link to={"/login"}>Back to login</Link>
                </div>
              </Box>
            }
            {(emailSubmitted && codeSubmitted) &&
              <Box
                component="form"
                onSubmit={handlePasswordSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  size="small"
                  margin="normal"
                  type="password"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  autoComplete="password"
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  value={passwordValue}
                  helperText={passwordHasError && "Password is invalid"}
                  error={passwordHasError}
                />
                <TextField
                  size="small"
                  type="password"
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  autoComplete="password"
                  onChange={confirmPasswordChangeHandler}
                  onBlur={confirmPasswordBlurHandler}
                  value={confirmPasswordValue}
                  helperText={confirmPasswordHasError && "Please confirm your password"}
                  error={confirmPasswordHasError}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>


                <div style={{ textAlign: "center" }}>
                  <Link to={"/login"}>Back to login</Link>
                </div>
              </Box>

            }
          </Box>
        </Container>

      </div>
    </div>

  );
};

export default ForgotPassword;
