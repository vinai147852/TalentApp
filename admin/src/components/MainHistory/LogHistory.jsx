import React from 'react';
import Moment from 'react-moment';

export default function LogHistory({ Logs, Creator }) {
  return (
    <div className="user_history_container">
      <div className="user_history_headings">
        <h2>Username</h2>
        <h2>Device</h2>
        <h2>Status</h2>
        <h2>Date</h2>
        <h2>Time</h2>
      </div>
      <div className="user_history_container_main_data">
        {Logs?.map((item) => {
          return (
            <div className="user_history_container_inner_data" key={item?._id}>
              <h2>{Creator?.username}</h2>
              <h2>{item?.device}</h2>
              <h2>
                <span className={item?.status === '1' ? 'login' : 'logout'}>
                  {item?.status === '1' ? 'Login' : 'Logout'}
                </span>
              </h2>
              <h2>{<Moment date={item?.createdAt} format="DD-MM-YYYY" />}</h2>
              <h2>{<Moment date={item?.createdAt} format="HH:MM A" />}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
