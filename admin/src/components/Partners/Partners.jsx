import React from 'react';
import './partners.scss';
import Partner1 from '../../images/etv-2.jpg';
import Partner2 from '../../images/etv-bharat.jpg';
import Partner3 from '../../images/etv-group.png';

export default function Partners() {
  return (
    <div className="partner_container">
      <div className="inner_partners">
        <img src={Partner1} alt="" />
        <img src={Partner2} alt="" />
        <img src={Partner3} alt="" />
        <img src={Partner2} alt="" />
        <img src={Partner1} alt="" />
      </div>
    </div>
  );
}
