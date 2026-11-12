'use client';

import type { ReactNode } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

export default function Reveal({
  children,
  id,
  className = '',
}: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id={id}
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.15,
          margin: '0px 0px -60px 0px',
        }}
        variants={revealVariants}
      >
        {children}
      </motion.section>
    </MotionConfig>
  );
}