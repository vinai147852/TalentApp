import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGlobalState } from '../../states';
import { axiosinstance } from '../../utils/axiosinstance';
import { GetReceiverId } from './GetReceiverId';
import Moment from 'react-moment';
import { useEffect } from 'react';

export default function Conversation({ item, Typing }) {
  const User = useSelector((state) => state.admin.admin);
  const [CurrConversation, setCurrConversation] =
    useGlobalState('Cconversation');
  const [Onlineusers] = useGlobalState('Online');
  const [SingleUnreadmsgs, setSingleUnreadmsgs] = useState();
  const [Reciever, setReciever] = useState();
  const [lastmessage, setLastmessage] = useState();
  const recieverId = GetReceiverId(item?.members, User?._id);
  const isOnline = Onlineusers?.some((item) => item?.userId === recieverId);

  // Get Unread Messages Here -----------------------------------------------------------
  const GetUnreadMsgs = async () => {
    try {
      const res = await axiosinstance.post(
        `/chat/unread/messages/${item?._id}`,
        { senderId: User?._id }
      );

      setSingleUnreadmsgs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get  Conversations Last Messages ----------------------------------------------------------------

  const GetLastMessage = async () => {
    try {
      const res = await axiosinstance.get(
        `/chat/get/last/messages/${item?._id}`
      );
      setLastmessage(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const GetReciever = async () => {
    try {
      const res = await axiosinstance.get(`/chat/receiver/${recieverId}`);
      setReciever(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    recieverId && GetReciever();
    item && GetLastMessage();
    item && GetUnreadMsgs();
  }, [recieverId, item]);

  return (
    <div
      className={`${
        Reciever?.isTerminated
          ? 'chat_conversation Fd_name closed'
          : CurrConversation?._id === item?._id
          ? 'chat_conversation Fd_name active'
          : 'chat_conversation Fd_name'
      }`}
      onClick={() => setCurrConversation(item)}
    >
      <div
        className={isOnline ? 'conversation_img active' : 'conversation_img'}
      >
        <img
          src={Reciever?.ProfilePic ? Reciever?.ProfilePic : Reciever?.image1}
          alt=""
        />
      </div>
      <div className="convseration_info">
        <div className="convseration_details">
          <h2>
            {Reciever?.username
              ? Reciever?.username
              : Reciever?.name + ' ' + Reciever?.surname}
          </h2>
          <p>{<Moment date={lastmessage?.createdAt} format="HH:MM A" />}</p>
        </div>
        <div className="conversation_last_message">
          {Typing?.conversationId === item?._id && Typing?.istyping ? (
            <p className="typing">Typing ...</p>
          ) : (
            <p>{lastmessage?.message}</p>
          )}
          {SingleUnreadmsgs?.length > 0 && (
            <span className="unread_msgs">{SingleUnreadmsgs?.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}
