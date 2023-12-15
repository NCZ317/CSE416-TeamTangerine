import React, { useState, useContext } from 'react';
import mapImage from './map.jpg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditDetailsModal from './EditDetailsModal';
import DeleteMapModal from './DeleteMapModal'
import { useNavigate } from 'react-router-dom';

import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';

function MapCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const [isDeleteMapModalOpen, setDeleteMapModalOpen] = useState(false);
  const { myMap, idNamePair } = props;
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePublish = () => {
    store.publish(idNamePair._id);
    store.loadIdNamePairs();
    handleClose();
  }

  const handleEditDetails = () => {
    setEditDetailsModalOpen(true);
    handleClose();
  };

  const handleDeleteMap = () => {
    console.log("DELETE MAP");
    store.markMapForDeletion(idNamePair._id);
    setDeleteMapModalOpen(true);
    handleClose();
  };

  const handleEditGraphics = async () => {
    // store.setScreen("MAP_EDITOR");
    console.log("MAP ID: " + idNamePair._id);
    await store.setCurrentMap(idNamePair._id);

    store.setScreen("MAP_EDITOR");
    handleClose();
  };

  const handleEditDetailsModalClose = () => {
    setEditDetailsModalOpen(false);
  };

  const handleDeleteMapModalClose = () => {
    setDeleteMapModalOpen(false);
  };


  
  const handleCardClick = async () => {
    if (props.idNamePair.published) {
      console.log(idNamePair);
      await store.setCurrentMap(idNamePair._id);
      await store.view(idNamePair._id);
      await auth.viewUser(idNamePair.email);
      navigate("/post/" + idNamePair._id);
    }
    else handleEditGraphics();
  }
  let title = "Title"
  let author = "Author"
  let description = "A Map";
  let tags = ['HeatMap', 'Asia'];
  let likes = 0;
  let comments = 0;
  let views = 0;
  if (props) {
    if (idNamePair) {
      let pair = idNamePair;
      title = pair.title;
      author = pair.username;
      description = pair.description;
      tags = [pair.mapType, ...pair.regions];
      likes = pair.likes;
      comments = pair.comments.length;
      views = pair.views;
    }
  }

  let editModal = "";
  if (myMap) {
    editModal = <EditDetailsModal idNamePair={idNamePair} open={isEditDetailsModalOpen} onClose={handleEditDetailsModalClose} />;
  }

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
            <MenuItem onClick={(event) => { event.stopPropagation(); handlePublish(); }}>Publish</MenuItem>
            <MenuItem onClick={(event) => { event.stopPropagation(); handleEditDetails(); }}>Edit Details</MenuItem>
            <MenuItem onClick={(event) => { event.stopPropagation(); handleEditGraphics(); }}>Edit Graphics</MenuItem>
            <MenuItem onClick={(event) => { event.stopPropagation(); handleDeleteMap(); }}>Delete</MenuItem>
          </Menu>

        </>
      )}
      <Box className ='map-card-box'>
        <CardMedia component="img" src={mapImage} alt="Map Graphic" className='map-card-image' />
        <div className='map-card-counter'>
          <Box className='map-card-box-2'>
            <FavoriteIcon className='map-card-favorite-icon' />
            <Typography variant="body2">
              {likes}
            </Typography>
          </Box>
          <Box className='map-card-box-2'>
            <ChatBubbleOutlinedIcon className='map-card-favorite-icon' />
            <Typography variant="body2">{comments}</Typography>
          </Box>
          <Box className='map-card-box-2'>
            <VisibilityOutlinedIcon className='map-card-favorite-icon' />
            <Typography variant="body2">{views}</Typography>
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
          {title}
        </Typography>
        <Typography variant="h6" className='map-card-typography'>
          By: {author}
        </Typography>
        <Typography variant="body1" className='map-card-typography-2'>
          {description}
        </Typography>
      </CardContent>
      {editModal}
      <DeleteMapModal open={isDeleteMapModalOpen} onClose={handleDeleteMapModalClose} />
    </Card>
  );
};

export default MapCard;
