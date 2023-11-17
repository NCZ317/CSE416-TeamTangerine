
import { useContext, useState } from 'react';
import AuthContext from '../auth';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/HighlightOff';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', 
    maxWidth: 500, 
    bgcolor: 'lightyellow',
    borderRadius: 8, 
    boxShadow: 24,
    p: 2, 
};

export default function ErrorModal() {
    const { auth } = useContext(AuthContext);

    return (
        <Modal open={auth.errorMessage !== ""}>

            <Box sx={style}>
                <Alert
                sx={{ fontSize: 18, fontWeight: 'bold', borderRadius: 8 }}
                variant='outlined'
                severity='warning' 
                action={
                    <Button
                    sx={{padding: 4, color: 'black'}}
                    onClick={() => {
                        auth.hideModal();
                    }}
                    >
                        <CloseIcon sx={{fontSize: 24}}/>
                    </Button>}
                >
                    <AlertTitle sx={{fontWeight: 'bold'}}>Sorry</AlertTitle>
                    {auth.errorMessage}
                </Alert>
            </Box>

        </Modal>

    );

}

