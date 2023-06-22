import React, { forwardRef, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import logo from "../../assets/img/Logo.webp";
import "./RecipePrint.css";

const RecipePrint = forwardRef((data, ref) => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const [loading, setLoading] = useState(false);

  console.log(data);

  return (
    <div
      ref={ref}
      className="rootContainer"
      style={{ width: "100%", height: window.innerHeight }}
    >
      <img src={logo} height="100px" width="100px" />
      <h2 className="title">{data.RecipeName}</h2>
      <div className="recipeInfo">
        <div className="recipeInfoTitle">
          <p>DATE:</p>
          <p>TOOLS:</p>
          <p>YIELD:</p>
          <p>SHELF LIFE:</p>
          <p>SENSITIVITY:</p>
          <p>REMARKS:</p>
        </div>
        <div className="recipeInfoText">
          <p>{data.data.Date !== "" ? data.data.Date : "-"}</p>
          <p>{data.data.Tools !== "" ? data.data.Tools : "-"}</p>
          <p>{data.data.Yield !== "" ? data.data.Yield : "-"}</p>
          <p>{data.data.ShelfLife !== "" ? data.data.ShelfLife : "-"}</p>
          <p>
            {data.data.Sensitivity !== "" ? data.data.TSensitivityools : "-"}
          </p>
          <p>{data.data.Remarks !== "" ? data.data.Remarks : "-"}</p>
        </div>
      </div>
      <div className="table-page-break">
        <Table className="w-60 mx-auto" striped bordered hover>
          <thead>
            <th>INGREDIENTS</th>
          </thead>
          <tbody>{data.tableIngredients}</tbody>
        </Table>
      </div>
      <div className="table-page-break" style={{ marginTop: "3rem" }}>
        <Table className="w-60 mx-auto" striped bordered hover>
          <thead>
            <th>PROCEDURE</th>
          </thead>
          <tbody>{data.tableProcedure}</tbody>
        </Table>
      </div>
    </div>
  );
});

export default RecipePrint;
