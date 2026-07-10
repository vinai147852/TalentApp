import React from 'react';
import './testimonials.scss';
import Pic1 from '../../images/user7.jpg';
import Pic2 from '../../images/Vijayendra-Prasad.jpg';
import Pic3 from '../../images/user9.jpg';

export default function Testimonials({ Title }) {
  return (
    <div className="main_container_testimonial">
      <div className="Heading_testimonials">
        <h2>{Title}</h2>
      </div>
      <div className="inner_testimonial">
        <div className="testimonial_card">
          <div className="testimonial_card_img">
            <img src={Pic1} alt="" />
          </div>
          <div className="Testimonial_info">
            <p>
            Talentapp is a wonderful opportunity for anyone to directly apply and try their luck in film industry. The new talent has a chance to prove their worth now.
            </p>
            <div className="testimonial_author">
              <h2>- K. Raghavendra Rao</h2>
              <p>Indian film director & Producer</p>
            </div>
          </div>
        </div>
        <div className="testimonial_card">
          <div className="testimonial_card_img">
            <img src={Pic2} alt="" />
          </div>
          <div className="Testimonial_info">
            <p>
            I would like to recommend everyone to use TalentApp which really helps the unexplored talent to come to limelight. It really helps makers and cast and crew in both ways.
            </p>
            <div className="testimonial_author">
              <h2>- V. Vijayendra Prasad</h2>
              <p>Screenwriter & Film director</p>
            </div>
          </div>
        </div>
        <div className="testimonial_card">
          <div className="testimonial_card_img">
            <img src={Pic3} alt="" />
          </div>
          <div className="Testimonial_info">
            <p>
            Considering the huge requirement for manpower in the film industry, TalentApp really helps the makers to easily recruit the cast and crew based on the requirements.
            </p>
            <div className="testimonial_author">
              <h2>- S. S. Rajamouli</h2>
              <p>Indian film director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
