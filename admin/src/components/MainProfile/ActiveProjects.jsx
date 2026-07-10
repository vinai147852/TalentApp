import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { axiosinstance } from '../../utils/axiosinstance';

export default function ActiveProjects({ item }) {
  const [Item, setItem] = useState();

  useEffect(() => {
    const GetProjects = async () => {
      try {
        const res = await axiosinstance.get(
          `/project/single/${item?.projectId}`
        );
        setItem(res.data);
      } catch (error) {
        console.logs(error);
      }
    };
    item?.projectId && GetProjects();
  }, [item]);

  return (
    <div className="project_bx">
      <div className="project_img">
        <img src={Item?.image} alt="" />
      </div>
      <div className="project_info">
        <h2>
          {Item?.title}{' '}
          <span
            className={
              (Item?.status === 1 && 'opened') ||
              (Item?.status === 2 && 'upcoming') ||
              (Item?.status === 3 && 'closed')
            }
          >
            {(Item?.status === 1 && 'Opened') ||
              (Item?.status === 2 && 'Upcoming') ||
              (Item?.status === 3 && 'Closed')}
          </span>
        </h2>
        <p>
          Created At : {<Moment date={Item?.createdAt} format="DD-MM-YYYY" />}
        </p>
      </div>
    </div>
  );
}
