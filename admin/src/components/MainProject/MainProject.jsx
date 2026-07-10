import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import CreateProject from '../CreateProject/CreateProject';
import Pagination from '../Pagination/Pagination';
import Projects from '../Projects/Projects';
import TopFilter from '../TopFilter/TopFilter';
import './mainproject.scss';

export default function MainProject() {
  const User = useSelector((state) => state.admin.admin);
  const [items, setItems] = useState();
  const [assistantProjects, setAssistantProjects] = useState();
  const [iscreate, setisCreate] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [Filtereditems, setFiltereditems] = useState();
  const [filter, setFilter] = useState();
  const [type, setType] = useState();
  const [itemsperpage] = useState(16);
  const [currentpage, setcurrentpage] = useState(1);

  useEffect(() => {
    const filteration = { status: filter, type: type };
    setFiltereditems(
      items?.filter((item) => {
        if (
          Object.entries(filteration).every(
            ([key, value]) => item[key]?.toString() === value?.toString()
          )
        ) {
          return item;
        } else if (
          filteration.status &&
          !filteration.type &&
          item?.status.toString() === filteration.status.toString()
        ) {
          return item;
        } else if (
          !filteration.status &&
          filteration.type &&
          item?.type === filteration.type
        ) {
          return item;
        } else if (
          filteration.type &&
          filteration.status === '0' &&
          item?.type === filteration.type
        ) {
          return item;
        } else if (
          filteration.type === 'All' &&
          filteration.status &&
          item?.status.toString() === filteration.status.toString()
        ) {
          return item;
        }
      })
    );
  }, [filter, type]);

  useEffect(() => {
    const GetAllItems = async () => {
      try {
        const res =
          (User?.role === 1 &&
            (await AuthRequest().post('/project/all', {
              userId: User?._id,
            }))) ||
          (User?.role === 2 &&
            (await AuthRequest().post('/project/admins/all', {
              userId: User?._id,
            }))) ||
          ((User?.role === 3 || User?.role === 4) &&
            (await AuthRequest().post(`/project/bulk`, {
              userId: User?._id,
              bulk: assistantProjects,
            })));
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAllItems();
  }, [updates, User?._id, assistantProjects]);

  const GetAssistantsProjects = async () => {
    try {
      const res = await axiosinstance.get(`/assistant/single/${User?._id}`);
      setAssistantProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  const GetFilters = (val) => {
    setFilter(val);
  };

  const GetType = (val) => {
    setType(val);
  };

  const onCloseProject = () => {
    setisCreate(!iscreate);
  };

  const GetUpdates = () => {
    setUpdates(!updates);
  };

  const onChangePage = (index) => {
    setcurrentpage(index);
  };

  const IndexoflastItem = currentpage * itemsperpage;
  const IndexoffirstItem = IndexoflastItem - itemsperpage;
  const currentitems =
    (filter && filter !== '0') || (type && type !== 'All')
      ? Filtereditems?.slice(IndexoffirstItem, IndexoflastItem)
      : items?.slice(IndexoffirstItem, IndexoflastItem);

  useEffect(() => {
    (User?.role === 3 || User?.role === 4) && GetAssistantsProjects();
  }, [User]);

  return (
    <>
      <TopFilter GetFilters={GetFilters} isProject={true} GetType={GetType} />
      {iscreate && (
        <CreateProject
          onCloseProject={onCloseProject}
          GetUpdates={GetUpdates}
        />
      )}
      <div className="container">
        <div className="inner_container">
          <div className="main_projects_heading">
            <h2>
              Total Projects{' '}
              <span>
                (
                {Filtereditems?.length > 0
                  ? Filtereditems?.length
                  : currentitems?.length}
                )
              </span>
            </h2>
            {User?.role === 2 && (
              <button onClick={() => setisCreate(!iscreate)}>
                <i className="fa-solid fa-plus"></i>CREATE NEW PROJECT
              </button>
            )}
          </div>
          <div className="main_projects_grid">
            {currentitems?.map((item) => {
              return (
                <Projects key={item?._id} item={item} GetUpdates={GetUpdates} />
              );
            })}
          </div>
          <Pagination
            itemsperpage={itemsperpage}
            totalitems={Filtereditems?.length ? Filtereditems : items}
            currentpage={currentpage}
            onChangePage={onChangePage}
          />
        </div>
      </div>
    </>
  );
}
