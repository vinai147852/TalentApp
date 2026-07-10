import React, { useState, useEffect } from 'react';
import './viewproject.scss';
import Viewuser from './Viewuser';
import FinalizeArtists from '../FinalizeArtists/FinalizeArtists';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { axiosinstance } from '../../utils/axiosinstance';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import DeletePopup from '../DeletePopup/DeletePopup';
import CreateProject from '../CreateProject/CreateProject';
import SharePopup from '../SharePopup/SharePopup';
import AddArtists from './AddArtists';

export default function ViewProject() {
  const User = useSelector((state) => state.admin.admin);
  const [isedit, setisEdit] = useState(false);
  const [update, setupdate] = useState(false);
  const [isdelete, setisdelete] = useState(false);
  const [isfinalize, setisFinalize] = useState(false);
  const [item, setItem] = useState();
  const [assistants, setassistants] = useState();
  const [audition, setaudition] = useState();
  const [creator, setCreator] = useState();
  const [addedArtists, setAddedArtists] = useState();
  const [finalizedArtists, setfinalizedArtists] = useState();
  const [isshare, setisshare] = useState(false);
  const [AddArtist, setAddArtist] = useState(false);
  const url = window.location.href;
  const location = useLocation();
  const ItemId = location.pathname.split('/').pop();
  const navigate = useNavigate();

  const GetProjectAudition = async () => {
    try {
      const res = await axiosinstance.get(
        `/audition/single/${item?.linkedaudition}`
      );
      setaudition(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetProjectAssistants = async () => {
    try {
      const res = await axiosinstance.post(
        `/assistant/project/assigned/${item?._id}`
      );
      setassistants(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetProjectArtists = async () => {
    try {
      const res = await axiosinstance.get(`/addedartist/project/${ItemId}`);
      setAddedArtists(res.data);
      setfinalizedArtists(res.data.filter((item) => item?.final === true));
    } catch (error) {
      console.log(error);
    }
  };

  const GetItem = async (Id) => {
    try {
      const res = await axiosinstance.get(`/project/single/${Id}`);
      res.data ? setItem(res.data) : navigate('/projects');
    } catch (error) {
      console.log(error);
      navigate('/projects');
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

  const onCloseProject = () => {
    setisEdit(!isedit);
  };

  const oncloseDeletepopup = () => {
    setisdelete(!isdelete);
  };

  const GetUpdates = () => {
    setupdate(!update);
  };

  const onCloseFinalizePopup = () => {
    setisFinalize(!isfinalize);
  };

  const onCLoseSharePopup = () => {
    setisshare(!isshare);
  };

  useEffect(() => {
    GetItem(ItemId);
  }, [ItemId, update]);

  useEffect(() => {
    GetProjectAudition();
    GetProjectAssistants();
    item?.userId && getCreator(item?.userId);
    (item?._id || update || AddArtist) && GetProjectArtists();
  }, [item, update, AddArtist]);

  const GetAddedUserUpdates = () => {
    setupdate(!update);
  };

  const CloseAddedArtists = () => {
    setAddArtist(!AddArtist);
  };

  const GetProjectUpdate = () => {
    setupdate(!update);
  };

  return (
    <div className="container" style={{ background: '#f1f1f1' }}>
      {isfinalize && (
        <FinalizeArtists
          onCloseFinalizePopup={onCloseFinalizePopup}
          GetAddedUserUpdates={GetAddedUserUpdates}
          addedArtists={addedArtists}
          project={item}
          GetProjectUpdate={GetProjectUpdate}
        />
      )}

      {isedit && (
        <CreateProject
          isedit={item}
          onCloseProject={onCloseProject}
          GetUpdates={GetUpdates}
        />
      )}

      {isdelete && (
        <DeletePopup
          oncloseDeletepopup={oncloseDeletepopup}
          url={`/project/delete/${item?._id}`}
          item={{ userId: User?._id }}
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
        <Link to="/projects">
          <button className="back_to_main_btn">
            <i className="fa-solid fa-chevron-left"></i>Back to Projects
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
              <h4>
                Project Type : <span>{item?.type}</span>
              </h4>
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
                <h3>Line Producers :</h3>
                {assistants?.map((item) => {
                  if (item?.role === 3) {
                    return <p key={item?._id}>{item?.username} ,</p>;
                  }
                })}
              </div>
              <div className="data_side_bar">
                <h3>Directors :</h3>
                {assistants?.map((item) => {
                  if (item?.role === 4) {
                    return <p key={item?._id}>{item?.username} ,</p>;
                  }
                })}
              </div>
              {audition && (
                <div className="data_side_bar">
                  <h3>Audition :</h3>
                  <Link to={`/audition/${audition?._id}`}>
                    <p>{audition?.title}</p>
                  </Link>
                </div>
              )}
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
              {(item?.userId === User?.userId ||
                item?.userId === User?._id) && (
                <button
                  className="view_sidebar_btns edit"
                  onClick={() => setAddArtist(!AddArtist)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>Recommend Artist
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
                Share Project
              </button>
            </div>
            <div className="side_bar_users_box">
              <div
                className="side_bar_user_heading"
                onClick={() => {
                  setisFinalize(!isfinalize);
                }}
              >
                <h2>
                  Finalized Artists
                  <span>{finalizedArtists?.length}</span>
                </h2>
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div className="main_view_users">
                {finalizedArtists?.map((val, index) => {
                  return <Viewuser key={index} item={val} project={item} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {AddArtist && (
        <AddArtists CloseAddedArtists={CloseAddedArtists} project={item} />
      )}
    </div>
  );
}
