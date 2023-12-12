import Header from 'layout/header';
import Sidebar from 'layout/sidebar';
import { PropTypes } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';

// eslint-disable-next-line react/prop-types
export default function Layout({ children, isDashBoard,
  setRefetch, isRefetch }) {
  const contentRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(false);
  const handleScrollTop = () => {
    contentRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setScrollTop(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = contentRef.current.scrollTop;

      if (scrollPosition > 300) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    };

    contentRef.current.addEventListener('scroll', handleScroll);
  }, [contentRef]);
  return (
    <>
      <Header isDashBoard={isDashBoard} setRefetch={setRefetch} />
      <div className="flex overflow-hidden">
        <div className="flex-none">
          <Sidebar isRefetch={isRefetch} />
        </div>
        <div className="flex-grow-1 overflow-y-scroll" style={{ height: '90vh' }} ref={contentRef}>{children} </div>
        <Button className={!scrollTop ? 'hidden' : 'button-scroll-top'} icon="pi pi-arrow-up" severity="info" aria-label="User" onClick={handleScrollTop} rounded />
      </div>
    </>
  );
}

Layout.propTypes = {
  isDashBoard: PropTypes.bool,
  setRefetch: PropTypes.func,
  isRefetch: PropTypes.bool,
};
Layout.defaultProps = {
  isDashBoard: false,
  setRefetch: () => null,
  isRefetch: false,
};
