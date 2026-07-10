import React from 'react';
import Banner from '../components/Banner/Banner';
import Faqsection from '../components/Faqsection/Faqsection';
import Layout from '../components/Layout';

export default function Faqs() {
  return (
    <Layout>
      <Banner title="Faqs" />
      <Faqsection />
    </Layout>
  );
}
