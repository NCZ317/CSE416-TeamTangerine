import React, { useState } from 'react';
import { Box, Button, Grid, Menu, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';
import MapCard from './MapCard';
import SortIcon from '@mui/icons-material/Sort';

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
            
            <div className='home-div'>
                <input type="text" placeholder="Search" id = "home-search-bar" className="searchbar" />
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleSortClick}
                    className='home-button'
                    id='sort-filter-button'
                >
                    <SortIcon id='home-sort-icon'/>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleSortClose}
                    id='sort-filter-menu'
                >
                    <Typography variant="h6" className='home-typography'>Sort By</Typography>
                    <MenuItem onClick={() => handleSortOptionClick('Most Popular')}>Most Popular</MenuItem>
                    <MenuItem onClick={() => handleSortOptionClick('Newest')}>Newest</MenuItem>
                    <MenuItem onClick={() => handleSortOptionClick('Recent Activity')}>Recent Activity</MenuItem>
                    <Typography variant="h6" className='home-typography'>Filter by</Typography>
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
