import React from 'react';
import Moment from 'react-moment';

export default function CreationHistory({ Creations }) {
  return (
    <div className="user_history_container">
      <div className="user_history_headings">
        <h2>Title</h2>
        <h2>Status</h2>
        <h2>Created Date</h2>
        <h2>Created Time</h2>
      </div>
      <div className="user_history_container_main_data">
        {Creations?.map((item) => {
          return (
            <div className="user_history_container_inner_data" key={item?._id}>
              <h2 className="title">{item?.title}</h2>
              <h2>
                <span
                  className={
                    (item?.status === 1 && 'opened') ||
                    (item?.status === 2 && 'upcoming') ||
                    (item?.status === 3 && 'closed')
                  }
                >
                  {(item?.status === 1 && 'Opened') ||
                    (item?.status === 2 && 'Upcoming') ||
                    (item?.status === 3 && 'Closed')}
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
