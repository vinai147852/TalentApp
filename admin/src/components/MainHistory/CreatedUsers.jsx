import React from 'react';
import Moment from 'react-moment';

export default function CreatedUsers({ Users }) {
  return (
    <div className="user_history_container">
      <div className="user_history_headings">
        <h2>Username</h2>
        <h2>Email</h2>
        <h2>Role</h2>
        <h2>Permissions</h2>
        <h2>created Date</h2>
      </div>
      <div className="user_history_container_main_data">
        {Users?.map((item) => {
          return (
            <div className="user_history_container_inner_data" key={item?._id}>
              <h2>{item?.username}</h2>
              <h2>{item?.email}</h2>
              <h2>{item?.role === 3 ? 'Line Producer' : 'Director'}</h2>
              <h2>
                {item?.permissions?.map((item) => {
                  return ' . ' + item?.value;
                })}
              </h2>
              <h2>{<Moment date={item?.createdAt} format="DD-MM-YYYY" />}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
