import React from 'react';
import Layout from '../components/Layout';
import Banner from '../components/Banner/Banner';
import Faqsection from '../components/Faqsection/Faqsection';

export default function Faq() {
  return (
    <Layout>
      <Banner title="Faqs" />
      <Faqsection />
    </Layout>
  );
}
