import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Box, ButtonBase, Card, CardContent, Grid, InputAdornment, OutlinedInput, Popper, MenuItem, TextField } from '@material-ui/core';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from '../../../../ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { SET_CITY, SET_SEARCH, SET_TWEETS } from '../../../../store/actions';

import axios from 'axios';

import configData from '../../../../config';

// style constant
const useStyles = makeStyles((theme) => ({
    searchControl: {
        width: '434px',
        marginLeft: '16px',
        paddingRight: '16px',
        paddingLeft: '16px',
        '& input': {
            background: 'transparent !important',
            paddingLeft: '5px !important'
        },
        [theme.breakpoints.down('lg')]: {
            width: '250px'
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginLeft: '4px',
            background: '#fff'
        }
    },
    startAdornment: {
        fontSize: '1rem',
        color: theme.palette.grey[500]
    },
    headerAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        background: theme.palette.primary.light,
        color: theme.palette.primary.dark,
        '&:hover': {
            background: theme.palette.primary.dark,
            color: theme.palette.primary.light
        }
    },
    closeAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        background: theme.palette.orange.light,
        color: theme.palette.orange.dark,
        '&:hover': {
            background: theme.palette.orange.dark,
            color: theme.palette.orange.light
        }
    },
    popperContainer: {
        zIndex: 1100,
        width: '99%',
        top: '-55px !important',
        padding: '0 12px',
        [theme.breakpoints.down('sm')]: {
            padding: '0 10px'
        }
    },
    cardContent: {
        padding: '12px !important'
    },
    card: {
        background: '#fff',
        [theme.breakpoints.down('sm')]: {
            border: 0,
            boxShadow: 'none'
        }
    }
}));

const status = [
    {
        value: 'Philadelphia',
        label: 'Philadelphia'
    },
    {
        value: 'Tucson',
        label: 'Tucson'
    },
    {
        value: 'Tampa',
        label: 'Tampa'
    },
    {
        value: 'Indianapolis',
        label: 'Indianapolis'
    },
    {
        value: 'Nashville',
        label: 'Nashville'
    }
];

//Philadelphia: long: -75.153534, lat: 39.91276, zoom: 12.00
//Tuscon : long: -110.9357, lat: 32.2064, zoom: 11.45
//Tampa: long: -82.4644, lat: 27.9590, zoom: 12.00
//Indianapolis: long: -86.1555, lat 39.7634, zoom: 12.00
//Nashville: Longitude: -86.7843 | Latitude: 36.1361 | Zoom: 11.93

const getCoords = (city) => {
    switch(city){
        case "Philadelphia": {
            return {lat: 39.91276, long: -75.153534, zoom: 12.00}
        }
        case "Tucson": {
            return {lat: 32.2064, long: -110.9357, zoom: 12.00}
        }
        case "Tampa": {
            return {lat: 27.9590, long: -82.4644, zoom: 12.00}
        }
        case "Indianapolis": {
            return {lat: 39.7634, long: -86.1555, zoom: 12.00}
        }
        case "Nashville": {
            return {lat: 36.1361, long: -86.7843, zoom: 12.00}
        }
    }

}


//-----------------------|| SEARCH INPUT ||-----------------------//

const SearchSection = () => {
    const classes = useStyles();
    const [value, setValue] = useState('Philadelphia');
    const [searchval, setSearchVal] = useState('');
    //const cityName = useSelector((state)=> state.main.cityName);
    const dispatcher = useDispatch();
    const [searchvalOnEnter, setSearchValOnEnter] = useState('');

    const change = (name) =>{
        let vals = getCoords(name) 
        dispatcher({
            type: SET_CITY,
            payload: { lat: vals.lat, long: vals.long, zoom:vals.zoom, cityName: name }
        });
        setValue(name);
    }

    const handleSubmit = () => {
        console.log('We are here');
        axios
            .get( configData.API_SERVER + 'search?query='+searchval+'&city='+value, {}, { headers: {} })
            .then(function (response) {
                console.log(response)
                if(response.data && response.data.length > 0 && response.data[response.data.length - 1].hasOwnProperty('tweets')){
                    let tweets = []
                    for(let i = 0; i < response.data[response.data.length - 1].tweets.length; i++){
                        if(response.data[response.data.length - 1].tweets[i] != ""){
                            tweets.push(response.data[response.data.length - 1].tweets[i])
                        }
                    }
                    response.data.pop()//Remove from search results so that SET_SEARCH DISPATCHER doesn't break
                    dispatcher({
                        type: SET_TWEETS,
                        payload: {data: tweets}
                    })
                }
               dispatcher({
                   type: SET_SEARCH,
                   payload: {data: response.data}
               })
            })
            .catch(function (error) {
                console.log('error - ', error);
            });
    };

    return (
        <React.Fragment>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                        <React.Fragment>
                            <Box
                                sx={{
                                    ml: 2
                                }}
                            >
                                <ButtonBase sx={{ borderRadius: '12px' }}>
                                    <Avatar variant="rounded" className={classes.headerAvatar} {...bindToggle(popupState)}>
                                        <IconSearch stroke={1.5} size="1.2rem" />
                                    </Avatar>
                                </ButtonBase>
                            </Box>
                            <Popper {...bindPopper(popupState)} transition className={classes.popperContainer}>
                                {({ TransitionProps }) => (
                                    <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                                        <Card className={classes.card}>
                                            <CardContent className={classes.cardContent}>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item xs>
                                                        <OutlinedInput
                                                            className={classes.searchControl}
                                                            id="input-search-header"
                                                            value={searchval}
                                                            onChange={(e) => setSearchVal(e.target.searchval)}
                                                            placeholder="Search"
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <IconSearch
                                                                        stroke={1.5}
                                                                        size="1rem"
                                                                        className={classes.startAdornment}
                                                                    />
                                                                </InputAdornment>
                                                            }
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <Grid item>
                                                                    <TextField
                                                                        id="standard-select-currency"
                                                                        select
                                                                        value={value}
                                                                        onChange={(e) => setValue(e.target.value)}
                                                                    >
                                                                        {status.map((option) => (
                                                                            <MenuItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </Grid>
                                                                    <Box
                                                                        sx={{
                                                                            ml: 2
                                                                        }}
                                                                    >
                                                                        <ButtonBase sx={{ borderRadius: '12px' }}>
                                                                            <Avatar
                                                                                variant="rounded"
                                                                                className={classes.closeAvatar}
                                                                                {...bindToggle(popupState)}
                                                                            >
                                                                                <IconX stroke={1.5} size="1.3rem" />
                                                                            </Avatar>
                                                                        </ButtonBase>
                                                                    </Box>
                                                                </InputAdornment>
                                                            }
                                                            aria-describedby="search-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'weight'
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Transitions>
                                )}
                            </Popper>
                        </React.Fragment>
                    )}
                </PopupState>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <OutlinedInput
                    className={classes.searchControl}
                    id="input-search-header"
                    value={searchval}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            setSearchValOnEnter(event.target.value)
                            handleSubmit()
                        }
                    }}
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" className={classes.startAdornment} />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                           <Grid item>
                                <TextField
                                    id="standard-select-currency"
                                    select
                                    value={value}
                                    onChange={(e) => change(e.target.value)}
                                >
                                    {status.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </InputAdornment>
                    }
                    aria-describedby="search-helper-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                />
            </Box>
        </React.Fragment>
    );
};

export default SearchSection;
