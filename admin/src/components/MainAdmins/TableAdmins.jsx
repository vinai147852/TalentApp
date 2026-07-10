import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateUser from '../CreateUser/CreateUser';
import DeletePopup from '../DeletePopup/DeletePopup';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { useGlobalState } from '../../states';
import { axiosinstance } from '../../utils/axiosinstance';

export default function TableAdmins({ item, index, GetUpdates }) {
  const User = useSelector((state) => state.admin.admin);
  const [, setCurrConversation] = useGlobalState('Cconversation');
  const [isedit, setisEdit] = useState(false);
  const [isterminate, setisterminate] = useState(false);
  const navigate = useNavigate();

  // STart Conversation with a user ----------------------------------------------------

  const StartConversation = async () => {
    try {
      const res = await axiosinstance.post('/chat/create/conversation', {
        senderId: User?._id,
        receiverId: item?._id,
      });
      setCurrConversation(res.data);
      navigate('/chat');
    } catch (error) {
      console.log(error);
    }
  };

  const onCloseUserPopup = () => {
    setisEdit(!isedit);
  };

  const oncloseDeletepopup = () => {
    setisterminate(!isterminate);
  };

  return (
    <>
      {isedit && (
        <CreateUser
          onCloseUserPopup={onCloseUserPopup}
          isedit={item}
          GetUpdates={GetUpdates}
        />
      )}

      {isterminate && (
        <DeletePopup
          oncloseDeletepopup={oncloseDeletepopup}
          url={
            User?.role === 1
              ? `/admin/terminate/${item?._id}`
              : `/assistant/delete/${item?._id}`
          }
          item={User?.role === 2 && { userId: User?._id }}
          GetUpdates={GetUpdates}
          isterminate={User?.role === 1 ? (item?.isTerminated ? 1 : 2) : null}
          adminDel={User?.role === 2 && item}
        />
      )}
      <div
        className={
          'user_table' +
          ((User?.role === 1 && item?.isTerminated && ' admin terminated') ||
            (User?.role === 1 && ' admin') ||
            (item?.isTerminated && ' terminated') ||
            '')
        }
      >
        <h2>{index < 10 ? '0' + (index + 1) : index + 1}</h2>
        <Link to={`/history/${item?._id}`}>
          <h2 className="username">
            <img src={item?.ProfilePic} /> {item?.username}
          </h2>
        </Link>
        <h2>{item?.email}</h2>
        {User?.role !== 1 && (
          <h2>{item?.role === 3 ? 'Line Producer' : 'Director'}</h2>
        )}
        <h2>
          <Moment date={item?.createdAt} format="DD-MM-YYYY" />
        </h2>
        <button
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          {!item?.isTerminated && (
            <label onClick={StartConversation}>
              <i className="fa-brands fa-facebook-messenger"></i> Chat
            </label>
          )}
          <label onClick={() => setisEdit(!isedit)}>
            <i className="fa-regular fa-pen-to-square"></i>
            Update
          </label>
          <label onClick={() => setisterminate(!isterminate)}>
            <i className="fa-solid fa-trash"></i>{' '}
            {User?.role === 1
              ? item?.isTerminated
                ? 'Activate'
                : 'Terminate'
              : 'Delete'}
          </label>
        </div>
      </div>
    </>
  );
}
