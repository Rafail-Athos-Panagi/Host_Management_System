import React, { useEffect } from 'react';
import Modal from './Modal';
import { useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function ModalButton({ children, name, close, isClosed }) {

    const [isOpen, setIsOpen] = useState(false);
    useEffect(()=>{
        if(close){
            isClosed();
            setIsOpen(false);
        }
    }, [close, isClosed])
    return (
        <>
            <Button startIcon={<AddIcon/>} variant="contained" onClick={() => {
                setIsOpen(true);
            }} >
                {name}
            </Button>
            <Modal handleClose={() => {setIsOpen(false);isClosed()}}
                isOpen={isOpen}>
                {children}
            </Modal>
        </>
    )
}
