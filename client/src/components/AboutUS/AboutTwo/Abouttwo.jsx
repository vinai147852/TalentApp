import React from 'react';
import './abouttwo.scss';
import About_Img from '../../../images/About_two.jpg';

export default function Abouttwo() {
  return (
    <div className="main_about">
      <div className="inner_about">
        <div className="about_left">
          <img src={About_Img} alt="" />
        </div>
        <div className="about_right">
          <h2>The World’s Largest Film City.</h2>
          <p>
          Ramoji Group is a multi-dimensional corporate entity headquartered in Hyderabad. 
          The 60-year-old Group has evolved into one of the most diversified business houses 
          with notable presence in media & entertainment (print, satellite TV, digital, 
          FM Radio), film production, film & television education, thematic leisure & tourism, 
          wellness, hospitality, financial services, retail and food.
          </p>
          <p>
          The Group has also dominant presence in Film Production (Ushakiron Movies), Thematic Leisure & Tourism 
          (Ramoji Film City - the world’s largest film city), Financial Services (Margadarsi Chit Fund), 
          FMCG (Priya Foods), Retail (Kalanjali famed for Indian handicraft, artifacts & textiles) Hospitality 
          (Dolphin Hotels), Film & Television Education (Ramoji Academy of Film & Television), Wellness 
          (Sukhibhava Wellness promoting traditional and holistic healing systems & drug-less treatment).
          </p>
          <div className="about_two_maps">
            <h4>Our Mission</h4>
            <p>
            To commit to excellence, innovate with preparedness for the ever-evolving world, 
            create  products and services high on quality, entertainment and fair play!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
