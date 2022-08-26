import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Title from './Title';
import {useTheme} from "@mui/material/styles";

function preventDefault(event) {
  event.preventDefault();
}

export default function Info() {
  const theme = useTheme()
  return (
    <React.Fragment>
      <Title>Resturant Info</Title>
      <Typography component="p" lineHeight={theme.palette.Typography.lineHeight}>
      <Box component="span" fontWeight="bold">Name:</Box>
      </Typography>
      <Typography component="p">
       Enter Name here
      </Typography>
      <Typography component="p" lineHeight={theme.palette.Typography.lineHeight}>
      <Box component="span" fontWeight="bold">Catagories:</Box>
      </Typography>
      <Typography component="p">
       Mexican, American, Persian
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }} lineHeight={theme.palette.Typography.lineHeight}>
        <Box component="span" fontWeight="bold">Hours:</Box>
        _ AM : _ PM
        <Typography component="p" >
      </Typography>
      <Box component="span" fontWeight="bold">Address:</Box>
      1165 13th St, Boulder, CO 80302
      </Typography>
      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Address: 
        </Link>
      </div> */}
    </React.Fragment>
  );
}
