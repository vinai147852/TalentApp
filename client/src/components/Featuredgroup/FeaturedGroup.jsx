import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Auditions from '../Auditions/Auditions';
import './featuredgroup.scss';
import { useEffect } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';

export default function FeaturedGroup({ title }) {
  const [Items, setItems] = useState([]);
  const [updates, setUpdates] = useState(false);

  useEffect(() => {
    const GetUpcomingPosts = async () => {
      try {
        const res = await axiosinstance.get('/audition/all?new=true');
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetUpcomingPosts();
  }, [updates]);

  const GetUpdates = () => {
    setUpdates(!updates);
  };

  return (
    <div className="container" style={{ background: '#f4f4f4' }}>
      <div className="inner_container">
        <div className="audition_group_heading">
          <h2>{title}</h2>
          <Link to="/auditions">
            <p>View all</p>
          </Link>
        </div>
        <div className="audition_group_grid">
          {Items?.map((item) => {
            return (
              <Auditions
                status="upcoming"
                item={item}
                key={item?._id}
                GetUpdates={GetUpdates}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
