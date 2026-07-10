import React, { useState } from 'react';
import { useEffect } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';
import CreatedUser from './CreatedUser';
import { useSelector } from 'react-redux';

export default function AddUserPopup({
  OnCloseAddUserPopup,
  item,
  OnAddNewItem,
}) {
  const User = useSelector((state) => state.admin.admin);
  const [Items, setItems] = useState();
  const [Filteredtems, setFilteredtems] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    const GetItems = async () => {
      try {
        const res =
          (item === 1 && (await axiosinstance.get('/user/all'))) ||
          (item === 2 &&
            (await axiosinstance.get(
              `/assistant/all/admin/${User?._id}?role=3`
            ))) ||
          (item === 3 &&
            (await axiosinstance.get(
              `/assistant/all/admin/${User?._id}?role=4`
            ))) ||
          (item === 4 &&
            (await axiosinstance.get(`/audition/all?unlinked=${User?._id}`)));
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetItems();
  }, [item]);

  useEffect(() => {
    const FilterItems = () => {
      setFilteredtems(
        Items?.filter(
          (item) =>
            item?.name
              ?.toLocaleLowerCase()
              ?.replace(' ', '')
              ?.includes(search) ||
            item?.surname
              ?.toLocaleLowerCase()
              ?.replace(' ', '')
              ?.includes(search) ||
            item?.title
              ?.toLocaleLowerCase()
              ?.replace(' ', '')
              ?.includes(search) ||
            item?.username
              ?.toLocaleLowerCase()
              ?.replace(' ', '')
              ?.includes(search) ||
            item?.name
              ?.concat(item?.surname)
              ?.toLocaleLowerCase()
              ?.replace(' ', '')
              ?.includes(search)
        )
      );
    };
    FilterItems();
  }, [search]);

  return (
    <div className="add_users_project">
      <div className="add_user_header">
        <input
          type="text"
          placeholder="Search Here"
          onChange={(e) =>
            setSearch(e.target.value.toLocaleLowerCase().replace(' ', ''))
          }
        />
        <i className="fa fa-circle-xmark" onClick={OnCloseAddUserPopup}></i>
      </div>
      <div className="inner_add_user_projects">
        {Filteredtems?.length > 0
          ? Filteredtems?.map((value, index) => {
              return (
                <CreatedUser
                  value={value}
                  item={item}
                  key={index}
                  OnAddNewItem={OnAddNewItem}
                />
              );
            })
          : Items?.map((value, index) => {
              return (
                <CreatedUser
                  value={value}
                  item={item}
                  key={index}
                  OnAddNewItem={OnAddNewItem}
                />
              );
            })}
      </div>
    </div>
  );
}
