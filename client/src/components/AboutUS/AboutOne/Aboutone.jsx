import React from 'react';
import './aboutone.scss';
import AboutImg from '../../../images/talentapp-welcome-1.jpg';

export default function Aboutone() {
  return (
    <div className="main_about">
      <div className="inner_about">
        <div className="about_left">
          <h2>Welcome to ETV-TalenTapp</h2>
          <p>
            TalentApp is a platform which exclusively acts as a bridge between
            Industry Talent and ETV Network. Talent belonging to all departments
            of filmmaking can create a profile and apply to various casting and
            audition calls here.
            <br />
            <br />
            An initiative of the ETV Network, the talent app provides an
            opportunity for various talents throughout the country to create a
            profile with all their details, after which they can get a chance to
            directly apply for productions on ETV Network.
          </p>
        </div>
        <div className="about_right">
          <img src={AboutImg} alt="" />
        </div>
      </div>
    </div>
  );
}
