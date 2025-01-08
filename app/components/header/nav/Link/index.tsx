"use client";
import styles from './style.module.scss';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../anim';

// Define the interface for the props
interface LinkProps {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Index({data, isActive, setSelectedIndicator, setIsActive}: LinkProps) {
  
    const { title, href, index} = data;
  
    return (
      <motion.div onClick={() => {setIsActive(false)}} className={styles.link} onMouseEnter={() => {setSelectedIndicator(href)}} custom={index} variants={slide} initial="initial" animate="enter" exit="exit">
        <motion.div  variants={scale} animate={isActive ? "open" : "closed"} className={styles.indicator}></motion.div>
        <Link href={href}>{title}</Link>
      </motion.div>
    )
  }