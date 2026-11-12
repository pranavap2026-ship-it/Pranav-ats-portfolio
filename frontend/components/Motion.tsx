'use client';
import { motion, MotionConfig, useScroll, useSpring } from 'framer-motion';
export const ease = [0.22, 1, 0.36, 1] as const;
export const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
export function Stagger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (<MotionConfig reducedMotion="user"><motion.div className={className} initial="hidden" animate="show"
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}>{children}</motion.div></MotionConfig>);
}
export function Item({ children, className = '', as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'li' }) {
  const C = as === 'li' ? motion.li : motion.div;
  return <C variants={item} className={className}>{children}</C>;
}
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent" />;
}