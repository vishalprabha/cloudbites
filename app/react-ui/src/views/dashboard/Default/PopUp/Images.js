import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const boxStyle ={
  "height": "100%"
}

const Images = ({data}) => {
  let img = ''
  if(data == null || (data.photo_ids && data.photo_ids.length == 0)){
    img = '--0h6FMC0V8aMtKQylojEg'
  }
  else{
    img = data.photo_ids[0]
  }
  return (
    <React.Fragment>
      <img src={`https://storage.googleapis.com/cloudbites-yelp-dataset/photos/photos/${img}.jpg`} style={boxStyle} alt="Red dot"/>
    </React.Fragment>
  );
}

export default Images;
