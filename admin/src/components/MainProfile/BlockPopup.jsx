import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AuthRequest from '../../utils/axiosinstance';
import { CreateNotification } from '../../utils/CreateNotification';

export default function BlockPopup({ OnCloseBlockPopup, item }) {
  const User = useSelector((state) => state.admin.admin);
  const [reason, setReason] = useState();
  const [loading, setLoading] = useState(false);

  const HandleBlockUser = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().post('/block/create', {
        reason,
        userId: User?._id,
        artistId: item?._id,
        username: User?.username,
      });
      toast.success(res.data);
      OnCloseBlockPopup();
      setLoading(false);

      // Notification Templte -----------------------------------------------------

      const notification_tem = {
        data: {
          image: item?.ProfilePic,
          title: `${User?.username} Blocked a artist ${
            item?.name + ' ' + item?.surname
          }`,
          desc: `Block List`,
        },
        link: `/profile/${item?._id}`,
        forAdmins: true,
      };

      CreateNotification(notification_tem);
    } catch (error) {
      toast.error(error?.response.data);
      OnCloseBlockPopup();
      setLoading(false);
    }
  };

  return (
    <div className="user_profile_container">
      <div className="inner_profile_container">
        <div className="block_popup">
          <h2>Add a Reason to Block The User</h2>
          <textarea
            placeholder="Enter Reason"
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          <div className="btns_cta_popup">
            <button onClick={OnCloseBlockPopup} disabled={loading && true}>
              Cancel
            </button>
            <button
              onClick={HandleBlockUser}
              disabled={!reason || (loading && true)}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
