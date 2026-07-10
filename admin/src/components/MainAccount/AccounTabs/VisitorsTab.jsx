import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import AuthRequest from '../../../utils/axiosinstance';
import Moment from 'react-moment';

export default function VisitorsTab() {
  const [tab, setTab] = useState(2);
  const [Visitors, setVisitors] = useState();
  const [UniqueVisitors, setUniqueVisitors] = useState();

  useEffect(() => {
    const GetVisitors = async () => {
      try {
        const res = await AuthRequest().get(`/visitor/get`);
        setVisitors(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetVisitors();
  }, [tab]);

  useEffect(() => {
    Visitors &&
      setUniqueVisitors(
        Visitors?.filter((value, index, self) => {
          return self.findIndex((v) => v.ip === value.ip) === index;
        })
      );
  }, [Visitors]);

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>
          Total visitors from around the world <span>{Visitors?.length}</span>
        </h2>
        <p>Country wise list of users who visited the website.</p>
      </div>
      <div className="inner_visitors_tabs">
        <div className="visitors_tab_header">
          <label
            className={tab === 2 ? 'active' : ''}
            onClick={() => setTab(2)}
          >
            New Visitors <span>{UniqueVisitors?.length}</span>
          </label>
          <label
            className={tab === 1 ? 'active' : ''}
            onClick={() => setTab(1)}
          >
            Frequent Visitors <span>{Visitors?.length}</span>
          </label>
        </div>
        <div className="visitor_table">
          <div className="visitor_table_header">
            <h2>No</h2>
            <h2>Ip Address</h2>
            <h2>Country</h2>
            <h2>Status</h2>
            <h2>Visited At</h2>
          </div>
          <div className="vistors_main_body_table">
            {tab === 1
              ? Visitors?.map((item, index) => {
                  return (
                    <div className="visitor_details" key={item?._id}>
                      <h2>{index + 1}</h2>
                      <h2>{item?.ip}</h2>
                      <h2>{item?.country}</h2>
                      <h2>
                        <span className={item?.isRegistered ? 'active' : ''}>
                          {item?.isRegistered
                            ? 'Registered'
                            : 'Frequent Visitor'}
                        </span>
                      </h2>
                      <h2>
                        <Moment
                          date={item?.createdAt}
                          format="DD-MM-YYYY hh:mm A"
                        />
                      </h2>
                    </div>
                  );
                })
              : UniqueVisitors?.map((item, index) => {
                  return (
                    <div className="visitor_details" key={item?._id}>
                      <h2>{index + 1}</h2>
                      <h2>{item?.ip}</h2>
                      <h2>{item?.country}</h2>
                      <h2>
                        <span className={item?.isRegistered ? 'active' : ''}>
                          {item?.isRegistered ? 'Registered' : 'New Visitor'}
                        </span>
                      </h2>
                      <h2>
                        <Moment
                          date={item?.createdAt}
                          format="DD-MM-YYYY hh:mm A"
                        />
                      </h2>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
