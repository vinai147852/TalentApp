import React from 'react';
import Layout from '../components/Layout';
import Banner from '../components/Banner/Banner';
import Terms from '../components/Terms/Terms';

export default function Conditions() {
  return (
    <Layout>
      <Banner title="Terms & Conditions" />
      <Terms />
    </Layout>
  );
}
