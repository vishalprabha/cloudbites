// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import { MapboxLayer } from "@deck.gl/mapbox";
import { ArcLayer } from "@deck.gl/layers";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { scaleLog } from "d3-scale";
import { geoToH3, h3ToGeo } from "h3-js";
import React, { useRef, useEffect, useState } from "react";

import { load } from "@loaders.gl/core";
import { CSVLoader } from "@loaders.gl/csv";

import Popup from './Popup'

/*
  const lat = 37.77926208174472;
  const lng = -122.27605163708448;
  const res = 10;
  // 8a28308148effff
*/

// info: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
// Set your mapbox token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWFsaTcwNzUiLCJhIjoiY2wwbjM0dnJqMThkejNrbGFsaHNyY2VxZCJ9.HhRT9oD4i-ccz5WL4QszAg"; // eslint-disable-line

// Uses the fromula  y=m*log(x)+b
const colorScale = scaleLog()
  .domain([10, 100, 1000, 10000])
  .range([
    [255, 255, 178],
    [254, 204, 92],
    [253, 141, 60],
    [227, 26, 28],
  ]);

// Function will render the Map
export default function App(data) {
  //For more information about the map: https://docs.mapbox.com/mapbox-gl-js/api/map/
  const mapContainer = useRef(null);
  const [map, setMap ] = useState(null);
  const [lng, setLng] = useState(-122.4044);
  const [lat, setLat] = useState(37.7845);
  const [zoom, setZoom] = useState(15.5);
  const [bearing, setBearing] = useState(20);
  const [pitch, setPitch] = useState(60);
  const [csv, setCsv] = useState("")
  const [poiLayer, setPoiLayer] = useState(null)
  // Adding popup window
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    console.log(h3ToGeo('8a28308148effff'))
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v9",
      center: [lng, lat],
      zoom: zoom,
      bearing: bearing,
      pitch: pitch,
      antialias: true,
    });
    // Create a asyncrhoucs function to be updated from useEffect()
    const fetchCSVData = async () => {
      const csv = await loadAndRender()
      setCsv(csv)
      console.log("csv is ", csv)
      const poiLayer = await new MapboxLayer({
        id: "deckgl-pois",
        type: H3HexagonLayer,
        data: aggregateHexes(csv),
        opacity: 0.5,
        pickable: true,
        autoHighlight: true,
        // arrow function to return object and run selectPOI object return becomes d
        onClick: ({object})=> object && togglePopup(),
        getHexagon: (d) => d.hex, //Resoultion is 10
        getFillColor: (d) => colorScale(d.count),
        extruded: false,
        stroked: false,
      });
      setPoiLayer(poiLayer)
      map.addLayer(poiLayer, getFirstLabelLayerId(map.getStyle()));
      setMap(map)
    }
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    // listener for a event. In this case we're changing something when the map finshes loading
    map.on('load', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
      map.addLayer({ // adding the 3d layer after loading
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
        fetchCSVData()
      setMap(map);
    });
    return () => map.remove()
  },[]);



  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      {isOpen && <Popup
      handleClose={togglePopup}
    />}
    <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
    
  );
}

// Change so that each hexagon is a resturant
function aggregateHexes(data) {
  if (data==""){
    return null
  }
  const result = {};
  for (const object of data) {
    if (!result[object.hex]) {
      result[object.hex] = { hex: object.hex, count: 0 };
    }
    result[object.hex].count += object.count;
  }
  return Object.values(result); // returns an array where each element is a tuple key value pair
}

function getFirstLabelLayerId(style) {
  const layers = style.layers;
  // Find the index of the first symbol (i.e. label) layer in the map style
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      return layers[i].id;
    }
  }
  return undefined;
}

async function loadAndRender() {
  const data = await load(
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/safegraph/sf-pois.csv",
    CSVLoader
  );
  return data
  
}
