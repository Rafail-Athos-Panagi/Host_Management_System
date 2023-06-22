import React from "react";
import ModalButton from "../UI/Modal/ModalButton";
import Tabs from "react-bootstrap/Tabs";
import { Tab } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Suppliers.css";
import AddSupplier from './AddSupplier';
import SupplierOrder from './SupplierOrder';
import Loading from "../UI/Loading/Loading";
import OrderHistory from './OrderHistory';
import Modal from "../UI/Modal/Modal";
import EditSupplier from "./EditSupplier";
import MUIDataTable from "mui-datatables";
import Username from "../../hooks/user-context";
import logging from "../../hooks/logging-hook";
import Manual from "../Settings/Manual";
import Swal from 'sweetalert2';
import Button from "@mui/material/Button";


export default function Suppliers() {
  const [key, setKey] = useState('supplierlist');
  const [rows, setRows] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadHistory, setLoadHistory] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editRow, setEditRow] = useState([]);
  const { username } = React.useContext(Username);

  const columns = [
    { name: 'supplierID', label: 'Supplier ID', options: { display: false, searchable: false, download: false, print: false, filter: false, sort: true } },
    { name: 'supplierName', label: 'Supplier Name', options: { filter: false, sort: true } },
    { name: 'supplierStreetName', label: 'Street Name', options: { filter: false, sort: true } },
    { name: 'supplierStreetNumber', label: 'Street Number', options: { filter: false, sort: true } },
    { name: 'supplierCity', label: 'City', options: { sort: true } },
    { name: 'supplierPostalCode', label: 'Postal Code', options: { sort: true } },
    { name: 'supplierEmail', label: 'Email', options: { filter: false, sort: true } },
    { name: 'phoneNumber', label: 'Phone Number', options: { filter: false, sort: true } },
  ];

  const options = {
    setRowProps: (row, dataIndex) => ({
      onDoubleClick: () => {
        setEditRow([...row]);
        setIsOpen(true);
      }
    }),
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <div>
        <Button variant="contained" className="me-2" onClick={() => handleDelete(selectedRows, displayData)}>Delete Selected</Button>
      </div>
    ),
  }


  const handleDelete = async (selectedRows, rows2) => {
    const deleted = selectedRows.data.map(d => rows[d.dataIndex])

    const choice = await Swal.fire({
      title: 'Delete?',
      text: "Are you sure you want to delete these suppliers?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed)
        return true;
      return false;
    });

    if (!choice) return;

    try {
      deleted.forEach(i => {
        const request = {
          method: "post",
          credentials: "include",
          mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "suppliers",
            columns: `deleted=true`,
            where: `supplierID=${i.supplierID}`
          }),
        };

        fetch(`/api/update`, request).then(function (res) {
          res.json().then(function (data) {
            if (data.sqlMessage) {
              console.log(data.sqlMessage);
              throw new Error(data.sqlMessage);
            } else 
              logging(`${username}`, "Delete", `${i.supplierID}`, "suppliers", `Deleted supplier: ${i.supplierName}`);
          })
        });
      });
      Swal.fire({
        title: 'Success!',
        text: 'The selected items have been deleted.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      refreshTable();
    } catch (error) {
      console.error(error)
    }
  };

  function refreshTable() {
    setIsLoading(true);
    const request = {
      method: "post",
      credentials: "include",
      mode: "cors", redirect: "follow",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        select: "*",
        from: "suppliers",
        where: "deleted=false"
      })
    };
    fetch(`/api/select`, request)
      .then(function (res) {
        res.json().then(function (data) {
          data.sqlMessage ? console.log(data.sqlMessage) : setRows(data);
          setIsLoading(false);
        })
      })
  }

  useEffect(() => {
    refreshTable();
  }, []);


  return (
    <>
      <div className="suppliers">
        <div className="box">
          <p className="title">Supplier Management</p>

          <Tabs
            id="controlled-tab"
            activeKey={key}
            onSelect={function (k) { setKey(k); if (k === "orderhistory") setLoadHistory(true); else setLoadHistory(false); }}
            className="mb-3"

          >
            <Tab eventKey="supplierlist" title="Supplier List">
              <div className="interior">
                <div style={{ display: "flex" }}>
                  <div className="leftside">
                  <Manual title="Suppliers Manual" pageNumber={25}/>
                  </div>
                  <div className="rightside">
                    <ModalButton
                      close={closeModal}
                      isClosed={() => { refreshTable(); setCloseModal(false) }}
                      name="Add new supplier"
                    >
                      <AddSupplier handleClose={() => { refreshTable(); setCloseModal(true) }}></AddSupplier>
                    </ModalButton>
                  </div>
                </div>
                <hr />
                <div className="Contents">
                  {isLoading && <Loading />}
                  {!isLoading && <MUIDataTable title={"Supplier List"} data={rows} columns={columns} options={options} />}
                </div>
              </div>
            </Tab>
            <Tab eventKey="supplierorder" title="Supplier Order">
            <Manual title="Order Manual" pageNumber={30}/>
              <div className="interior">
                <SupplierOrder supplierdata={rows} />
              </div>
            </Tab>
            <Tab eventKey="orderhistory" title="Order History">
            <Manual title="Order History Manual" pageNumber={31}/>
              <div className="interior">
                <div>
                  {loadHistory && <OrderHistory />}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Modal handleClose={() => setIsOpen(false)}
        isOpen={isOpen}>
        <EditSupplier handleClose={() => { setIsOpen(false) }} editValues={editRow} refresh={() => refreshTable()} />
      </Modal>
    </>
  );
}