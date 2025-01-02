"use client";
import React, { useState } from "react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How can I reset my password?",
      answer:
        'To reset your password, go to the login page and click on "Forgot Password". Enter your registered email address, and we will send you a link to reset your password. Make sure to check your spam folder if you do not receive the email.',
    },
    {
      question: "How do I update my billing information?",
      answer:
        'To update your billing information, log in to your account and navigate to the "Billing" section under "Account Settings". From there, you can update your payment methods and subscription plan.',
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        'You can cancel your subscription anytime by visiting the "Subscription" section under "Account Settings". You will find the option to cancel or modify your subscription plan.',
    },
    {
      question: "How do I contact Optimetry support?",
      answer:
        'If you need assistance, you can reach Optimetry support by visiting our "Support" page. From there, you can contact us via live chat, email, or submit a support ticket for further assistance.',
    },
    {
      question: "How do I delete my Optimetry account?",
      answer:
        'To delete your account, go to the "Account Settings" page and select "Delete Account" at the bottom. Please note that this action is permanent and cannot be undone. Make sure to back up any necessary data before proceeding.',
    },
    {
      question: "What is Optimetry’s data privacy policy?",
      answer:
        'At Optimetry, we take your privacy seriously. We do not sell or share your personal data with third parties without your consent. You can read our full privacy policy on the "Privacy" page to learn more about how we handle your information.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 section h-fit">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-manrope text-center font-bold text-white leading-[3.25rem]">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="accordion-group" data-accordion="default-accordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="accordion border border-solid border-gray-300 p-4 rounded-xl accordion-active:bg-gray-50 accordion-active:border-gray-600 mb-8 lg:p-4"
            >
              <button
                className="accordion-toggle group inline-flex items-center justify-between text-left text-lg font-normal leading-8 text-white w-full transition duration-500 hover:text-gray-100 accordion-active:font-medium accordion-active:text-gray-600"
                onClick={() => toggleAccordion(index)}
              >
                <h5 className="text-2xl">{faq.question}</h5>
                <svg
                  className={`w-6 h-6 text-gray-100 transition duration-500 ${
                    openIndex === index ? "hidden" : "block"
                  } accordion-active:text-gray-600 group-hover:text-gray-600`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18M12 18V6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  className={`w-6 h-6 text-gray-100 transition duration-500 ${
                    openIndex === index ? "block" : "hidden"
                  } accordion-active:text-gray-600 group-hover:text-gray-600`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                className={`accordion-content w-full overflow-hidden pr-4 ${
                  openIndex === index ? "max-h-[500px]" : "max-h-0"
                }`}
                aria-labelledby={`faq-heading-${index}`}
              >
                <p className="text-base mt-4 text-gray-400 font-normal leading-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
