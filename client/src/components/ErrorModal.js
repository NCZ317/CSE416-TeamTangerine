
import { useContext, useState } from 'react';
import AuthContext from '../auth';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/HighlightOff';

export default function ErrorModal() {
    const { auth } = useContext(AuthContext);

    return (
        <Modal open={auth.errorMessage !== ""}>

            <Box id = "error-modal">
                <Alert
                id = "error-alert"
                variant='outlined'
                severity='warning' 
                action={
                    <Button
                    id = "error-button"
                    onClick={() => {
                        auth.hideModal();
                    }}
                    >
                        <CloseIcon className='font-size-twenty-four'/>
                    </Button>}
                >
                    <AlertTitle className='bold-font'>Sorry</AlertTitle>
                    <div className='font-size-eighteen'>
                        {auth.errorMessage}
                    </div>
                </Alert>
            </Box>

        </Modal>

    );

}

