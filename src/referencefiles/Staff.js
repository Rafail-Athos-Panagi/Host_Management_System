import React from "react";
import "./Staff.css";
import person from "../assets/img/staff/person.png";

const staffData = [
  {
    image: person,
    name: "Ανδρέας Ανδρέου",
    position: "Chef",
  },
  {
    image: person,
    name: "Γιάννης Μακρίδης ",
    position: "Chef",
  },
  {
    image: person,
    name: "Κώστας Κυριακίδης",
    position: "Sales",
  },
];

function handleAdd() {}
function Staff() {
  return (
    <div className="Staff">
      <div className="Box">
        <div id="Searchbox">
          <form>
            <label style={{ marginLeft: "5px", marginRight: "5px" }}>
              Search staff member:{" "}
            </label>
            <input type="text" name="name" />
            <input
              type="button"
              value="Search!"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
            <input
              type="button"
              value="Add new staff member"
              onSubmit={handleAdd}
            />
          </form>
        </div>
        <div className="Contents">
          <table style={{ width: "100%" }}>
            <tr>
              <div className="smallbox">
                <th className="imagetd" style={{ marginLeft: "15px" }}>
                  Image
                </th>
                <th className="name" style={{ marginLeft: "40px" }}>
                  Name
                </th>
                <th className="choice" style={{ marginLeft: "60px" }}>
                  Choice
                </th>
              </div>
            </tr>
            {staffData.map((val, key) => {
              return (
                <tr>
                  <div key={key} className="smallbox">
                    <td className="imagetd">
                      <img className="image" src={val.image} />
                    </td>
                    <td className="name">{val.name}</td>
                    <td className="choice">
                      <input
                        type="button"
                        value="Edit"
                        style={{ marginRight: "10px" }}
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

export default Staff;
