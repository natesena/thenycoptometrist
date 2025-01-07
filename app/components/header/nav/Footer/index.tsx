import styles from './style.module.scss';
import { Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
export default function index() {
  return (
    <div className={styles.footer}>
        <Instagram />
        <Facebook />
        <Linkedin />
        <Twitter />
    </div>
  )
}
