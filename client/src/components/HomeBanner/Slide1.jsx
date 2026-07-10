import React from 'react';
import Slide1Img from '../../images/roshan-meka-banner-big.png';

export default function Slide1() {
  return (
    <div className="slide">
      <div className="inner_slide">
        <div className="left_slide">
          <div className="Search_employees_main">
            <h2>Slide Heading 1</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem,
              accusantium obcaecati? Eum atque, dolorum eveniet excepturi unde
              perspiciatis magnam reiciendis.
            </p>
            <button>Apply Now</button>
          </div>
        </div>
        <div className="right_slide">
          <div className="inner_right_slider_image">
            <div className="main_slider_image">
              <img src={Slide1Img} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
