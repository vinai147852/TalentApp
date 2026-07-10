import React, { useState } from 'react';
import { useEffect } from 'react';
import Moment from 'react-moment';
import { axiosinstance } from '../../utils/axiosinstance';

export default function BlockHistory({ item }) {
  const [Items, setItems] = useState();

  useEffect(() => {
    const GetBlockLogs = async () => {
      try {
        const res = await axiosinstance.get(
          `/block/logs/user/all/${item?._id}`
        );
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetBlockLogs();
  }, [item?.asrtistId]);

  return (
    <div className="user_block_history_table">
      <div className="heading_block_history">
        <h2>Blocked By</h2>
        <h2>Action</h2>
        <h2>Reason</h2>
        <h2>Date</h2>
      </div>
      {Items?.map((i) => {
        return (
          <div className="body_blocked_history" key={i?._id}>
            <h2>{i?.username}</h2>
            <h2>
              <span className={i?.isblocked ? 'danger' : 'success'}>
                {i?.isblocked ? 'Blocked' : 'UnBlocked'}
              </span>
            </h2>
            <p>{i?.reason}</p>
            <h2>{<Moment date={i?.createdAt} format="DD-MM-YYYY" />}</h2>
          </div>
        );
      })}
    </div>
  );
}
