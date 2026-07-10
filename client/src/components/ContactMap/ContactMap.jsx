import React from 'react';
import './contactmap.scss';

export default function ContactMap() {
  return (
    <div className="contact_map_container">
      <div className="inner_contact_map">
        <div className="left_map">
          <div className="inner_map_display">
            <iframe
              height="450"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d60957.220641072294!2d78.680584!3d17.275637!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb0a2271893ff5%3A0xf993da1fbc177b06!2sRamoji%20Film%20City%2C%20Telangana!5e0!3m2!1sen!2sin!4v1661747895340!5m2!1sen!2sin"
            ></iframe>
          </div>
        </div>
        <div className="Right_map_contact_info">
          <h2>Get In Touch</h2>
          <div className="contact_info_box">
            <h4>
              <i className="fa-solid fa-location-dot"></i> Address :
            </h4>
            <p>Ramoji Film City Main Rd, Hyderabad, Telangana 501512</p>
          </div>

          <div className="contact_info_box">
            <h4>
              <i className="fa-solid fa-phone"></i> Phone :
            </h4>
            <p>1800-123-4567, 1800-1800-999</p>
          </div>

          <div className="contact_info_box">
            <h4>
              <i className="fa-solid fa-mobile-screen-button"></i> Mobile :
            </h4>
            <p>+91 12345-67890, (+91) 123 456 7890</p>
          </div>

          <div className="contact_info_box">
            <h4>
              <i className="fa-solid fa-envelope"></i> Email :
            </h4>
            <p>info@etvtalentapp.com, help@etvtalentapp.com</p>
          </div>

          <div className="contact_info_box">
            <h4>
              <i className="fa-solid fa-link"></i>Website :
            </h4>
            <p>www.etvtalentapp.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
