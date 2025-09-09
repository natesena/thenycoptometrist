"use client";
import { useState } from "react";
import {
  GraduationCap,
  Languages,
  Stethoscope,
  BookOpen,
  UtensilsCrossed,
  Plane,
} from "lucide-react";

const Description = () => {
  const [activeTab, setActiveTab] = useState<"professional" | "personal">(
    "professional"
  );

  return (
    <section id="about-me" className="mx-auto px-4 py-24 lg:py-48 bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* Content */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-federalBlue">
              Dr. Joanna Latek
            </h1>
            <h2 className="text-xl text-charcoal">Comprehensive Optometrist</h2>
          </div>

          {/* Credentials Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-4 justify-center">
              <Stethoscope className="w-6 h-6 text-federalBlue" />
              <h3 className="font-semibold text-lg">
                Board Certified Optometrist
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Medical Eye Care",
                "Glaucoma",
                "Dry Eye Disease",
                "Specialty Contact Lenses",
              ].map((specialty) => (
                <span
                  key={specialty}
                  className="px-4 py-2 bg-federalBlue text-white rounded-md text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center space-x-8 border-b max-w-md mx-auto">
            {["professional", "personal"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "professional" | "personal")}
                className={`pb-2 px-4 transition-colors duration-300 ${
                  activeTab === tab
                    ? "border-b-2 border-federalBlue text-federalBlue"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "professional" ? (
              <>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Dr. Latek is a comprehensive optometrist specializing in all
                    aspects of medical eye care including diagnosing and
                    treating glaucoma, managing diabetic and hypertensive
                    retinopathy, retinal conditions and other eye-related
                    issues.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    She also specializes in diagnosing, managing and treating
                    Dry Eye Disease as well as fitting a wide variety of
                    specialty contact lenses, such as scleral and rigid gas
                    permeable contact lenses, along with Pediatric Myopia
                    Management.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <GraduationCap className="text-federalBlue" />
                    Education
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-2 bg-federalBlue rounded-full" />
                      <span className="text-gray-700 flex-1">
                        Doctor Of Optometry - SUNY College of Optometry,
                        Microcredential Degree in Anterior Segment and Specialty
                        Contact Lenses - SUNY College of Optometry
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 mt-2 bg-federalBlue rounded-full" />
                      <span className="text-gray-700 flex-1">
                        Undergrad - University of Connecticut, Go Huskies!
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center space-x-4">
                  <Languages className="text-federalBlue" />
                  <div className="flex gap-2">
                    {["English", "Polish", "Medical Spanish"].map(
                      (language) => (
                        <span
                          key={language}
                          className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                        >
                          {language}
                        </span>
                      )
                    )}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <a
                    href="https://www.zocdoc.com/doctor/joanna-latek-od-640237"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-federalBlue text-white px-6 py-3 rounded-lg font-medium hover:bg-federalBlue/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    Book Appointment on ZocDoc
                  </a>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  When Dr. Latek is not seeing patients, she enjoys pursuing her
                  personal interests and hobbies.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, text: "Reading" },
                    { icon: UtensilsCrossed, text: "Cooking" },
                    { icon: Plane, text: "Traveling" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="text-federalBlue" />
                      <span className="text-gray-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Description;
