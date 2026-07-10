import React, { useEffect } from 'react';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function AddToProject({ onCloseAddProjectPopup, item }) {
  const User = useSelector((state) => state.admin.admin);
  const [search, setSearch] = useState();
  const [Projects, setProjects] = useState();
  const [FilteredProjects, setFilteredProjects] = useState();
  const [assistantProjects, setAssistantProjects] = useState();
  const AllProjects = search ? FilteredProjects : Projects;

  useEffect(() => {
    setFilteredProjects(
      Projects?.filter((item) =>
        item?.title?.toLocaleLowerCase().replaceAll(' ', '')?.includes(search)
      )
    );
  }, [search]);

  useEffect(() => {
    const GetAllItems = async () => {
      try {
        const res =
          (User?.role === 2 &&
            (await AuthRequest().post('/project/admins/all', {
              userId: User?._id,
            }))) ||
          ((User?.role === 3 || User?.role === 4) &&
            (await AuthRequest().post(`/project/bulk`, {
              userId: User?._id,
              bulk: assistantProjects,
            })));
        setProjects(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAllItems();
  }, [User?._id, assistantProjects]);

  useEffect(() => {
    const GetAssistantsProjects = async () => {
      try {
        const res = await axiosinstance.get(`/assistant/single/${User?._id}`);
        setAssistantProjects(res.data.projects);
      } catch (error) {
        console.log(error);
      }
    };
    GetAssistantsProjects();
  }, [User]);

  const AddArtist = async (projectId) => {
    try {
      const res = await AuthRequest().post('addedartist/add/single', {
        userId: User?._id,
        artistId: item?._id,
        projectId: projectId,
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

  return (
    <div className="add_project_container">
      <div className="inner_add_project_container">
        <div className="heading_add_to_project">
          <div className="input_bx">
            <input
              type="search"
              placeholder="Saerch here"
              onChange={(e) =>
                setSearch(
                  e.target.value.toLocaleLowerCase().replaceAll(' ', '')
                )
              }
            />
          </div>
          <label onClick={onCloseAddProjectPopup}>
            <i className="fa-solid fa-xmark"></i>
          </label>
        </div>

        <div className="inner_grid_grojects">
          {AllProjects?.map((item) => {
            return (
              <div className="project_card" key={item?.id}>
                <img src={item?.image} alt="" />
                <h2>{item?.title}</h2>
                <p
                  className={
                    (item?.status === 1 && 'Upcoming') ||
                    (item?.status === 2 && 'Opened') ||
                    (item?.status === 3 && 'Closed')
                  }
                >
                  {(item?.status === 1 && 'Upcoming') ||
                    (item?.status === 2 && 'Opened') ||
                    (item?.status === 3 && 'Closed')}
                </p>
                <button onClick={() => AddArtist(item?._id)}>Add</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
