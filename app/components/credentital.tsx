"use client"
import { useState } from 'react';
import { Building2, Clock, Phone, Globe, Award, BookOpen, MapPin } from 'lucide-react';

const CredentialsAndLocations = () => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [activeCredential, setActiveCredential] = useState(0);

  const credentials = [
    {
      title: "Bachelor's Degree in Biology",
      institution: "University of Connecticut",
      specialization: "Minor in Physiology and Neurobiology",
      icon: BookOpen
    },
    {
      title: "Doctorate in Optometry",
      institution: "State University of New York College of Optometry",
      icon: Award
    },
    {
      title: "Microcredential Certificate",
      institution: "SUNY College of Optometry",
      specialization: "Anterior Segment & Specialty Contact Lenses",
      icon: Award
    },
    {
      title: "Optometric License #011115",
      institution: "New York State",
      icon: Building2
    }
  ];

  const locations = [
    {
      name: "Compton Eye Associates",
      address: "4738 Broadway New York NY 10040",
      phone: "+1-800-936-0036",
      website: "https://comptoneye.com/",
      hours: [
        { day: "Monday", time: "10:00am - 6:00pm" },
        { day: "Friday", time: "10:00am - 6:00pm" },
        { day: "Every other Saturday", time: "10:00am - 6:00pm" }
      ]
    },
    {
      name: "M S Optical",
      address: "5202 16th Ave, Brooklyn, NY 11204",
      phone: "(718) 436-5900",
      website: "https://msopticalstore.com/",
      hours: [
        { day: "Tuesday", time: "10:00am - 7:30pm" },
        { day: "Wednesday", time: "10:00am - 6:30pm" },
        { day: "Thursday", time: "10:00am - 6:30pm" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 bg">
      {/* Credentials Section */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-charcoal">
          Licenses & Certifications
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">

            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-[500] mb-2">{credentials[activeCredential].title}</h3>
              <p className="text-sm opacity-90">{credentials[activeCredential].institution}</p>
            </div>
          </div>

          <div className="space-y-4">
            {credentials.map((credential, index) => (
              <div
                key={credential.title}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeCredential === index
                    ? 'bg-charcoal text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCredential(index)}
              >
                <div className="flex items-center gap-4">
                  <credential.icon className={`w-6 h-6 ${
                    activeCredential === index ? 'text-white' : 'text-federalBlue'
                  }`} />
                  <div>
                    <h3 className="font-semibold">{credential.title}</h3>
                    <p className={`text-sm ${
                      activeCredential === index ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {credential.institution}
                    </p>
                    {credential.specialization && (
                      <p className={`text-sm mt-1 ${
                        activeCredential === index ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {credential.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Practice Locations
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className={`p-8 rounded-2xl transition-all duration-300 ${
                activeLocation === index
                  ? 'bg-white shadow-2xl scale-105'
                  : 'bg-gray-50'
              }`}
              onMouseEnter={() => setActiveLocation(index)}
            >
              <h3 className="text-2xl font-semibold mb-6">{location.name}</h3>
              
              <div className="space-y-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
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
                      {location.hours.map(hour => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CredentialsAndLocations;