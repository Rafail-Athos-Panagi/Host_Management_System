import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownloadIcon from '@mui/icons-material/Download';
import MUITable from "@mui/material/Table";
import TablePagination from "@mui/material/TablePagination";
import { TextField } from "@mui/material";
import Modal from "../UI/Modal/Modal";
import EditOrder from "./EditOrder";
import { Link } from "react-router-dom";

export default function OrderProducts() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [rowEdit, setRowEdit] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortedOrders, setSortedOrders] = useState([]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function Orders() {
    const request = {
      method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        select:
          "supplierId,orderId,orderStatus,orderTotalPrice,orderDate,arrivalDate,orderInvoice,supplierName,comments",
        from: "orders natural join suppliers",
      }),
    };
    fetch(`/api/select`, request).then(function (res) {
      res.json().then(function (data) {
        data.sqlMessage ? console.log(data.sqlMessage) : setOrders(data);
      });
    });
  }

  function OrderDetails() {
    const request = {
      method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ select: "*", from: "order_details" }),
    };
    fetch(`/api/select`, request).then(function (res) {
      res.json().then(function (data) {
        data.sqlMessage ? console.log(data.sqlMessage) : setOrderDetails(data);
      });
    });
  }

  function handleClick(e, row){
    if (e.detail === 2) {
      setRowEdit(row);
      setIsOpen(true);
    }
  }

  function refreshTable(){
    Orders();
    OrderDetails();
  }

  useEffect(() => {
    Orders();
    OrderDetails();
  }, []);

  useEffect(() => {
    const ordersWithProducts = orders.map((order) => {
      //const date = new Date(order.orderDate);

      const date1 = new Date(order.orderDate);
      const orderDate = `${date1.toLocaleDateString()} ${date1.toLocaleTimeString()}`;
      
      var arrivalDate;
      if(order.arrivalDate){
        const date2 = new Date(order.arrivalDate);
        arrivalDate = `${date2.toLocaleDateString()} ${date2.toLocaleTimeString()}`;
      } else 
        arrivalDate = "Awaiting";

      const orderProducts = orderDetails.reduce((acc, product) => {
        if (product.orderID === order.orderId) {
          acc.push({
            productName: product.orderProductName,
            productPrice: product.orderProductPrice,
            quantity: product.orderQuantity,
          });
        }
        return acc;
      }, []);

      return {
        orderId: order.orderId,
        supplierName: order.supplierName,
        orderStatus: order.orderStatus,
        orderTotalPrice: order.orderTotalPrice,
        orderDate: orderDate,
        arrivalDate: arrivalDate,
        orderInvoice: (order.orderInvoice? <Link to={`/invoices/${order.orderInvoice}`} target="_blank" download><DownloadIcon /></Link>: "Not uploaded"),
        products: orderProducts,
        comments: order.comments
      };
    });

    const sortedOrders = ordersWithProducts.sort((a, b) => {
      if (a.orderId > b.orderId) {
        return -1;
      }
      if (a.orderId < b.orderId) {
        return 1;
      }
      return 0;
    });
    setSortedOrders(sortedOrders);
  }, [orders, orderDetails]);

  /* useEffect(() => {
      const filteredRows = sortedOrders.filter((row) => {
         return row.supplierName.toLowerCase().includes(search.toLowerCase());
      });
      setRows(filteredRows);
    }, [search, sortedOrders]); */

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

   /*  const date1 = new Date(row.orderDate);
    const orderDate = `${date1.toLocaleDateString()} ${date1.toLocaleTimeString()}`; */

    

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }} onClick={e=>handleClick(e, row.orderId)}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.orderId}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.supplierName}
          </TableCell>
          <TableCell align="right">{row.orderStatus}</TableCell>
          <TableCell align="right">{row.orderTotalPrice}€</TableCell>
          <TableCell align="right">{row.orderDate}</TableCell>
          <TableCell align="right">{row.arrivalDate}</TableCell>
          <TableCell align="right">{row.orderInvoice}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Products
                </Typography>

                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Product Price</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.products.map((prd) => (
                      <TableRow key={prd.productName}>
                        <TableCell>{prd.productName}</TableCell>
                        <TableCell>{prd.productPrice}€</TableCell>
                        <TableCell>{prd.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Comments
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow>
                      <TableCell>{row.comments}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <>
      <div className="leftside">
        {/* <TextField
          id="outlined-basic"
          label="Search by supplier"
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
        /> */}
      </div>
      <Paper sx={{ overflow: 'auto', margin: "20px auto" }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <MUITable stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell align="right">Order Status</TableCell>
                <TableCell align="right">Total Price</TableCell>
                <TableCell align="right">Order Date</TableCell>
                <TableCell align="right">Arrival Date</TableCell>
                <TableCell align="right">Order Invoice</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                  <Row key={i} row={row} />
                ))}
            </TableBody>
          </MUITable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sortedOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal handleClose={() => setIsOpen(false)}
        isOpen={isOpen}>
        <EditOrder handleClose={() => { setIsOpen(false); refreshTable(); }} editValues={rowEdit} refresh={()=>{refreshTable();}} />
      </Modal>
    </>
  );
}
