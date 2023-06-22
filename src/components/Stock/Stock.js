import React from "react";
import { useState, useEffect } from "react";
import "./Stock.css";
import ModalButton from '../UI/Modal/ModalButton';
import AddStock from "./AddStock";
import Loading from "../UI/Loading/Loading";
import MUIDataTable from "mui-datatables";
import EditStock from "./EditStock";
import Modal from "../UI/Modal/Modal";
import logging from "../../hooks/logging-hook";
import Username from "../../hooks/user-context";
import Manual from "../Settings/Manual";
import Swal from 'sweetalert2';
import Button from "@mui/material/Button";

function Stock() {
  const [closeModal, setCloseModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editRow, setEditRow] = useState([]);
  const { username } = React.useContext(Username);

  const columns = [
    { name: 'stockProductID', label: 'Stock ID', options: { display: false, searchable: false, download: false, print: false, filter: false, sort: true } },
    { name: 'stockName', label: 'Product Name', options: { filter: false, sort: true } },
    { name: 'stockType', label: 'Type', options: { filter: true, sort: true } },
    { name: 'stockUnit', label: 'Unit', options: { filter: true, sort: true } },
    { name: 'stockQuantity', label: 'Quantity', options: { filter: false, sort: true } },
    { name: 'supplierName', label: 'Supplier', options: { filter: true, sort: true } },
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
          <Button variant="contained" className="me-2" onClick={() => handleDelete(selectedRows, displayData)}>Deleted Selected</Button>
      </div>
    ),
    responsive: "vertical",
  }

  const handleDelete = async (selectedRows, displayData) => {
    const deleted = selectedRows.data.map(i => rows[i.dataIndex]);
      const choice = await Swal.fire({
        title: 'Delete?',
        text: "Are you sure you want to delete these items?",
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
            method: "POST",
            credentials: 'include',
            mode: 'cors',
            redirect: 'follow',

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table: "stock",
              columns: `deleted=true`,
              where: `stockProductID=${i.stockProductID}`
            }),
          };

          fetch(`/api/update`, request).then(function (res) {
            res.json().then(function (data) {
              if (data.sqlMessage) {
                console.log(data.sqlMessage);
              } else {
                logging(`${username}`, "Delete", `${i.stockProductID}`, "stock", `Deleted stock item: ${i.stockName}`);
                Swal.fire({
                  title: 'Success!',
                  text: 'The selected items have been deleted.',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                });
                refreshTable(); 
              }

            })
          });
        });
        
      } catch (error) {
        console.error(error)
      }
    };

  function refreshTable() {
    setIsLoading(true);
    const request = {
      method: "POST",
      credentials: 'include',
      mode: 'cors',
      redirect: 'follow',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        select: "stockProductID,stockName,stockType,stockUnit,stockQuantity,supplierName",
        from: "stock natural join suppliers", where: "deleted=false"
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
      <div className="stock">
        <div className="box">
          <p className="title">Stock Management</p>
          <div className="interior">
            <div style={{ display: "flex" }}>
              <div className="leftside">
                <Manual title="Stock Manual" pageNumber={19}/>
              
              </div>
              <div className="rightside">
                <ModalButton close={closeModal} isClosed={() => { refreshTable(); setCloseModal(false) }} name="Add new product" >
                  <AddStock handleClose={() => { refreshTable(); setCloseModal(true) }} />
                </ModalButton>
              </div>
            </div>
            <hr />
            <div className="contents">
              {isLoading && <Loading />}
              {!isLoading && <MUIDataTable title={<><span className="me-2 ">Stock List</span><Manual title="Table Manual" pageNumber={13}/></>} data={rows} columns={columns} options={options} />}
            </div>
            
          </div>
        </div>
      </div>
      <Modal handleClose={() => setIsOpen(false)}
        isOpen={isOpen}>
        <EditStock handleClose={() => { setIsOpen(false) }} editValues={editRow} refresh={()=>refreshTable()} />
      </Modal>
    </>
  );
}

export default Stock;
