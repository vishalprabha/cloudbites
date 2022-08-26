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

const WordCloud1 = ({data}) => {
  let img = ''
  if(data == null){
    img = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
  }
  else{
    img = data.b64_string_image
  }
  return (
    <React.Fragment>
      <img src={`data:image/png;base64,${img}`} style={boxStyle} alt="Red dot"/>
      {/*
      <Title>Word Cloud 1</Title>
      <Typography component="p" variant="h4">
        Image goes here
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Setiment analysis score: 
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Go to tweet
        </Link>
      </div>
    */}
    </React.Fragment>
  );
}

export default WordCloud1;