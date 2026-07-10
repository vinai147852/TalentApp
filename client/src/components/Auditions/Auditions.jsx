import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auditions.scss";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { axiosinstance } from "../../utils/axiosinstance";
import { toast } from "react-toastify";
import AuditionCtaPopup from "./AuditionCtaPopup";

export default function Auditions({ item, GetUpdates }) {
  const User = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [isCtaPopup, setisCtaPopup] = useState(false);

  const HandleApply = async () => {
    setLoading(true);
    try {
      const res = await axiosinstance.post(`/audition/apply/${item?._id}`, {
        userId: User?._id,
      });
      toast.success(res.data);
      setLoading(false);
      GetUpdates();
      onCloseCtaPopup();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data);
    }
  };

  const HandleUnApply = async () => {
    setLoading(true);
    try {
      const res = await axiosinstance.post(`/audition/unapply/${item?._id}`, {
        userId: User?._id,
      });
      toast.success(res.data);
      setLoading(false);
      GetUpdates();
      onCloseCtaPopup();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data);
    }
  };

  const onCloseCtaPopup = () => {
    setisCtaPopup(!isCtaPopup);
  };

  return (
    <>
      <div className="main_post_card">
        <div className="Post_card_image">
          <img src={item?.image} alt="" />
        </div>
        <div className="card_info_details">
          <div className="admin_card_post_heading">
            <div className="admin_details_post_card_left">
              <h2>
                {item?.title}
                {item?.status && (
                  <span
                    className={
                      (item?.status === 1 && `post_status opened`) ||
                      (item?.status === 2 && `post_status upcoming`) ||
                      (item?.status === 3 && `post_status closed`)
                    }
                  >
                    {item?.status === 1 && "Open"}
                    {item?.status === 2 && "Upcoming"}
                    {item?.status === 3 && "Closed"}
                  </span>
                )}
              </h2>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    item?.descp.replace(/(<([^>]+)>)/gi, "").slice(0, 130) +
                    ".....",
                }}
              ></p>
              <h4>
                Start Date :
                <span>
                  <Moment date={item?.startdate} format="DD-MM-YYYY" />
                </span>
              </h4>
              <h4>
                Last Date :
                <span>
                  <Moment date={item?.enddate} format="DD-MM-YYYY" />
                </span>
              </h4>
            </div>
          </div>
          <h6>
            Type : <span>{item?.type === 1 ? "Online" : "Physical"}</span>
          </h6>
        </div>
        <div className="card_cta_btns_posts">
          <Link to={`/audition/${item?._id}`}>
            <button>View Details</button>
          </Link>
          {User && item.status === 1 && (
            <button
              className={
                !item?.applied.includes(User?._id) ? "apply" : "apply active"
              }
              onClick={() => setisCtaPopup(!isCtaPopup)}
            >
              {loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : !item?.applied.includes(User?._id) ? (
                "Apply Now"
              ) : (
                "Withdraw"
              )}
            </button>
          )}
        </div>
      </div>
      {isCtaPopup && (
        <AuditionCtaPopup
          onCloseCtaPopup={onCloseCtaPopup}
          loading={loading}
          onPress={
            !item?.applied.includes(User?._id) ? HandleApply : HandleUnApply
          }
          state={!item?.applied.includes(User?._id) ? 1 : 2}
        />
      )}
    </>
  );
}
