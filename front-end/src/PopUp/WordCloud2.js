import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function WordCloud2() {
  return (
    <React.Fragment>
      <Title>Word Cloud 2</Title>
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
    </React.Fragment>
  );
}
