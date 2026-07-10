import React from 'react';
import { useSelector } from 'react-redux';
import Aboutone from '../components/AboutUS/AboutOne/Aboutone';
import ArtistApplication from '../components/ArtistApplication/ArtistApplication';
import FeaturedGroup from '../components/Featuredgroup/FeaturedGroup';
import HomeBanner from '../components/HomeBanner/HomeBanner';
import Layout from '../components/Layout';
import Newsletter from '../components/NewsLetter/Newsletter';
import Partners from '../components/Partners/Partners';
import Testimonials from '../components/Testimonial/Testimonials';

export default function Home() {
  const User = useSelector((state) => state.user.user);
  return (
    <Layout>
      <HomeBanner />
      <Partners />
      <Aboutone />
      <FeaturedGroup title="Present Auditions" />
      <ArtistApplication />
      <Testimonials Title="Industry Experts Says" />
      {!User && <Newsletter />}
    </Layout>
  );
}
