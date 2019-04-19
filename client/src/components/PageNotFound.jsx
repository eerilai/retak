import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = ({ userInfo }) => (
  <div className="pageNotFound">
    <h5 className="FourOFour"> 404 </h5>
    <h4 className="NotFound">PAGE NOT FOUND!</h4>
    <div className="ClickReturnHome">
      <Link to="/">Click here to return home.</Link>
    </div>
    {/* <img /> */}
  </div>
);

export default PageNotFound;
