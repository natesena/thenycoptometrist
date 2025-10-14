'use client'
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import Nav from './nav';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
export default function Menu() {

  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith('/blog');

  useEffect( () => {
    if(isActive) setIsActive(false)
  }, [pathname, isActive])

  return (
    <>
    <div className={styles.main}>

      <div className={styles.header}>
        <div>
        <Image 
          src="/Eye.png" 
          alt="logo" 
          width={96} 
          height={96} 
          className="w-12 h-12 md:w-24 md:h-24" 
          style={{ filter: isBlogPage ? 'invert(1)' : 'none' }}
        />
        </div>
        <div onClick={() => {setIsActive(!isActive)}} className={`${styles.button} block lg:!hidden`}>
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </div>
      </div>

    </div>
    <AnimatePresence mode="wait">
      {isActive && <Nav setIsActive={setIsActive}/>}
    </AnimatePresence>
    </>
  )
}
