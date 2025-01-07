"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Stethoscope, Users } from "lucide-react";

const AdditionalNote = () => {
  const [activeTab, setActiveTab] = useState("optometrists");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const cardHover = {
    scale: 1.02,
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-white p-4 md:py-48">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Eye Care Professionals in New York
        </motion.h1>

        <div className="flex gap-4 mb-8 justify-center">
          {["optometrists", "ophthalmologists"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-md flex items-center gap-2 text-sm md:text-base transition-colors
                ${
                  activeTab === tab
                    ? "bg-charcoal text-white shadow-lg"
                    : "bg-white text-charcoal hover:bg-blue-50"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "optometrists" ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Stethoscope className="w-4 h-4" />
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            {...fadeIn}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8"
          >
            {activeTab === "optometrists" ? (
              <motion.div className="space-y-6" layout>
                <h2 className="text-2xl font-semibold text-charcoal mb-4">
                  Primary Eye Care Specialists
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Optometrists serve as the first point of contact for patients
                  with vision concerns, providing essential eye care services
                  and preventive measures.
                </p>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={fadeIn}
                >
                  {[
                    {
                      title: "Routine Care",
                      desc: "Comprehensive eye exams and vision testing",
                    },
                    {
                      title: "Vision Correction",
                      desc: "Prescription of corrective lenses and contact lenses",
                    },
                    {
                      title: "Prevention",
                      desc: "Regular screenings and early detection of eye issues",
                    },
                    {
                      title: "Basic Treatment",
                      desc: "Management of common eye conditions",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="bg-blue-50 p-4 rounded-xl"
                      whileHover={cardHover}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="font-semibold text-charcoal mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className="space-y-6" layout>
                <h2 className="text-2xl font-semibold text-charcoal mb-4">
                  Medical Eye Care Specialists
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Ophthalmologists are medical doctors with specialized training
                  in comprehensive eye care, including both medical and surgical
                  treatments.
                </p>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={fadeIn}
                >
                  {[
                    {
                      title: "Surgical Care",
                      desc: "Performance of complex eye surgeries",
                    },
                    {
                      title: "Medical Treatment",
                      desc: "Management of serious eye diseases",
                    },
                    {
                      title: "Advanced Diagnostics",
                      desc: "Specialized testing and treatment planning",
                    },
                    {
                      title: "Systemic Care",
                      desc: "Treatment of eye conditions related to other health issues",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="bg-blue-50 p-4 rounded-xl"
                      whileHover={cardHover}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="font-semibold text-charcoal mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="bg-gradient-to-r from-charcoal to-charcoal rounded-2xl p-6 md:p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Collaborative Care Model</h2>
          </div>
          <p className="leading-relaxed">
            In New York State, optometrists and ophthalmologists work together
            seamlessly in a co-management model. This collaboration ensures
            patients receive the most appropriate care, with smooth referrals
            between providers when needed, such as when surgical intervention is
            required.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdditionalNote;
