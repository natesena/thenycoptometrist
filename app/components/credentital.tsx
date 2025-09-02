"use client";
import { useState } from "react";
import { Clock, Phone, Globe, MapPin, ExternalLink } from "lucide-react";
import { locations } from "@/data";
const CredentialsAndLocations = () => {
  const [activeLocation, setActiveLocation] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 bg">
      {/* Locations Section */}
      <section id="locations">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-charcoal">
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
                    href={`tel:${location.phone}`}
                    className="w-full px-4 py-2 bg-charcoal border-2 border-charcoal text-white rounded-lg 
                          hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5 text-white" />
                    Call to Book
                  </a>

                  {
                    location.bookingUrl && (<>
                    
                  <a
                    href={`${location.bookingUrl}`}
                     target="_blank"
                    className="w-full px-4 py-2 border-charcoal border-2 text-charcoal rounded-lg 
                          hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5 text-charcoal" />
                    Book Online
                  </a>
                    </>)
                  }
                  {
                    location.website && (
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-federalBlue transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>
                    )
                  }

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
