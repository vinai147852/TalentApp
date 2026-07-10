import React from 'react';
import './artistfilter.scss';
import Select from 'react-select';
import { useState } from 'react';
import {
  category_options,
  gender_options,
  languages_options,
  options_styles,
  state_options,
  subcategory_options,
} from '../Options';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function ArtistFilter({ GetFilters }) {
  let [filter, setFilter] = useState();
  const category_ref = useRef();
  const subcategory_ref = useRef();
  const gender_ref = useRef();
  const language_ref = useRef();
  const age_ref = useRef();
  const state_ref = useRef();

  useEffect(() => {
    GetFilters(filter);
  }, [filter]);

  const HandleFilter = (e) => {
    if (e !== null) {
      if (typeof e.name === 'string') {
        setFilter({ ...filter, [e.name]: e.value });
      } else {
        setFilter({
          ...filter,
          [e.target.name]: e.target.value?.toLowerCase().replace(' ', ''),
        });
      }
    }
  };

  const HandleRemoveFilter = (val) => {
    if (val === 'category') {
      const { category, ...others } = filter;
      category_ref.current.setValue(null);
      Object.keys(others)?.length > 0 ? setFilter(others) : setFilter();
      category.replace(' ', '');
    } else if (val === 'subcategory') {
      const { subcategory, ...others } = filter;
      subcategory_ref.current.setValue(null);
      Object.keys(others)?.length > 0 ? setFilter(others) : setFilter();
      subcategory.replace(' ', '');
    } else if (val === 'gender') {
      const { gender, ...others } = filter;
      gender_ref.current.setValue(null);
      Object.keys(others)?.length > 0 ? setFilter(others) : setFilter();
      gender.replace(' ', '');
    } else if (val === 'motherlanguage') {
      const { motherlanguage, ...others } = filter;
      language_ref.current.setValue(null);
      Object.keys(others)?.length > 0 ? setFilter(others) : setFilter();
      motherlanguage.replace(' ', '');
    } else if (val === 'age') {
      const { age, ...others } = filter;
      age_ref.current.setValue(null);
      Object.keys(others)?.length > 0 ? setFilter(others) : setFilter();
      age.replace(' ', '');
    } else if (val === 'state') {
      const { state, ...others } = filter;
      state_ref.current.setValue(null);
      Object.keys(others)?.length > 0 ? setFilter(others) : setFilter();
      state.replace(' ', '');
    }
  };

  useEffect(() => {
    subcategory_ref.current.setValue(null);
    filter?.subcategory && HandleRemoveFilter('subcategory');
  }, [filter?.category]);

  return (
    <>
      <div className="artist_filter">
        <div className="inner_artist_filter">
          <div className="inputs_artist_filter">
            <div className="input_general">
              <input
                type="text"
                name="search"
                placeholder="Search Here...."
                onChange={HandleFilter}
              />
              <button>Search</button>
            </div>
          </div>
        </div>
      </div>
      <div className="category_inner_bar">
        <div className="category_inner_selects_grid">
          <div className="select_artist_filter">
            <div className="select_bx">
              <Select
                ref={category_ref}
                styles={options_styles}
                options={category_options}
                placeholder="Category"
                onChange={HandleFilter}
              />
            </div>
            <div className="select_bx">
              <Select
                ref={subcategory_ref}
                styles={options_styles}
                isDisabled={!filter?.category}
                options={subcategory_options?.filter(
                  (item) => item?.target === filter?.category
                )}
                placeholder="Sub Category"
                onChange={HandleFilter}
              />
            </div>
            <div className="select_bx">
              <Select
                ref={gender_ref}
                styles={options_styles}
                options={gender_options}
                placeholder="Gender"
                onChange={HandleFilter}
              />
            </div>
            <div className="select_bx">
              <Select
                ref={language_ref}
                styles={options_styles}
                options={languages_options}
                placeholder="Language"
                onChange={HandleFilter}
              />
            </div>
            <div className="select_bx">
              <Select
                ref={age_ref}
                styles={options_styles}
                placeholder="Age"
                options={[
                  { value: 'kids', label: 'Kids', name: 'age' },
                  { value: 'teengaers', label: 'Teenagers', name: 'age' },
                  { value: 'above 20', label: 'Above 20', name: 'age' },
                ]}
                onChange={HandleFilter}
              />
            </div>
            <div className="select_bx">
              <Select
                ref={state_ref}
                styles={options_styles}
                options={state_options}
                placeholder="Location"
                onChange={HandleFilter}
              />
            </div>
          </div>
          {filter && (
            <div className="added_filters_artist">
              {filter?.category && (
                <label className="filter_added">
                  {filter?.category}{' '}
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => HandleRemoveFilter('category')}
                  ></i>
                </label>
              )}
              {filter?.subcategory && (
                <label className="filter_added">
                  {filter?.subcategory}{' '}
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => HandleRemoveFilter('subcategory')}
                  ></i>
                </label>
              )}
              {filter?.gender && (
                <label className="filter_added">
                  {filter?.gender}{' '}
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => HandleRemoveFilter('gender')}
                  ></i>
                </label>
              )}
              {filter?.motherlanguage && (
                <label className="filter_added">
                  {filter?.motherlanguage}{' '}
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => HandleRemoveFilter('motherlanguage')}
                  ></i>
                </label>
              )}

              {filter?.age && (
                <label className="filter_added">
                  {filter?.age}{' '}
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => HandleRemoveFilter('age')}
                  ></i>
                </label>
              )}

              {filter?.state && (
                <label className="filter_added">
                  {filter?.state}{' '}
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => HandleRemoveFilter('state')}
                  ></i>
                </label>
              )}

              {filter && (
                <label
                  className="filter_added clear"
                  onClick={() => {
                    setFilter();
                    category_ref.current.setValue(null);
                    subcategory_ref.current.setValue(null);
                    gender_ref.current.setValue(null);
                    language_ref.current.setValue(null);
                    age_ref.current.setValue(null);
                    state_ref.current.setValue(null);
                  }}
                >
                  Clear all
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
