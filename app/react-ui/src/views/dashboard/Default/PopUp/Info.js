import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Title from './Title';
import { useTheme } from '@mui/material/styles';

function preventDefault(event) {
    event.preventDefault();
}

const Info = ({ data }) => {
    const theme = useTheme();
    if (data === null) {
        data = {
            name: '',
            catArray: '',
            address: '',
            hours: ''
        };
    }
    if (!data.hasOwnProperty('categories')) {
        data.categories = '';
    } else {
        console.log('data in info is');
        console.log(data);
        data.catArray = data.categories.split(',', 2);
        data.hour = JSON.parse(data.hours).Monday;
    }
    //  <Typography variant = "body1" sx= {{fontSize: theme.palette.Typography.body1.fontSize}}>
    return (
        <React.Fragment>
            <Title>Resturant Info</Title>
            <Typography component="p" lineHeight={theme.palette.Typography.lineHeight}>
                <Box component="span" fontWeight="bold">
                    Name:
                </Box>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: theme.palette.Typography.body1.fontSize }}>
                {data.name}
            </Typography>
            <Typography component="p" lineHeight={theme.palette.Typography.lineHeight}>
                <Box component="span" fontWeight="bold">
                    Catagories:
                </Box>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: theme.palette.Typography.body1.fontSize }}>
                {data.catArray}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }} lineHeight={theme.palette.Typography.lineHeight}>
                <Box component="span" fontWeight="bold">
                    Hours:
                </Box>
                <Typography variant="body1" sx={{ fontSize: theme.palette.Typography.body1.fontSize }}>
                    {data.hour}
                </Typography>
                <Box component="span" fontWeight="bold">
                    Address:
                </Box>
                <Typography variant="body1" sx={{ fontSize: theme.palette.Typography.body1.fontSize }}>
                    {data.address}
                </Typography>
            </Typography>
            {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Address: 
        </Link>
      </div> */}
        </React.Fragment>
    );
};

export default Info;
