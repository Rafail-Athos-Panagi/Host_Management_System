import React from "react";
import "./Loading.css";

export default function Loading() {
    return (
        <div style={{textAlign: "center" }}>
            <div className="spinner-container">
                <div className="loading-spinner">
                </div>
            </div>
            <br/>
            <p>Loading data...</p>
        </div>
    );
}