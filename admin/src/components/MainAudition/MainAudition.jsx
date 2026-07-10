import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosinstance } from '../../utils/axiosinstance';
import Auditions from '../Auditions/Auditions';
import CreateAudition from '../CreateAudition/CreateAudition';
import Pagination from '../Pagination/Pagination';
import TopFilter from '../TopFilter/TopFilter';
import './mainaudition.scss';

export default function MainAudition() {
  const User = useSelector((state) => state.admin.admin);
  const [auditions, setAuditions] = useState();
  const [iscreate, setisCreate] = useState(false);
  const [update, setupdate] = useState(false);
  const [FilteredAuditions, setFilteredAuditions] = useState();
  const [filter, setFilter] = useState();
  const [itemsperpage] = useState(12);
  const [currentpage, setcurrentpage] = useState(1);

  useEffect(() => {
    setFilteredAuditions(
      auditions?.filter((item) => item?.status.toString() === filter)
    );
  }, [filter]);

  const onCloseAudition = () => {
    setisCreate(!iscreate);
  };

  const GetUpdates = () => {
    setupdate(!update);
  };

  const GetFilters = (val) => {
    setFilter(val);
  };

  useEffect(() => {
    const GetAllAuditions = async () => {
      try {
        const res = await axiosinstance.get(
          User?.role === 1
            ? `/audition/all`
            : `/audition/single/admin/${
                User?.role === 2 ? User?._id : User?.userId
              }`
        );
        setAuditions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAllAuditions();
  }, [update]);

  const onChangePage = (index) => {
    setcurrentpage(index);
  };

  const IndexoflastItem = currentpage * itemsperpage;
  const IndexoffirstItem = IndexoflastItem - itemsperpage;
  const currentitems =
    filter && filter !== '0'
      ? FilteredAuditions?.slice(IndexoffirstItem, IndexoflastItem)
      : auditions?.slice(IndexoffirstItem, IndexoflastItem);

  return (
    <>
      <TopFilter GetFilters={GetFilters} />
      {iscreate && (
        <CreateAudition
          onCloseAudition={onCloseAudition}
          GetUpdates={GetUpdates}
        />
      )}
      <div className="container">
        <div className="inner_container">
          <div className="main_audition_heading">
            <h2>
              Total Auditions{' '}
              <span>
                (
                {filter && filter !== '0'
                  ? FilteredAuditions?.length
                  : currentitems?.length}
                )
              </span>
            </h2>
            {User?.role === 2 && (
              <button onClick={() => setisCreate(!iscreate)}>
                <i className="fa-solid fa-plus"></i>Create New Audition
              </button>
            )}
          </div>
          <div className="main_auditions_grid">
            {currentitems?.map((item) => {
              return (
                <Auditions key={item._id} item={item} GetUpdates={GetUpdates} />
              );
            })}
          </div>
          <Pagination
            itemsperpage={itemsperpage}
            totalitems={
              FilteredAuditions?.length ? FilteredAuditions : auditions
            }
            currentpage={currentpage}
            onChangePage={onChangePage}
          />
        </div>
      </div>
    </>
  );
}
