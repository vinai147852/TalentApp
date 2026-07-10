import React, { useEffect, useState } from 'react';
import './scrolltotop.scss';

export default function ScrollToTop() {
  const [scrollTop, setscrollTop] = useState();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setscrollTop(window.scrollY);
    });
  }, []);

  const HandleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="scrolltotop">
      <button
        className={
          scrollTop > 180 ? 'scrolltotop_btn show' : 'scrolltotop_btn hide'
        }
        onClick={HandleScrollToTop}
      >
        <i className="fa-solid fa-angle-up"></i>
      </button>
    </div>
  );
}
