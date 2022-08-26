import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { Grid, MenuItem, TextField, Typography, useTheme } from '@material-ui/core';
import Box from "@mui/material/Box";
import { withStyles, makeStyles } from "@material-ui/styles";
import { GlobalStyles } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from './../../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from './../../../ui-component/cards/MainCard';
import { gridSpacing } from './../../../store/constant';
import Map from './map';
import Popup from './Popup';

// chart data
// import chartData from './chart-data/total-growth-bar-chart';

// const status = [
//     {
//         value: 'today',
//         label: 'Today'
//     },
//     {
//         value: 'month',
//         label: 'This Month'
//     },
//     {
//         value: 'year',
//         label: 'This Year'
//     }
// ];


const useStyles = makeStyles({
    myComponent: {
      "& .MuiPaper-root-MuiCard-root": {
        height:1000
      }
    }
  });

//-----------------------|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||-----------------------//

const TotalGrowthBarChart = ({ isLoading }) => {
    // const [value, setValue] = React.useState('today');
    const theme = useTheme();
    //     const togglePopup = () => {
    //     setIsOpen(!isOpen);
    // };
    // const classes = useStyles();

    return (
        <React.Fragment>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                
                <MainCard sx={{height:1000}}>
                    <Map/>
                
                    
             </MainCard>
             
            )}

       </React.Fragment>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default (TotalGrowthBarChart);
