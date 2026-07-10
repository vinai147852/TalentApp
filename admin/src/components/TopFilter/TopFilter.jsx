import React from 'react';
import './topfilter.scss';
import Select from 'react-select';
import { options_styles, project_type } from '../Options';

export default function TopFilter({ GetFilters, isProject, GetType }) {
  const HanldeFilters = (e) => {
    GetFilters(e.target.value);
  };

  return (
    <div className="main_postfilter">
      <div className="inner_filter">
        <div className="Left_filter_post">
          {isProject && (
            <div className="project_filteration">
              <Select
                placeholder="Project Type"
                options={[
                  { value: 'All', label: 'All', name: 'type' },
                  ...project_type,
                ]}
                styles={options_styles}
                onChange={(e) => GetType(e.value)}
              />
            </div>
          )}
        </div>
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
