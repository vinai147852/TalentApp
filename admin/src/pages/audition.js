import React from 'react';
import Banner from '../components/Banner/Banner';
import Layout from '../components/Layout';
import MainAudition from '../components/MainAudition/MainAudition';

export default function Audition() {
  return (
    <Layout>
      <Banner title="Auditions" />
      <MainAudition />
    </Layout>
  );
}
