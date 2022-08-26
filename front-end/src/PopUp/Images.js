import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Images() {
  return (
    <React.Fragment>
      <Title>Images</Title>
      <Typography component="p" variant="h4">
        Review goes here
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Setiment analysis score: 
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Overall review score:
        </Link>
      </div>
    </React.Fragment>
  );
}
