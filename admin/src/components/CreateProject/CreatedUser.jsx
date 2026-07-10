import React from 'react';

export default function CreatedUser({
  value,
  item,
  OnAddNewItem,
  isRemoveable,
  OnRemoveItem,
}) {
  return (
    <div className="user_view_box">
      {item === 1 && (
        <>
          <div className="user_img">
            <img
              src={value?.ProfilePic ? value?.ProfilePic : value?.image1}
              alt=""
            />
          </div>
          <div className="user_view_box_details">
            <div className="user_details">
              <h2>{value?.name + ' ' + value?.surname}</h2>
              <p>{value?.category}</p>
            </div>
            {!isRemoveable ? (
              <i
                className="fa-solid fa-circle-plus"
                onClick={() => {
                  OnAddNewItem({
                    artist: value,
                  });
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-xmark"
                onClick={() => {
                  OnRemoveItem({
                    artist: value,
                  });
                }}
              ></i>
            )}
          </div>
        </>
      )}

      {(item === 2 || item === 3) && (
        <>
          <div className="user_img">
            <img src={value?.ProfilePic} alt="" />
          </div>
          <div className="user_view_box_details">
            <div className="user_details">
              <h2>{value?.username}</h2>
              <p>{value?.email}</p>
            </div>
            {!isRemoveable ? (
              <i
                className="fa-solid fa-circle-plus"
                onClick={() => {
                  if (item === 2) {
                    OnAddNewItem({ producer: value });
                  } else {
                    OnAddNewItem({ director: value });
                  }
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-xmark"
                onClick={() => {
                  if (item === 2) {
                    OnRemoveItem({ producer: value });
                  } else {
                    OnRemoveItem({ director: value });
                  }
                }}
              ></i>
            )}
          </div>
        </>
      )}

      {item === 4 && (
        <>
          <div className="user_img">
            <img src={value?.image} alt="" />
          </div>
          <div className="user_view_box_details">
            <div className="user_details">
              <h2>{value?.title}</h2>
              <p>
                {(value?.status === 1 && 'Opened') ||
                  (value?.status === 2 && 'Upcoming') ||
                  (value?.status === 3 && 'Closed')}
              </p>
            </div>
            {!isRemoveable ? (
              <i
                className="fa-solid fa-circle-plus"
                onClick={() => {
                  OnAddNewItem({
                    audition: value,
                  });
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-xmark"
                onClick={() => {
                  OnRemoveItem({ audition: value });
                }}
              ></i>
            )}
          </div>
        </>
      )}
    </div>
  );
}
