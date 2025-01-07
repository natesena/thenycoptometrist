import React from "react";
import Image from "next/image";
const stats = [
  {
    years: "10+ Years",
    description: "Providing Comprehensive Eye Care Services",
  },
  {
    years: "1,000+ Patients",
    description: "Helping Patients Achieve Better Vision",
  },
  {
    years: "20+ Awards",
    description: "Recognized for Excellence in Vision Care",
  },
  {
    years: "99% Satisfaction Rate",
    description: "Committed to Exceptional Patient Care",
  },
];
const AboutUs = () => {
  return (
    <section id="about" className="py-24 section relative xl:mr-0 lg:mr-5 mr-0">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                <h6 className="text-gray-400 text-lg font-normal leading-relaxed">
                  About Me
                </h6>
                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                  <h2 className="text-white text-4xl lg:text-5xl font-bold font-manrope leading-normal lg:text-start text-center">
                    Revolutionizing Backend Development
                  </h2>
                  <p className="text-gray-400 text-base lg:text-lg font-normal leading-relaxed lg:text-start text-center">
                    At Optimetry, we empower developers to achieve more by
                    providing pre-built backend solutions that integrate
                    seamlessly with their projects. Our mission is to streamline
                    your workflow and enable you to focus on creating
                    exceptional frontend experiences.
                  </p>
                </div>
              </div>
              <div className="w-full flex-col justify-center items-start gap-6 flex">
                <div className="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                    >
                      <h4 className="text-white text-2xl lg:text-3xl font-bold font-manrope leading-9">
                        {stat.years}
                      </h4>
                      <p className="text-gray-400 text-lg font-normal leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className="sm:w-fit w-full group px-3.5 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex">
              <span className="px-1.5 text-gray-600 text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">
                Learn More
              </span>
              <svg
                className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996"
                  stroke="#4F46E5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="w-full lg:justify-start justify-center items-start flex">
            <div className="sm:w-[564px] w-full sm:h-[646px] h-full rounded-3xl sm:border border-gray-200 relative">
              <Image
                width={1000}
                height={1000}
                className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                src="/about-us.webp"
                alt="Optimetry About Us"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
