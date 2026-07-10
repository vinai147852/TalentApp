import React, { useEffect } from 'react';
import { useState } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';
import './finalizeartists.scss';
import FinalizeUsers from './FinalizeUsers';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function FinalizeArtists({
  onCloseFinalizePopup,
  addedArtists,
  GetAddedUserUpdates,
  project,
  GetProjectUpdate,
}) {
  const User = useSelector((state) => state.admin.admin);
  const [update, setupdate] = useState(false);
  const [filter, setfilter] = useState('database');
  const [Artists, setArtists] = useState();
  const [filteredArtists, setfilteredArtists] = useState();

  useEffect(() => {
    const filteredItems = Artists?.filter((item) => {
      if (filter === 'database' && item?.From === 1) {
        return item;
      } else if (filter === 'audition' && item?.From === 2) {
        return item;
      } else if (filter === 'admin' && item?.by === 1) {
        return item;
      } else if (filter === 'producer' && item?.by === 2) {
        return item;
      } else if (filter === 'director' && item?.by === 3) {
        return item;
      } else if (filter === 'shortlist' && item?.shortlisted === true) {
        return item;
      } else if (filter === 'final' && item?.final === true) {
        return item;
      }
    });
    setfilteredArtists(filteredItems);
  }, [filter, update, Artists]);

  useEffect(() => {
    setArtists(addedArtists);
  }, [addedArtists, filter, update]);

  const isActive = (index) => {
    if (index === filter) {
      return 'active';
    }
  };

  const GetUpdates = () => {
    setupdate(!update);
    GetAddedUserUpdates();
  };

  const HandleProjectLock = async () => {
    try {
      const res = await axiosinstance.post(
        `/project/lock/unlock/${project?._id}`
      );
      toast.success(res.data);
      GetProjectUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main_popup_finalize">
      <div className="inner_finalize_artists">
        <div className="inner_finalize_artists_header">
          <div className="inner_finalize_artist_Btns">
            <label
              className={isActive('database')}
              onClick={() => {
                setfilter('database');
              }}
            >
              From Database
            </label>
            <label
              className={isActive('audition')}
              onClick={() => {
                setfilter('audition');
              }}
            >
              From Audition
            </label>

            <label
              className={isActive('producer')}
              onClick={() => {
                setfilter('producer');
              }}
            >
              By Line Producer
            </label>
            <label
              className={isActive('director')}
              onClick={() => {
                setfilter('director');
              }}
            >
              By Director
            </label>
            <label
              className={isActive('admin')}
              onClick={() => {
                setfilter('admin');
              }}
            >
              By Sr. Producer
            </label>
            <label
              className={isActive('shortlist')}
              onClick={() => {
                setfilter('shortlist');
              }}
            >
              Short Listed
            </label>
            <label
              className={isActive('final')}
              onClick={() => {
                setfilter('final');
              }}
            >
              Final
            </label>
          </div>
          <div className="close_btn_popup_finalize">
            <i
              className="fa-solid fa-circle-xmark"
              onClick={onCloseFinalizePopup}
            ></i>
          </div>
        </div>
        <div className="inner_finalize_artists_content">
          {filteredArtists?.map((item, index) => {
            return (
              <FinalizeUsers
                item={item}
                key={index}
                GetUpdates={GetUpdates}
                filter={filter}
                project={project}
              />
            );
          })}
        </div>
        {project?.userId === User?._id && filter === 'final' && (
          <div className="lock_icon_project">
            {project?.islocked ? (
              <i className="fa-solid fa-unlock" onClick={HandleProjectLock}></i>
            ) : (
              <i className="fa-solid fa-lock" onClick={HandleProjectLock}></i>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
