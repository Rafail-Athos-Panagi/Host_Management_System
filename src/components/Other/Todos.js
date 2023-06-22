import React, { useState, useEffect } from 'react';
import "./Other.css";
import ModalButton from '../UI/Modal/ModalButton';
import AddTodo from './AddTodo';
import MUIDataTable from "mui-datatables";
import { Checkbox } from '@mui/material';
import Manual from '../Settings/Manual';



export default function Todos() {
  const [closeModal, setCloseModal] = useState(false);
  const [rows, setRows] = useState([]);

  const columns = [
    { name: "todoID", label: "Number", options: { filter: false, sort: true } },
    { name: "description", label: "Description", options: { filter: false, sort: true } },
    { name: "dueDate", label: "Due", options: { filter: true, sort: true } },
    { name: "byWho", label: "By", options: { filter: true, sort: true } },
    { name: "forWho", label: "Phone For", options: { filter: true, sort: true } },
    {
      name: "completed", label: "Done", options: {
        filter: true, sort: true, checkbox: true,
        customBodyRender: (value, tableMeta, updateValue) => (<Checkbox checked={value} disabled={value} onChange={()=>{updateValue();updateTodo(tableMeta.rowData[0])}} />)
      }
    },
  ];

  const options = {
    onRowsDelete: (rowsDeleted) => {
      const deleted = rowsDeleted.data.map(d => rows[d.dataIndex].todoID)

      if (!window.confirm("Are you sure you want to delete these todos?")) {
        return false;
      }

      try {
        deleted.forEach(i => {
          const request = {
            method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table: "todolist",
              where: `todoID=${i}`
            }),
          };
          fetch(`/api/delete`, request).then(function() {
            refreshTable();
        });

        })
      } catch (error) {
        console.error(error)
      }
    },
    responsive: "vertical",
  };

  function updateTodo(rowEdit) {
    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "todolist", columns: "completed=1", where:`todoID=${rowEdit}` }),
    };
    fetch(`/api/update`, request).then(function () {
        refreshTable();
    }); 
  }


  function refreshTable() {
    const request = {
      method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ select: "*", from: "todolist" }),
    };
    fetch(`/api/select`, request).then(function (res) {
      res.json().then(function (data) {
        if(data.sqlMessage){
          console.log(data.sqlMessage);
        }else{
          data.forEach(item=>{
            item.dueDate = item.dueDate.substring(0,10);
          })
          setRows(data);
        }
      });
    });

  }

  useEffect(() => {
    refreshTable();
  }, []);


  return (
    <div className="interior">
      <div style={{ display: "flex" }}>
        <div className="leftside">
        </div>

        <div className="rightside">
          <ModalButton close={closeModal} isClosed={() => { setCloseModal(false); refreshTable() }} name="Add new todo">
            <AddTodo handleClose={() => { setCloseModal(true); refreshTable() }} />
          </ModalButton>
        </div>
      </div>
      <hr />
      <div className="contents">
        <MUIDataTable title={<><span className="me-2">Todos</span><Manual title="Todos Manual" pageNumber={48}/></>} data={rows} columns={columns} options={options} />
      </div>
    </div>
  )
}
