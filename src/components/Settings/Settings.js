import CreateAccount from './CreateAccount'
import React, { useEffect, useState } from 'react';
import Units from './Units';
import ProductTypes from './ProductTypes';
import "./Settings.css";
import Tabs from 'react-bootstrap/Tabs';
import Tab from "react-bootstrap/Tab";
import Backup from './Backup';
import Manual from './Manual';

export default function Settings() {
  const [image, setImage] = useState(null);
  const [key, setKey] = useState('types');

  const handleSubmit = event => {

    event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.set("data", "asd");
    const request = {
      method: "post",
      credentials: "include", 
      mode: "cors", redirect: "follow",
      body: formData
    };
    fetch(`/api/image`, request).then(response => {
      console.log('Upload successful');
    })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
    console.log("aaa")
  };

  const handleImageChange = event => {
    setImage(event.target.files[0]);
  };

  /*useEffect(()=>{
    const request = {
      method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email:"paraskeva254@gmail.com"})
    };
    fetch(`/api/auth/reset`, request).then(response => {
      console.log('email succ');
    })
    .catch(error => {
      console.error('fail?', error);
    });
  },[])*/

  return (
    <div className="settings">
      <div className="box">
        <p className="title">Settings</p>
        <Tabs
          id="controlled-tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="types" title="Types">
            <div className="interior">
              <div style={{ display: "flex", gap: "40px" }}>
                <Manual title="Setup Manual" pageNumber={52}/>
                <ProductTypes />
                <Units />
              </div>
            </div>
          </Tab>
          <Tab eventKey="createuser" title="Create user">
            <div className="interior">
              <Manual title="Create Account Manual" pageNumber={55}/>
              <CreateAccount />
            </div>
          </Tab>
          <Tab eventKey="backup" title="Backups">
            <div className="interior">  
              <Manual title="Backup Manual" pageNumber={56}/>            
              <Backup />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}