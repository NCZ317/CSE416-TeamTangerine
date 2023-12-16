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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const { myMap, idNamePair } = props;
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };

  const handlePublish = () => {
    store.publish(idNamePair._id);
    store.loadIdNamePairs();
    handleClose2();
  }

  const handleEditDetails = () => {
    setEditDetailsModalOpen(true);
    handleClose2();
  };

  const handleDeleteMap = () => {
    console.log("DELETE MAP");
    store.markMapForDeletion(idNamePair._id);
    setDeleteMapModalOpen(true);
    handleClose2();
  };

  const handleEditGraphics = async () => {
    // store.setScreen("MAP_EDITOR");
    console.log("MAP ID: " + idNamePair._id);
    await store.setCurrentMap(idNamePair._id);

    store.setScreen("MAP_EDITOR");
    handleClose2();
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
  let imageURL = "";
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
      imageURL = pair.imageURL;
      console.log(imageURL);
    }
  }

  let editModal = "";
  if (myMap) {
    editModal = <EditDetailsModal idNamePair={idNamePair} open={isEditDetailsModalOpen} onClose={handleEditDetailsModalClose} />;
  }

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setThumbnailFile(file);
    
    if (file) {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        try {
          // Get the image data
          const imageDataUrl = e.target.result;
          
          // Create an image element
          const img = new Image();
          img.src = imageDataUrl;
  
          img.onload = () => {
            // Ensure the file is an image
            if (img.width === 0 || img.height === 0) {
              console.error('Invalid image file');
              return;
            }
  
            // Create a canvas for image manipulation
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
  
            // Calculate the cropping dimensions to achieve a 1:1 aspect ratio
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
  
            // Set canvas dimensions to achieve a fixed size (500x500)
            canvas.width = 500;
            canvas.height = 500;
  
            // Crop the image
            context.drawImage(img, x, y, size, size, 0, 0, 500, 500);
  
            // Convert the canvas content to a data URL (JPEG format)
            const croppedImageDataUrl = canvas.toDataURL('image/jpeg');
  
            // Convert the data URL to a Blob
            const blob = dataURItoBlob(croppedImageDataUrl);
  
            // Create a new File with the Blob and original file name
            const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
            console.log(croppedFile);
            // Upload the cropped thumbnail
            store.uploadThumbnail(croppedFile, idNamePair._id);
          };
        } catch (error) {
          console.error('Error processing image:', error.message);
        }
      };
  
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  
    handleClose2();
  };
  
  // Function to convert data URI to Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: 'image/jpeg' });
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
            {idNamePair.published ? (
              <MenuItem onClick={(event) => { event.stopPropagation(); handleDeleteMap(); }}>Delete</MenuItem>
            ) : (
              <>
                <MenuItem onClick={(event) => { event.stopPropagation(); handlePublish(); }}>Publish</MenuItem>
                <MenuItem onClick={(event) => { event.stopPropagation(); handleEditDetails(); }}>Edit Details</MenuItem>
                <MenuItem onClick={(event) => { event.stopPropagation(); handleEditGraphics(); }}>Edit Graphics</MenuItem>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-thumbnail-input"
                    onChange={handleThumbnailChange}

                    onClick={(event) => {event.stopPropagation();}}
                  />
                  <label htmlFor="upload-thumbnail-input">
                    <MenuItem component="div" onClick={(event) => {event.stopPropagation();}}>
                      Upload Thumbnail
                    </MenuItem>
                  </label>
                <MenuItem onClick={(event) => { event.stopPropagation(); handleDeleteMap(); }}>Delete</MenuItem>
              </>
            )}
          </Menu>

        </>
      )}
      <Box className ='map-card-box'>
        <CardMedia component="img" src={imageURL} alt={mapImage} className='map-card-image' />
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
