import React from "react";
import Dashboard from "./PopUp/Dashboard";

const Popup = props => {
  // console.log("data in Popup is ");
  // console.log(props.data);
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {/* {props.content} */}
        <Dashboard data = {props.data}>
        
        </Dashboard>
      </div>
    </div>
  );
};

export default Popup;