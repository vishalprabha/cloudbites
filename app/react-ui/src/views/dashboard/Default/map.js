// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { ArcLayer } from '@deck.gl/layers';
import { H3HexagonLayer } from '@deck.gl/geo-layers';
import { scaleLog } from 'd3-scale';
import { geoToH3, h3ToGeo } from 'h3-js';
import React, { useRef, useEffect, useState } from 'react';

import { load } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';

import Popup from './Popup';
import val from './const';

import axios from 'axios';

import configData from '../../../config';

import { useDispatch, useSelector } from 'react-redux';

// info: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
// Set your mapbox token here
mapboxgl.accessToken = 'pk.eyJ1IjoiYWFsaTcwNzUiLCJhIjoiY2wwbjM0dnJqMThkejNrbGFsaHNyY2VxZCJ9.HhRT9oD4i-ccz5WL4QszAg'; // eslint-disable-line

// Uses the fromula  y=m*log(x)+b
const colorScale = scaleLog()
    .domain([1, 100, 500, 1000])
    .range([
        [178, 255, 255],
        [92, 204, 255],
        [60, 141, 253],
        [28, 26, 227]
    ]);

// Function will render the Map
export default function Map(data) {
    // Redux global state store variables
    const cityPayload = useSelector((state) => state.main.cityPayload);
    const cityName = useSelector((state) => state.main.cityName);
    const cityLat = useSelector((state) => state.main.lat);
    const cityLong = useSelector((state) => state.main.long);
    const cityZoom = useSelector((state) => state.main.zoom);

    //For more information about the map: https://docs.mapbox.com/mapbox-gl-js/api/map/
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [lng, setLng] = useState(cityLong);
    const [lat, setLat] = useState(cityLat);
    const [zoom, setZoom] = useState(cityZoom);
    const [bearing, setBearing] = useState(20);
    const [pitch, setPitch] = useState(70);
    const [csv, setCsv] = useState('');
    const [poiLayer, setPoiLayer] = useState(null);
    // Adding popup window
    const [isOpen, setIsOpen] = useState(false);
    const [buisinessData, setbuisinessData] = useState(null);


    
    
    const makeCall = (business_id, all_data) => {
        let business_id1 = business_id
        let all_data1 = all_data
        axios
            .get( configData.API_SERVER + 'review?business_id='+business_id, {}, { headers: {} })
            .then(function (response) {
                console.log('Clicked on business ID' + business_id1)
                let reviews = []
                let recommendations = []
                let b64_string_image = ''
                let photo_ids = []
                for(let i = 0; i < response.data.length; i++){//Last three are word cloud,recommendations and photos
                    if(response.data[i] && response.data[i].hasOwnProperty('review_id')){
                        reviews.push(response.data[i])
                    }
                    else if(response.data[i] && response.data[i].hasOwnProperty('recommendation')){
                        for (let rec in response.data[i].recommendation) {
                            recommendations.push(response.data[i].recommendation[rec])
                          }
                    }
                    else if(response.data[i] && response.data[i].hasOwnProperty('b64_string_image')){
                        b64_string_image = response.data[i].b64_string_image
                    }
                    else if(response.data[i] && response.data[i].hasOwnProperty('photo_ids')){
                        photo_ids = response.data[i].photo_ids
                    }
                }
                all_data1['reviews'] = reviews
                all_data1['recommendations'] = recommendations
                all_data1['b64_string_image'] = b64_string_image
                all_data1['photo_ids'] = photo_ids
                console.log("all_data1 in map is")
                console.log(all_data1)
                setIsOpen(!isOpen);
                setbuisinessData(all_data1)
            })
            .catch(function (error) {
                console.log('error - ', error);
            });
    };

    const togglePopup = (all_data) => {
        if(isOpen == true){
            setIsOpen(!isOpen);
            return;
        }
        if(['business_id'] in all_data){
            makeCall(all_data['business_id'], all_data)
        }
        console.log("cityPayload is ")
        console.log(cityPayload)
    };

    const sidebarStyle = {
        backgroundColor: 'rgba(35, 55, 75, 0.9)',
        color: '#fff',
        padding: '6px 20px',
        fontFamily: 'monospace',
        zIndex: '1',
        position: 'absolute',
        left: '40px',
        margin: '12px',
        borderRadius: '4px'
    };
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v9',
            center: [cityLong, cityLat],
            zoom: cityZoom,
            bearing: bearing,
            pitch: pitch,
            antialias: true
        });
        // Create a asyncrhoucs function to be updated from useEffect()
        const fetchCSVData = async () => {
            //const csv = await loadAndRender();
            const csv = cityPayload;
            setCsv(csv);
            //console.log('csv is ', csv);
            const poiLayer = await new MapboxLayer({
                id: 'deckgl-pois',
                type: H3HexagonLayer,
                data: aggregateHexes(csv),
                opacity: 0.8,
                pickable: true,
                autoHighlight: true,
                extruded: true,
                filled: true,
                elevationScale: 6,
                // arrow function to return object and run selectPOI object return becomes d
                onClick: ({ object }) => object && togglePopup(object.all_data),
                getHexagon: (d) => d.hex, //Resoultion is 10
                getFillColor: (d) => colorScale(d.count),
                getElevation: (d) => d.count,
                stroked: false
            });
            setPoiLayer(poiLayer);
            map.addLayer(poiLayer, getFirstLabelLayerId(map.getStyle()));
            // console.log(h3ToGeo(poiLayer.props.data[0].hex))
            // console.log(poiLayer.props.data[0].hex)
            // console.log(geoToH3(39.9127689, -75.1535348, 10 ))
            setMap(map);
        };
        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });
        //map.addControl(new mapboxgl.NavigationControl(), 'top-left');
        // listener for a event. In this case we're changing something when the map finshes loading
        map.on('load', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
            map.addLayer({
                // adding the 3d layer after loading
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'], // only dislplay features if extrude is true
                type: 'fill-extrusion', // fill color for extrusion
                minzoom: 14, // minimum zoom to be seen at that layer
                paint: {
                    'fill-extrusion-color': '#ccc',
                    'fill-extrusion-height': ['get', 'height']
                }
            });
            // a style is a JSON document that defines the visual appearance of a map.
            fetchCSVData();
            setMap(map);
        });
        return () => map.remove();
    }, [cityPayload, cityLat]);
    return (
        <div className="contain" style={{ height: 1000 }}>
            {isOpen && <Popup handleClose={togglePopup} data={buisinessData} />}
            <div className="sidebar" style={sidebarStyle}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | City: {cityName}
            </div>
            <div ref={mapContainer} className="map-container" style={{ height: 960 }} />
        </div>
    );
}

// Change so that each hexagon is a resturant
// function aggregateHexes(data) {
//     if (data == '') {
//         return null;
//     }
//     const result = {};
//     for (const object of data) {
//         if (!result[object.hex]) {
//             result[object.hex] = { hex: object.hex, count: 0 };
//         }
//         result[object.hex].count += object.count;
//     }
//     let pls= Object.values(result);
//     return pls.slice(0,10); // returns an array where each element is a tuple key value pair
// }

function aggregateHexes(data) {
    if (data == '') {
        return null;
    }
    const result = {};
    for (const object of data) {
        object.hex_val = geoToH3(object.latitude, object.longitude, 10);
        if (!result[object.hex_val]) {
            result[object.hex_val] = { hex: object.hex_val, count: parseInt(object.review_count), business_id: object.business_id, all_data: object };
        }
        //result[object.hex].count += object.count;
    }
    return Object.values(result); // returns an array where each element is a tuple key value pair
}

function getFirstLabelLayerId(style) {
    const layers = style.layers;
    // Find the index of the first symbol (i.e. label) layer in the map style
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            return layers[i].id;
        }
    }
    return undefined;
}

async function loadAndRender() {
    const data = await load('https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/safegraph/sf-pois.csv', CSVLoader);
    return val;
}
