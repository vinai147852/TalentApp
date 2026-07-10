import React from 'react';
import './sharepopup.scss';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import moment from 'moment';

export default function SharePopup({ onCLoseSharePopup, url, item }) {
  let data = `
  Title : ${item?.title}
  Description : ${item?.descp?.replace(/(<([^>]+)>)/gi, '').slice(0, 20)}
  Start Date : ${moment(item?.startdate).format('DD-MM-YYYY')}
  End Date : ${moment(item?.enddate).format('DD-MM-YYYY')}
  Type : ${item?.type === 1 ? 'Online' : 'Physical'}
  `;
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
          <FacebookShareButton
            url={url}
            title={data}
            media={item?.image}
            className="facebook"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </FacebookShareButton>
          <LinkedinShareButton
            url={url}
            title={data}
            media={item?.image}
            className="linkedin"
          >
            <i className="fa-brands fa-linkedin"></i>
          </LinkedinShareButton>
          <TwitterShareButton
            url={url}
            title={data}
            media={item?.image}
            className="twitter"
          >
            <i className="fa-brands fa-twitter"></i>
          </TwitterShareButton>
          <WhatsappShareButton
            url={url}
            title={data}
            media={item?.image}
            className="whatsapp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
}
