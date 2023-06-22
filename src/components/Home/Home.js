import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Username from "../../hooks/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faTruck,
  faNoteSticky,
  faBookOpen,
  faClock,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [dateState, setDateState] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const { username } = useContext(Username);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);

    const request = {
      method: "post",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
    };

    fetch(`/api/homepage-data`, request).then(function (res) {
      res.json().then(function (data) {
        setData(data[0]);
        setIsLoading(false);
      });
    });
  };
  useEffect(() => {
    setInterval(() => setDateState(new Date()), 30000);
    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="box">
        <p className="title">Dashboard</p>
        <div style={{ display: "flex", padding: "30px" }}>
          <div className="leftside">
            <h1>Hello {username}!</h1>
          </div>
          <div className="rightside">
            <h2>
              {dateState.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <h3>
              {dateState.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h3>
          </div>
        </div>
        <div className="interior">
          <div className="grid-container">
            <div
              className="grid-box"
              style={{
                backgroundColor: "lightblue",
                display: "flex",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/staff")}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                  width:'40.9%'
                }}
              >
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{ padding: "20" }}
                  size="4x"
                />
              </div>
              <div style={{ marginTop: "1rem", flex: 1,width:'59.1%' }}>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "35px" }}
                  >
                    {data.staff}
                  </span>
                </div>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "25px" }}
                  >
                    Employees
                  </span>
                </div>
              </div>
            </div>
            <div
              className="grid-box"
              style={{
                backgroundColor: "lightgreen",
                display: "flex",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/stock")}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                  width:'40.9%'
                }}
              >
                <FontAwesomeIcon
                  icon={faArchive}
                  style={{ padding: "20" }}
                  size="4x"
                />
              </div>
              <div style={{  marginTop: "1rem", flex: 1, width:'59.1%' }}>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "35px" }}
                  >
                    {data.stock}
                  </span>
                </div>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "25px" }}
                  >
                    Stock
                  </span>
                </div>
              </div>
            </div>
            <div
              className="grid-box"
              style={{
                backgroundColor: "lightgray",
                display: "flex",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/suppliers")}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                  width:'40.9%'
                }}
              >
                <FontAwesomeIcon
                  icon={faTruck}
                  style={{ padding: "20" }}
                  size="4x"
                />
              </div>
              <div style={{ marginTop: "1rem", flex: 1, width:'59.1%' }}>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "35px" }}
                  >
                    {data.suppliers}
                  </span>
                </div>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "25px" }}
                  >
                    Suppliers
                  </span>
                </div>
              </div>
            </div>
            <div
              className="grid-box"
              style={{
                backgroundColor: "orange",
                display: "flex",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/other")}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                  width:'40.9%'
                }}
              >
                <FontAwesomeIcon
                  icon={faNoteSticky}
                  style={{ padding: "20" }}
                  size="4x"
                />
              </div>
              <div style={{ marginTop: "1rem", flex: 1, width:'59.1%' }}>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "35px" }}
                  >
                    {data.todos}
                  </span>
                </div>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "25px" }}
                  >
                    Todos
                  </span>
                </div>
              </div>
            </div>
            <div
              className="grid-box"
              style={{
                backgroundColor: "lightsalmon",
                display: "flex",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/recipes")}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                  width:'40.9%'
                }}
              >
                <FontAwesomeIcon
                  icon={faBookOpen}
                  style={{ padding: "20" }}
                  size="4x"
                />
              </div>
              <div style={{ marginTop: "1rem", flex: 1, width:'59.1%' }}>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "35px" }}
                  >
                    {data.recipes}
                  </span>
                </div>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "25px" }}
                  >
                    Recipes
                  </span>
                </div>
              </div>
            </div>
            <div
              className="grid-box"
              style={{
                backgroundColor: "lightyellow",
                display: "flex",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/suppliers")}
            >
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                  width:'40.9%'
                }}
              >
                <FontAwesomeIcon
                  icon={faClock}
                  style={{ padding: "20" }}
                  size="4x"
                />
              </div>
              <div style={{ marginTop: "1rem", flex: 1, width:'59.1%' }}>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "35px" }}
                  >
                    {data.orders}
                  </span>
                </div>
                <div style={{ justifyContent: "left", textAlign: "left" }}>
                  <span
                    style={{ fontFamily: "monospace monaco", fontSize: "25px" }}
                  >
                    Pending orders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
