import React, { useMemo, useState } from "react";
import "./view.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { axiosinstance } from "../../utils/axiosinstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import SharePopup from "../SharePopup/SharePopup";

export default function View() {
  const User = useSelector((state) => state.user.user);
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isshare, setisshare] = useState(false);
  const location = useLocation();
  const url = window.location.href;
  const ItemId = location.pathname.split("/").pop();
  const navigate = useNavigate();

  const HandleApply = async () => {
    setLoading(true);
    try {
      const res = await axiosinstance.post(`/audition/apply/${item?._id}`, {
        userId: User?._id,
      });
      toast.success(res.data);
      setLoading(false);
      setUpdate(!update);
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
      setUpdate(!update);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data);
    }
  };

  const GetItem = async (Id) => {
    try {
      const res = await axiosinstance.get(`/audition/single/${Id}`);
      res.data ? setItem(res.data) : navigate("/auditions");
    } catch (error) {
      console.log(error);
      navigate("/auditions");
    }
  };

  const onCLoseSharePopup = () => {
    setisshare(!isshare);
  };

  useMemo(() => {
    GetItem(ItemId);
  }, [ItemId, update]);

  return (
    <div className="container" style={{ background: "#f1f1f1" }}>
      {isshare && (
        <SharePopup
          onCLoseSharePopup={onCLoseSharePopup}
          url={url}
          item={item}
        />
      )}
      <div className="inner_container">
        {User && (
          <Link to="/auditions">
            <button className="back_to_main_btn">
              <i className="fa-solid fa-chevron-left"></i>Back to Auditions
            </button>
          </Link>
        )}
        <div className="main_view_container">
          <div className="view_left_container">
            <div className="view_main_img">
              <img src={item?.image} alt="" />
            </div>
            <div className="view_details">
              <h2>{item?.title}</h2>
              <div className="view_realted_details">
                <p>
                  <Moment date={item?.createdAt} fromNow />
                </p>
              </div>
              <div
                className="view_description"
                dangerouslySetInnerHTML={{ __html: item?.descp }}
              ></div>
            </div>
          </div>
          <div className="view_right_container">
            <div className="right_view_data_bars">
              <div className="data_side_bar">
                <h3>Start Date :</h3>
                <p>
                  <Moment date={item?.startdate} format="DD-MM-YYYY" />
                </p>
              </div>
              <div className="data_side_bar">
                <h3>Close Date :</h3>
                <p>
                  <Moment date={item?.enddate} format="DD-MM-YYYY" />
                </p>
              </div>
              <div className="data_side_bar">
                <h3>Audition Type</h3>
                <p>
                  {item?.type === 1 && "Online"}
                  {item?.type === 2 && "Physical"}
                </p>
              </div>
              {/* <div className="data_side_bar">
                <h3>Total Applied</h3>
                <p>{item?.applied?.length}</p>
              </div> */}
              <div className="data_side_bar">
                <h3>Status</h3>
                <p>{item?.status === 1 && "Opened"}</p>
                <p>{item?.status === 2 && "Upcoming"}</p>
                <p>{item?.status === 3 && "Closed"}</p>
              </div>
            </div>
            <div className="view_sidebar_cta">
              {User && item?.status === 1 && (
                <button
                  className="view_sidebar_btns apply"
                  onClick={
                    item?.applied.includes(User?._id)
                      ? HandleUnApply
                      : HandleApply
                  }
                >
                  {item?.applied.includes(User?._id) ? (
                    !loading ? (
                      <>
                        <i className="fa-solid fa-circle-xmark"></i> Withdraw
                      </>
                    ) : (
                      <i className="fa fa-spinner fa-spin"></i>
                    )
                  ) : !loading ? (
                    <>
                      <i className="fa-sharp fa-solid fa-circle-check"></i>
                      Apply Now
                    </>
                  ) : (
                    <i className="fa fa-spinner fa-spin"></i>
                  )}
                </button>
              )}
              <button
                className="view_sidebar_btns share"
                onClick={() => setisshare(!isshare)}
              >
                <i className="fa-solid fa-share"></i>
                Share Audition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
