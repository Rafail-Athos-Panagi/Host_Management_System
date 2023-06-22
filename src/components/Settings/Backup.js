import React from 'react';
import MUIDataTable from "mui-datatables";
import Manual from '../Settings/Manual';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function Backup() {
  const [files, setFiles] = React.useState([]);

  React.useEffect(() => {
    const options = {
      method: "post",
      credentials: "include",
      mode: "cors", redirect: "manual",
    };

    fetch("/api/backup", options).then(res => {
      res.json().then(data => {
        setFiles(data);
        console.log(data);
      });
    });
  }, []);

  async function restoreBackup(filename) {
    const choice = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed)
        return true;
      return false;
    });
    if (!choice)
      return;

    const options = {
      method: "post",
      credentials: "include",
      mode: "cors", redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: filename }),
    };
    fetch("/api/backup-restore", options).then(res => {
      if (res.status === 200)
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Backup restored successfully!',
        });
      else
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Backup restore failed!',
        });
    });
  }


  const columns = [
    {
      name: "date", label: "Date Created", options: {
        filter: false, sort: true, sortDirection: 'desc',
        customBodyRender: (value, tableMeta, updateValue) => (<span>{new Date(value.replaceAll('_', ':')).toLocaleString()}</span>)
      }
    },
    { name: "filename", label: "Filename", options: { filter: false, sort: true } },
    {
      name: "action", label: "Restore", options: {
        filter: true, sort: true, checkbox: true,
        customBodyRender: (value, tableMeta, updateValue) => (<Button onClick={() => { updateValue(); restoreBackup(tableMeta.rowData[1]) }} >Restore</Button>)
      }
    },
  ];

  const options = {
    selectableRows: "none",
    responsive: "vertical",
  };

  return (
    <div>
      <MUIDataTable title={<><span className="me-2">Backups</span><Manual title="Backups Manual" pageNumber={57} /></>} data={files} columns={columns} options={options} />
    </div>

  )
}
