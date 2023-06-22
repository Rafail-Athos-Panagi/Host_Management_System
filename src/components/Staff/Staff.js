import React, { useEffect } from "react";
import "./Staff.css";
import ModalButton from "../UI/Modal/ModalButton";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useState } from "react";
import AddStaff from "./AddStaff";
import ShiftScheduling from "./ShiftScheduling";
import Loading from "../UI/Loading/Loading";
import MUIDataTable from "mui-datatables";
import EditStaff from "./EditStaff";
import Modal from "../UI/Modal/Modal";
import Manual from "../Settings/Manual";
import Username from "../../hooks/user-context";
import logging from "../../hooks/logging-hook";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";

function Staff() {
  const [key, setKey] = useState("stafflist");
  const [closeModal, setCloseModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [loadShiftSchedule, setLoadShiftSchedule] = useState(false);
  const [editRow, setEditRow] = useState([]);
  const { username } = React.useContext(Username);
  const [staffNames , setStaffNames] = useState([]);

  const columns = [
    { name: "staffID", label: "Staff ID", options: { display: false, searchable: false, download: false, print: false, filter: false, sort: true } },
    { name: "staffName", label: "First Name", options: { filter: true, sort: true } },
    { name: "staffSurname", label: "Last Name", options: { filter: true, sort: true } },
    { name: "staffEmail", label: "Email", options: { filter: false, sort: true } },
    { name: "staffPhoneNumber", label: "Phone Number", options: { filter: false, sort: true } },
    { name: "startDate", label: "Hire Date", options: { filter: true, sort: true } },
  ]

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
    responsive: "vertical",
  };



  const handleDelete = async (selectedRows, displayData) => {
    const deleted = selectedRows.data.map(d => rows[d.dataIndex])


    const choice = await Swal.fire({
      title: 'Delete?',
      text: "Are you sure you want to delete these staff members?",
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
            table: "staff",
            columns: `deleted=true`,
            where: `staffID=${i.staffID}`
          }),
        };

        fetch(`/api/update`, request).then(function (res) {
          res.json().then(function (data) {
            if (data.sqlMessage) {
              console.log(data.sqlMessage);
              throw new Error(data.sqlMessage);
            } else {
              logging(`${username}`, "Delete", `${i.staffID}`, "staff", `Deleted staff: ${i.staffName + " " +i.staffSurname}`);
            }

          })
        });
      });
      Swal.fire({
        title: 'Success!',
        text: 'The selected staff members have been deleted.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      refreshTable();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An error has occurred. Please try again.' + error,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
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
        select: "staffID,staffName,staffSurname,staffPhoneNumber,staffEmail,startDate",
        from: "staff", where: "deleted=false"
      }),
    };
    fetch(`/api/select`, request).then(function (res) {
      res.json().then(function (data) {
        if (data.sqlMessage)
          console.log(data.sqlMessage)
        data.forEach(item => {
          item.startDate = item.startDate.substring(0, 10);
        })
        setRows(data);
        const temp = data.map((item) => {
          return {value: item.staffName , label: item.staffName}
        })
        setStaffNames(temp)
        setIsLoading(false);
      });
    });
  }



  useEffect(() => {
    refreshTable();
  }, []);

  return (
    <>
      <div className="staff">
        <div className="box">
          <p className="title">Staff Management</p>

          <Tabs
            id="controlled-tab"
            activeKey={key}
            onSelect={function (k) { setKey(k); if (k === "shiftschedule") setLoadShiftSchedule(true); else setLoadShiftSchedule(false); }}
            className="mb-3"
          >
            <Tab eventKey="stafflist" title="Staff List">
              <div className="interior">
                <div style={{ display: "flex" }}>
                  <div className="leftside">
                  <Manual title="Staff Manual" pageNumber={33}/>
                  </div>
                  <div className="rightside">
                  
                    <ModalButton
                      close={closeModal}
                      isClosed={() => { refreshTable(); setCloseModal(false) }}
                      name="Add new staff member"
                    >
                      <AddStaff handleClose={() => { refreshTable(); setCloseModal(true) }} />
                    </ModalButton>
                  </div>
                </div>
                <hr />
                <div className="Contents">
                
                  {isLoading && <Loading />}
                  {!isLoading && <MUIDataTable title={"Staff List"} data={rows} columns={columns} options={options} />}
                </div>
              </div>
            </Tab>
            <Tab eventKey="shiftschedule" title="Shift Schedule">
              {loadShiftSchedule &&
                <div className="interior">
                  <ShiftScheduling/>
                </div>
              }
            </Tab>
          </Tabs>
        </div>
      </div>
      <Modal handleClose={() => setIsOpen(false)}
        isOpen={isOpen}>
        <EditStaff handleClose={() => { setIsOpen(false) }} editValues={editRow} refresh={() => refreshTable()} />
      </Modal>
    </>
  );
}

export default Staff;