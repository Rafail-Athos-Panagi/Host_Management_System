import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Username from "../../../hooks/user-context";

const Login = ({ handleLogin }) => {
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword] = useState("password");
  const { setUsername } = useContext(Username);
  const validEmail = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const navigate = useNavigate();



  function handleSubmit(event) {
    event.preventDefault(); //prevents the page to make a reload
    setWrongCredentials(false);

    if (validEmail.test(email)) // if email has right syntax
    {
      try {
        const request = {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          redirect: 'follow',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password })
        };
  
        fetch(`/api/auth`, request).then(res => {
          res.json().then(data => {
            if (data.username) {
              setUsername(data.username);
              handleLogin();
              navigate("/home");
            } else if (data.error) {
              setWrongCredentials(true);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
      
    } else {
      setWrongCredentials(true);
    }
  };

  function handleCheckbox(){
    if(showPassword==="password")
      setShowPassword("text");
    else
      setShowPassword("password");
  }

  return (
    <div className="login">
      <div className="login-form">
        <img src={require("../../../assets/img/Logo.webp")} style={{width:"160px", display:"flex", margin:"auto"}} alt="Logo"/>
        <h2 className="title">Host Management System</h2>
        <h2 className="title">Log In</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Email</label>
              <input placeholder="Enter your email" className="inputs" type="email" name="emailName" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-container">
              <label>Password </label>
              <input placeholder="Enter your password" className="inputs" type={showPassword} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <FormControlLabel control={<Checkbox onClick={handleCheckbox} />} label="Show password"/>
            <div className="errorMessage">{wrongCredentials && <>The email or password you've entered is wrong.</>}</div>
            <div className="button-container">
              <button type="submit" className="submit">
                Log in
              </button>
            </div>
            <div className="link-container">
              <Link to={"/forgotpass"}>Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
      </div>
  );
}
export default Login;
