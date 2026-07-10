import React from 'react';
import Abouttwo from '../components/AboutUS/AboutTwo/Abouttwo';
import Banner from '../components/Banner/Banner';
import Layout from '../components/Layout';
import Services from '../components/Services/Services';
import Testimonials from '../components/Testimonial/Testimonials';

export default function About() {
  return (
    <Layout>
      <Banner title="About" />
      <Abouttwo />
      <Services />
      <Testimonials Title="Experts Testimonials" />
    </Layout>
  );
}
