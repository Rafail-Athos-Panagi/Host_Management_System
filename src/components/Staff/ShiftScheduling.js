import React, { useState, useEffect } from "react";
import Modal from "../UI/Modal/Modal";
import logging from "../../hooks/logging-hook";
import Username from "../../hooks/user-context";
import Manual from "../Settings/Manual";
import Swal from 'sweetalert2';
import Button from "@mui/material/Button";
import Loading from "../UI/Loading/Loading";
import MUIDataTable from "mui-datatables";
import EditShift from "./EditShift";
import AddShift from "./AddShift";
import AddIcon from '@mui/icons-material/Add';

const ShiftScheduling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [week, setWeek] = useState(currentWeek());

  const columns = [
    { name: 'staffID', label: 'Staff ID', options: { display: false, searchable: false, download: false, print: false, filter: false, sort: false } },
    { name: 'staffName', label: 'Staff Name', options: { filter: true, sort: true } },
    { name: 'staffSurname', label: 'Staff Surname', options: { display: false, filter: true, sort: true } },
    { name: 'monday', label: 'Monday', options: { filter: false, sort: false } },
    { name: 'tuesday', label: 'Tuesday', options: { filter: false, sort: false } },
    { name: 'wednesday', label: 'Wednesday', options: { filter: false, sort: false } },
    { name: 'thursday', label: 'Thursday', options: { filter: false, sort: false } },
    { name: 'friday', label: 'Friday', options: { filter: false, sort: false } },
    { name: 'saturday', label: 'Saturday', options: { filter: false, sort: false } },
    { name: 'sunday', label: 'Sunday', options: { display: false, filter: false, sort: false } },
  ];

  const options = {
    setRowProps: (row, dataIndex) => ({
      onDoubleClick: () => {
        if (row[0] === null)
          return;
        setEditRow([...row]);
        setIsEditOpen(true);
      }
    }),
    responsive: "vertical",
    selectableRows: "none",
  };

  function currentWeek() {
    var today = new Date();
    var onejan = new Date(today.getFullYear(), 0, 1);
    var week = Math.ceil((((today - onejan) / (24 * 60 * 60 * 1000)) + onejan.getDay() + 1) / 7);
    return week;
  }

  function getDatesOfWeek(week) {
    //i want to get an array of dates of the week so like (21/05,22/05)
    const dates = {};
    Date.prototype.GetWeekDates = function () {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const dates = {};
      const weekShift = (week - currentWeek()) * 7;
      this.setDate(this.getDate() + weekShift);
      days.forEach((day, i) => {
        dates[day] = new Date(this.setDate(this.getDate() - this.getDay() + 1 + i)).toLocaleDateString('el-GR');
      });
      dates["staffID"] = null;
      dates["staffName"] = null;
      dates["staffSurname"] = null;
      return dates;
    }
    return new Date().GetWeekDates();
  }

  function refreshTable() {
    setIsLoading(true);
    const request = {
      method: "POST",
      credentials: 'include',
      mode: 'cors',
      redirect: 'follow',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        select: "staffID, staffName, staffSurname, monday, tuesday, wednesday, thursday, friday, saturday, sunday",
        from: "shift_scheduling NATURAL JOIN staff", where: `deleted=false AND week=${week}`
      })
    };
    fetch(`/api/select`, request)
      .then(function (res) {
        res.json().then(function (data) {
          if (data.sqlMessage)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: data.sqlMessage,
            });
          const dates = getDatesOfWeek(week);
          data = [dates, ...data];
          setRows(data);
          setIsLoading(false);
        })
      })
  }

  useEffect(() => {
    refreshTable();
  }, []);

  useEffect(() => {
    refreshTable();
    getDatesOfWeek(week);
  }, [week]);

  return (
    <>
      <div className="contents">
        {isLoading && <Loading />}
        {!isLoading && <>
          <div className="d-flex">
            <div className="d-flex justify-content-between w-50 mb-4">

              <Button variant="contained" onClick={() => { setWeek(week - 1); }} disabled={week === 1}>Previous Week</Button>
              <div className="d-flex flex-column align-items-center">
                <h3>Week {week}</h3>
              </div>

              <Button variant="contained" onClick={() => { setWeek(week + 1); }} disabled={week === 53}>Next Week</Button>
            </div>
            <div className="d-flex justify-content-end w-50 mb-4">
              <Button variant="contained" onClick={()=>{setIsAddOpen(true)}} startIcon={<AddIcon/>}><span style={{marginTop:"4px"}}>Add New Shift</span></Button>
            </div>
          </div>
          <MUIDataTable title={<><span className="me-2 ">Shift Schedule</span><Manual title="Table Manual" pageNumber={38} /></>} data={rows} columns={columns} options={options} />
        </>}

      </div>

      <Modal handleClose={() => setIsEditOpen(false)}
        isOpen={isEditOpen}>
        <EditShift handleClose={() => { setIsEditOpen(false) }} editValues={editRow} refresh={() => refreshTable()} />
      </Modal>
      <Modal handleClose={() => setIsAddOpen(false)}
        isOpen={isAddOpen}>
        <AddShift handleClose={() => { setIsAddOpen(false) }} refresh={() => refreshTable()} initialweek={week} />
      </Modal>
    </>
  );
};

export default ShiftScheduling;
