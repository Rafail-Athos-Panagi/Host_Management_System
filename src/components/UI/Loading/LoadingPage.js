import React from 'react'
import "./Loading.css"

export default function LoadingPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="spinner-container">
        <div className="loading-spinner">
        </div>
      </div>
      <br />
      <p>Loading page...</p>
    </div>
  )
}
