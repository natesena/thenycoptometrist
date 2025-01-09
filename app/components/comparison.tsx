"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Stethoscope,
  Users,
  BookOpen,
  Award,
  Clock,
  Microscope,
  Heart,
  Zap,
  Scan,
} from "lucide-react";

type Categories = Record<
  | "education"
  | "licensing"
  | "scope"
  | "treatment"
  | "specializations"
  | "procedures"
  | "emergency"
  | "insurance"
  | "prevention",
  CategoryType
>;
  const categories: Categories = {
    education: {
      icon: BookOpen,
      title: "Education & Training",
      optometrist: {
        title: "Doctor of Optometry (OD)",
        points: [
          "4-year undergraduate degree",
          "4 years of optometry school",
          "Optional residency programs",
          "State board licensing",
        ],
      },
      ophthalmologist: {
        title: "Medical Doctor (MD/DO)",
        points: [
          "4-year undergraduate degree",
          "4 years of medical school",
          "3-4 years residency in ophthalmology",
          "Optional fellowship for subspecialization",
        ],
      },
    },
    licensing: {
      icon: Stethoscope,
      title: "Licensing",
      optometrist: {
        title: "Optometry Licensing",
        points: ["Licensed by the New York State Board of Optometry"],
      },
      ophthalmologist: {
        title: "Medical Licensing",
        points: ["Licensed by the New York State Board for Medicine"],
      },
    },
    scope: {
      icon: Eye,
      title: "Scope of Practice",
      optometrist: {
        title: "Primary Vision Care",
        points: [
          "Vision testing & correction",
          "Diagnosis of common eye conditions",
          "Spherical, toric, multifocal and specialty contact lens fitting",
          "Monitoring systemic and ocular health conditions",
          "Diagnosis and treatment of complex eye diseases",
        ],
      },
      ophthalmologist: {
        title: "Medical & Surgical Care",
        points: [
          "Diagnosis and treatment of complex eye diseases",
          "Performing surgical procedures",
          "Advanced medical interventions",
          "Monitoring systemic and ocular health conditions",
        ],
      },
    },
    treatment: {
      icon: Microscope,
      title: "Treatment Abilities",
      optometrist: {
        title: "Non-Surgical Care",
        points: [
          "Prescription eyewear",
          "Medical eye drops",
          "Vision therapy",
          "Minor procedures",
        ],
      },
      ophthalmologist: {
        title: "Full Surgical Care",
        points: [
          "Eye surgery",
          "Laser procedures (e.g., LASIK, PRK)",
          "Injectable treatments",
          "Advanced and complex procedures",
        ],
      },
    },
    specializations: {
      icon: Award,
      title: "Specializations",
      optometrist: {
        title: "Vision Specialties",
        points: [
          "Pediatric optometry",
          "Contact lens fitting",
          "Low vision care",
          "Vision therapy",
        ],
      },
      ophthalmologist: {
        title: "Surgical Specialties",
        points: [
          "Retinal surgery",
          "Corneal transplants",
          "Glaucoma surgery",
          "Oculoplastics",
        ],
      },
    },
    procedures: {
      icon: Scan,
      title: "Laser Procedures",
      optometrist: {
        title: "Referral & Management",
        points: [
          "Provides laser vision correction exams",
          "Refers patients to ophthalmologists for surgeries like LASIK",
          "Handles pre- and post-operative care",
        ],
      },
      ophthalmologist: {
        title: "Surgical Expertise",
        points: [
          "Performs laser surgeries like LASIK, PRK, and YAG capsulotomy",
          "Advanced laser treatments for retinal diseases",
        ],
      },
    },
    emergency: {
      icon: Zap,
      title: "Emergency Care",
      optometrist: {
        title: "Minor Emergencies",
        points: [
          "Treats eye infections",
          "Handles foreign body removal",
          "Manages minor injuries",
        ],
      },
      ophthalmologist: {
        title: "Comprehensive Emergency Care",
        points: [
          "Treats severe eye trauma",
          "Manages complex infections",
          "Performs emergency surgeries",
        ],
      },
    },
    insurance: {
      icon: Heart,
      title: "Insurance Coverage",
      optometrist: {
        title: "Vision Insurance",
        points: [
          "Covers routine eye exams",
          "Includes corrective lenses",
          "Most accept medical and vision insurance",
        ],
      },
      ophthalmologist: {
        title: "Medical Insurance",
        points: [
          "Covers advanced treatments and surgeries",
          "Includes medical eye care and emergency procedures",
          "Most accept medical and vision insurance",
        ],
      },
    },
    prevention: {
      icon: Clock,
      title: "Prevention & Education",
      optometrist: {
        title: "Preventive Vision Care",
        points: [
          "Addresses systemic conditions affecting eyes",
          "Emphasis on vision correction",
          "Education on eye hygiene and safety",
        ],
      },
      ophthalmologist: {
        title: "Disease Prevention",
        points: [
          "Addresses systemic conditions affecting eyes",
          "Focus on advanced disease prevention",
          "Offers medical and surgical solutions",
        ],
      },
    },
  };
