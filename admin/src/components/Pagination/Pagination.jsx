import React, { useState } from 'react';
import './pagination.scss';

export default function Pagination({
  itemsperpage,
  totalitems,
  currentpage,
  onChangePage,
}) {
  const Numbers = [];
  const [currentslide, setcurrentslide] = useState(1);
  const [letnumbers] = useState(10);
  for (let i = 1; i <= Math.ceil(totalitems?.length / itemsperpage); i++) {
    Numbers.push(i);
  }

  const isActive = (index) => {
    if (index === currentpage) {
      return 'pagination_button active';
    } else {
      return 'pagination_button';
    }
  };

  const HandleSlide = (e, index) => {
    e.preventDefault();
    if (index === 'next') {
      setcurrentslide((prev) => (prev += 1));
    } else if (index === 'prev') {
      setcurrentslide((prev) => (prev -= 1));
    }
  };

  const Indexoflastnumber = currentslide * letnumbers;
  const Indexoffirstnumber = Indexoflastnumber - letnumbers;
  const currentnumbers = Numbers.slice(Indexoffirstnumber, Indexoflastnumber);

  return (
    <div className="pagination_container">
      {totalitems?.length > itemsperpage && (
        <div className="inner_pagination_container">
          {Indexoffirstnumber !== 0 && (
            <button
              className="pagination_button next_prev"
              disabled={!Indexoffirstnumber}
              onClick={(e) => {
                HandleSlide(e, 'prev');
              }}
            >
              Prev
            </button>
          )}

          {currentnumbers?.map((number) => {
            return (
              <>
                <button
                  key={number}
                  className={isActive(number)}
                  onClick={() => {
                    onChangePage(number);
                  }}
                >
                  {number}
                </button>
              </>
            );
          })}

          {Indexoflastnumber < Numbers?.length && (
            <button
              className="pagination_button next_prev"
              disabled={Indexoflastnumber >= Numbers?.length}
              onClick={(e) => {
                HandleSlide(e, 'next');
              }}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
