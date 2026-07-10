import React, { useEffect, useState } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';
import { Link } from 'react-router-dom';

export default function Viewuser({ item }) {
  const [Item, setItem] = useState();

  useEffect(() => {
    const GetItem = async () => {
      try {
        const res = await axiosinstance.get(`/user/single/${item?.artistId}`);
        setItem(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    item?.artistId && GetItem();
  }, [item]);

  return (
    <Link to={`/profile/${Item?._id}`}>
      <div className="user_view_box">
        <div className="user_img">
          <img
            src={Item?.ProfilePic ? Item?.ProfilePic : Item?.image1}
            alt=""
          />
        </div>

        <div className="user_view_box_details">
          <div className="user_details">
            <h2>{Item?.name + ' ' + Item?.surname}</h2>
            <p>
              From{' '}
              {(item?.From === 1 && 'Database') ||
                (item?.From === 2 && 'Audition')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
