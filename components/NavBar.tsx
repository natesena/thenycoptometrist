"use client";
import Image from "next/image";
import { useState } from "react";
import { X, AlignJustify } from "lucide-react";
import MainButton from "./button";
import Link from "next/link";
function NavBar() {
  const links = [
    {
      route: "#about-me",
      name: "About Me",
      badgeCount: 0,
    },
    {
      route: "#licenses",
      name: "Licenses/Certifications",
      badgeCount: 0,
    },
    {
      route: "#opmetrist-vs-opthamology",
      name: "Optometrist vs. Ophthalmologist",
      badgeCount: 0,
    },
    {
      route: "#locations",
      name: "Locations",
      badgeCount: 0,
    },
    {
      route: "#services",
      name: "Services",
      badgeCount: 0,
    },
    {
      route: "#contact-us",
      name: "Secure Email Form/Booking",
      badgeCount: 0,
    }
  ];
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  return (
    <div className="md:sticky md:top-0 md:shadow-none z-20 mt-[5rem] md:mt-0">
      {/* DESKTOP */}
      <div className=" hidden lg:block animate-in fade-in zoom-in bg-background p-4">
        <div className="flex justify-between mx-4 items-center">
          <div>
            <Image width={30} height={30} src="/logo.png" alt="logo" />
          </div>
          <div className="flex gap-[20px] xl:gap-[50px] text-[16px] items-center select-none">
            {links.map((item, index) => (
              <Link
                href={item.route}
                key={index}
                className="flex gap-2 hover:text-primary cursor-pointer"
              >
                <p
                  className={`flex items-center gap-2  font-[500] text-white`}
                >
                  {item.name}
                </p>
                {item.badgeCount ? (
                  <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center  font-semibold text-white">
                    {item.badgeCount}
                  </div>
                ) : (
                  <div />
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-[20px] select-none">
            <MainButton
              text="Sign in"
              width="contain"
              className="bg-white border text-[#31373D] border-background hover:bg-white"
            />

            <MainButton text="Start for free" width="contain" />
          </div>
        </div>
      </div>
      {/* MOBILE */}
      <div
        className={` block lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-background py-4 animate-in fade-in zoom-in  ${
          menu ? " bg-primary py-2" : ""
        } `}
      >
        <div className="flex justify-between mx-[10px]">
          <div className="flex gap-[50px] text-[16px] items-center select-none">
            <Image width={30} height={30} src="/logo.png" alt="logo" />
          </div>
          <div className="flex items-center gap-[40px]">
            {menu ? (
              <X
                className="cursor-pointer animate-in fade-in zoom-in text-white"
                onClick={toggleMenu}
              />
            ) : (
              <AlignJustify className="cursor-pointer animate-in fade-in zoom-in text-white"
              onClick={toggleMenu}
            />
            )}
          </div>
        </div>
        {menu ? (
          <div className="my-8 select-none animate-in slide-in-from-right">
            <div className="flex flex-col gap-6 mt-8 mx-4">
              {links.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <p
                    className={`hover:text-primary text-xl cursor-pointer flex items-center gap-2  font-[500] text-gray`}
                  >
                    {item.name}
                  </p>
                  {item.badgeCount ? (
                    <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center  font-semibold text-white">
                      {item.badgeCount}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-[20px] select-none">
                <MainButton
                  text="Sign in"
                  width="contain"
                  className="bg-white text-[#31373D] border-[#EDEEF0] hover:bg-white"
                  
                />

                <MainButton text="Start for free" width="contain" />
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
