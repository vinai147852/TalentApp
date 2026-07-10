import React from 'react';
import './homebanner.scss';
import Slide1Img from '../../images/roshan-meka-banner-big.png';
// import Select from 'react-select';
// import { category_options, options_styles } from '../Options';
// import { useSearchParams } from 'react-router-dom';

export default function HomeBanner() {
  // const [search, setsearch] = useSearchParams();
  // const [query, setquery] = useState('');
  // const [category, setcategory] = useState('');
  // const q = search.get('query');
  // const cat = search.get('category');

  // useEffect(() => {
  //   (query || category) && setsearch({ query, category });
  // }, [query, category]);

  // const HandleSearchValues = (e) => {
  //   if (e.target === 'select') {
  //     setcategory(e.value);
  //   } else {
  //     setquery(e.target.value);
  //   }
  // };

  return (
    <div className="main_slider_container">
      <div className="slide">
        <div className="inner_slide">
          <div className="left_slide">
            <div className="Search_employees_main">
              <h2>Search all creative artists here</h2>
              {/* <div className="admin_catogery_search_mainbar">
                <div className="select_cat_admin">
                  <Select
                    styles={options_styles}
                    defaultInputValue={cat || ''}
                    options={category_options}
                    onChange={HandleSearchValues}
                  />
                </div>
                <div className="Search_bar_employee">
                  <input
                    type="text"
                    placeholder="Search Here"
                    defaultValue={q || ''}
                    onChange={HandleSearchValues}
                  />
                  <button>Search</button>
                </div>
              </div> */}
              {/* <div className="Popular_tags">
                <h3>Top search :</h3>
                <div className="popular_tags_grid">
                  <h4>Anchor</h4>
                  <h4>Director</h4>
                  <h4>Heroine</h4>
                  <h4>Music Director</h4>
                </div>
              </div> */}
            </div>
          </div>
          <div className="right_slide">
            <div className="inner_right_slider_image">
              <div className="main_slider_image">
                <img src={Slide1Img} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
