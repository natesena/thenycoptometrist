import React from "react";
import Image from "next/image";
const ContactUs = () => {
  return (
    <section
      className="py-24 section lg:h-[100vh] flex justify-center items-center"
      id="contact"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex gap-x-24 clear-left md:mb-16 mb-10">
          <div className=" md:mb-0 mb-4">
            <h2 className="text-white font-manrope text-4xl lg:text-6xl font-semibold leading-10 mb-5 md:text-left text-center">
              Get In Touch
            </h2>
            <p className="text-gray-300 text-lg font-normal leading-7 mb-7 md:text-left text-center">
              Whether you have a concern or simply want to say hello, We are
              here to facilitate communication with you.
            </p>
            <div className="flex md:items-center md:justify-start justify-center">
              <button className="w-36 h-12 rounded-xl bg-blue-600 transition-all duration-700 hover:bg-indigo-800 shadow text-white text-center text-base font-semibold leading-6">
                Contact Us
              </button>
            </div>
          </div>
          <div className="border-l-2 md:border-white-600 border-white px-10 py-6">
            <div className="mb-8">
              <h6 className="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">
                Email Address
              </h6>
              <h3 className="text-white text-xl font-semibold leading-8 md:text-start text-center">
                thenycoptometrist@nyc.com
              </h3>
            </div>
            <div>
              <h6 className="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">
                Phone Number
              </h6>
              <h3 className="text-white text-xl font-semibold leading-8 md:text-start text-center">
                470-601-1911
              </h3>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
          <div className="h-96 relative flex justify-center">
            <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50" />
            <Image
              height={1000}
              width={1000}
              src="/uk.png"
              alt="United Kingdom image"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 mb-6 text-center px-6">
              <h5 className="text-white text-lg font-semibold leading-7 mb-2">
                United Kingdom
              </h5>
              <p className="text-white text-base font-medium leading-6">
                123 High Street, Westminster, London
              </p>
            </div>
          </div>
          <div className="h-96 relative flex justify-center">
            <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50" />
            <Image
              height={1000}
              width={1000}
              src="/germany.png"
              alt="Germany image"
              className="w-full h-full  object-cover"
            />
            <div className="absolute bottom-0 mb-6 text-center px-6">
              <h5 className="text-white text-lg font-semibold leading-7 mb-2">
                Germany
              </h5>
              <p className="text-white text-base font-medium leading-6">
                101 Unter den Linden, Mitte <br />
                District, Berlin
              </p>
            </div>
          </div>
          <div className="h-96 relative flex justify-center">
            <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50" />
            <Image
              width={1000}
              height={1000}
              src="/france.png"
              alt="France image"
              className="w-full h-full  object-cover"
            />
            <div className="absolute bottom-0 mb-6 text-center px-6">
              <h5 className="text-white text-lg font-semibold leading-7 mb-2">
                France
              </h5>
              <p className="text-white text-base font-medium leading-6">
                456 Rue de la Paix, 8th Arrondissement, Paris
              </p>
            </div>
          </div>
          <div className="h-96 relative flex justify-center">
            <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50" />
            <Image
              width={1000}
              height={1000}
              src="/switzerland.png"
              alt="Switzerland image"
              className="w-full h-full  object-cover"
            />
            <div className="absolute bottom-0 mb-6 text-center px-6">
              <h5 className="text-white text-lg font-semibold leading-7 mb-2">
                Switzerland
              </h5>
              <p className="text-white text-base font-medium leading-6">
                987 Bahnhofstrasse, Zurich <br /> City Center, Zurich
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
