import React from 'react';
import './imageslider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import { useState } from 'react';

export default function ImageSlider({ onCloseSlider, item }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div className="main_image_slide">
      <div className="inner_image_slider">
        <i className="fa fa-xmark" onClick={() => onCloseSlider()}></i>
        <div className="main_image_sliders">
          <Swiper
            style={{
              '--swiper-navigation-color': '#ffffff',
              '--swiper-pagination-color': '#ffffff',
            }}
            loop={true}
            navigation={true}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
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
        <div className="pagination_image_sliders">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
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
    </div>
  );
}
