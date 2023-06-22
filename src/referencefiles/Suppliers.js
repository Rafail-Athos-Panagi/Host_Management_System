import React from "react";
import person from "../assets/img/staff/person.png";
import "./Suppliers.css";

const suppliersData = [
  {
    image: person,
    name: "Frozen Foods inc.",
    items: ["Beef Patty, ", "Chicken Patty, ", "Chicken Thigh "],
  },
  {
    image: person,
    name: "Thomas Bakeries",
    items: ["Burger Bun, ", "Bread"],
  },
  {
    image: person,
    name: "Maria's Fresh Market",
    items: ["Tomatoes, ", "Lettuce, ", "Onions, "],
  },
];

function handleAdd() {}

function GetSuppliers() {
  return suppliersData.map();
}
function Suppliers() {
  return (
    <div className="Suppliers">
      <div className="Box">
        <div id="Searchbox">
          <form>
            <label style={{ marginLeft: "5px", marginRight: "5px" }}>
              Search supplier:{" "}
            </label>
            <input type="text" name="name" />
            <input
              type="button"
              value="Search!"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
            <input
              type="button"
              value="Add new supplier"
              onSubmit={handleAdd}
            />
          </form>
        </div>
        <div className="Contents">
          <table>
            <tr>
              <div className="smallbox">
                <th className="imagetd" style={{ textAlign: "center" }}>
                  Image
                </th>
                <th className="name" style={{ textAlign: "right" }}>
                  Name
                </th>
                <th className="items" style={{ marginLeft: "130px" }}>
                  Items
                </th>
                <th
                  className="choice"
                  style={{ marginLeft: "60px", textAlign: "left" }}
                >
                  Choice
                </th>
              </div>
            </tr>
            {suppliersData.map((val, key) => {
              return (
                <tr>
                  <div key={key} className="smallbox">
                    <td className="imagetd">
                      <img className="image" src={val.image} />
                    </td>
                    <td className="name">{val.name}</td>
                    <td className="whitespace"></td>
                    <td className="items">{val.items}</td>
                    <td className="whitespace"></td>
                    <td className="choice">
                      <input
                        type="button"
                        value="Order"
                        style={{ marginRight: "10px" }}
                      />
                      <label> | </label>
                      <input
                        type="button"
                        value="Edit"
                        style={{ marginRight: "10px", marginLeft: "10px" }}
                      />
                      <label> | </label>
                      <input
                        type="button"
                        value="Delete"
                        style={{ marginLeft: "10px" }}
                      />
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

export default Suppliers;
