import React, { useEffect, useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import Moment from 'react-moment';
import { axiosinstance } from '../../utils/axiosinstance';

export default function Reviews({ item }) {
  const [creator, setCreator] = useState();

  useEffect(() => {
    const GetCreator = async () => {
      try {
        const res = await axiosinstance.get(`/admin/single/${item?.userId}`);
        setCreator(res.data);
      } catch (error) {
        console.log(error);
        if (error) {
          const res = await axiosinstance.get(
            `/assistant/single/${item?.userId}`
          );
          setCreator(res.data);
        }
      }
    };
    GetCreator();
  }, [item?.userId]);

  return (
    <>
      <div className="review_profile">
        <div className="review_imgs">
          <img src={creator?.ProfilePic} alt="" />
        </div>
        <div className="review_date_profile">
          <div className="review_heading">
            <h2>{creator?.username} </h2>
            <ReactStars
              count={5}
              size={24}
              isHalf={true}
              value={item?.stars}
              edit={false}
              emptyIcon={<i className="fa fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              filledIcon={<i className="fa fa-star"></i>}
              color="#d3d3d3"
            />
          </div>
          <div className="review_values">
            <p>{item?.review}</p>
            <h6>published {<Moment date={item?.createdAt} fromNow />}</h6>
          </div>
        </div>
      </div>
    </>
  );
}
