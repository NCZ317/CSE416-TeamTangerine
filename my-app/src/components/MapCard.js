import React from 'react';
import mapImage from './map.jpg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const MapCard = () => {
    const cardStyle = {
        borderRadius: '25px',
        display: 'flex',
        margin: '20px',
        padding: '10px',
        backgroundColor: '#f18500',
        height: '250px',
    };

    const imageStyle = {
        marginRight: '35px',
        borderRadius: '25px',
        height: '100%',
        objectFit: 'cover', 
    };

    const counterStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        color: '#a85920',
        textShadow: "0px  0px  1px  black"
    };

    const detailsStyle = {
        flex: '2',
    };

    const tagsStyle = {
        marginBottom: '10px',
        marginTop: '10px'
    };
    const tags = ["HeatMap", "Asia"];
    return (
        <div style={cardStyle}>
            <div style={imageStyle}>
                <img src={mapImage} alt="Map Graphic" style={{
                    flex: '1',
                    marginRight: '20px',
                    marginLeft: '20px',
                    borderRadius: '25px',
                    height: '85%',
                    objectFit: 'cover', 
                }} />
                <div style={counterStyle}>
                    <span><FavoriteIcon/> 0</span>
                    <span><ChatBubbleOutlinedIcon/> 0</span>
                    <span><VisibilityOutlinedIcon/> 0</span>
                </div>
            </div>
            <div style={detailsStyle}>
                <div style={tagsStyle}>
                    {tags.map((tag, index) => (
                        <span key={index} style={{ backgroundColor: 'lightblue', padding: '5px', marginRight: '5px' }}>
                            {tag}
                        </span>
                    ))}
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '60px', color: '#ad591b' }}>Title</div>
                <div style={{ fontWeight: 'bold', marginBottom: '10px',fontSize: '20px',  marginLeft: '10px', color: '#ad591b' }}>Author: User1</div>
                <div style={{ marginBottom: '10px',fontSize: '16px',  marginLeft: '10px', color: '#ad591b' }}> Map of Asia </div>
            </div>
        </div>
    );
};
export default MapCard