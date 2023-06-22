import React from "react";
import "./Stock.css";
import bun from "../assets/img/stock/bun.png";
import chickenpatty from "../assets/img/stock/chickenpatty.png";
import flour from "../assets/img/stock/flour.png";
import lettuce from "../assets/img/stock/lettuce.png";
import beefpatty from "../assets/img/stock/beefpatty.png";
import tomato from "../assets/img/stock/tomato.png";

const stockData = [
  {
    image: bun,
    name: "Buns",
    quantity: 300,
  },
  {
    image: chickenpatty,
    name: "Chicken",
    quantity: "30kg",
  },
  {
    image: beefpatty,
    name: "Beef Patties",
    quantity: "8kg",
  },
  {
    image: lettuce,
    name: "Flour",
    quantity: "5kg",
  },
  {
    image: flour,
    name: "Flour",
    quantity: "12kg",
  },
  {
    image: tomato,
    name: "Tomatoes",
    quantity: "10kg",
  },
];

function handleAdd() {}
function Stock() {
  return (
    <div className="Stock">
      <div className="Box">
        <div id="Searchbox">
          <form>
            <label style={{ marginLeft: "5px", marginRight: "5px" }}>
              Search ingredient:{" "}
            </label>
            <input type="text" name="name" />
            <input
              type="button"
              value="Search!"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
            <input
              type="button"
              value="Add new ingredient"
              onSubmit={handleAdd}
            />
          </form>
        </div>
        <div className="Contents">
          <table style={{ width: "100%" }}>
            <tr>
              <div className="smallbox">
                <th className="imagetd">
                  <div style={{ width: "100%", textAlign: "center" }}>Item</div>
                </th>
                <th className="name">
                  <div style={{ width: "100%", textAlign: "center" }}>Name</div>
                </th>
                <th className="quantity">
                  <div style={{ width: "100%", textAlign: "center" }}>
                    Quantity
                  </div>
                </th>
                <th className style={{ margin: "auto" }}>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    Remove Item
                  </div>
                </th>
              </div>
            </tr>
            {stockData.map((val, key) => {
              return (
                <tr>
                  <div key={key} className="smallbox">
                    <td className="imagetd">
                      <img className="image" src={val.image} />
                    </td>
                    <td className="name">
                      <div style={{ width: "100%", textAlign: "center" }}>
                        {val.name}
                      </div>
                    </td>
                    <td className="quantity">
                      <input type="button" value="-" />
                      <input type="text" value={val.quantity} size="8" />
                      <input type="button" value="+" />
                    </td>
                    <td className="remove">
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <input type="button" value="X" />
                      </div>
                    </td>
                  </div>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stock;
