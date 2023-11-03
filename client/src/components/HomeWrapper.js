import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import AppBanner from './AppBanner';
import MapCard from './MapCard';
import SortIcon from '@mui/icons-material/Sort';

const searchbarStyle = {
    backgroundColor: '#F6A440',
    color: '#fff',
    padding: '12px 16px',
    border: 'none',
    width: '95%',
    height: '24px'
};

const buttonStyle = {
    color: '#79C200',
    border: 'none',
    width: '5%',
    height: '49px'
};

export default function HomeWrapper() {
    return (
        <div>
            <AppBanner />
            
            <div style={{ display: 'flex'}}>
                <input type="text" placeholder="Search" style={searchbarStyle} className="searchbar" />
                <Button
                    variant="text"
                    color="primary"
                    startIcon={<SortIcon />}
                    style={buttonStyle}
                />
            </div>
            
            <Box mt={2}>
                <Grid container spacing={1}>
                    {[1, 2, 3, 4, 5, 6].map((cardId) => (
                        <Grid item key={cardId} xs={12} sm={6}>
                            <MapCard />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
}
