// CreateAccountModal.js
import React, { useState, useContext } from 'react';
import AuthContext from '../auth';
import {
  Button,
  Modal,
  Box,
  Paper,
  Typography,
} from '@mui/material';

export default function CreateAccountModal({ open, onClose }) {
  const { auth } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleCreateAccount = () => {
    auth.registerUser(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.username,
      formData.password,
      formData.confirmPassword
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="create-account-modal">
      <Paper id="create-account-paper">
        <Typography variant="h3" gutterBottom className="modal-title">
          Sign Up
        </Typography>
        <Box className="create-account-box">
          <div className="name-inputs">
            <div>
              <label className='create-account-label' htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                className="custom-text-field"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className='create=account-row'>
              <label className='create-account-label' htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                className="custom-text-field"
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className='create=account-row'>
            <label className='create-account-label' htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              placeholder="Email"
              className="custom-long-text-field"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className='create=account-row'>
            <label className='create-account-label' htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="custom-long-text-field"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className='create=account-row'>
            <label className='create-account-label' htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="custom-long-text-field"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className='create=account-row'>
            <label className='create-account-label' htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              className="custom-long-text-field"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>
        </Box>
        <Box className="register-button-container">
          <Button
            variant="contained"
            id="create-account-button"
            className="custom-button"
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
