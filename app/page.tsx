import React from 'react';

const Page = () => {
    return (
        <div className="container mx-auto text-center">
            
            <section id="services" className="section flex flex-col justify-center items-center">
                <h2>Our Services</h2>
                <p>We provide comprehensive eye exams, contact lens fittings, and more.</p>
            </section>
            <section id="testimonials" className="section flex flex-col justify-center items-center">
                <h2>Testimonials</h2>
                <p>&quot;Best optometrist in NYC!&quot; - Happy Customer</p>
            </section>
            <section id="contact" className="section flex flex-col justify-center items-center">
                <h2>Contact Us</h2>
                <p>Email: info@thenycoptometrist.com</p>
                <p>Phone: (123) 456-7890</p>
            </section>
            <footer className="section flex flex-col justify-center items-center">
                <p>&copy; 2024 The NYC Optometrist. All rights reserved.</p>
                <p>Follow us on social media!</p>
            </footer>
        </div>
    );
};

export default Page;
