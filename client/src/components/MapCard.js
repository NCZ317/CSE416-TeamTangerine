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
    /* if (store.currentScreen === "HOME") {
      store.setScreen("MAP_POST");
    } */
  }

  const tags = ['HeatMap', 'Asia'];

  return (
    <Card className='map-card' onClick={handleCardClick}>
      {myMap && (
        <>
          <IconButton
            id='map-card-icon-button'
            aria-label="more"
            onClick={handleClick}
          >
            <MoreHorizIcon className='create-map-cloud-icon' />
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
      <Box className ='map-card-box'>
        <CardMedia component="img" src={mapImage} alt="Map Graphic" className='map-card-image' />
        <div className='map-card-counter'>
          <Box className='map-card-box-2'>
            <FavoriteIcon className='map-card-favorite-icon' />
            <Typography variant="body2">70</Typography>
          </Box>
          <Box className='map-card-box-2'>
            <ChatBubbleOutlinedIcon className='map-card-favorite-icon' />
            <Typography variant="body2">12</Typography>
          </Box>
          <Box className='map-card-box-2'>
            <VisibilityOutlinedIcon className='map-card-favorite-icon' />
            <Typography variant="body2">123</Typography>
          </Box>
        </div>
      </Box>
      <CardContent id='map-card-content'>
        <div>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              color="primary"
              size="small"
              id='map-card-chip'
            />
          ))}
        </div>
        <Typography variant="h3" className='map-card-typography'>
          Title
        </Typography>
        <Typography variant="h6" className='map-card-typography'>
          Author: User1
        </Typography>
        <Typography variant="body1" className='map-card-typography-2'>
          Map of Asia
        </Typography>
      </CardContent>
      <EditDetailsModal open={isEditDetailsModalOpen} onClose={handleEditDetailsModalClose} />
      <DeleteMapModal open={isDeleteMapModalOpen} onClose={handleDeleteMapModalClose} />
    </Card>
  );
};

export default MapCard;
