import * as React from 'react';
import { useState } from 'react';
import api from '../auth-request-api';
import {
    Button,
    Modal,
    Box,
    TextField,
    Paper,
    Typography,
} from '@mui/material';

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
const customTextFieldStyle2 = {
    width: 280,
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

export default function CreateAccountModal() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleCreateAccount = () => {
        // alert("Creating an account");
        api.registerUser(formData.firstName, formData.lastName, formData.email, formData.username, formData.password, formData.confirmPassword);
    };

    return (
        <Modal open={true}>
            <Paper
                sx={{
                    position: 'absolute',
                    width: 700,
                    height: 600,
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
                    Sign Up
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div>
                            <label htmlFor="firstName" style={{ paddingLeft: '36px' }}>First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="First Name"
                                style={customTextFieldStyle2}
                                onChange={e => {setFormData({...formData, firstName: e.target.value});}}
                            />
                        </div>
                        <div style={{ marginLeft: '12px' }}>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Last Name"
                                style={customTextFieldStyle2}
                                onChange={e => {setFormData({...formData, lastName: e.target.value});}}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <label htmlFor="email" style={{ paddingLeft: '36px' }}>Email:</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Email"
                            style={customTextFieldStyle}
                            onChange={e => {setFormData({...formData, email: e.target.value});}}
                            autocomplete="off"
                        />
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <label htmlFor="username" style={{ paddingLeft: '36px' }}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            style={customTextFieldStyle}
                            onChange={e => {setFormData({...formData, username: e.target.value});}}
                            autocomplete="off"
                        />
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <label htmlFor="password" style={{ paddingLeft: '36px' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            style={customTextFieldStyle}
                            onChange={e => {setFormData({...formData, password: e.target.value});}}
                        />
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <label htmlFor="confirmPassword" style={{ paddingLeft: '36px' }}>Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            style={customTextFieldStyle}
                            onChange={e => {setFormData({...formData, confirmPassword: e.target.value});}}
                        />
                    </div>
                </Box>
                <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={customButtonStyle}
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}
