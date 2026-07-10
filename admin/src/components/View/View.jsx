import React, { useState } from 'react';
import './view.scss';
import Viewuser from './Viewuser';
import FinalizeArtists from '../FinalizeArtists/FinalizeArtists';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import CreateAudition from '../CreateAudition/CreateAudition';
import DeletePopup from '../DeletePopup/DeletePopup';
import SharePopup from '../SharePopup/SharePopup';

export default function View() {
  const User = useSelector((state) => state.admin.admin);
  const [isedit, setisEdit] = useState(false);
  const [update, setupdate] = useState(false);
  const [isdelete, setisdelete] = useState(false);
  const [isfinalize, setisFinalize] = useState(false);
  const [item, setItem] = useState();
  const [creator, setCreator] = useState();
  const [isshare, setisshare] = useState(false);
  const url = window.location.href;
  const location = useLocation();
  const ItemId = location.pathname.split('/').pop();
  const navigate = useNavigate();

  const onCloseAudition = () => {
    setisEdit(!isedit);
  };

  const oncloseDeletepopup = () => {
    setisdelete(!isdelete);
  };

  const GetItem = async (Id) => {
    try {
      const res = await axiosinstance.get(`/audition/single/${Id}`);
      res.data ? setItem(res.data) : navigate('/audition');
    } catch (error) {
      console.log(error);
      navigate('/auditions');
    }
  };

  const getCreator = async (Id) => {
    try {
      const res = await axiosinstance.get(`/admin/single/${Id}`);
      setCreator(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetUpdates = () => {
    setupdate(!update);
  };

  useMemo(() => {
    GetItem(ItemId);
  }, [ItemId, update]);

  useMemo(() => {
    item?.userId && getCreator(item?.userId);
  }, [item?.userId]);

  const onCloseFinalizePopup = () => {
    setisFinalize(!isfinalize);
  };

  const onCLoseSharePopup = () => {
    setisshare(!isshare);
  };

  return (
    <div className="container" style={{ background: '#f1f1f1' }}>
      {isfinalize && (
        <FinalizeArtists onCloseFinalizePopup={onCloseFinalizePopup} />
      )}

      {isedit && (
        <CreateAudition
          isedit={item}
          onCloseAudition={onCloseAudition}
          GetUpdates={GetUpdates}
        />
      )}

      {isdelete && (
        <DeletePopup
          oncloseDeletepopup={oncloseDeletepopup}
          url={`/audition/delete/${item?._id}`}
          item={{ userId: item?.userId }}
          GetUpdates={GetUpdates}
        />
      )}

      {isshare && (
        <SharePopup
          onCLoseSharePopup={onCLoseSharePopup}
          url={url}
          title={item?.title}
        />
      )}

      <div className="inner_container">
        <Link to="/auditions">
          <button className="back_to_main_btn">
            <i className="fa-solid fa-chevron-left"></i>Back to Auditions
          </button>
        </Link>
        <div className="main_view_container">
          <div className="view_left_container">
            <div className="view_main_img">
              <img src={item?.image} alt="" />
              <span
                className={
                  (item?.status === 1 && `post_status opened`) ||
                  (item?.status === 2 && `post_status upcoming`) ||
                  (item?.status === 3 && `post_status closed`)
                }
              >
                {item?.status === 1 && 'Opened'}
                {item?.status === 2 && 'Upcoming'}
                {item?.status === 3 && 'Closed'}
              </span>
            </div>
            <div className="view_details">
              <h2>{item?.title}</h2>
              <div className="view_realted_details">
                <div className="view_author_info">
                  <img src={creator?.ProfilePic} alt="" />
                  <h4>By {creator?.username}</h4>
                </div>
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
                <Moment date={item?.enddate} format="DD-MM-YYYY" />
              </div>
              <div className="data_side_bar">
                <h3>Audition Type :</h3>
                <p>{item?.type === 1 ? 'Online' : 'Physical'}</p>
              </div>

              <div className="data_side_bar">
                <h3>Total Applied:</h3>
                <p>{item?.applied.length}</p>
              </div>
            </div>
            <div className="view_sidebar_cta">
              {item?.userId === User?._id && (
                <button
                  className="view_sidebar_btns edit"
                  onClick={() => setisEdit(!isedit)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>Edit
                </button>
              )}
              {(item?.userId === User?._id || User?.role === 1) && (
                <button
                  className="view_sidebar_btns delete"
                  onClick={() => setisdelete(!isdelete)}
                >
                  <i className="fa-solid fa-trash"></i> Delete
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
            {item?.applied?.length > 0 && (
              <div className="side_bar_users_box">
                <div className="side_bar_user_heading">
                  <h2>
                    Total Applied
                    <span>{item?.applied?.length}</span>
                  </h2>
                  {/* <i className="fa-solid fa-pen-to-square"></i> */}
                </div>
                <div className="main_view_users">
                  {item?.applied?.map((val) => {
                    return <Viewuser key={val} item={val} audition={item} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
