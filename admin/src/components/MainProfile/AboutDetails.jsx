import React from 'react';

export default function AboutDetails({ item }) {
  const GetAge = () => {
    const dateofbirth = new Date(item?.dateofbirth);
    const today = new Date();
    const ageyear = dateofbirth.getFullYear();
    const currentyear = today.getFullYear();
    const age = currentyear - ageyear;
    return `${age} yrs`;
  };

  return (
    <div className="user_profile_about_details">
      <div className="heading_user_profile">Contact Information</div>
      <div className="details_user_profile_about">
        <div className="data_about_profile">
          <h4>Phone Number</h4>
          <h2>+{item?.mobileno}</h2>
        </div>
        <div className="data_about_profile">
          <h4>Email</h4>
          <h2>{item?.email}</h2>
        </div>
        <div className="data_about_profile">
          <h4>Address</h4>
          <h2>
            {item?.house +
              ', ' +
              item?.street +
              ', ' +
              item?.colony +
              ', ' +
              item?.zip}
          </h2>
        </div>
      </div>
      <div className="heading_user_profile">Basic Information</div>
      <div className="details_user_profile_about basic_info">
        <div className="data_about_profile">
          <h4>Age</h4>
          <h2>{GetAge()}</h2>
        </div>
        <div className="data_about_profile">
          <h4>Gender</h4>
          <h2>{item?.gender}</h2>
        </div>
        <div className="data_about_profile">
          <h4>Mother language</h4>
          <h2>{item?.motherlanguage}</h2>
        </div>
        <div className="data_about_profile">
          <h4>Known languages</h4>
          <h2>
            {item?.knownlanguages?.map((i) => {
              return i.value + ' , ';
            })}
          </h2>
        </div>
        <div className="data_about_profile">
          <h4>Height</h4>
          <h2>{item?.height}</h2>
        </div>
        <div className="data_about_profile">
          <h4>Weight</h4>
          <h2>{item?.weight} kg</h2>
        </div>
      </div>

      <div className="heading_user_profile">Vital Measurments</div>
      <div className="details_user_profile_about basic_info">
        <div className="data_about_profile">
          <h4>Chest</h4>
          <h2>{item?.chest} in</h2>
        </div>
        <div className="data_about_profile">
          <h4>Waist</h4>
          <h2>{item?.waist} in</h2>
        </div>
        <div className="data_about_profile">
          <h4>Hips</h4>
          <h2>{item?.hips} in</h2>
        </div>
        <div className="data_about_profile">
          <h4>Shoulders</h4>
          <h2>{item?.shoulders} in</h2>
        </div>
      </div>
    </div>
  );
}
