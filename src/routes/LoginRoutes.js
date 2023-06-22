import React from 'react';
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
const Login = React.lazy(() => import("../components/Account/Login/Login"));
const ChangePassword = React.lazy(() => import("../components/Account/Login/ChangePassword"));
const ForgotPassword = React.lazy(() => import("../components/Account/Login/ForgotPassword"));

export default function LoginRoutes({isLoggedIn, setIsLoggedIn}) {
    
    return (
        <div className="login">
            <Routes>               
                <Route path="/login" element={<Login handleLogin={() => { setIsLoggedIn(true); }} />} />
                <Route path="/forgotpass" element={<ForgotPassword />} />
                <Route path="/reset/:key" element={<ChangePassword />} />
                <Route path="/" element={<Login handleLogin={() => { setIsLoggedIn(true); }} />} />
                {/*<Route exact path="*" element={<Navigate to="/login" />} />*/}
            </Routes>
        </div>
    )
}
