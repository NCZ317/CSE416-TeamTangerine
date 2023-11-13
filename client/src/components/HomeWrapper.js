import React, { useState } from 'react';
import { Box, Button, Grid, Menu, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';
import AppBanner from './AppBanner';
import MapCard from './MapCard';
import SortIcon from '@mui/icons-material/Sort';
import LoginModal from './LoginModal';

const searchbarStyle = {
    backgroundColor: '#F6A440',
    color: '#fff',
    padding: '12px 16px',
    border: 'none',
    width: '95%',
    height: '24px',
};

const buttonStyle = {
    color: '#79C200',
    border: 'none',
    width: '5%',
    height: '49px',
};

export default function HomeWrapper() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setAnchorEl(null);
    };

    const handleSortOptionClick = (option) => {
        //alert(`Sorting by: ${option}`);
        setAnchorEl(null);
    };

    return (
        <div>
            {/* <AppBanner /> */}
            
            <div style={{ display: 'flex'}}>
                <input type="text" placeholder="Search" style={searchbarStyle} className="searchbar" />
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleSortClick}
                    style={buttonStyle}
                    id='sort-filter-button'
                >
                    <SortIcon style={{ height: '100%', width: '56px' }}/>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleSortClose}
                    id='sort-filter-menu'
                >
                    <Typography variant="h6" style={{marginLeft: '8px'}}>Sort By</Typography>
                    <MenuItem onClick={() => handleSortOptionClick('Most Popular')}>Most Popular</MenuItem>
                    <MenuItem onClick={() => handleSortOptionClick('Newest')}>Newest</MenuItem>
                    <MenuItem onClick={() => handleSortOptionClick('Recent Activity')}>Recent Activity</MenuItem>
                    <Typography variant="h6" style={{marginLeft: '8px'}}>Filter by</Typography>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Filter 1"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Filter 2"
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Filter 3"
                    />
                </Menu>
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
