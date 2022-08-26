// action - state management
import { SET_CITY, SET_SEARCH, SET_TWEETS } from './actions';

import { citiesVal } from './PhiladelphiaVal';

import configData from '../config'

import axios from 'axios';

export const initialState = {
    cityName: 'Philadelphia',
    lat: 39.91276,
    long: -75.153534,
    zoom: 12.00,
    cityPayload: citiesVal,
    tweetsPayload: ["@RexChapman How does a patty melt make the cut but not a burger?", "No one asked but\n\nTeams that i know and think have a chance to win\n\nNA: TSM, NRG, DNO, G2\n\nEMEA: Players, Alliance, GMT\n\nAPAC N: Crazy Raccoon, aDRaccoon\n\nAPAC S: RIG, Burger\n\nTop 3: Players, TSM/NRG, Alliance\n\nI know jackshit about SA",
    "Mi gympartner llego a comprar una burger nmms :(",
    "Burger King Song.Wrote by Billy Waters as Billy the kid Forest City NC https://t.co/dsbBpCSQA5 via @YouTube",
    "I don't eat at burger a lot but sometimes a whopper flips a switch https://t.co/pORH2FeQkM https://t.co/fOLZjN5shk",
    "@DiscussingFilm Bob Burger and the Burger family! https://t.co/XE3xKZS7f7"]
};

//-----------------------|| MAIN PAGE REDUCER ||-----------------------//
//const payload = {}
//const handleSubmit = (searchval,value) => {
//    console.log('We are here');
//    axios
//        .get( configData.API_SERVER + '/search?query='+searchval+'&city='+value, {}, { headers: {} })
//        .then(function (response) {
//           const payload = response
//        })
//        .catch(function (error) {
//            console.log('error - ', error);
//        });
//};



const mainPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CITY: {
            const { lat, long, zoom, cityName } = action.payload;
            //cityPayload = Axios end point for payload
            //payload = handleSubmit(query, cityName)
            return {
                ...state,
                cityName: cityName,
                lat: lat,
                long: long,
                zoom: zoom
            };
        }
        case SET_SEARCH:{
            const {data} = action.payload
            return {
                ...state,
                cityPayload: data
            }
        }
        case SET_TWEETS:{
            const {data} = action.payload
            return {
                ...state,
                tweetsPayload:data
            }
        }
        default: {
            return { ...state };
        }
    }
};

export default mainPageReducer;
