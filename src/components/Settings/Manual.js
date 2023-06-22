import React from 'react';
import UserManual from '../../Pages.pdf';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from '@mui/material';

export default function Manual(props) {

    
    const handleOpenPdf = () => {
        const url = `${UserManual}#page=${props.pageNumber}`;
        window.open(url, '_blank');
    }
    
  return (
            <Tooltip title={props.title}><HelpOutlineIcon onClick={handleOpenPdf} sx={{cursor:"pointer"}}/></Tooltip>
    )
}
