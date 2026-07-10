import React, { useState } from 'react';
import CreateUser from '../CreateUser/CreateUser';
import './mainadmins.scss';
import TableAdmins from './TableAdmins';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import AuthRequest from '../../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';

export default function MainAdmins() {
  const User = useSelector((state) => state.admin.admin);
  const [search, setsearch] = useState();
  const [iscreate, setiscreate] = useState(false);
  const [AllUsers, setAllUsers] = useState();
  const [FilteredUsers, setFilteredUsers] = useState();
  const [update, setupdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const FilterAllUsers = () => {
      const filteredItems = AllUsers?.filter((item) => {
        if (item?.username?.toLowerCase().replace(' ', '').includes(search)) {
          return item;
        } else if (
          item?.email?.toLowerCase().replace(' ', '').includes(search)
        ) {
          return item;
        }
      });
      setFilteredUsers(filteredItems);
    };
    search && FilterAllUsers();
  }, [search]);

  useEffect(() => {
    if (User?.role === 1) {
      return;
    } else if (User?.role === 2) {
      return;
    } else {
      navigate('/');
    }
  }, [User?.role]);

  const onCloseUserPopup = () => {
    setiscreate(!iscreate);
  };

  const GetUpdates = () => {
    setupdate(!update);
  };

  useEffect(() => {
    const GetAllUsers = async () => {
      try {
        const res = await AuthRequest().get(
          User?.role === 1 ? '/admin/all' : `/assistant/all/admin/${User?._id}`
        );
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    GetAllUsers();
  }, [update]);

  return (
    <div className="container" style={{ background: '#f1f1f1' }}>
      {iscreate && (
        <CreateUser
          onCloseUserPopup={onCloseUserPopup}
          GetUpdates={GetUpdates}
        />
      )}
      <div className="inner_container">
        <div className="main_user_table_container">
          <div className="header_user_table_container">
            <div className="search_box_tabel_container">
              <input
                type="text"
                placeholder="Filter Admins"
                onChange={(e) =>
                  setsearch(e.target.value?.toLowerCase()?.replace(' ', ''))
                }
              />
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            <div className="header_adnew_btn">
              <button onClick={() => setiscreate(!iscreate)}>
                <i className="fa-solid fa-plus"></i> Create New
                {User?.role === 1 ? ' Admin' : ' User'}
              </button>
            </div>
          </div>
          <div
            className={
              User?.role === 1 ? 'user_table_head admin' : 'user_table_head'
            }
          >
            <h2>SNo</h2>
            <h2>Username</h2>
            <h2>Email</h2>
            {User?.role !== 1 && <h2>Role</h2>}
            <h2>Created On</h2>
            <h2>Actions</h2>
          </div>
          <div className="user_tabel_body_container">
            {search
              ? FilteredUsers?.map((item, index) => {
                  return (
                    <TableAdmins
                      key={item?._id}
                      item={item}
                      index={index}
                      GetUpdates={GetUpdates}
                    />
                  );
                })
              : AllUsers?.map((item, index) => {
                  return (
                    <TableAdmins
                      key={item?._id}
                      item={item}
                      index={index}
                      GetUpdates={GetUpdates}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
