import "./App.css";
import React, { Suspense, useEffect } from "react";
import { useState } from "react";
import LoadingPage from "./components/UI/Loading/LoadingPage";
import UserID from "./hooks/user-context";
import { useNavigate } from "react-router-dom";

const Navbar = React.lazy(() => import("./components/Navbar/Navbar"));
const Sidebar = React.lazy(() => import("./components/Sidebar/Sidebar"));
const LoginRoutes = React.lazy(() => import("./routes/LoginRoutes"));
const AppRoutes = React.lazy(() => import("./routes/AppRoutes"))

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState(null);

  const navigate = useNavigate();

  //On first load check if the cookie is expired or exists on backend
  useEffect(() => {
    try {
      const options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        
      }
      fetch('/api/auth/validate', options).then(res => {
        res.json().then(data => {
          if (typeof data !== "undefined")
            if (data.username) {
              setIsLoggedIn(true);
              setUsername(data.username);
              setLoaded(true);
              return;
            }
        })
        setIsLoggedIn(false);
        setLoaded(true);
      });
    } catch (error) { }

  }, []);


  return (<>
    <UserID.Provider value={{ username, setUsername }}>
      {!loaded && <LoadingPage />}
      {loaded && <>
        {!isLoggedIn && (
          <Suspense fallback={<LoadingPage />}>
            <LoginRoutes setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
          </Suspense>
        )}

        {isLoggedIn && (
          <div className="App">
            <div className="sidebar"><Sidebar /> </div>
            <div className="header"><Navbar handleLogout={setIsLoggedIn} /></div>
            <div className="content">
              <Suspense fallback={<LoadingPage />}>
                <AppRoutes setIsLoggedIn={setIsLoggedIn} />
              </Suspense>
            </div>
          </div>
        )}
      </>}
    </UserID.Provider>
  </>
  );
}
