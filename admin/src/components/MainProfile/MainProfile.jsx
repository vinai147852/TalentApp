import React, { useEffect, useState } from 'react';
import './mainprofile.scss';
import ReactStars from 'react-rating-stars-component';
import BlockHistory from './BlockHistory';
import AboutDetails from './AboutDetails';
import Reviews from './Reviews';
import ActiveProjects from './ActiveProjects';
import BlockPopup from './BlockPopup';
import ReviewPopup from './ReviewPopup';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import { CreateNotification } from '../../utils/CreateNotification';
import { useGlobalState } from '../../states';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
// import required modules
import { FreeMode, Thumbs } from 'swiper';
import ImageSlider from '../ImageSlider/ImageSlider';
import AddToProject from './AddToProject';

export default function MainProfile() {
  const User = useSelector((state) => state.admin.admin);
  const [slide, setSlide] = useState(User?.role === 4 ? 2 : 1);
  const [item, setItem] = useState();
  const [isSlider, setisSlider] = useState(false);
  const [isBlockPopup, setisBlockPopup] = useState(false);
  const [isBlocked, setisBlocked] = useState();
  const [blocker, setBlocker] = useState();
  const [isReviewPopup, setisReviewPopup] = useState(false);
  const [isaddtoproject, setisaddtoproject] = useState(false);
  const [Userreviews, setUserreviews] = useState();
  const [UsersProjects, setUsersProjects] = useState();
  const [Overallrating, setOverallrating] = useState();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const location = useLocation();
  const [, setCurrConversation] = useGlobalState('Cconversation');
  const navigate = useNavigate();
  const ItemId = location.pathname.split('/').pop();

  // useEffect(() => {
  //   console.log(item?.facebook.split(':').pop());
  // }, [item]);

  useEffect(() => {
    const getBlocker = async (Id) => {
      try {
        const res = await axiosinstance.get(`/admin/single/${Id}`);
        setBlocker(res.data);
      } catch (error) {
        if (error) {
          try {
            const res = await axiosinstance.get(`/assistant/single/${Id}`);
            setBlocker(res.data);
          } catch (error) {
            console.log(error);
          }
        }
      }
    };
    isBlocked?.userId && getBlocker(isBlocked?.userId);
  }, [isBlocked?.userId]);

  useEffect(() => {
    const GetSingleItem = async () => {
      try {
        const res = await axiosinstance.get(`/user/single/${ItemId}`);
        setItem(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetSingleItem();
  }, []);

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
  }, [item?._id, User?._id, isReviewPopup]);

  // Check if User is Blocked or Not ----------------------------------------------------

  useEffect(() => {
    const isUserBlocked = async () => {
      try {
        const res = await axiosinstance.get(`/block/logs/single/${item?._id}`);
        setisBlocked(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    item?._id && isUserBlocked();
  }, [item?._id, isBlockPopup]);

  // unblock user ----------------------------------------------------------------------
  const HandleUnBlockUser = async () => {
    try {
      const res = await AuthRequest().put(`/block/unblock/${isBlocked?._id}`, {
        userId: isBlocked?.userId,
        artistId: isBlocked?.artistId,
        username: isBlocked?.username,
        isblocked: false,
      });
      toast.success(res.data);
      setisBlocked();

      // Notification Templte -----------------------------------------------------

      const notification_tem = {
        data: {
          image: item?.ProfilePic,
          title: `${User?.username} UnBlocked a artist ${
            item?.name + ' ' + item?.surname
          }`,
          desc: `Block List`,
        },
        link: `/profile/${item?._id}`,
        forAdmins: true,
      };

      CreateNotification(notification_tem);
    } catch (error) {
      toast.error(error?.response.data);
    }
  };

  // Get Users Active Projects ---------------          ------------      ---------
  useEffect(() => {
    const GetActiveProjects = async () => {
      try {
        const res = await axiosinstance.get(
          `/addedartist/user/active/projects/${item?._id}`
        );
        setUsersProjects(
          res.data?.filter((value, index, self) => {
            return (
              self.findIndex((v) => v.projectId === value.projectId) === index
            );
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    item?._id && GetActiveProjects();
  }, [item?._id]);

  // Claculate Rating of a User ------------------------------------------------------------------
  useEffect(() => {
    let Sumratings = 0;
    for (let i = 0; i < Userreviews?.length; i++) {
      Sumratings += Userreviews[i]?.stars;
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

  const isActive = (index) => {
    if (index === slide) {
      return 'active';
    } else {
      return '';
    }
  };

  const OnCloseBlockPopup = () => {
    setisBlockPopup(!isBlockPopup);
  };

  const OnCloseReviewPopup = () => {
    setisReviewPopup(!isReviewPopup);
  };

  const onCloseSlider = () => {
    setisSlider(!isSlider);
  };

  const onCloseAddProjectPopup = () => {
    setisaddtoproject(!isaddtoproject);
  };

  return (
    <>
      <div className="container" style={{ background: '#f1f1f1' }}>
        {isBlockPopup && (
          <BlockPopup OnCloseBlockPopup={OnCloseBlockPopup} item={item} />
        )}
        {isReviewPopup && (
          <ReviewPopup OnCloseReviewPopup={OnCloseReviewPopup} item={item} />
        )}

        {isSlider && <ImageSlider onCloseSlider={onCloseSlider} item={item} />}
        <div className="inner_container">
          <Link to="/artists">
            <button className="back_to_main_btn">
              <i className="fa-solid fa-chevron-left"></i>Back to Artists
            </button>
          </Link>
          {item ? (
            <div className="main_view_profile_container">
              <div className="view_profile_left">
                <div className="view_profile_left_tabs">
                  <div
                    className="images_view_profile"
                    onClick={() => setisSlider(!isSlider)}
                  >
                    <Swiper
                      className="image_profile mySwiper2"
                      loop={true}
                      spaceBetween={10}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      modules={[FreeMode, Thumbs]}
                    >
                      <SwiperSlide>
                        <img src={item?.image1} alt="" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src={item?.image2} alt="" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src={item?.image3} alt="" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src={item?.image4} alt="" />
                      </SwiperSlide>
                    </Swiper>
                  </div>
                  <div className="image_slide_pagination">
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Thumbs]}
                      className="mySwiper"
                    >
                      <SwiperSlide>
                        <img src={item?.image1} alt="" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src={item?.image2} alt="" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src={item?.image3} alt="" />
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src={item?.image4} alt="" />
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>

                <div className="view_profile_left_tabs">
                  <div className="left_profile_headings">
                    <p>Social Media</p>
                  </div>
                  <div className="profile_social_media">
                    <a
                      href={`//${item?.facebook?.split(':').pop()}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${!item?.facebook ? 'disabled' : ''}`}
                    >
                      <div className={`social_icons facebook `}>
                        <i className="fa-brands fa-facebook-f"></i>
                      </div>
                    </a>
                    <a
                      href={`//${item?.twitter?.split(':').pop()}`}
                      target="_blank"
                      rel="noreferrer"
                      className={` ${!item?.twitter ? 'disabled' : ''}`}
                    >
                      <div className={`social_icons twitter`}>
                        <i className="fa-brands fa-twitter"></i>
                      </div>
                    </a>
                    <a
                      href={`//${item?.instagram?.split(':').pop()}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${!item?.instagram ? 'disabled' : ''}`}
                    >
                      <div className={`social_icons instagram`}>
                        <i className="fa-brands fa-instagram"></i>
                      </div>
                    </a>
                    <a
                      href={`//${item?.youtube?.split(':').pop()}`}
                      target="_blank"
                      rel="noreferrer"
                      className={` ${!item?.youtube ? 'disabled' : ''}`}
                    >
                      <div className={`social_icons youtube`}>
                        <i className="fa-brands fa-youtube"></i>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="view_profile_left_tabs">
                  <div className="left_profile_headings">
                    <p>Film Info</p>
                  </div>
                  <div className="portfolio_links">
                    <div className="link_portfolio">
                      {item?.portfolio
                        .map((i) => {
                          return (
                            <a
                              href={`//${i}`}
                              target="_blank"
                              rel="noreferrer"
                              key={i}
                            >
                              <h2>{i}</h2>
                            </a>
                          );
                        })
                        .reverse()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="right_profile_container">
                {isBlocked && (
                  <div className="container_blocked_message">
                    <h2>User Blocked By {blocker?.username}</h2>
                    <p>{isBlocked?.reason}</p>
                  </div>
                )}
                <div className="view_profile_right">
                  <div className="user_profile_details_main">
                    <div className="user_details_profile">
                      <h2>{item?.name + ' ' + item?.surname}</h2>
                      <p>
                        {item?.category} &gt; {item?.subcategory}
                      </p>
                      <p className="users_location">
                        <i className="fa-solid fa-location-dot"></i>
                        {item?.city}
                      </p>
                    </div>
                    <div className="user_ratings_profile">
                      <p>Rating</p>
                      <div className="inner_ratings">
                        {Overallrating > 0 && <h2>{Overallrating}</h2>}
                        <div className="profile_rating_stars">
                          {Overallrating ? (
                            <ReactStars
                              count={5}
                              size={24}
                              isHalf={true}
                              value={Number(Overallrating)}
                              edit={false}
                              emptyIcon={<i className="fa fa-star"></i>}
                              halfIcon={<i className="fa fa-star-half-alt"></i>}
                              filledIcon={<i className="fa fa-star"></i>}
                              color="#d3d3d3"
                            />
                          ) : (
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <ReactStars
                                count={1}
                                size={24}
                                value={0}
                                edit={false}
                                emptyIcon={<i className="fa fa-star"></i>}
                                halfIcon={
                                  <i className="fa fa-star-half-alt"></i>
                                }
                                filledIcon={<i className="fa fa-star"></i>}
                                color="#d3d3d3"
                              />
                              <h4>Not rated yet</h4>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="user_profile_cta">
                      {User?.role !== 4 && (
                        <>
                          {' '}
                          <label
                            className="message"
                            onClick={StartConversation}
                          >
                            <i className="fa-brands fa-facebook-messenger"></i>{' '}
                            Chat Now
                          </label>
                          <label
                            className="block"
                            onClick={() => {
                              isBlocked
                                ? HandleUnBlockUser()
                                : setisBlockPopup(!isBlockPopup);
                            }}
                          >
                            {isBlocked ? (
                              <>
                                <i className="fa-solid fa-circle-check"></i>{' '}
                                Unblock user
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-ban"></i> Block user
                              </>
                            )}
                          </label>
                        </>
                      )}
                      <label
                        className="addreview"
                        onClick={() => setisReviewPopup(!isReviewPopup)}
                      >
                        <i className="fa-solid fa-circle-plus"></i> Add review
                      </label>
                      {(User?.role === 2 ||
                        User?.role === 3 ||
                        User?.role === 4) && (
                        <label
                          className="addproject"
                          onClick={() => setisaddtoproject(true)}
                        >
                          <i className="fa-solid fa-circle-plus"></i> Add to
                          Project
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="user_profile_main_data">
                    <div className="user_profile_tabs">
                      {User?.role !== 4 && (
                        <label
                          className={isActive(1)}
                          onClick={() => setSlide(1)}
                        >
                          About
                        </label>
                      )}
                      <label
                        className={isActive(2)}
                        onClick={() => setSlide(2)}
                      >
                        Reviews <span>({Userreviews?.length})</span>
                      </label>
                      {User?.role !== 4 && (
                        <label
                          className={isActive(3)}
                          onClick={() => setSlide(3)}
                        >
                          Active Projects <span>({UsersProjects?.length})</span>
                        </label>
                      )}
                      {User?.role !== 4 && (
                        <label
                          className={isActive(4)}
                          onClick={() => setSlide(4)}
                        >
                          Block History
                        </label>
                      )}
                    </div>
                    <div className="user_profile_data_details">
                      {slide === 1 && <AboutDetails item={item} />}
                      {slide === 2 && (
                        <div className="display_added_reviews">
                          {Userreviews?.map((review) => {
                            return <Reviews item={review} key={review?._id} />;
                          })}
                        </div>
                      )}
                      {slide === 3 && (
                        <div className="added_projects_user_profile">
                          {UsersProjects?.map((item, index) => {
                            return (
                              <ActiveProjects
                                item={item}
                                key={item?._id + index}
                              />
                            );
                          })}
                        </div>
                      )}
                      {slide === 4 && <BlockHistory item={item} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>

      {isaddtoproject && (
        <AddToProject
          onCloseAddProjectPopup={onCloseAddProjectPopup}
          item={item}
        />
      )}
    </>
  );
}
