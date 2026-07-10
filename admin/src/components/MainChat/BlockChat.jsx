import React, { useState } from 'react';
import Blockimg from '../../images/block-chat.webp';
import { toast } from 'react-toastify';
import { axiosinstance } from '../../utils/axiosinstance';
import { useGlobalState } from '../../states';
import { GetReceiverId } from './GetReceiverId';
import { useSelector } from 'react-redux';
import socket from '../../socket';

export default function BlockChat({ onCloseBlock }) {
  const User = useSelector((state) => state.admin.admin);
  const [CurrConversation, setCurrConversation] =
    useGlobalState('Cconversation');
  const [loading, setLoading] = useState(false);
  const recieverId =
    CurrConversation && GetReceiverId(CurrConversation?.members, User?._id);

  const HandleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axiosinstance.post(
        `/chat/close/open/${CurrConversation?._id}`
      );

      // Sending Real Time Message ------------------------------------------------------------
      socket.emit('SendisClosed', {
        recieverId,
        isClosed: CurrConversation?.isClosed ? false : true,
      });

      toast.success(res.data);
      setCurrConversation(null);
      onCloseBlock();
      setLoading(false);
    } catch (error) {
      toast.error(error?.response.data);
      setCurrConversation(null);
      onCloseBlock();
      setLoading(false);
    }
  };

  return (
    <div className="chat_blocking_popup">
      <div className="inner_chat_blocker">
        <div className="blocking_popup_image">
          <img src={Blockimg} alt="" />
        </div>
        <h2>
          Are you sure you want to
          {CurrConversation?.isClosed ? ' open' : ' close'} this conversation ?
        </h2>
        <div className="blocker_cta_btns">
          <button className="block" onClick={HandleSubmit}>
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : CurrConversation?.isClosed ? (
              ' Open'
            ) : (
              ' Close'
            )}
          </button>
          <button onClick={onCloseBlock}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
