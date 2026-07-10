import React from 'react';
import DoubleCheck from '../../images/doublecheck.png';
import Read from '../../images/Read.png';
import Moment from 'react-moment';

export default function Message({ item, own }) {
  return (
    <div
      className={own ? 'message_box_container own' : 'message_box_container'}
    >
      <div className="message_chat">
        <div className="chat_box_message">
          <p>{item?.message}</p>
          <div className="chat_message_info">
            <label>{<Moment date={item?.createdAt} format="HH:MM" />}</label>
            {own && <img src={item?.isRead ? Read : DoubleCheck} alt="" />}
          </div>
        </div>
      </div>
    </div>
  );
}
