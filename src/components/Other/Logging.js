import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Manual from '../Settings/Manual';

export default function Logging() {
    const [rows, setRows] = useState([]);

    const columns = [
        { name: 'event', label: 'Event ID', options: { filter: false, sort: true } },
        { name: 'ID', label: 'ID', options: { display: false, filter: false, sort: true } },
        { name: 'action', label: 'Action', options: { filter: true, sort: true } },
        { name: 'table', label: 'Table', options: { filter: true, sort: true } },
        { name: 'description', label: 'Description', options: { filter: false, sort: true } },
        { name: 'username', label: 'By user', options: { filter: true, sort: true } },
        { name: 'date', label: 'Date', options: { filter: false, sort: true } },
    ];

    const options = {
        download: false,
        print: false,
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <div>
                <Button variant="contained" className="me-2" onClick={() => handleDelete(selectedRows, displayData)}>Revert Selected</Button>
            </div>
        ),
        responsive: "vertical",
    }

    const handleDelete = async (selectedRows, rows2) => {
        const deleted = selectedRows.data.map(i => rows[i.dataIndex]);
        console.log(deleted);
        const choice = await Swal.fire({
            title: 'Revert?',
            text: "Are you sure you want to revert these items? This will only revert deletions!",
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
        if (!choice) return false;

        try {
            const body = {};
            deleted.forEach(i => {
                if (i.action !== "Delete")
                    return;
                if (!body[i.table])
                    body[i.table] = [];
                body[i.table].push(i.ID)
            });

            if (Object.keys(body).length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No deletions selected, or you have selected other actions!',
                });
                return;
            }

            const request = {
                method: "POST",
                credentials: 'include',
                mode: 'cors',
                redirect: 'follow',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            };
            fetch(`/api/logging-revert`, request).then(function (res) {
                if (res.status !== 200) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Reverted successfully!',
                    });
                    refreshTable();
                }
            });
    
    } catch (err) {
        console.log(err);
    }
}

function refreshTable() {
    const request = {
        method: "post",
        credentials: "include",
        mode: "cors", redirect: "follow",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ select: "*", from: "`logs`" }),
    };
    fetch(`/api/select`, request).then(function (res) {
        res.json().then(function (data) {
            data.sqlMessage ? console.log(data.sqlMessage) : setRows(data);
        });
    });
}

useEffect(() => {
    refreshTable();
}, []);

return (
    <div className="interior">
        <div style={{ display: "flex" }}>
        </div>
        <div className="contents">
            <MUIDataTable title={<><span className="me-2">Logs</span><Manual title="Log Manual" pageNumber={51}/></>} data={rows} columns={columns} options={options} />
        </div>
    </div>
)
}
