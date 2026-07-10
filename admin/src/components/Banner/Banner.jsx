import React from 'react';
import './banner.scss';

export default function Banner({ title }) {
  return (
    <div className="banner_container">
      <div className="inner_banner_container">
        <h2>{title}</h2>
        <p>Home / {title}</p>
      </div>
    </div>
  );
}
