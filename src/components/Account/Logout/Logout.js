import React from 'react'
import "./Logout.css"
import ModalAutoOpening from '../../UI/Modal/ModalAutoOpening';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
const Logout = ({handleLogout}) => {
  const [closeModal, setCloseModal] = React.useState(true);
  const navigate = useNavigate();

  const handler = () => {
    const request = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      redirect: 'follow'
    };

    fetch(`/api/auth/logout`, request);
    handleLogout();
    navigate("/login");
  };



  return (
        <ModalAutoOpening
          close={closeModal}
          isClosed={() => setCloseModal(false)}
        >
          <div >
            <div className="title">Are you sure you want to log out?</div>
            <div className='button-container-logout'>
              <div>
                <Button id="yes-btn" variant="contained" color='success' onClick={handler} sx={{width: "100px"}}>Yes</Button>
                <Button variant="contained" color='error' sx={{width: "100px"}} onClick={()=>navigate(-1)}>No</Button>
              </div>
            </div>
          </div>
        </ModalAutoOpening>
  );
}

export default Logout
