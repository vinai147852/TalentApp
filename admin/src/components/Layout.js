import React, { useEffect } from 'react';
import Footer from './Footer/Footer';
import ScrollToTop from './ScrollToTop/ScrollToTop';
import Topbar from './Topbar/Topbar';

export default function Layout({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Topbar />
      {children}
      <ScrollToTop />
      <Footer />
    </>
  );
}
