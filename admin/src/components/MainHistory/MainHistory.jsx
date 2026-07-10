import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogHistory from './LogHistory';
import './mainhistory.scss';
import { useEffect } from 'react';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import CreationHistory from './CreationHistory';
import CreatedUsers from './CreatedUsers';

export default function MainHistory() {
  const User = useSelector((state) => state.admin.admin);
  const [Tab, setTab] = useState(1);
  const [Logs, setLogs] = useState();
  const [Assistants, setAssistants] = useState();
  const [Creator, setCreator] = useState();
  const [Creations, setCreations] = useState();
  const location = useLocation();
  const UserId = location?.pathname.split('/').pop();

  const GetUserCreations = async () => {
    try {
      const res = await ((Tab === 2 &&
        axiosinstance.get(
          `/audition/single/admin/${
            User?.role === 1 ? UserId : Creator?.userId
          }`
        )) ||
        (Tab === 3 && User?.role === 1
          ? AuthRequest().post(`/project/admins/all`, {
              userId: UserId,
            })
          : AuthRequest().post(`/project/bulk`, {
              bulk: Creator?.projects,
              userId: Creator?.userId,
            })));
      setCreations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetCreator = async () => {
    try {
      const res = await axiosinstance.get(
        User?.role === 1
          ? `/admin/single/${UserId}`
          : `/assistant/single/${UserId}`
      );
      console.log(res.data);
      setCreator(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetUserLogs = async () => {
    try {
      const res = await axiosinstance.get(`/adminlogs/get/${UserId}`);
      setLogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetUsersAssistants = async () => {
    try {
      const res = await AuthRequest().get(`/assistant/all/admin/${UserId}`);
      setAssistants(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    User && Tab === 1 && GetUserLogs();
    User && (Tab === 2 || Tab === 3) && GetUserCreations();
    User && Tab === 4 && GetUsersAssistants();
    GetCreator();
  }, [UserId, Tab]);

  const isActive = (index) => {
    if (index === Tab) {
      return 'active';
    }
  };

  return (
    <div className="container" style={{ background: '#f1f1f1' }}>
      <div className="inner_container">
        <Link to="/admins">
          <button className="back_to_main_btn">
            <i className="fa-solid fa-chevron-left"></i>Back to all
            {User?.role === 1 ? ' admins' : ' users'}
          </button>
        </Link>
        <h2>
          Admin : <span>{Creator?.username}</span>
        </h2>
        <div className="inner_history_container">
          <div className="history_container_tabs">
            <label className={isActive(1)} onClick={() => setTab(1)}>
              Log History
            </label>
            {User?.role === 1 && (
              <>
                <label className={isActive(2)} onClick={() => setTab(2)}>
                  Auditions
                </label>
                <label className={isActive(3)} onClick={() => setTab(3)}>
                  Projects
                </label>
                <label className={isActive(4)} onClick={() => setTab(4)}>
                  Created Users
                </label>
              </>
            )}
          </div>
          <div className="history_container_body">
            {Tab === 1 && <LogHistory Logs={Logs} Creator={Creator} />}
            {Tab === 2 && (
              <CreationHistory Creations={Creations} Creator={Creator} />
            )}
            {Tab === 3 && (
              <CreationHistory Creations={Creations} Creator={Creator} />
            )}
            {Tab === 4 && <CreatedUsers Users={Assistants} />}
          </div>
        </div>
      </div>
    </div>
  );
}
