import { Button, TextField } from '@mui/material';
import React from 'react'
import Swal from 'sweetalert2';

export default function EditOrder({ handleClose, editValues, refresh }) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [arrivalDate, setArrivalDate] = React.useState(null)

  const addToDatabase = async () => {
    const formData = new FormData();
    if (selectedFile !== null) {
      formData.set('image', selectedFile);
      formData.set('imageName', selectedFile.name);
    }
    formData.set('orderID', editValues);
    formData.set('arrivalDate', arrivalDate);

    try {
      const request = {
        method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

        body: formData
      };

      const res = await fetch(`/api/update-order`, request);
      if(res.sqlMessage) 
        Swal.fire({
          title: 'Error!',
          text: res.sqlMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      else
        Swal.fire({
          title: 'Success!',
          text: 'Order updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      refresh();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h2>Upload invoice and set arrival date</h2>
      <hr/>
      <label htmlFor="btn-upload">
        <input
          id="btn-upload"
          name="btn-upload"
          style={{ display: 'none' }}
          type="file"
          accept="image/*, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .doc, .docx"
          onChange={e => setSelectedFile(e.target.files[0])} />
        <Button
          className="btn-choose"
          variant="outlined"
          component="span" >
          Choose File
        </Button>
      </label>
      <div className="file-name">
        {selectedFile ? selectedFile.name : null}
      </div>
      <br />
      <TextField
        id="outlined-controlled"
        type="datetime-local"
        required={true}
        label="Enter arrival date"
        InputLabelProps={{ shrink: true }}
        onChange={e => setArrivalDate(e.target.value)}
        onBlur={e => setArrivalDate(e.target.value)}
      />
      <br />
      <Button onClick={()=>handleClose()}>
        Cancel
      </Button>
      <Button
        className="btn-upload"
        color="primary"
        variant="contained"
        component="span"
        disabled={!(selectedFile || arrivalDate)}
        onClick={addToDatabase}>
        Upload
      </Button>

      {selectedFile && (
        <div>
          <img className="preview my20" src={selectedFile} alt="" />
        </div>
      )}

      {/* {message && (
      <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
        {message}
      </Typography>
    )}

    <Typography variant="h6" className="list-header">
      List of Images
      </Typography>
    <ul className="list-group">
      {imageInfos &&
        imageInfos.map((image, index) => (
          <ListItem
            divider
            key={index}>
            <img src={image.url} alt={image.name} height="80px" className="mr20" />
            <a href={image.url}>{image.name}</a>
          </ListItem>
        ))}
    </ul> */}
    </div >
  )
}
