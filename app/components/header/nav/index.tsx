"use client";
import React, { useState } from "react";
import styles from "./style.module.scss";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "../anim";
import Link from "./Link";
import Curve from "./Curve";
import Footer from "./Footer";
import { navItems } from "@/data";
import { trackBookNow, trackPhoneClick, trackEmailClick } from "@/lib/analytics";
import { ZOCDOC_URL, PHONE_NUMBER, EMAIL } from '@/lib/constants';


const Header = ({
  setIsActive,
}: {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  console.log('Nav drawer rendering');

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`${styles.menu} w-[100vw] p-[1rem] md:p-[100px]`}
      style={{ border: '5px solid red', transform: 'translateX(0)' }}
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
                setIsActive={setIsActive}
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
              ></Link>
            );
          })}
        </div>

        {/* Conversion Options Section */}
        <div className={styles.conversionSection}>
          <div className={styles.header}>
            <p className="text-federalBlue">Book Appointment</p>
          </div>
          <div className={styles.conversionOptions}>
            <a
              href={ZOCDOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackBookNow({ location: 'nav-drawer', page: pathname, url: ZOCDOC_URL });
                setIsActive(false);
              }}
              className={styles.conversionOption}
            >
              Book on ZocDoc
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              onClick={() => {
                trackPhoneClick({ location: 'nav-drawer', phone: PHONE_NUMBER, page: pathname });
                setIsActive(false);
              }}
              className={styles.conversionOption}
            >
              Call {PHONE_NUMBER}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => {
                trackEmailClick({ location: 'nav-drawer', email: EMAIL, page: pathname });
                setIsActive(false);
              }}
              className={styles.conversionOption}
            >
              Email Us
            </a>
          </div>
        </div>

        <Footer />
      </div>
      <Curve />
    </motion.div>
  );
};

export default Header;
