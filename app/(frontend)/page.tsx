import React from "react";
import HeroSection from "@/app/components/hero/hero";
import Description from "@/app/components/description";
import CredentialsAndLocations from "@/app/components/credentital";
import ComparisonComponent from "@/app/components/comparison";
import Services from "@/app/components/services";
import Reviews from "@/app/components/reviews";
import ContactForm from "@/app/components/contact-us";
import LenisWrapper from "@/lib/lenis-wrapper";
import FloatingBookButton from "@/app/components/floating button/floating-booking-icon";
import Credentials from "@/app/components/license";
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
