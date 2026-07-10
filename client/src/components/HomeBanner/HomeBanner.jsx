import './homebanner.scss';
import Slide2 from './Slide2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import Slide1 from './Slide1';

export default function HomeBanner() {
  return (
    <Swiper
      navigation={true}
      loop={true}
      pagination={{
        dynamicBullets: true,
      }}
      autoplay={true}
      modules={[Navigation, Pagination]}
      className="main_slider_container mySwiper"
    >
      <SwiperSlide>
        <Slide1 />
      </SwiperSlide>
      <SwiperSlide>
        <Slide2 />
      </SwiperSlide>
    </Swiper>
  );
}
