import React from 'react';
import './artistapplication.css';
import Tick from '../../images/Tick.svg';
import Btools from '../../images/masked-artist.png';

export default function ArtistApplication() {
  return (
    <div className="main_container_Btools">
      <div className="inner_b_tools">
        <div className="left_tools_b">
          <div className="main_tools_bussiness">
            <h2>
              One Application for all Artists, <br />
              Register, Apply, Get Select.
            </h2>
            <div className="list_tools">
              <div className="list_icons_tools">
                <img src={Tick} alt="" />
              </div>
              <div className="text_list_tools">
                <h4>Free Registration</h4>
                <p>
                Talentapp is a free app for everyone who wants to act in movies. No Joining Fee.
                </p>
              </div>
            </div>
            <div className="list_tools">
              <div className="list_icons_tools">
                <img src={Tick} alt="" />
              </div>
              <div className="text_list_tools">
                <h4>Apply to Auditions</h4>
                <p>
                After registration goto auditions page and apply for your any suitable role. Wait for the audition call.
                </p>
              </div>
            </div>
            <div className="list_tools">
              <div className="list_icons_tools">
                <img src={Tick} alt="" />
              </div>
              <div className="text_list_tools">
                <h4>Attend the Audition and show your talent.</h4>
                <p>
                Once the team shortlisted you. You will be informed to attend the audition. You can then come and show your talent in front of selectors.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="right_tools_b">
          <img src={Btools} alt="" />
        </div>
      </div>
    </div>
  );
}
