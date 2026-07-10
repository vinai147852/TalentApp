import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auditions.scss';
import CreateAudition from '../CreateAudition/CreateAudition';
import DeletePopup from '../DeletePopup/DeletePopup';
import Moment from 'react-moment';
import { axiosinstance } from '../../utils/axiosinstance';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function Auditions({ item, GetUpdates }) {
  const User = useSelector((state) => state.admin.admin);
  const [linkedProject, setLinkedProject] = useState();
  const [isedit, setisEdit] = useState(false);
  const [isdelete, setisdelete] = useState(false);
  const [creator, setcreator] = useState();

  const onCloseAudition = () => {
    setisEdit(!isedit);
  };

  const oncloseDeletepopup = () => {
    setisdelete(!isdelete);
  };

  const GetLinkedProject = async () => {
    try {
      const res = await axiosinstance.get(
        `/project/single/${item?.linkedproject}`
      );
      setLinkedProject(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCreator = async (Id) => {
    try {
      const res = await axiosinstance.get(`/admin/single/${Id}`);
      setcreator(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    item?.linkedproject && GetLinkedProject();
    item?.userId && getCreator(item?.userId);
  }, [item?.userId]);

  return (
    <>
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
                    {item?.status === 1 && 'Opened'}
                    {item?.status === 2 && 'Upcoming'}
                    {item?.status === 3 && 'Closed'}
                  </span>
                )}
              </h2>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    item?.descp.replace(/(<([^>]+)>)/gi, '').slice(0, 130) +
                    '.....',
                }}
              ></p>
              <h4>
                Start Date :{' '}
                <span>
                  <Moment date={item?.startdate} format="DD-MM-YYYY" />
                </span>
              </h4>
              <h4>
                Last Date :{' '}
                <span>
                  {' '}
                  <Moment date={item?.enddate} format="DD-MM-YYYY" />
                </span>
              </h4>
              <h4>
                Created By : <span>{creator?.username}</span>
              </h4>
              <h4>
                Linked Project :{' '}
                <Link to={`/project/${item?.linkedproject}`}>
                  {linkedProject ? linkedProject?.title : ' Not Linked'}
                </Link>
              </h4>
            </div>
          </div>
          <h6>
            Total Applied : <span>{item?.applied?.length}</span>
          </h6>
        </div>
        <div className="card_cta_btns_posts">
          <Link to={`/audition/${item?._id}`}>
            <button>View Details</button>
          </Link>
          <div className="edit_delete_post_btns">
            {item?.userId === User?._id && (
              <label onClick={() => setisEdit(!isedit)}>
                <i className="fa-regular fa-edit"></i>
              </label>
            )}
            {(item?.userId === User?._id || User?.role === 1) && (
              <label onClick={() => setisdelete(!isdelete)}>
                <i className="fa-regular fa-trash-can"></i>
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
