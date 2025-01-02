import AboutUs from '@/components/about-us';
import ContactUs from '@/components/contact-us';
import Faq from '@/components/faq';
import Hero from '@/components/hero';
import Testimonials from '@/components/testimonials';
import React from 'react';

const Page = () => {
    return (
        <div className="">
            <Hero />
            <AboutUs />
            <div className='relative'>
            <section id="services" className="section flex h-[50vh] flex-col justify-center items-center">
                <h2>Our Services</h2>
                <p>We provide comprehensive eye exams, contact lens fittings, and more.</p>
            </section>
            <section id="appointments" className="section flex h-[100vh] flex-col justify-center items-center">
                <h2>Book an Appointment</h2>
                <p>Book your appointment with Dr. Smith, our experienced optometrist!</p>
            </section>
            <Testimonials />
            
            <ContactUs />

            <Faq />
            </div>
        </div>
    );
};

export default Page;
