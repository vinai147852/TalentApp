import React, { useState, useEffect, useRef } from "react";
import "./topbar.scss";
import Logo from "../../images/Logo.png";
import Topbar_img from "../../images/Topbar_img.jpeg";
import { Link, NavLink, useLocation } from "react-router-dom";
import Notifications from "../Notifications/Notifications";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../../redux/UserSlice";
import { useGlobalState } from "../../states";
import { axiosinstance } from "../../utils/axiosinstance";
import NOUser from "../../images/User.jpg";

export default function Topbar() {
  const User = useSelector((state) => state.user.user);
  const [isMobNav, setisMobNav] = useState(false);
  var [shownotification, setshownotification] = useState(false);
  const [, setCLocation] = useGlobalState("location");
  const [UnreadNotifications] = useGlobalState("UnReadnotification");
  const [, setArrivalnotification] = useGlobalState("Arrivalnotification");
  const [UnreadMessages] = useGlobalState("UnreadMessages");
  const location = useLocation();
  const notifi_ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setCLocation(location.pathname);
  }, [location]);

  useEffect(() => {
    window.addEventListener("click", CheckClick);
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
            <div className="center_img_topbar">
              <img src={Topbar_img} alt="" />
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
                      User && setshownotification(!shownotification);
                      User && MarkAllmyNotificationsRead();
                    }}
                  ></i>

                  <div
                    className={
                      shownotification
                        ? "notification_dropdown"
                        : "notification_dropdown hide"
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
                  <img
                    src={
                      User
                        ? User?.ProfilePic
                          ? User?.ProfilePic
                          : User?.image1
                        : NOUser
                    }
                    alt=""
                  />
                </button>
                {User && (
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <div className="account_top_details">
                      <div className="account_top_img">
                        <img
                          src={
                            User?.ProfilePic ? User?.ProfilePic : User?.image1
                          }
                          alt=""
                        />
                      </div>
                      <div className="account_top_info">
                        <h2>{User?.name + " " + User?.surname}</h2>
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
                )}
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
            <NavLink className="nav_link_item" to="/about">
              About
            </NavLink>
            <NavLink className="nav_link_item" to="/auditions">
              Auditions
            </NavLink>
            <NavLink className="nav_link_item" to="/faqs">
              Faqs
            </NavLink>
            <NavLink className="nav_link_item" to="/contact">
              Contact
            </NavLink>
          </div>
          <div className="main_navbar_right">
            {!User ? (
              <>
                <NavLink to="/login">
                  <label className="topbar_cta_btns_right">Sign In</label>
                </NavLink>
                <NavLink to="/register">
                  <label className="topbar_cta_btns_right join">Join</label>
                </NavLink>{" "}
              </>
            ) : (
              <label
                className="topbar_cta_btns_right join"
                onClick={HandleLogout}
              >
                Logout
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navbar Here ------------------------------------------------------------ */}

      <div className="mob_navbar">
        <div className="inner_mob_navbar">
          <div
            className={isMobNav ? "hamburger active" : "hamburger"}
            onClick={() => setisMobNav(!isMobNav)}
          >
            <div className="bar"></div>
          </div>

          <div className="main_navbar_right">
            {!User ? (
              <>
                <NavLink to="/login">
                  <label className="topbar_cta_btns_right">Sign In</label>
                </NavLink>
                <NavLink to="/register">
                  <label className="topbar_cta_btns_right join">Join</label>
                </NavLink>{" "}
              </>
            ) : (
              <label
                className="topbar_cta_btns_right join"
                onClick={HandleLogout}
              >
                Logout
              </label>
            )}
          </div>
        </div>
        <div
          className={
            isMobNav ? "main_mob_dropdown active" : "main_mob_dropdown"
          }
        >
          <div className="inner_drop_down">
            <ul>
              <NavLink className="nav_link_item" to="/" end>
                Home
              </NavLink>
              <NavLink className="nav_link_item" to="/about">
                About
              </NavLink>
              <NavLink className="nav_link_item" to="/auditions">
                Auditions
              </NavLink>
              <NavLink className="nav_link_item" to="/faqs">
                Faqs
              </NavLink>
              <NavLink className="nav_link_item" to="/contact">
                Contact
              </NavLink>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
