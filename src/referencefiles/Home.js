import React from "react";
import "./Home.css";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import warehouse from "../assets/img/stock.jpg";
import staff from "../assets/img/staff.png";
import suppliers from "../assets/img/suppliers.png";
import recipes from "../assets/img/recipes.png";

const sidebarData = [
  {
    title: "Manage Stock",
    icon: <InventoryIcon />,
    link: "/stock",
    image: warehouse,
  },
  {
    title: "Manage Suppliers",
    icon: <LocalShippingIcon />,
    link: "/suppliers",
    image: suppliers,
  },
  {
    title: "Manage Staff",
    icon: <PeopleIcon />,
    link: "/staff",
    image: staff,
  },
  {
    title: "See Recipes",
    icon: <FastfoodIcon />,
    link: "/recipes",
    image: recipes,
  },
];

const divStyle = (src) => ({
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.5), rgba(10, 10, 10,0.5)), url(" +
    src +
    ")",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

function Home() {
  return (
    <div className="Home">
      <div className="Box">
        <div className="Contents">
          {sidebarData.map((val, key) => {
            return (
              <div
                key={key}
                style={divStyle(val.image)}
                className="smallbox"
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                {" "}
                <div id="icon">{val.icon}</div>
                <div id="title">{val.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
