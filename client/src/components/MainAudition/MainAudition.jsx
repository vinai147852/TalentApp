import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosinstance } from "../../utils/axiosinstance";
import Auditions from "../Auditions/Auditions";
import TopFilter from "../TopFilter/TopFilter";
import "./mainaudition.scss";

export default function MainAudition() {
  const User = useSelector((state) => state.user.user);
  const [Items, setItem] = useState();
  const [Filtereditems, setFiltereditems] = useState();
  const [filter, setFilter] = useState();
  const [updates, setUpdates] = useState(false);

  useEffect(() => {
    setFiltereditems(
      Items?.filter((item) =>
        filter === "4"
          ? item?.applied.includes(User?._id)
          : item?.status.toString() === filter
      )
    );
  }, [filter, Items]);

  useEffect(() => {
    const GetAllAuditions = async () => {
      try {
        const res = await axiosinstance.get("/audition/all");
        setItem(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAllAuditions();
  }, [updates]);

  const GetUpdates = () => {
    setUpdates(!updates);
  };

  const GetFilters = (val) => {
    setFilter(val);
  };

  return (
    <>
      <TopFilter GetFilters={GetFilters} />
      <div className="container" style={{ background: "#f4f4f4" }}>
        <div className="inner_container">
          <div className="main_audition_heading">
            <h2>
              Total Auditions{" "}
              <span>
                (
                {filter && filter !== "0"
                  ? Filtereditems?.length
                  : Items?.length}
                )
              </span>
            </h2>
          </div>
          <div className="main_auditions_grid">
            {filter && filter !== "0"
              ? Filtereditems?.map((item) => {
                  return (
                    <Auditions
                      key={item?._id}
                      item={item}
                      GetUpdates={GetUpdates}
                    />
                  );
                })
              : Items?.map((item) => {
                  return (
                    <Auditions
                      key={item?._id}
                      item={item}
                      GetUpdates={GetUpdates}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
}
