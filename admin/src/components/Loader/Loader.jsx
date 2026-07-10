import React from 'react';
import './loader.scss';

export default function Loader() {
  return (
    <div className="loader_container">
      <div className="inner_loading_component">
        <i className="fa fa-spinner fa-spin"></i>
        <h2>Smashing...</h2>
      </div>
    </div>
  );
}
