import React from 'react';
import mapImage from './map.jpg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';

const MapCard = () => {
    const cardStyle = {
        display: 'flex',
        margin: '8px',
        backgroundColor: '#f18500',
        borderRadius: '16px',
    };

    const imageStyle = {
        width: 200,
        height: '100%',
        objectFit: 'cover',
        margin: '10px',
        borderRadius: '30px'
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
        fontSize: '20pt'
    };

    const tags = ["HeatMap", "Asia"];

    return (
        <Card style={cardStyle}>
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
        </Card>
    );
};

export default MapCard;
