import React, { useEffect, useState } from 'react';
import './artist.scss';
import { Link, useNavigate } from 'react-router-dom';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';
import ReactStars from 'react-rating-stars-component';
import { useGlobalState } from '../../states';

export default function Artist({ item }) {
  const User = useSelector((state) => state.admin.admin);
  const [, setCurrConversation] = useGlobalState('Cconversation');
  const [Userreviews, setUserreviews] = useState();
  const [Overallrating, setOverallrating] = useState();
  const [isBlocked, setisBlocked] = useState();
  const navigate = useNavigate();

  const GetAge = () => {
    const dateofbirth = new Date(item?.dateofbirth);
    const today = new Date();
    const ageyear = dateofbirth.getFullYear();
    const currentyear = today.getFullYear();
    const age = currentyear - ageyear;
    return `${age} yrs`;
  };

  // STart Conversation with a user ----------------------------------------------------

  const StartConversation = async () => {
    try {
      const res = await axiosinstance.post('/chat/create/conversation', {
        senderId: User?._id,
        receiverId: item?._id,
      });
      setCurrConversation(res.data);
      navigate('/chat');
    } catch (error) {
      console.log(error);
    }
  };

  // Get Users Reviews Here --------------------------------------------------------------

  useEffect(() => {
    const GetSingleUsersreview = async () => {
      try {
        const res = await AuthRequest().post(`/review/user/all/${item?._id}`, {
          userId: User?._id,
        });
        setUserreviews(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetSingleUsersreview();
  }, [item?._id]);

  // Claculate Rating of a User ------------------------------------------------------------------
  useEffect(() => {
    let Sumratings = 0;
    for (let i = 0; i < Userreviews?.length; i++) {
      Sumratings += Userreviews[i].stars;
    }
    const max_count_users = Userreviews?.length * 5;
    const rating = (Sumratings * 5) / max_count_users;
    if (parseInt(rating) === rating) {
      setOverallrating(Math.floor(rating));
    } else if (!rating) {
      setOverallrating(0);
    } else {
      setOverallrating(rating.toFixed(1));
    }
  }, [Userreviews]);

  useEffect(() => {
    const isUserBlocked = async () => {
      try {
        const res = await axiosinstance.get(`/block/logs/single/${item?._id}`);
        setisBlocked(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    isUserBlocked();
  }, [item?._id]);

  return (
    <div className="employee_card">
      <div className="employee_card_img">
        <img src={item?.ProfilePic ? item?.ProfilePic : item?.image1} />

        {isBlocked && (
          <div className="isblocked">
            <i className="fa-solid fa-flag"></i>
          </div>
        )}
      </div>
      <div className="employee_card_info">
        <h2>{item?.name + ' ' + item?.surname}</h2>
        <p>
          {item?.category} &gt; {item?.subcategory}
        </p>
        <div className="employee_card_details">
          <label>
            Age : <span>{GetAge()}</span>
          </label>
        </div>
        <div className="employee_card_details">
          <label>
            Gender : <span>{item?.gender}</span>
          </label>
        </div>
        <div className="artist_social_icons">
          <a
            href={`//${item?.facebook?.split(':').pop()}`}
            target="_blank"
            rel="noreferrer"
            className={!item?.facebook ? 'disabled' : ''}
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a
            href={`//${item?.twitter?.split(':').pop()}`}
            target="_blank"
            rel="noreferrer"
            className={!item?.twitter ? 'disabled' : ''}
          >
            <i className="fa-brands fa-twitter "></i>
          </a>

          <a
            href={`//${item?.instagram?.split(':').pop()}`}
            target="_blank"
            rel="noreferrer"
            className={!item?.instagram ? 'disabled' : ''}
          >
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a
            href={`//${item?.youtube?.split(':').pop()}`}
            target="_blank"
            rel="noreferrer"
            className={!item?.youtube ? 'disabled' : ''}
          >
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>
        <div className="employee_card_rating">
          <h4>
            {Overallrating ? (
              <ReactStars
                count={5}
                size={18}
                isHalf={true}
                value={Number(Overallrating)}
                edit={false}
                emptyIcon={<i className="fa fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                filledIcon={<i className="fa fa-star"></i>}
                color="#d3d3d3"
              />
            ) : (
              'Not rated yet'
            )}
            <p>({Userreviews?.length})</p>
          </h4>
        </div>
      </div>
      <div className="employee_card_cta">
        <Link to={`/profile/${item?._id}`}>
          <p>View Profile</p>
        </Link>
        <h4 onClick={StartConversation}>
          <i className="fa-brands fa-facebook-messenger"></i>
        </h4>
      </div>
    </div>
  );
}
