import React from 'react';
import './notfound.scss';
import NoImg from '../../images/404.jpg';
import { Link } from 'react-router-dom';

export default function Notfound() {
  return (
    <div className="nopage_container">
      <div className="inner_nopage">
        <img src={NoImg} alt="" />
        <Link to="/">
          <button>
            <i className="fa-solid fa-chevron-left"></i> Back to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
}
