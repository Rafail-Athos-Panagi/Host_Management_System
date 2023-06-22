import React, { useEffect } from 'react';
import Modal from './Modal';
import { useState } from 'react';

export default function ModalAutoOpening({ children, close, isClosed }) {

    const [isOpen, setIsOpen] = useState(false);
    useEffect(()=>{
        // console.log(isOpen);
        setIsOpen(true)
        if(close){
            isClosed();
            setIsOpen(false);
        }
    }, [close, isClosed])
    return (
        <>
            <Modal handleClose={() => setIsOpen(false)}
                isOpen={isOpen}>
                {children}
            </Modal>
        </>
    )
}
