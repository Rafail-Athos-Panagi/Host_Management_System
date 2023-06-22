import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import "./ChildModal.css";



export default function ChildModal(props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 200,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    const [open, setOpen] = useState(false);


    useEffect(() => {
        setOpen(props.shouldOpen);
    }, [props.shouldOpen])

    const handleClose = () => {
        setOpen(false);
    };

    const handleNo = () => {
        setOpen(false);
        props.resetOpenModal();
    };

    const handleYes = () => {
        setOpen(false);
        props.databaseHandler();
    };

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 800, height: 500, overflow: 'auto' }} className='child-modal-contents'>
                    <h2 >{props.message}</h2>
                    {Object.entries(props.informationObject).map(([key, value], index) => (
                        <React.Fragment key={key}>
                            <span className='child-modal-contents' style={{ display: 'inline-block', width: '50%', marginBottom: "30px" }}>
                                {key}: {value}
                            </span>
                            {index % 2 === 1 && <br />}
                        </React.Fragment>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                        <Button onClick={handleNo} sx={{ marginRight: 5 }} variant="outlined" color="error">Cancel</Button>
                        <Button onClick={handleYes} variant="contained" color="success">Confirm changes</Button>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}
