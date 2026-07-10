import React, { useState } from 'react';
import { useEffect } from 'react';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function AddArtists({ CloseAddedArtists, project }) {
  const User = useSelector((state) => state.admin.admin);
  const [Items, setItems] = useState();
  const [search, setSearch] = useState();
  const [permissions, setpermissions] = useState();
  const [Filtereditems, setFiltereditems] = useState();

  const AddArtist = async (Item) => {
    try {
      const res = await AuthRequest().post('addedartist/add/single', {
        userId: User?._id,
        artistId: Item?._id,
        projectId: project?._id,
        by:
          (User?.role === 2 && 1) ||
          (User?.role === 3 && 2) ||
          (User?.role === 4 && 3),
        from: 1,
      });
      toast.success(res.data);
    } catch (error) {
      toast.error(error?.response.data);
    }
  };

  useEffect(() => {
    const filteredItems = Items?.filter((item) => {
      const username = item.name.concat(item?.surname);
      if (
        username.toLowerCase().includes(search?.toLowerCase().replace(' ', ''))
      ) {
        return item;
      }
    });
    setFiltereditems(filteredItems);
  }, [search]);

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
    User?.role === 4 && getAssistantsPermissions();
  }, [User?._id]);

  useEffect(() => {
    const GetAllArtists = async () => {
      try {
        const res =
          User?.role === 4
            ? await axiosinstance.post('/user/bulk', { bulk: permissions })
            : await axiosinstance.get('/user/all');
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAllArtists();
  }, [permissions]);

  return (
    <div className="main_tab_add_artists">
      <div className="inner_addartist">
        <div className="header_add_artist">
          <div className="serach_bar">
            <input
              type="text"
              placeholder="Search Artists"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <i
            className="fa-solid fa-xmark-circle"
            onClick={CloseAddedArtists}
          ></i>
        </div>
        <div className="body_add_artists">
          {Filtereditems
            ? Filtereditems?.map((item) => {
                return (
                  <div className="artist_main_popup" key={item?._id}>
                    <div className="user_view_box">
                      <div className="user_img">
                        <img src={item?.image1} alt="" />
                      </div>

                      <div className="user_view_box_details">
                        <div className="user_details">
                          <h2>{item?.name + ' ' + item?.surname}</h2>
                          <p>{item?.category}</p>
                        </div>
                        <i
                          className="fa-solid fa-plus-circle"
                          onClick={() => AddArtist(item)}
                        ></i>
                      </div>
                    </div>
                  </div>
                );
              })
            : Items?.map((item) => {
                return (
                  <div className="artist_main_popup" key={item?._id}>
                    <div className="user_view_box">
                      <div className="user_img">
                        <img src={item?.image1} alt="" />
                      </div>

                      <div className="user_view_box_details">
                        <div className="user_details">
                          <h2>{item?.name + ' ' + item?.surname}</h2>
                          <p>{item?.category}</p>
                        </div>
                        <i
                          className="fa-solid fa-plus-circle"
                          onClick={() => AddArtist(item)}
                        ></i>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
