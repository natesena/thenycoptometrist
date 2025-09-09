import React from "react";
import HeroSection from "./components/hero/hero";
import Description from "./components/description";
import CredentialsAndLocations from "./components/credentital";
import ComparisonComponent from "./components/comparison";
import Services from "./components/services";
import Reviews from "./components/reviews";
import ContactForm from "./components/contact-us";
import LenisWrapper from "@/lib/lenis-wrapper";
import FloatingBookButton from "./components/floating button/floating-booking-icon";
import Credentials from "./components/license";
const Page = () => {
  return (
    <LenisWrapper>
      <div className="bg-alabaster">
        <HeroSection />
        <Description />
        <Reviews />
        
        <CredentialsAndLocations />
        <Services />
        <Credentials />
        <ComparisonComponent />
        <ContactForm />
        <FloatingBookButton />
      </div>
    </LenisWrapper>
  );
};

export default Page;
