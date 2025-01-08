"use client";
import { useState } from "react";
import { Clock, Phone, Globe, MapPin } from "lucide-react";
import { credentials, locations } from "@/data";
const CredentialsAndLocations = () => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [activeCredential, setActiveCredential] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 bg">
      {/* Credentials Section */}
      <section id="licenses" className="mb-20">
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
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
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
                    <h3 className="font-semibold text-xl">
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

      {/* Locations Section */}
      <section id="locations">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 lg:mt-40 text-center text-charcoal">
          Practice Locations
        </h2>
        <div className="grid md:grid-cols-1 gap-8">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className={`p-[1rem] lg:p-8 flex ${
                index % 2 === 0
                  ? "flex-col md:flex-row-reverse"
                  : "flex-col md:flex-row"
              } gap-6 items-center justify-between rounded-2xl transition-all duration-300 ${
                activeLocation === index
                  ? "bg-white shadow-2xl scale-105"
                  : "bg-gray-50"
              }`}
              onMouseEnter={() => setActiveLocation(index)}
            >
              <div className="w-[100%] md:w-8/12 rounded-2xl overflow-hidden">
                {location.frame}
              </div>
              <div className="w-[100%] md:w-4/12">
                <h3 className="text-2xl font-semibold mb-6">{location.name}</h3>

                <div className="space-y-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-federalBlue transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>{location.address}</span>
                  </a>

                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center gap-3 hover:text-federalBlue transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{location.phone}</span>
                  </a>

                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-federalBlue transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 mt-1" />
                      <div className="space-y-2">
                        {location.hours.map((hour) => (
                          <div key={hour.day}>
                            <span className="font-medium">{hour.day}:</span>
                            <span className="ml-2">{hour.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CredentialsAndLocations;
