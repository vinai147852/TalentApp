import React from 'react';
import './sharepopup.scss';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

export default function SharePopup({ onCLoseSharePopup, url, title }) {
  return (
    <div className="container_sharepopup">
      <div className="inner_share_popup">
        <div className="share_popup_header">
          <h2>Share Now</h2>
          <i
            className="fa fa-circle-xmark"
            onClick={() => {
              onCLoseSharePopup();
            }}
          ></i>
        </div>
        <div className="share_popup_body">
          <FacebookShareButton url={url} title={title} className="facebook">
            <i className="fa-brands fa-facebook-f"></i>
          </FacebookShareButton>
          <LinkedinShareButton url={url} title={title} className="linkedin">
            <i className="fa-brands fa-linkedin"></i>
          </LinkedinShareButton>
          <TwitterShareButton url={url} title={title} className="twitter">
            <i className="fa-brands fa-twitter"></i>
          </TwitterShareButton>
          <WhatsappShareButton url={url} title={title} className="whatsapp">
            <i className="fa-brands fa-whatsapp"></i>
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
}
