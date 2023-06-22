import React, { useEffect, useRef } from "react";
import ReactPortal from "./ReactPortal";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";
import CloseIcon from '@mui/icons-material/Close';

export default function Modal({ children, isOpen, handleClose }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <CSSTransition
        in={isOpen}
        timeout={{ entry: 0, exit: 300 }}
        unmountOnExit
        classNames="modal"
        nodeRef={nodeRef}
      >
        <div className="modal" ref={nodeRef}>
          <div className="modal-content">
            <div style={{position:"absolute",right:"30px", top:"10px"}}>
              <CloseIcon fontSize="large" onClick={handleClose}/>
            </div>
            {children}
          </div>
        </div>
      </CSSTransition>
    </ReactPortal>
  );
}
