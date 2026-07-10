import React from 'react';
import Banner from '../components/Banner/Banner';
import Layout from '../components/Layout';
import MainAdmins from '../components/MainAdmins/MainAdmins';

export default function Admins() {
  return (
    <Layout>
      <Banner title="Admins" />
      <MainAdmins />
    </Layout>
  );
}
