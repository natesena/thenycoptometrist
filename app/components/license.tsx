"use client";
import { useState } from "react";
import { credentials } from "@/data";
const Credentials = () => {
  const [activeCredential, setActiveCredential] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32">
      {/* Credentials Section */}
      <section id="licenses" className="">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-charcoal">
          Licenses & Certifications
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl lg:text-5xl font-[500] mb-2">
                {credentials[activeCredential].title}
              </h3>
              <p className="text-sm lg:text-xl opacity-90">
                {credentials[activeCredential].institution}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {credentials.map((credential, index) => (
              <div
                key={credential.title}
                className={`p-[1rem] py-[1rem] lg:p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeCredential === index
                    ? "bg-charcoal text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setActiveCredential(index)}
              >
                <div className="flex items-center gap-4">
                  <credential.icon
                    className={`w-6 h-6 ${
                      activeCredential === index
                        ? "text-white"
                        : "text-federalBlue"
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-md lg:text-xl">
                      {credential.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        activeCredential === index
                          ? "text-white/90"
                          : "text-gray-600"
                      }`}
                    >
                      {credential.institution}
                    </p>
                    {credential.specialization && (
                      <p
                        className={`text-sm mt-1 ${
                          activeCredential === index
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
                        {credential.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Credentials;
