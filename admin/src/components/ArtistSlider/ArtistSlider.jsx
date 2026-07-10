import React, { useEffect, useState } from 'react';
import './artistslider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';
import Artist from '../Artist/Artist';
import { axiosinstance } from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';

export default function ArtistSlider({ title, color }) {
  const User = useSelector((state) => state.admin.admin);
  const [Items, setItems] = useState([]);
  const [permissions, setpermissions] = useState([]);
  const PrevRef = useRef(null);
  const NextRef = useRef(null);

  useEffect(() => {
    const getAssistantsPermissions = async () => {
      try {
        const res = await axiosinstance.get(
          `/assistant/permissions/${User?._id}`
        );
        setpermissions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    (User?.role === 3 || User?.role === 4) && getAssistantsPermissions();
  }, [User?._id]);

  useEffect(() => {
    const GetNewArtists = async () => {
      try {
        const res =
          User?.role === 1 || User?.role === 2 || User?.role === 3
            ? await axiosinstance.get('/user/all?new=true')
            : permissions &&
              (await axiosinstance.post('/user/bulk', { bulk: permissions }));
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetNewArtists();
  }, [permissions]);

  return (
    <div className="container" style={{ background: color ? color : '#fff' }}>
      <div className="inner_container">
        <div className="heading_employeeslider">
          <h2>{title}</h2>
          <div className="slider_btns">
            <button ref={PrevRef}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button ref={NextRef}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="employee_main_slider">
          <Swiper
            className="Swipper"
            modules={[Navigation]}
            navigation={{
              prevEl: PrevRef.current,
              nextEl: NextRef.current,
            }}
            spaceBetween={20}
            breakpoints={{
              1000: {
                slidesPerView: 4,
                spaceBetween: 20,
              },

              750: {
                slidesPerView: 3,
                spaceBetween: 20,
              },

              550: {
                slidesPerView: 2,
                spaceBetween: 20,
              },

              250: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
            }}
            slidesPerView={4}
            pagination={{ clickable: true }}
            onBeforeInit={(swip) => {
              swip.params.navigation.prevEl = PrevRef.current;
              swip.params.navigation.nextEl = NextRef.current;
            }}
          >
            {Items?.length > 0 &&
              Items?.map((item) => {
                return (
                  <SwiperSlide key={item?._id}>
                    <Artist item={item} />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
