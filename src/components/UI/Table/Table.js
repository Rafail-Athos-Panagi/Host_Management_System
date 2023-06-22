import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "./Table.css";
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import EditStock from "../../Stock/EditStock";
import Modal from "../Modal/Modal";
import EditSupplier from "../../Suppliers/EditSupplier";
import EditStaff from "../../Staff/EditStaff";
import EditTodo from "../../Other/EditTodo";
import { Button } from "@mui/material";


export default function Table(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowEdit, setRowEdit] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedList, setCheckList] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleDoubleClick(event, row) {
    if (event.detail === 2) {
      setRowEdit(row);
      setIsOpen(true);
    }
  }

  const handleTodoChange = (rowID) => {
    console.log(rowID);
    if (checkedList.includes(rowID)){
        checkedList.splice(checkedList.indexOf(rowID),1);
        console.log(checkedList);
    } else {
      setCheckList(array => [...array, rowID]);
    }
  }

  return (
    <div>
      <Paper sx={{ overflow: 'auto', margin: "20px auto" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <MUITable stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props.columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundColor: "lightgray", fontSize: "18px" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i} onClick={e => handleDoubleClick(e, i)}>
                      {props.columns.map((column, j) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={j} align={column.align} className="tablerow" style={{ fontSize: "18px" }}>
                            {(column.id === "done") && <FormControl><Checkbox defaultChecked={row.completed} disabled={row.completed} onChange={e=>handleTodoChange(i)} /></FormControl>}
                            {(column.id === "delete") && <FormControl><Checkbox defaultChecked={false} /></FormControl>}
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  );
                })}
            </TableBody>
          </MUITable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {props.editTodo && 
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <Button sx={{ marginRight: 5 }} variant="outlined" color="error" >Delete marked rows</Button>
            </div>
        }
        <Modal handleClose={() => setIsOpen(false)}
          isOpen={isOpen}>
          {props.editStock && <EditStock handleClose={() => { setIsOpen(false) }} editValues={props.rows[rowEdit]} refresh={props.refresh}/>}
          {props.editStaff && <EditStaff handleClose={() => { setIsOpen(false) }} editValues={props.rows[rowEdit]} refresh={props.refresh}/>}
          {props.editSupplier && <EditSupplier handleClose={() => { setIsOpen(false) }} editValues={props.rows[rowEdit]} refresh={props.refresh}/>}
          {props.editTodo && <EditTodo handleClose={()=>{setIsOpen(false)}} editValues={props.rows[rowEdit]} refresh={props.refresh}/>}
        </Modal>
    </div>
  );
}
