import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Menu, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';
import MapCard from './MapCard';
import SortIcon from '@mui/icons-material/Sort';
import GlobalStoreContext from '../store';

export default function HomeWrapper() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { store } = useContext(GlobalStoreContext);
    const [show, setShow] = useState('All');
    useEffect(() => {
        store.loadAllIdNamePairs();
    }, []);
    let mapCards = "";
    if (store) {
        mapCards =
            <Grid container spacing={1}>
                {store.idNamePairs.map((pair) => (
                        <Grid item xs={12} sm={6}>
                            <MapCard key={pair._id} idNamePair={pair}/>
                        </Grid>
                    ))}
            </Grid>
    }
    const filters = [];
    const mapTypes = [];
    const regions = [];
    for (let map of store.idNamePairs){
        if(!mapTypes.includes(map.mapType)){
            mapTypes.push(map.mapType);
        }
        for (let region of map.regions){
            if(!regions.includes(region)){
                regions.push(region);
            }
        }
    }
    const checked = [];
    for(let i = 0; i<mapTypes.length+regions.length; i++){
        checked.push(false);
    }
    for(let x = 0; x<mapTypes.length; x++){
        filters.push(<FormControlLabel
            control={<Checkbox />}
            onChange={()=>setChecked(x)}
            label= {mapTypes[x]}
        />)
    }
    for(let y = 0; y<regions.length; y++){
        filters.push(<FormControlLabel
            control={<Checkbox />}
            onChange={()=>setChecked(mapTypes.length+y)}
            label= {regions[y]}
        />)
    }
    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setAnchorEl(null);
    };

    const handleSortOptionClick = (option) => {
        //alert(`Sorting by: ${option}`);
        if(option==='Most Popular'){
            //change mapCards, sort store.idNamePairs by likes before map
            let popSort = store.idNamePairs.sort(function(a, b){return b.likes - a.likes})
            mapCards =
            <Grid container spacing={1}>
                {popSort.map((pair) => (
                        <Grid item xs={12} sm={6}>
                            <MapCard key={pair._id} idNamePair={pair}/>
                        </Grid>
                    ))}
            </Grid>
        }
        else if(option==='Recent Activity'){
            let activitySort = store.idNamePairs.sort(function(a,b){if(b.updatedAt===undefined){b.updatedAt=b.publishedDate}
                if(a.updatedAt===undefined){a.updatedAt=a.publishedDate}
                return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)});
            mapCards =
            <Grid container spacing={1}>
                {activitySort.map((pair) => (
                        <Grid item xs={12} sm={6}>
                            <MapCard key={pair._id} idNamePair={pair}/>
                        </Grid>
                    ))}
            </Grid>
        }
        else {//if(option==='Newest'){ default Newest?
            //change mapCards, sort store.idNamePairs by published Date before map
            let dateSort = store.idNamePairs.sort(function(a, b){return Date.parse(b.publishedDate) - Date.parse(a.publishedDate)})
            mapCards =
            <Grid container spacing={1}>
                {dateSort.map((pair) => (
                        <Grid item xs={12} sm={6}>
                            <MapCard key={pair._id} idNamePair={pair}/>
                        </Grid>
                    ))}
            </Grid>
        }
        
        setAnchorEl(null);
    };
    const setChecked=(index)=>{
        checked[index]=!checked[index];
    }
    const handleFilter=()=>{
        const checkedRegions = [];
        const checkedMapTypes = []; 
        for(let x=0; x<mapTypes.length; x++){
            if(checked[x]){
                checkedMapTypes.push(mapTypes[x]);
            }
        }
        for(let y=mapTypes.length;y<checked.length; y++){
            if(checked[y]){
                checkedRegions.push(regions[y-mapTypes.length])
            }
        }
        var tagFilter = store.idNamePairs.filter(function(map){
            let hasRegion = false;
            for(let region of map.regions){
                if(checkedRegions.includes(region)){
                    hasRegion = true;
                }
            }
            return hasRegion||checkedMapTypes.includes(map.mapType)
        })
        store.idNamePairs=tagFilter;
        mapCards =
        <Grid container spacing={1}>
            {tagFilter.map((pair) => (
                    <Grid item xs={12} sm={6}>
                        <MapCard key={pair._id} idNamePair={pair}/>
                    </Grid>
                ))}
        </Grid>
        setShow('filter');
        setAnchorEl(null);
    }
    
    
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
                    {filters}
                    <Button variant="outlined" className='home-button' onClick={() => handleFilter()}>Filter</Button>
                </Menu>
            </div>
            
            <Box mt={2}>
                {mapCards}
            </Box>
        </div>
    );
}
