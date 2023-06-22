import React, { useState } from 'react'
import "./Login.css";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

  const ChangePassword = () => {
    const [correctPassword, setCorrectPassword]= useState(true); 
    const [wrongPassword,setWrongPassword] = useState(true)
    const [password, setPassword] = useState("");
    const [confirmPassword,setConfirmPassword]= useState("");
    const [weakPass,setWeakPass]= useState(false);
    const [formSubmitted, isFormSubmitted] = useState(false);
    const [returnMessage, setReturnMessage] = useState("");
    const {key}=useParams();

    
    async function sendChangePasswordToBackEnd() {
      try {
        const request = {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password:password, key:key }), 
        };
    
        const res = await fetch(`/api/auth/resetpass`, request);
        const data = await res.json();
        setReturnMessage(data.message);
        
        
      } catch (error) {
        console.error(error);
      }
    }
  
    const handleSubmit= (e)=>
    {
      e.preventDefault(); //prevents the page to make a reload

      if( password === confirmPassword){
        setWrongPassword(false);
        setCorrectPassword(true);
      } else {
      setCorrectPassword(false);
      }

      if( password.length >=8 && confirmPassword.length >=6)
        setWeakPass(false);
      else 
        setWeakPass(true);

      if(password === confirmPassword && password.length >=8 && confirmPassword.length >=8){
        sendChangePasswordToBackEnd();
        isFormSubmitted(true);
      }      
      setPassword("")
      setConfirmPassword("")
    }
  
    const message = <div className='errorMessage'>Passwords do not match!</div>

    const message2= <div className='successMessage'>Your password has been changed successfully!</div> 
    
    const message3= <div className='errorMessage'>Your password must be 8 characters/numbers or more</div>

    return (
      <div className="login">
        <div className="login-form">
          <h1 className="title">Change pass</h1>
          <div>
            {!formSubmitted && <form onSubmit={handleSubmit}>
              <div className="input-container">
                <label>Enter new password</label>
                <input
                  className="inputs"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <label>Confirm password</label>
                <input
                  className="inputs"
                  type="password"
                  name="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div>{(weakPass && message3) || (!correctPassword && message) || (!wrongPassword && message2)}</div>
              <div className="button-container">
                <button type="submit" className="submit">
                  Submit
                </button>
              </div>
              
            </form>}
            {formSubmitted && 
            <p>{returnMessage}</p>}
            <div className="link-container">
                <Link to={"/login"}>Back to login</Link>
              </div>
          </div>
        </div>
      </div>
    );
      
  };
  

export default ChangePassword
