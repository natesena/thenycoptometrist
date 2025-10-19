'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, Mail, X } from 'lucide-react';
import styles from './style.module.scss';
import { trackBookNow, trackPhoneClick, trackEmailClick } from '@/lib/analytics';
import { ZOCDOC_URL, PHONE_NUMBER, EMAIL } from '@/lib/constants';

interface ConversionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSlide = {
  initial: { x: 'calc(100% + 100px)' },
  enter: { x: '0', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { x: 'calc(100% + 100px)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
};

export default function ConversionDrawer({ isOpen, onClose }: ConversionDrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBookNow = () => {
    trackBookNow({ location: 'conversion_drawer', page: window.location.pathname });
    window.open(ZOCDOC_URL, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneClick = () => {
    trackPhoneClick({ location: 'conversion_drawer', phone: PHONE_NUMBER });
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleEmailClick = () => {
    trackEmailClick({ location: 'conversion_drawer', email: EMAIL });
    window.location.href = `mailto:${EMAIL}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.div
        className={styles.drawer}
        variants={menuSlide}
        initial="initial"
        animate="enter"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h2 id="drawer-title" className={styles.title}>
              Schedule Your Appointment
            </h2>
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close conversion menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Conversion Options */}
          <div className={styles.options}>
            {/* Book Now - Priority 1 */}
            <button
              onClick={handleBookNow}
              className={`${styles.option} ${styles.primary}`}
              aria-label="Book appointment on ZocDoc"
            >
              <div className={styles.iconWrapper}>
                <Calendar className="w-6 h-6" />
              </div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Book Now</span>
                <span className={styles.optionSubtitle}>Schedule on ZocDoc</span>
              </div>
            </button>

            {/* Call - Priority 2 */}
            <button
              onClick={handlePhoneClick}
              className={styles.option}
              aria-label={`Call ${PHONE_NUMBER}`}
            >
              <div className={styles.iconWrapper}>
                <Phone className="w-6 h-6" />
              </div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Call</span>
                <span className={styles.optionSubtitle}>{PHONE_NUMBER}</span>
              </div>
            </button>

            {/* Email - Priority 3 */}
            <button
              onClick={handleEmailClick}
              className={styles.option}
              aria-label={`Email ${EMAIL}`}
            >
              <div className={styles.iconWrapper}>
                <Mail className="w-6 h-6" />
              </div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Email</span>
                <span className={styles.optionSubtitle}>{EMAIL}</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
