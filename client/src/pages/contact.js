import React from 'react';
import Banner from '../components/Banner/Banner';
import Contactform from '../components/ContactForm/Contactform';
import ContactMap from '../components/ContactMap/ContactMap';
import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout>
      <Banner title="Contact" />
      <ContactMap />
      <Contactform />
    </Layout>
  );
}
