import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Menu, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';
import MapCard from './MapCard';
import SortIcon from '@mui/icons-material/Sort';
import GlobalStoreContext from '../store';

export default function HomeWrapper() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { store } = useContext(GlobalStoreContext);
    const [show, setShow] = useState('All');
    const [cards, setCards] = useState([]);
    const [sortMethod, setSortMethod] = useState('Newest');
    const [mapTypeFilters, setMapTypeFilters] = useState({
        'Choropleth': false,
        'Heatmap': false,
        'Dot Density': false,
        'Graduated Symbol': false,
        'Flow': false,
    });
    const [regionFilters, setRegionFilters] = useState({
        'Americas': false,
        'Europe': false,
        'Africa': false,
        'Asia': false,
        'Australia': false,
    });

    const templateDict = {
        "Choropleth" : "choroplethMap",
        "Heatmap" : "heatMap" ,
        "Dot Density" : "dotDensityMap",
        "Graduated Symbol" : "graduatedSymbolMap",
        "Flow" : "flowMap"
    }
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        store.loadAllIdNamePairs();
    }, []);

    useEffect(() => {
        if (store.idNamePairs) {
            let sortedCards = store.idNamePairs;
            if (sortMethod === 'Newest') {
                sortedCards = [...sortedCards].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
                setCards(sortedCards);
            } 
            else if (sortMethod === 'Most Popular') {
                sortedCards = [...sortedCards].sort((a, b) => b.views - a.views);;;
                setCards(sortedCards);
            } 
            else if (sortMethod === 'Recent Activity') {
                sortedCards = [...sortedCards].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setCards(sortedCards);
            }
        }
    }, [store.idNamePairs])

    useEffect(() => {
        if (store.idNamePairs) {
            let sortedCards = store.idNamePairs;
            // Apply filters
            sortedCards = applyFilters(sortedCards);
            // Apply sorting
            sortedCards = applySorting(sortedCards);
            setCards(sortedCards);
        }
    }, [store.idNamePairs, mapTypeFilters, regionFilters, searchTerm, sortMethod]);

    const applyFilters = (data) => {
        return data.filter((card) => {
            // Check map type filters
            const isMapTypeFiltered =
                Object.keys(mapTypeFilters).every((type) => !mapTypeFilters[type] || card.mapType === templateDict[type]);

            // Check region filters
            const isRegionFiltered =
                Object.keys(regionFilters).every((region) => !regionFilters[region] || card.regions.includes(region));

                const isSearchFiltered =
                searchTerm.trim() === '' ||
                ['title', 'username', 'description'].some(
                    (field) => card[field] && card[field].toLowerCase().includes(searchTerm.toLowerCase().trim())
                );

            return isMapTypeFiltered && isRegionFiltered && isSearchFiltered;
        });
    };

    const applySorting = (data) => {
        switch (sortMethod) {
            case 'Newest':
                return [...data].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
            case 'Most Popular':
                return [...data].sort((a, b) => b.views - a.views);
            case 'Recent Activity':
                return [...data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            default:
                return data;
        }
    };

    let mapCards = "";
    if (cards) {
        mapCards =
            <Grid container spacing={1}>
                {cards.map((pair) => (
                        <Grid item xs={12} sm={6}>
                            <MapCard key={pair._id} idNamePair={pair}/>
                        </Grid>
                    ))}
            </Grid>
    }
    
    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setAnchorEl(null);
    };

    const handleSortSelect = (method) => {
        setSortMethod(method);
        handleSortClose();
    };

    const handleFilterToggle = (filterType, filterName) => {
        if (filterType === 'mapType') {
            setMapTypeFilters((prevFilters) => ({ ...prevFilters, [filterName]: !prevFilters[filterName] }));
        } else if (filterType === 'region') {
            setRegionFilters((prevFilters) => ({ ...prevFilters, [filterName]: !prevFilters[filterName] }));
        }
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    return (
        <div>
            {/* <AppBanner /> */}
            
            <div className='home-div'>
                <input
                    type='text'
                    placeholder='Search'
                    id='home-search-bar'
                    className='searchbar'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
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
                    <MenuItem onClick={() => handleSortSelect('Newest')}>Newest</MenuItem>
                    <MenuItem onClick={() => handleSortSelect('Most Popular')}>
                        Most Popular
                    </MenuItem>
                    <MenuItem onClick={() => handleSortSelect('Recent Activity')}>
                        Recent Activity
                    </MenuItem>
                    <Typography variant="h6" className='home-typography'>
                        Filter by
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', padding: '4px'}}>
                    {Object.keys(mapTypeFilters).map((type) => (
                        <FormControlLabel
                            key={type}
                            control={
                                <Checkbox
                                    checked={mapTypeFilters[type]}
                                    onChange={() => handleFilterToggle('mapType', type)}
                                />
                            }
                            label={type}
                        />
                    ))}
                    {Object.keys(regionFilters).map((region) => (
                        <FormControlLabel
                            key={region}
                            control={
                                <Checkbox
                                    checked={regionFilters[region]}
                                    onChange={() => handleFilterToggle('region', region)}
                                />
                            }
                            label={region}
                        />
                    ))}
                    </Box>
                    
                </Menu>
            </div>
            
            <Box mt={2}>
                {mapCards}
            </Box>
        </div>
    );
}
