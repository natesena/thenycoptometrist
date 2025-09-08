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

  useEffect( () => {
    if(isActive) setIsActive(false)
  }, [pathname, isActive])

  return (
    <>
    <div className={styles.main}>

      <div className={styles.header}>
        <div className='bg-white/40 p-2 rounded-md'>
        <Image src="/logo.png" alt="logo"  width={50} height={50} />
        </div>
        <div onClick={() => {setIsActive(!isActive)}} className={styles.button}>
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
