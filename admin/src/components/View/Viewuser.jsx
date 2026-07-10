import React, { useEffect, useState } from 'react';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Viewuser({ item, audition }) {
  const User = useSelector((state) => state.admin.admin);
  const [Item, setItem] = useState();
  const [permissions, setpermissions] = useState();

  useEffect(() => {
    const getAssistantsPermissions = async () => {
      try {
        const res = await axiosinstance.get(
          `/assistant/permissions/${User?._id}`
        );
        setpermissions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    (User?.role === 3 || User?.role === 4) && getAssistantsPermissions();
  }, [User?._id]);

  const AddArtistToProject = async () => {
    try {
      const res = await AuthRequest().post('addedartist/add/single', {
        userId: User?._id,
        artistId: Item?._id,
        projectId: audition?.linkedproject,
        by:
          (User?.role === 2 && 1) ||
          (User?.role === 3 && 2) ||
          (User?.role === 4 && 3),
        from: 2,
      });
      toast.success(res.data);
    } catch (error) {
      toast.error(error?.response.data);
    }
  };

  useEffect(() => {
    const GetItem = async () => {
      try {
        const res = await axiosinstance.get(`/user/single/${item}`);
        setItem(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    item && GetItem();
  }, [item]);

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
            <p>{Item?.category}</p>
          </div>
        </Link>
        {(audition?.userId === User?._id ||
          (audition?.userId === User?.userId && User?.role === 3) ||
          permissions?.includes(Item?.category)) &&
          audition.linkedproject && (
            <i
              className="fa-solid fa-circle-plus"
              onClick={AddArtistToProject}
            ></i>
          )}
      </div>
    </div>
  );
}
