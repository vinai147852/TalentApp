import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Auditions from '../Auditions/Auditions';
import Projects from '../Projects/Projects';
import './featuredgroup.scss';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';

export default function FeaturedGroup({ title, color, isItem }) {
  const User = useSelector((state) => state?.admin.admin);
  const [items, setitems] = useState();
  const [assistantProjects, setAssistantProjects] = useState();

  const GetAuditions = async () => {
    try {
      const res = await ((User?.role === 1 &&
        axiosinstance.get('/audition/all?new=true')) ||
        (User?.role === 2
          ? axiosinstance.get(`/audition/all?featured=${User?._id}`)
          : axiosinstance.get(`/audition/all?id=${User?.userId}`)));

      setitems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetProjects = async () => {
    try {
      const res = await ((User?.role === 1 &&
        AuthRequest().post('/project/all?limit=4', { userId: User?._id })) ||
        (User?.role === 2
          ? AuthRequest().post(`/project/all?featured=${User?._id}`, {
              userId: User?._id,
            })
          : AuthRequest().post(`/project/bulk`, {
              userId: User?._id,
              bulk: assistantProjects,
            })));
      setitems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetAssistantsProjects = async () => {
    try {
      const res = await axiosinstance.get(`/assistant/single/${User?._id}`);
      setAssistantProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    (User?.role === 3 || User?.role === 4) && GetAssistantsProjects();
  }, [User]);

  useEffect(() => {
    isItem ? GetAuditions() : GetProjects();
  }, [isItem, assistantProjects]);

  return (
    <div className="container" style={{ background: color ? color : '#fff' }}>
      <div className="inner_container">
        <div className="audition_group_heading">
          <h2>{title}</h2>
          <Link to={isItem ? `/auditions` : `/projects`}>
            <p>View all</p>
          </Link>
        </div>
        <div
          className="audition_group_grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${isItem ? 3 : 4},1fr)`,
            gridGap: `${isItem ? 25 : 20}px`,
          }}
        >
          {isItem ? (
            <>
              {items?.map((item) => {
                return <Auditions key={item?._id} item={item} />;
              })}
            </>
          ) : (
            <>
              {items?.map((item) => {
                return <Projects key={item?._id} item={item} />;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
