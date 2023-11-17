// LoginModal.js
import React, { useState, useContext } from 'react';
import AuthContext from '../auth';
import {
  Button,
  Modal,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import CreateAccountModal from './CreateAccountModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ErrorModal from './ErrorModal';

export default function LoginModal({ open, onClose }) {
  const { auth } = useContext(AuthContext);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth.loginUser(email, password);
    onClose();
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    onClose();
  };

  const handleSignUp = () => {
    setShowCreateAccountModal(true);
    onClose();
  };

  let modalJSX = "";
  if (auth.errorMessage) {
      modalJSX = <ErrorModal/>
  }

  return (
    <>
      <Modal open={open} onClose={onClose} id="login-modal">
        <Paper id="login-modal-paper">
          <Typography variant="h3" gutterBottom className="modal-title">
            Login
          </Typography>
          <Box className="login-inputs">
            <div>
              <label htmlFor="email" className='create-account-label'>Email:</label>
              <input
                type="text"
                id="email"
                placeholder="Email"
                className="login-textfield"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='login-row'>
              <label htmlFor="password" className='create-account-label'>Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="login-textfield"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Box>
          <Box className="forgot-password">
            <span
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </span>
          </Box>
          <Box className="login-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignUp}
              className="login-button"
              id='sign-up-button'
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              className='login-button'
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Modal>
      {showCreateAccountModal && (
        <CreateAccountModal
          open={showCreateAccountModal}
          onClose={() => setShowCreateAccountModal(false)}
        />
      )}
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          open={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
      {modalJSX}
    </>
  );
}