const ProfessionalComparison = ({ className }: { className?: string }) => {
  const [activeCategory, setActiveCategory] = useState<
    | "education"
    | "licensing"
    | "scope"
    | "treatment"
    | "specializations"
    | "procedures"
    | "emergency"
    | "insurance"
    | "prevention"
  >("education");
  const [isHoveringOptom, setIsHoveringOptom] = useState(false);
  const [isHoveringOphth, setIsHoveringOphth] = useState(false);



  return (
    <div className={className}>
      <div className="max-w-7xl mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-b text-center text-white">
            Understanding Eye Care Professionals
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Choose the right professional for your eye care needs
          </p>
        </motion.div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(categories).map(([key, category]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setActiveCategory(
                  key as
                    | "education"
                    | "licensing"
                    | "scope"
                    | "treatment"
                    | "specializations"
                    | "procedures"
                    | "emergency"
                    | "insurance"
                    | "prevention"
                )
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all
              ${
                activeCategory === key
                  ? "bg-charcoal text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.title}</span>
            </motion.button>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Optometrist Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHoveringOptom(true)}
            onHoverEnd={() => setIsHoveringOptom(false)}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
            <div className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Eye className="w-8 h-8 text-federalBlue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Optometrist
                  </h3>
                  <p className="text-federalBlue font-medium">
                    {
                      categories[activeCategory as keyof Categories].optometrist
                        .title
                    }
                  </p>
                </div>
              </div>

              <motion.ul
                initial={false}
                animate={{ y: isHoveringOptom ? 0 : 10, opacity: 1 }}
                className="space-y-4"
              >
                {categories[
                  activeCategory as keyof Categories
                ].optometrist.points.map((point, index) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-charcoal" />
                    <span className="text-gray-700">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* Ophthalmologist Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHoveringOphth(true)}
            onHoverEnd={() => setIsHoveringOphth(false)}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50" />
            <div className="relative p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Microscope className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ophthalmologist
                  </h3>
                  <p className="text-purple-600 font-medium">
                    {
                      categories[activeCategory as keyof Categories]
                        .ophthalmologist.title
                    }
                  </p>
                </div>
              </div>

              <motion.ul
                initial={false}
                animate={{ y: isHoveringOphth ? 0 : 10, opacity: 1 }}
                className="space-y-4"
              >
                {categories[
                  activeCategory as keyof Categories
                ].ophthalmologist.points.map((point, index) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-gray-700">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>

        {/* Collaboration Note */}
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
            In  State, optometrists and ophthalmologists work together
            seamlessly in a co-management model. This collaboration ensures
            patients receive the most appropriate care, with smooth referrals
            between providers when needed, such as when surgical intervention is
            required.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalComparison;
