'use client';
import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisWrapperProps {
  children: React.ReactNode;
}

const LenisWrapper: React.FC<LenisWrapperProps> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);
  return <>{children}</>;
};

export default LenisWrapper;
