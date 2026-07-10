import React from 'react';
import ArtistSlider from '../components/ArtistSlider/ArtistSlider';
import FeaturedGroup from '../components/Featuredgroup/FeaturedGroup';
import HomeBanner from '../components/HomeBanner/HomeBanner';
import Layout from '../components/Layout';
import Partners from '../components/Partners/Partners';

export default function Home() {
  return (
    <Layout>
      <HomeBanner />
      <Partners />
      <ArtistSlider title="Recently Joined" color="#f1f1f1" />
      <FeaturedGroup title="Auditions" isItem={1} />
      <FeaturedGroup title="Projects" color="#f1f1f1" />
    </Layout>
  );
}
