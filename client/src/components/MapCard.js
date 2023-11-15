import React, { useState, useContext } from 'react';
import mapImage from './map.jpg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditDetailsModal from './EditDetailsModal';
import DeleteMapModal from './DeleteMapModal'

import { GlobalStoreContext } from '../store';

const MapCard = ({ myMap }) => {
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const [isDeleteMapModalOpen, setDeleteMapModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditDetails = () => {
    setEditDetailsModalOpen(true);
    handleClose();
  };

  const handleDeleteMap = () => {
    setDeleteMapModalOpen(true);
    handleClose();
  };

  const handleEditGraphics = () => {
    store.setScreen("MAP_EDITOR");
    handleClose();
  };

  const handleEditDetailsModalClose = () => {
    setEditDetailsModalOpen(false);
  };

  const handleDeleteMapModalClose = () => {
    setDeleteMapModalOpen(false);
  };


  //NEED TO MODIFY LATER ON --> OPEN MAP_POST IF MAP IS ONLY PUBLISHED
  const handleCardClick = () => {
    if (store.currentScreen === "HOME") {
      store.setScreen("MAP_POST");
    }
  }

  const cardStyle = {
    cursor: 'pointer',
    display: 'flex',
    margin: '8px',
    backgroundColor: '#f18500',
    borderRadius: '16px',
    position: 'relative', // Added for positioning the IconButton
  };

  const imageStyle = {
    width: 200,
    height: '100%',
    objectFit: 'cover',
    margin: '10px',
    borderRadius: '30px',
  };

  const counterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#A85821',
    marginBottom: '8px',
    marginLeft: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontSize: '20pt',
  };

  const tags = ['HeatMap', 'Asia'];

  return (
    <Card style={cardStyle} onClick={handleCardClick}>
      {myMap && (
        <>
          <IconButton
            style={{ position: 'absolute', top: '12px', right: '12px', color: '#A85821' }}
            aria-label="more"
            onClick={handleClick}
          >
            <MoreHorizIcon fontSize='large' />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleClose}>Publish</MenuItem>
            <MenuItem onClick={handleEditDetails}>Edit Details</MenuItem>
            <MenuItem onClick={handleEditGraphics}>Edit Graphics</MenuItem>
            <MenuItem onClick={handleDeleteMap}>Delete</MenuItem>
          </Menu>
        </>
      )}
      <Box display="flex" flexDirection="column">
        <CardMedia component="img" src={mapImage} alt="Map Graphic" style={imageStyle} />
        <div style={counterStyle}>
          <Box display="flex" alignItems="center">
            <FavoriteIcon fontSize="20pt" />
            <Typography variant="body2">70</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <ChatBubbleOutlinedIcon fontSize="20pt" />
            <Typography variant="body2">12</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <VisibilityOutlinedIcon fontSize="20pt" />
            <Typography variant="body2">123</Typography>
          </Box>
        </div>
      </Box>
      <CardContent style={{ textAlign: 'left', marginLeft: '8px' }}>
        <div>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              color="primary"
              size="small"
              style={{ marginRight: '5px', marginBottom: '5px', backgroundColor: '#79C200' }}
            />
          ))}
        </div>
        <Typography variant="h3" style={{ fontWeight: 'bold', color: '#542C11', marginBottom: '10px' }}>
          Title
        </Typography>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#542C11', marginBottom: '10px' }}>
          Author: User1
        </Typography>
        <Typography variant="body1" style={{ color: '#542C11', marginBottom: '10px' }}>
          Map of Asia
        </Typography>
      </CardContent>
      <EditDetailsModal open={isEditDetailsModalOpen} onClose={handleEditDetailsModalClose} />
      <DeleteMapModal open={isDeleteMapModalOpen} onClose={handleDeleteMapModalClose} />
    </Card>
  );
};

export default MapCard;
