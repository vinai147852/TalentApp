import React from 'react';
import PostImg from '../../images/roshan-1.jpg';

export default function Viewuser() {
  return (
    <div className="user_view_box">
      <div className="user_img">
        <img src={PostImg} alt="" />
      </div>
      <div className="user_view_box_details">
        <div className="user_details">
          <h2>Roshan Nandamuri</h2>
          <p>Hero</p>
        </div>
        <i className="fa-solid fa-circle-plus"></i>
      </div>
    </div>
  );
}
