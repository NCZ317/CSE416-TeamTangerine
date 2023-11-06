import * as React from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    Paper,
    Typography,
} from '@mui/material';
import ForgotPasswordModal from './ForgotPasswordModal';

const customTextFieldStyle = {
    width: 600,
    height: 40,
    display: 'block',
    margin: '0 auto',
    borderRadius: 24,
    backgroundColor: '#d9d9d9',
    color: '#000',
    outline: 'none',
    border: 'none',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 6,
};

const customButtonStyle = {
    width: '24%',
    height: 40,
    borderRadius: 24,
    backgroundColor: '#79c200',
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'none',
};

export default function LoginModal() {
    const handleLogin = () => {
        alert("Logging In");
    };

    const handleForgotPassword = () => {
        alert("Forgot Password clicked");
    };

    return (
        <Modal open={true}>
            <Paper
                sx={{
                    position: 'absolute',
                    width: 700,
                    height: 350,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '16px',
                }}
            >
                <Typography variant="h3" gutterBottom style={{ textAlign: 'center' }}>
                    Login
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <label htmlFor="email" style={{ paddingLeft: '36px' }}>Email:</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Email"
                            style={customTextFieldStyle}
                        />
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <label htmlFor="password" style={{ paddingLeft: '36px' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            style={customTextFieldStyle}
                        />
                    </div>
                </Box>
                <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', paddingLeft: '36px' }}>
                    <span
                        style={{
                            fontSize: 12,
                            marginLeft: '36px',
                            color: '#f28500',
                            cursor: 'pointer',
                        }}
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </span>
                    <Box sx={{ marginLeft: 'auto' }} />
                </Box>
                <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={customButtonStyle}
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        style={customButtonStyle}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}
