"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Rounded from '../common/RoundedButton';
import { trackBookNow } from '@/lib/analytics';
import { ZOCDOC_URL } from '@/lib/constants';

const FloatingBookButton = ({ alwaysVisible = false }: { alwaysVisible?: boolean }) => {
  const [isVisible, setIsVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Get hero section height - assuming it's 100vh
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      setIsVisible(scrollPosition > heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [alwaysVisible]);

  const handleBookNow = () => {
    trackBookNow({ location: 'floating-button', page: window.location.pathname, url: ZOCDOC_URL });
    window.open(ZOCDOC_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={handleBookNow}
          className="fixed bottom-2 md:bottom-8 right-2 md:right-8 flex items-center justify-center"
        >
          <Rounded>
            <div className='relative z-10 text-white text-md lg:text-xl'>Book Now</div>
          </Rounded>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingBookButton;