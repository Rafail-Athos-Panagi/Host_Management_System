import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
const Home = React.lazy(() => import("../components/Home/Home"));
const Stock = React.lazy(() => import("../components/Stock/Stock"));
const Staff = React.lazy(() => import("../components/Staff/Staff"));
const Recipes = React.lazy(() => import("../components/Recipes/Recipes"));
const Suppliers = React.lazy(() => import("../components/Suppliers/Suppliers"));
const Settings = React.lazy(() => import("../components/Settings/Settings"));
const Other = React.lazy(() => import("../components/Other/Other"));
const Account = React.lazy(() => import("../components/Account/Account"));
const Logout = React.lazy(() => import("../components/Account/Logout/Logout"));

export default function AppRoutes({ setIsLoggedIn }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/other" element={<Other />} />
      <Route path="/account" element={<Account />} />
      <Route path="/logout" element={<Logout handleLogout={() => setIsLoggedIn(false)} />} />
      {/*<Route path="*" element={<Navigate to="/home" />} />*/}
    </Routes>
  )
}
