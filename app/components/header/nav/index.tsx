"use client";
import React, { useState } from "react";
import styles from "./style.module.scss";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "../anim";
import Link from "./Link";
import Curve from "./Curve";
import Footer from "./Footer";

const navItems = [
  {
    title: "About Me",
    href: "#about-me",
  },
  {
    title: "Licenses/Certifications",
    href: "#licenses",
  },
  {
    title: "Optometrist vs. Ophthalmologist",
    href: "#opmetrist-vs-opthamology",
  },
  {
    title: "Locations",
    href: "#locations",
  },
  {
    title: "Services",
    href: "#services",
  },
  {
    title: "Secure Email Form/Booking",
    href: "#contact",
  },
];

const Header = () => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`${styles.menu} w-[100vw] p-[1rem] md:p-[100px]`}
    >
      <div className={styles.body}>
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          <div className={styles.header}>
            <p className="text-federalBlue">Navigation</p>
          </div>
          {navItems.map((data, index) => {
            return (
              <Link
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
              ></Link>
            );
          })}
        </div>
        <Footer />
      </div>
      <Curve />
    </motion.div>
  );
};

export default Header;
