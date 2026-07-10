import React from 'react';
import Banner from '../components/Banner/Banner';
import Layout from '../components/Layout';
import MainProject from '../components/MainProject/MainProject';

export default function Project() {
  return (
    <Layout>
      <Banner title="Projects" />
      <MainProject />
    </Layout>
  );
}
