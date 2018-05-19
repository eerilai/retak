import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = ({ userInfo }) => {

  return (
    <div className="pageNotFound">
      <h5> 404 </h5>
      <h4>PAGE NOT FOUND!</h4>
      <div>
        Click here to return <Link to="/">home.</Link>
      </div>
      {/* <img /> */}
    </div>
  );
}

export default PageNotFound;