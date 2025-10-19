'use client'
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { trackBookNow, trackPhoneClick, trackEmailClick } from '@/lib/analytics';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navItems } from "@/data";

const ZOCDOC_URL = 'https://www.zocdoc.com/doctor/joanna-latek-od-640237';
const PHONE_NUMBER = '+1 (212) 228-0950';
const EMAIL = 'info@thenycoptometrist.com';

export default function Menu() {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith('/blog');

  useEffect( () => {
    if(isActive) setIsActive(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
    <div className={styles.main}>

      <div className={styles.header}>
        {/* Left Group: Logo + Conversion Links */}
        <div className={styles.leftGroup}>
          <Link href="/" className="cursor-pointer">
            <Image
              src="/Eye.png"
              alt="logo"
              width={96}
              height={96}
              className="w-12 h-12 md:w-24 md:h-24"
              style={{
                filter: isBlogPage
                  ? 'brightness(0) invert(1)'
                  : 'brightness(1.15) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                transition: 'filter 0.3s ease'
              }}
            />
          </Link>

          {/* Desktop Conversion Links */}
          <div className={styles.conversionLinks}>
            <a
              href={ZOCDOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookNow({ location: 'header', page: pathname, url: ZOCDOC_URL })}
              className={`${styles.conversionLink} font-gothic`}
            >
              Book an Appointment
            </a>
            <Link
              href="/blog"
              className={`${styles.conversionLink} font-gothic`}
            >
              Blog
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              onClick={() => trackPhoneClick({ location: 'header', phone: PHONE_NUMBER, page: pathname })}
              className={`${styles.conversionLink} font-gothic`}
            >
              Call
            </a>
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => trackEmailClick({ location: 'header', email: EMAIL, page: pathname })}
              className={`${styles.conversionLink} font-gothic`}
            >
              Email
            </a>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <div
          onClick={() => setIsActive(!isActive)}
          className={`${styles.button} block lg:!hidden`}
        >
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </div>
      </div>

    </div>

    {/* Navigation Sheet */}
    <Sheet open={isActive} onOpenChange={setIsActive}>
      <SheetContent side="right" className="w-[90vw] sm:w-[400px] bg-[#E9E4DB]">
        <SheetHeader className="text-left mb-8">
          <SheetTitle className="text-2xl font-bold text-charcoal">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigate and book appointments</SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Conversion Options */}
          <div className="space-y-6 bg-white/40 p-6 rounded-xl border border-charcoal/10">
            <h3 className="text-sm font-bold text-federalBlue uppercase tracking-wider">Get Started</h3>
            <div className="space-y-4">
              {/* Primary CTA */}
              <a
                href={ZOCDOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackBookNow({ location: 'nav-drawer', page: pathname, url: ZOCDOC_URL });
                  setIsActive(false);
                }}
                className="block w-full px-6 py-4 bg-federalBlue text-white text-center text-lg font-bold rounded-lg hover:bg-charcoal transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Book an Appointment
              </a>

              {/* Secondary options */}
              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  onClick={() => {
                    trackPhoneClick({ location: 'nav-drawer', phone: PHONE_NUMBER, page: pathname });
                    setIsActive(false);
                  }}
                  className="block w-full px-6 py-3 border-2 border-charcoal text-charcoal text-center text-base font-semibold rounded-lg hover:bg-charcoal hover:text-white transition-all duration-300"
                >
                  Call {PHONE_NUMBER}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => {
                    trackEmailClick({ location: 'nav-drawer', email: EMAIL, page: pathname });
                    setIsActive(false);
                  }}
                  className="block w-full px-6 py-3 border-2 border-charcoal text-charcoal text-center text-base font-semibold rounded-lg hover:bg-charcoal hover:text-white transition-all duration-300"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-300 pb-2">Navigation</h3>
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsActive(false)}
                  className="block text-3xl font-normal text-charcoal hover:opacity-70 transition-opacity py-1"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}
