import React from 'react';

import logo from '../assets/images/logo.svg';



//-----------------------|| LOGO SVG ||-----------------------//

const Logo = () => {


    return (
        
         // if you want to use image instead of svg uncomment following, and comment out <svg> element.
         
          <img src={logo} alt="Cloud" width="60" />
         
    );
};

export default Logo;
