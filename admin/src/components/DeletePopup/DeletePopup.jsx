import React, { useState } from 'react';
import './deletepopup.scss';
import DelSvg from '../../images/delete.jpg';
import AuthRequest from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import { CreateNotification } from '../../utils/CreateNotification';
import { useSelector } from 'react-redux';

export default function DeletePopup({
  oncloseDeletepopup,
  url,
  item,
  GetUpdates,
  isterminate,
  adminDel,
}) {
  const User = useSelector((state) => state.admin.admin);
  const [loading, setLoading] = useState(false);
  const HandleDelete = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().post(url, item && item);
      toast.success(res.data);

      if (adminDel) {
        // Notification Templte -----------------------------------------------------
        const notification_tem = {
          data: {
            image: adminDel?.ProfilePic,
            title: `${User?.username} Deleted Assistant (${adminDel?.username})`,
            desc: `Assistants List`,
          },
          link: `/admins`,
          recieverId: [User?._id],
        };
        CreateNotification(notification_tem);
      }

      setLoading(false);
      GetUpdates();
      oncloseDeletepopup();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="delete_popup_container">
      <div className="inner_delete_popup_container">
        <div className="delete_popup_img">
          <img src={DelSvg} alt="" />
        </div>
        <div className="delete_popup_details">
          <h2>
            Are you sure you want to{' '}
            {isterminate
              ? isterminate === 1
                ? 'Activate ?'
                : 'Terminate ?'
              : 'Delete ?'}
          </h2>
          <p>
            If you click delete you wont get back this. Please check once again.
          </p>
        </div>
        <div className="delete_popup_cta">
          <button className="delete" onClick={HandleDelete}>
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : isterminate ? (
              isterminate === 1 ? (
                'Activate'
              ) : (
                'Terminate'
              )
            ) : (
              'Delete'
            )}
          </button>
          <button onClick={oncloseDeletepopup}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
