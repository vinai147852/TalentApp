import React, { useState } from 'react';
import './topbar.scss';
import Logo from '../../images/Logo.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Notifications from '../Notifications/Notifications';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/AdminSlice';
import { useGlobalState } from '../../states';
import { axiosinstance } from '../../utils/axiosinstance';
import { CreateAdminLogs } from '../../utils/AdminLogs';

export default function Topbar() {
  const User = useSelector((state) => state.admin.admin);
  const [isMobNav, setisMobNav] = useState(false);
  var [shownotification, setshownotification] = useState(false);
  const [, setCLocation] = useGlobalState('location');
  const [UnreadNotifications] = useGlobalState('UnReadnotification');
  const [, setArrivalnotification] = useGlobalState('Arrivalnotification');
  const [UnreadMessages] = useGlobalState('UnreadMessages');
  const location = useLocation();
  const notifi_ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setCLocation(location.pathname);
  }, [location]);

  useEffect(() => {
    window.addEventListener('click', CheckClick);
  }, []);

  const CheckClick = (event) => {
    if (notifi_ref && !notifi_ref.current?.contains(event.target)) {
      setshownotification(false);
    }
  };

  const MarkAllmyNotificationsRead = async () => {
    try {
      const res = await axiosinstance.post(
        `/notification/all/markas/read/${User?._id}`
      );
      setArrivalnotification(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleLogout = () => {
    CreateAdminLogs({ Id: User?._id, status: 2 });
    dispatch(Logout());
  };

  return (
    <>
      <div className="topbar_container">
        <div className="container_topbar_main">
          <div className="topbar_main">
            <div className="topbar_left">
              <Link to="/">
                <div className="logo_topbar">
                  <img src={Logo} alt="" />
                </div>
              </Link>
            </div>
            <div className="topbar_right">
              <div className="topbar_right_items">
                <Link to="/chat">
                  <button className="topbar_item">
                    {UnreadMessages?.length > 0 && (
                      <div className="unread_circle">
                        {UnreadMessages?.length}
                      </div>
                    )}
                    <i className="fa-brands fa-facebook-messenger"></i>
                  </button>
                </Link>
                <button type="button" className="topbar_item" ref={notifi_ref}>
                  {UnreadNotifications?.length > 0 && (
                    <div className="unread_circle">
                      {UnreadNotifications?.length}
                    </div>
                  )}
                  <i
                    className="fa-solid fa-bell"
                    onClick={() => {
                      setshownotification(!shownotification);
                      MarkAllmyNotificationsRead();
                    }}
                  ></i>

                  <div
                    className={
                      shownotification
                        ? 'notification_dropdown'
                        : 'notification_dropdown hide'
                    }
                  >
                    <Notifications />
                  </div>
                </button>

                <button
                  className="topbar_item account_settings"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img src={User?.ProfilePic} alt="" />
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <div className="account_top_details">
                    <div className="account_top_img">
                      <img src={User?.ProfilePic} alt="" />
                    </div>
                    <div className="account_top_info">
                      <h2>{User?.username}</h2>
                      <p>{User?.email}</p>
                    </div>
                  </div>
                  <div className="btns_account_top">
                    <Link to="/account">
                      <label>
                        <i className="fa-solid fa-user"></i>Account
                      </label>
                    </Link>
                    <label onClick={HandleLogout}>
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      Logout
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar_main_container">
        <div className="main_navbar">
          <div className="main_navbar_left">
            <NavLink className="nav_link_item" to="/" end>
              Home
            </NavLink>
            <NavLink className="nav_link_item" to="/artists">
              Artists
            </NavLink>
            <NavLink className="nav_link_item" to="/projects">
              Projects
            </NavLink>
            <NavLink className="nav_link_item" to="/auditions">
              Auditions
            </NavLink>
            <NavLink className="nav_link_item" to="/faqs">
              Faqs
            </NavLink>
          </div>
          <div className="main_navbar_right">
            {(User?.role === 1 || User?.role === 2) && (
              <NavLink className="nav_link_item" to="/admins">
                <i className="fa-solid fa-users"></i> All{' '}
                {User?.role === 1 ? 'Admins' : 'Users'}
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navbar Here ------------------------------------------------------------ */}

      <div className="mob_navbar">
        <div className="inner_mob_navbar">
          <div
            className={isMobNav ? 'hamburger active' : 'hamburger'}
            onClick={() => setisMobNav(!isMobNav)}
          >
            <div className="bar"></div>
          </div>

          <NavLink className="nav_link_item" to="/admins" end>
            <i className="fa-solid fa-users"></i> All Admins
          </NavLink>
        </div>
        <div
          className={
            isMobNav ? 'main_mob_dropdown active' : 'main_mob_dropdown'
          }
        >
          <div className="inner_drop_down">
            <ul>
              <NavLink className="nav_link_item" to="/" end>
                Home
              </NavLink>
              <NavLink className="nav_link_item" to="/artists">
                Artists
              </NavLink>
              <NavLink className="nav_link_item" to="/projects">
                Projects
              </NavLink>
              <NavLink className="nav_link_item" to="/auditions">
                Auditions
              </NavLink>
              <NavLink className="nav_link_item" to="/faqs">
                Faqs
              </NavLink>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
