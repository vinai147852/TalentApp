import React from "react";
import "./notifications.scss";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosinstance } from "../../utils/axiosinstance";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { useGlobalState } from "../../states";

export default function Notifications() {
  const User = useSelector((state) => state.user.user);
  const [Notifications, setNotifications] = useGlobalState("Notification");
  const [, setUnreadNotifications] = useGlobalState("UnReadnotification");
  const [Arrivalnotification] = useGlobalState("Arrivalnotification");

  useEffect(() => {
    const GetAllNotifications = async () => {
      try {
        const res = await axiosinstance.get(`/notification/get/all`);
        setNotifications(
          res.data.filter(
            (item) =>
              (!item.deleteIds?.includes(User?._id) &&
                item.recieverId?.includes(User?._id)) ||
              (item.forAll === true &&
                Date.parse(item?.createdAt) > Date.parse(User?.createdAt))
          )
        );

        setUnreadNotifications(
          res.data.filter(
            (item) =>
              (!item.deleteIds?.includes(User?._id) &&
                item.recieverId?.includes(User?._id)) ||
              (item.forAll === true &&
                Date.parse(item?.createdAt) > Date.parse(User?.createdAt) &&
                !item?.isRead?.includes(User?._id))
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    GetAllNotifications();
  }, [User?._Id, Arrivalnotification]);

  return (
    <div className="notification_container">
      <div className="notification_heading">
        <h2>
          Notifications <span>{Notifications?.length}</span>
        </h2>
      </div>
      <div className="main_notifications_container">
        {Notifications?.map((item) => {
          return (
            <Link to={item?.link ? item?.link : "/"} key={item?._id}>
              <div className="notification">
                <div className="notification_img">
                  <img src={item?.data.image} alt="" />
                </div>
                <div className="notification_info">
                  <h2>
                    <span>{item?.data.title}</span>
                    <p>
                      <span>{<Moment date={item?.createdAt} fromNow />}</span> .{" "}
                      {item?.data?.desc}
                    </p>
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
