"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, AlertTriangle, Send, ExternalLink } from "lucide-react";
import { contactLocations } from "@/data";
import { trackBookNow, trackPhoneClick } from "@/lib/analytics";

interface ContactLocation {
  name: string;
  phone: string;
  bookingUrl?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      message: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-charcoal py-32 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-100 max-w-2xl mx-auto"
          >
            Thank you for taking time to get to know me better. I&apos;m here to
            help with any questions you may have.
          </motion.p>
        </div>

        {/* Locations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {contactLocations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {location.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-federalBlue" />
                <a
                  href={`tel:${location.phone}`}
                  onClick={() => trackPhoneClick({
                    location: 'contact-form',
                    phone: location.phone,
                    page: 'contact'
                  })}
                  className="text-federalBlue hover:text-blue-800 transition-colors"
                >
                  {location.phone}
                </a>
              </div>
              {(location as ContactLocation).bookingUrl ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const bookingUrl = (location as ContactLocation).bookingUrl;
                    trackBookNow({
                      location: 'contact-form',
                      page: 'contact',
                      ...(bookingUrl && { url: bookingUrl })
                    });
                    window.open(bookingUrl, "_blank");
                  }}
                  className="w-full px-4 py-2 bg-white border-2 border-federalBlue text-federalBlue rounded-lg
                            hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Book Online
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              ) : (
                <a
                  href={`tel:${location.phone}`}
                  onClick={() => trackPhoneClick({
                    location: 'contact-form-cta',
                    phone: location.phone,
                    page: 'contact'
                  })}
                  className="w-full px-4 py-2 bg-white border-2 border-federalBlue text-federalBlue rounded-lg
                        hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Call to Book Appointment
                  <Phone className="w-4 h-4 text-federalBlue" />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-charcoal">
            Contact Us
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileTap={{ scale: 0.99 }} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 transition-all duration-200 outline-none"
                  required
                />
              </motion.div>

              <motion.div whileTap={{ scale: 0.99 }} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 transition-all duration-200 outline-none"
                  required
                />
              </motion.div>
            </div>

            <motion.div whileTap={{ scale: 0.99 }} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleMessageChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition-all duration-200 outline-none resize-none"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-federalBlue hover:bg-blue-700 text-white py-3 px-6 rounded-lg 
                        transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
            >
              Send Message
              <Send className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Security Warning */}
          <div className="my-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              This is not a secure form. Please do not include any sensitive or
              private medical information. For medical inquiries, please contact
              our offices directly.
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-white text-sm mt-8"
        >
          For urgent matters, please contact our offices directly using the
          phone numbers above.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ContactForm;
