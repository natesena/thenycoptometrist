"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { reviews } from "@/data";
import styles from "./style.module.scss";

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalReviewsOnZocDoc = 49; // Total reviews on ZocDoc (23 with text, 26 rating-only)
  const displayableReviews = reviews.length; // Reviews with text that we can show (23)
  const reviewsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const getReviewsToShow = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return reviewsPerPage.desktop;
      if (window.innerWidth >= 768) return reviewsPerPage.tablet;
    }
    return reviewsPerPage.mobile;
  }, [reviewsPerPage.desktop, reviewsPerPage.tablet, reviewsPerPage.mobile]);

  const [reviewsToShow, setReviewsToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setReviewsToShow(getReviewsToShow());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getReviewsToShow]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, displayableReviews - reviewsToShow);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 4000); // Reduced interval for better UX

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviewsToShow, displayableReviews]);

  const nextReview = () => {
    const maxIndex = Math.max(0, displayableReviews - reviewsToShow);
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    setIsAutoPlaying(true); // Resume auto-play after manual navigation
  };

  const prevReview = () => {
    const maxIndex = Math.max(0, displayableReviews - reviewsToShow);
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
    setIsAutoPlaying(true); // Resume auto-play after manual navigation
  };

  const goToReview = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
    setIsAutoPlaying(true); // Resume auto-play after manual navigation
  };

  // Calculate current slide for pagination
  const getCurrentSlide = () => {
    return Math.floor(currentIndex / reviewsToShow);
  };

  const totalSlides = Math.ceil(displayableReviews / reviewsToShow);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    // ZocDoc dates are in relative format like "Less than 1 month ago"
    // Return them as-is without attempting to parse
    return dateString;
  };

  const getVisibleReviews = () => {
    const endIndex = Math.min(currentIndex + reviewsToShow, displayableReviews);
    return reviews.slice(currentIndex, endIndex);
  };

  return (
    <section
      id="reviews"
      className="bg-white pt-0 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-charcoal">
            Patient Reviews
          </h2>
          <p className="text-xl text-federalBlue max-w-2xl mx-auto">
            Hear what our patients have to say about their experience with Dr. Latek
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevReview}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`${styles.navButton} ${styles.navButtonLeft} absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300`}
            style={{ marginLeft: '-1.5rem' }}
          >
            <ChevronLeft className="w-6 h-6 text-charcoal" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextReview}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`${styles.navButton} ${styles.navButtonRight} absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-300`}
            style={{ marginRight: '-1.5rem' }}
          >
            <ChevronRight className="w-6 h-6 text-charcoal" />
          </motion.button>

          {/* Reviews Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`grid gap-6 items-stretch ${
                reviewsToShow === 1 ? 'grid-cols-1' : 
                reviewsToShow === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {getVisibleReviews().map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className={`${styles.reviewCard} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden h-full flex flex-col`}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-federalBlue/5 to-transparent pointer-events-none" />
                  
                  {/* Quote icon */}
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-federalBlue/20" />
                  
                  <div className="relative z-10">
                    {/* Header with avatar and info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-federalBlue text-white rounded-full flex items-center justify-center font-semibold text-sm mr-4">
                        {review.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-charcoal text-lg">
                          {review.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service badge */}
                    {review.service && (
                      <div className="mb-4">
                        <span className="inline-block bg-federalBlue/10 text-federalBlue px-3 py-1 rounded-full text-sm font-medium">
                          {review.service}
                        </span>
                      </div>
                    )}

                    {/* Review content */}
                    <p className="text-gray-700 leading-relaxed mb-4 flex-grow">
                      &ldquo;{review.review}&rdquo;
                    </p>

                    {/* Location */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                      <span className="text-sm text-gray-500">
                        {review.location}
                      </span>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <motion.button
                key={slideIndex}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => goToReview(slideIndex * reviewsToShow)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  getCurrentSlide() === slideIndex
                    ? "bg-federalBlue shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-8 bg-gray-50 rounded-2xl px-8 py-4">
              <div>
                <div className="text-2xl font-bold text-charcoal">4.92</div>
                <div className="flex justify-center mb-1">
                  {renderStars(4.92)}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <div className="text-2xl font-bold text-charcoal">{totalReviewsOnZocDoc}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;