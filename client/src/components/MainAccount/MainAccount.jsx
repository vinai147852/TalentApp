import React, { useState } from 'react';
import AccountTab from './AccounTabs/AccountTab';
import ImageTab from './AccounTabs/ImageTab';
import PortfolioTab from './AccounTabs/PortfolioTab';
import ProfileTab from './AccounTabs/ProfileTab';
import SocialTab from './AccounTabs/SocialTab';
import { useDispatch } from 'react-redux';
import { Logout } from '../../redux/UserSlice';
import './mainaccount.scss';

export default function MainAccount() {
  const [slide, setslide] = useState(1);
  const dispatch = useDispatch();

  const isActive = (index) => {
    if (slide === index) {
      return 'sidebar_links active';
    } else {
      return 'sidebar_links';
    }
  };

  const HandleLogout = () => {
    dispatch(Logout());
  };

  return (
    <div className="container" style={{ background: '#F9FBFE' }}>
      <div className="inner_container">
        <div className="main_account_container">
          <div className="left_sidebar">
            <div className="sidebar_container">
              <label
                className={isActive(1)}
                onClick={() => {
                  setslide(1);
                }}
              >
                Account
              </label>
              <label
                className={isActive(2)}
                onClick={() => {
                  setslide(2);
                }}
              >
                Personal Details
              </label>

              <label
                className={isActive(3)}
                onClick={() => {
                  setslide(3);
                }}
              >
                Photos
              </label>

              <label
                className={isActive(4)}
                onClick={() => {
                  setslide(4);
                }}
              >
                Film History
              </label>
              <label
                className={isActive(5)}
                onClick={() => {
                  setslide(5);
                }}
              >
                Social Media
              </label>
              <label className="sidebar_links logout" onClick={HandleLogout}>
                Logout
              </label>
            </div>
          </div>
          <div className="right_setting_box">
            {slide === 1 && <AccountTab />}
            {slide === 2 && <ProfileTab />}
            {slide === 3 && <ImageTab />}
            {slide === 4 && <PortfolioTab />}
            {slide === 5 && <SocialTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
