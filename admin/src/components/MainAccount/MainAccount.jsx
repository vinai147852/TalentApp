import React, { useState } from 'react';
import AccountTab from './AccounTabs/AccountTab';
import PasswordTab from './AccounTabs/PasswordTab';
import SPassword from './AccounTabs/SPassword';
import './mainaccount.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Logout } from '../../redux/AdminSlice';
import { CreateAdminLogs } from '../../utils/AdminLogs';
import VisitorsTab from './AccounTabs/VisitorsTab';
import ArtistsTab from './AccounTabs/ArtistsTab';

export default function MainAccount() {
  const User = useSelector((state) => state.admin.admin);
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
    CreateAdminLogs({ Id: User?._id, status: 2 });
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
                Password
              </label>
              {User?.role === 1 && (
                <label
                  className={isActive(3)}
                  onClick={() => {
                    setslide(3);
                  }}
                >
                  Super Password
                </label>
              )}

              {User?.role === 1 && (
                <label
                  className={isActive(4)}
                  onClick={() => {
                    setslide(4);
                  }}
                >
                  Total Visitors
                </label>
              )}
              {User?.role === 1 && (
                <label
                  className={isActive(5)}
                  onClick={() => {
                    setslide(5);
                  }}
                >
                  Total Artists
                </label>
              )}
              <label className="sidebar_links logout" onClick={HandleLogout}>
                Logout
              </label>
            </div>
          </div>
          <div className="right_setting_box">
            {slide === 1 && <AccountTab />}
            {slide === 2 && <PasswordTab />}
            {slide === 3 && <SPassword />}
            {slide === 4 && <VisitorsTab />}
            {slide === 5 && <ArtistsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
