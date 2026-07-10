import React from 'react';
import './topfilter.scss';

export default function TopFilter({ GetFilters }) {
  const HanldeFilters = (e) => {
    GetFilters(e.target.value);
  };

  return (
    <div className="main_postfilter">
      <div className="inner_filter">
        <div className="Left_filter_post"></div>
        <div className="Right_filter_post">
          <div className="toggle_filters">
            <label className="switch">
              <input
                type="radio"
                value={0}
                name="filter"
                onChange={HanldeFilters}
              />
              <span className="Slider"></span>
            </label>
            <p>All</p>
          </div>

          <div className="toggle_filters">
            <label className="switch">
              <input
                type="radio"
                value={4}
                name="filter"
                onChange={HanldeFilters}
              />
              <span className="Slider"></span>
            </label>
            <p>Applied</p>
          </div>

          <div className="toggle_filters">
            <label className="switch">
              <input
                type="radio"
                value={1}
                name="filter"
                onChange={HanldeFilters}
              />
              <span className="Slider"></span>
            </label>
            <p>Opened</p>
          </div>

          <div className="toggle_filters">
            <label className="switch">
              <input
                type="radio"
                value={2}
                name="filter"
                onChange={HanldeFilters}
              />
              <span className="Slider"></span>
            </label>
            <p>Upcoming</p>
          </div>

          <div className="toggle_filters">
            <label className="switch">
              <input
                type="radio"
                name="filter"
                value={3}
                onChange={HanldeFilters}
              />
              <span className="Slider"></span>
            </label>
            <p>Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
