"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Rounded from '../common/RoundedButton';
const FloatingBookButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get hero section height - assuming it's 100vh
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      setIsVisible(scrollPosition > heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPracticeLocations = () => {
    const practiceSection = document.getElementById('locations');
    if (practiceSection) {
      practiceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToPracticeLocations}
          className="fixed bottom-2 md:bottom-8 right-2 md:right-8 flex items-center justify-center"
        >
          <Rounded>
            <button className='relative z-10 text-white text-md lg:text-xl'>Book Now</button>
          </Rounded>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingBookButton;