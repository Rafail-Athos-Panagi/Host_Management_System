import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsIcon from '@mui/icons-material/Settings';
import Logo from "../../assets/img/Logo.webp";
import EventNoteIcon from '@mui/icons-material/EventNote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers,faTruck,faBookOpen,faNoteSticky } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const sidebarData = [
    {
      title: "Home",
      icon: <HomeIcon />,
      link: "/home",
    },
    {
      title: "Stock",
      icon: <InventoryIcon />,
      link: "/stock",
    },
    {
      title: "Suppliers",
      icon: <FontAwesomeIcon icon={faTruck} />,
      link: "/suppliers",
    },
    {
      title: "Staff",
      icon:  <FontAwesomeIcon icon={faUsers}/>,
      link: "/staff",
    },
    {
      title: "Recipes",
      icon: <FontAwesomeIcon icon={faBookOpen}/>,
      link: "/recipes",
    },
    {
      title: "Other",
      icon: <FontAwesomeIcon icon={faNoteSticky}/>,
      link: "/other",
    }
  ];

  const sidebarSettings = [
    {
      title: "Settings",
      icon: <SettingsIcon />,
      link: "/settings",
    },
  ];
  
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li>
          <img
            style={{ width: "70%", height: "70%", padding: "5px" }}
            src={Logo}
            alt="Logo"
          />
        </li>
        {sidebarData.map((val, key, dd) => {
          return (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => { navigate(val.link) }}
            >
              <div className="d-xs-flex"id="icon">{val.icon}</div>
              <div className="d-none d-md-block" id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
      <ul className="sidebar-settings">
        {sidebarSettings.map((val, key, dd) => {
          return (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => { navigate(val.link) }}
            >
              <div className="d-xs-flex" id="icon">{val.icon}</div>
              <div className="d-none d-md-block" id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
