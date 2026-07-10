import React, { useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import { useSelector } from 'react-redux';
import AuthRequest from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import { CreateNotification } from '../../utils/CreateNotification';

export default function ReviewPopup({ OnCloseReviewPopup, item }) {
  const User = useSelector((state) => state.admin.admin);
  const [values, setValues] = useState();
  const [loading, setLoading] = useState(false);

  const HandleAddReview = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().post('/review/create', {
        ...values,
        userId: User?._id,
        artistId: item?._id,
      });
      toast.success(res.data.message);
      OnCloseReviewPopup();
      setLoading(false);

      // Notification Templte -----------------------------------------------------

      const notification_tem = {
        data: {
          image: item?.ProfilePic,
          title: `${User?.username} added a ${
            res.data.data.stars
          } Stars Review to ${item?.name + ' ' + item?.surname}`,
          desc: `Review List`,
        },
        link: `/profile/${item?._id}`,
        forAdmins: true,
      };

      CreateNotification(notification_tem);
    } catch (error) {
      toast.error(error?.response.data);
      OnCloseReviewPopup();
      setLoading(false);
    }
  };

  return (
    <div className="user_profile_container">
      <div className="inner_profile_container">
        <div className="review_popup">
          <h2>Add a Review</h2>
          <div className="stars_popup_review">
            <ReactStars
              count={5}
              size={24}
              isHalf={true}
              onChange={(e) => setValues((prev) => ({ ...prev, ['stars']: e }))}
              edit={true}
              emptyIcon={<i className="fa fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              filledIcon={<i className="fa fa-star"></i>}
              color="#d3d3d3"
            />
          </div>
          <textarea
            placeholder="Enter Reason"
            name="review"
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          ></textarea>
          <div className="btns_cta_popup">
            <button onClick={OnCloseReviewPopup}>Cancel</button>
            <button
              onClick={HandleAddReview}
              disabled={!values?.stars || !values?.review || (loading && true)}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
