import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="lg:pl-8 min-h-[100vh] section h-fit">
      <div className="rounded-l-2xl bg-[#1b2330] py-10 overflow-hidden h-[90vh] m-5 lg:m-0 2xl:py-16 xl:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 items-center lg:grid-cols-12 lg:gap32">
            <div className="w-full xl:col-span-5 lg:col-span-5 2xl:-mx-5 xl:-mx-0">
              <div className="flex md:items-center text-sm font-medium text-gray-500 justify-center lg:justify-start">
                <span className="bg-gray-600 py-1 px-3 rounded-sm text-xs font-medium text-white mr-3 ">
                  #1
                </span>
                Health Care
              </div>
              <h1 className="py-8 md:text-center text-gray-500 font-[500] text-6xl sm:text-8xl lg:text-[5rem] xl:text-[6rem] xl:leading-[6rem] lg:text-left sm:leading-[70px]">
                Achieve a
                <br />
                <span className="text-white">Lifetime of</span>
                <br />
                eye health
              </h1>
              <p className=" text-white text-xl sm:text-center lg:text-left">
                The NYC Optometrist is a leading provider of eye care services,
                offering comprehensive eye exams, contact lens fittings, and
                more.
              </p>
              <button className="bg-white text-[#1b2330] py-2 px-5 rounded-md mt-4">
                Book Appointment
              </button>
            </div>
            <div className="w-[110%] xl:col-span-7  lg:col-span-7 block">
              <div className="w-[100%] xl:ml-16 flex gap-2">
                <Image
                  width={1000}
                  height={1000}
                  src="/second-half.png"
                  alt="Dashboard image"
                  className="rounded-2xl object- w-6/12"
                />

                <Image
                  width={1000}
                  height={1000}
                  src="/first-hero.png"
                  alt="Dashboard image"
                  className="rounded-2xl object- w-6/12 min-h-[22.5rem] lg:min-h-[40rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
