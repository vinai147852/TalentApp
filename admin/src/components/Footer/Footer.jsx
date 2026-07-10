import React from 'react';
import './footer.scss';
import Logo from '../../images/Logo.png';
import GoogleLogo from '../../images/Google.png';
import AppleLogo from '../../images/Apple.png';

export default function Footer() {
  return (
    <div className="main_footer">
      <div className="inner_footer">
        <div className="d-flex justify-content-between row">
          <div className="col-md-6">
            <h2>Categories</h2>
            <div className="row">
              <div className="col-md-4">
                <ul className="list">
                  <li>
                    <a href="#">Artist</a>
                  </li>
                  <li>
                    <a href="#">Writer</a>
                  </li>
                  <li>
                    <a href="#">Director</a>
                  </li>
                  <li>
                    <a href="#">Singer</a>
                  </li>
                  <li>
                    <a href="#">Costumer</a>
                  </li>
                  <li>
                    <a href="#">Makeup</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <ul className="list">
                  <li>
                    <a href="#">Hero</a>
                  </li>
                  <li>
                    <a href="#">Heroine</a>
                  </li>
                  <li>
                    <a href="#">Villain</a>
                  </li>
                  <li>
                    <a href="#">Singer</a>
                  </li>
                  <li>
                    <a href="#">Writer</a>
                  </li>
                  <li>
                    <a href="#">Jr Artist</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <ul className="list">
                  <li>
                    <a href="#">Comedian</a>
                  </li>
                  <li>
                    <a href="#">Writer</a>
                  </li>
                  <li>
                    <a href="#">Director</a>
                  </li>
                  <li>
                    <a href="#">Singer</a>
                  </li>
                  <li>
                    <a href="#">Costumer</a>
                  </li>
                  <li>
                    <a href="#">Makeup</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <h2>Company</h2>
            <ul className="list">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Team</a>
              </li>
              <li>
                <a href="#">Management</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Partners</a>
              </li>
              <li>
                <a href="#" target="_blank">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-2">
            <h2>Support</h2>
            <ul className="list">
              <li>
                <a href="#">Help</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Safety</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Services</a>
              </li>
            </ul>
          </div>
          <div className="col-md-2">
            <h2>News &amp; Events</h2>
            <ul className="list">
              <li>
                <a href="#">News</a>
              </li>
              <li>
                <a href="#">Events</a>
              </li>
              <li>
                <a href="#">News</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Media</a>
              </li>
              <li>
                <a href="#">Company news</a>
              </li>
              <li>
                <a href="#">Refer a Friend</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer_contact_info">
          <div className="contact my-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-4">
                    <h2 className="mb-0 pb-2">
                      <i
                        className="fa fa-envelope-o mr-2"
                        aria-hidden="true"
                      ></i>
                      For any query
                    </h2>
                    <a href="" className="text-dark">
                      help@etvtalentapp.com
                    </a>
                  </div>
                  <div className="col-md-4">
                    <h2 className="mb-0 pb-2">
                      <i
                        className="fa fa-envelope-o mr-2"
                        aria-hidden="true"
                      ></i>
                      Complaints
                    </h2>
                    <a href="" className="text-dark">
                      complaints@etvtalentapp.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6 text-right App_promote">
                <h2 className="pb-1"> Download app for android and iOS:</h2>
                <a href="" className="">
                  <img
                    src={AppleLogo}
                    className="img-fluid"
                    width="100"
                    alt=""
                  />
                </a>
                <a href="" className="">
                  <img
                    src={GoogleLogo}
                    className="img-fluid"
                    width="100"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="last_footer">
          <div className="copyright">
            <div className="logo">
              <a>
                <img src={Logo} className="img-fluid" />
              </a>
              <p>Copyrights all reserved by etvtalentapp.com - 2022</p>
            </div>

            <ul className="social">
              <li>
                <a href="//www.twitter.com" target="_blank" rel="noreferrer">
                  <i className="fa fa-twitter" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a href="//www.facebook.com" target="_blank" rel="noreferrer">
                  <i className="fa fa-facebook" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a href="//www.instagram.com" target="_blank" rel="noreferrer">
                  <i className="fa fa-instagram" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a href="//www.youtube.com" target="_blank" rel="noreferrer">
                  <i className="fa fa-youtube-play" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
