import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import Magnetic from '../Magnetic';

interface RoundedProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode; // Type children as React.ReactNode
  backgroundColor?: string; // Optional backgroundColor prop
}

export default function Rounded({
  children,
  backgroundColor = "#455CE9",
  ...attributes
}: RoundedProps) {
  const circle = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<GSAPTimeline | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Use useRef for timeoutId

  useEffect(() => {
    if (circle.current && !timeline.current) {
      timeline.current = gsap.timeline({ paused: true })
        .to(circle.current, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
        .to(circle.current, { top: "-150%", width: "125%", duration: 0.25 }, "exit");
    }
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current); // Clear any previous timeouts
    timeline.current?.tweenFromTo('enter', 'exit'); // Optional chaining for safe access
  };

  const manageMouseLeave = () => {
    timeoutId.current = setTimeout(() => {
      timeline.current?.play(); // Optional chaining for safe access
    }, 300);
  };

  return (
    <Magnetic>
      <div
        className={styles.roundedButton}
        style={{ overflow: "hidden" }}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...attributes} // Spread the rest of the div props
      >
        {children}
        <div ref={circle} style={{ backgroundColor }} className={styles.circle}></div>
      </div>
    </Magnetic>
  );
}
