import React, { useEffect, useState } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Viewuser({ item, GetUpdates, filter, project }) {
  const User = useSelector((state) => state.admin.admin);
  const [Item, setItem] = useState();
  const [creator, setCreator] = useState();

  useEffect(() => {
    const GetCreator = async () => {
      try {
        const res = await axiosinstance.get(`/chat/receiver/${item?.userId}`);
        setCreator(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    GetCreator();
  }, [item]);

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

  const HandleFinalize = async () => {
    try {
      const res = await axiosinstance.post(
        `/addedartist/finalize/${item?._id}`
      );
      toast.success(res.data);
      GetUpdates();
    } catch (error) {
      toast.error(error?.response.data);
    }
  };

  const HandleShortlist = async () => {
    try {
      const res = await axiosinstance.post(
        `/addedartist/shortlist/${item?._id}`
      );
      toast.success(res.data);
      GetUpdates();
    } catch (error) {
      toast.error(error?.response.data);
    }
  };

  return (
    <div className="user_view_box">
      <Link to={`/profile/${Item?._id}`}>
        <div className="user_img">
          <img
            src={Item?.ProfilePic ? Item?.ProfilePic : Item?.image1}
            alt=""
          />
        </div>
      </Link>
      <div className="user_view_box_details">
        <Link to={`/profile/${Item?._id}`}>
          <div className="user_details">
            <h2>{Item?.name + ' ' + Item?.surname}</h2>
            <p>By {creator?.username}</p>
          </div>
        </Link>
        {project?.userId === User?._id && !project.islocked && (
          <>
            {item?.shortlisted && !item?.final && (
              <>
                {filter === 'shortlist' && item?.shortlisted && (
                  <i
                    className="fa-solid fa-circle-plus"
                    onClick={HandleFinalize}
                  ></i>
                )}
                <i className="fa-solid fa-trash" onClick={HandleShortlist}></i>
              </>
            )}
            {item?.final && item?.shortlisted && (
              <>
                <i className="fa-solid fa-trash" onClick={HandleFinalize}></i>
              </>
            )}
            {!item?.final && !item?.shortlisted && (
              <>
                <i
                  className="fa-solid fa-circle-plus"
                  onClick={HandleShortlist}
                ></i>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
