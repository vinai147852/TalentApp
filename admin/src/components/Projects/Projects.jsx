import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './projects.scss';
import CreateProject from '../CreateProject/CreateProject';
import DeletePopup from '../DeletePopup/DeletePopup';
import Moment from 'react-moment';
import { axiosinstance } from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';

export default function Projects({ item, GetUpdates }) {
  const User = useSelector((state) => state.admin.admin);
  const [creator, setCreator] = useState();
  const [linkedAudition, setLinkedAudition] = useState();
  const [isedit, setisEdit] = useState(false);
  const [isdelete, setisdelete] = useState(false);

  // Geting Project Data

  useEffect(() => {
    item?.userId && Getcreator();
    item?.linkedaudition && GetLinkedAudition();
  }, [item]);

  const Getcreator = async () => {
    try {
      const res = await axiosinstance.get(`/admin/single/${item?.userId}`);
      setCreator(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetLinkedAudition = async () => {
    try {
      const res = await axiosinstance.get(
        `/audition/single/${item?.linkedaudition}`
      );
      setLinkedAudition(res.data);
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

  return (
    <>
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

      <div className="main_card_project">
        <div className="project_card_image">
          <img src={item?.image} alt="" />
        </div>
        <div className="project_card_info">
          <h3>{item?.title}</h3>
          <h2>
            <span>Project Type :</span>
            {item?.type}
          </h2>
          <h2>
            <span>Created By :</span>
            {creator?.username}
          </h2>
          <h2>
            <span>Created On :</span>
            <Moment date={item?.createdAt} format="DD-MM-YYYY" />
          </h2>
          {linkedAudition && (
            <h2>
              <span>Audition :</span>
              <Link to={`/audition/${linkedAudition?._id}`}>
                {linkedAudition ? linkedAudition?.title : 'Not Linked'}
              </Link>
            </h2>
          )}
          <h2
            className={
              (item?.status === 1 && 'opened') ||
              (item?.status === 2 && 'upcoming') ||
              (item?.status === 3 && 'closed')
            }
          >
            <span>Status :</span>
            {item?.status === 1 && 'Opened'}
            {item?.status === 2 && 'Upcoming'}
            {item?.status === 3 && 'Closed'}
          </h2>
        </div>
        <div className="project_view_btn">
          <Link to={`/project/${item?._id}`}>
            <button>View Project</button>
          </Link>
          <div className="edit_delete_btns_project">
            {item?.userId === User?._id && (
              <i
                className="fa-regular fa-edit"
                onClick={() => setisEdit(!isedit)}
              ></i>
            )}
            {(item?.userId === User?._id || User?.role === 1) && (
              <i
                className="fa-regular fa-trash-can"
                onClick={() => setisdelete(!isdelete)}
              ></i>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
