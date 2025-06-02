import { Variants } from 'framer-motion';

const defaultTransition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

type Direction = 'up' | 'down' | 'left' | 'right';

export const fadeIn = (direction: Direction = 'up'): Variants => {
  switch (direction) {
    case 'up':
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: defaultTransition 
        }
      };
    case 'down':
      return {
        hidden: { opacity: 0, y: -20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: defaultTransition 
        }
      };
    case 'left':
      return {
        hidden: { opacity: 0, x: 20 },
        visible: { 
          opacity: 1, 
          x: 0, 
          transition: defaultTransition 
        }
      };
    case 'right':
      return {
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0, 
          transition: defaultTransition 
        }
      };
    default:
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: defaultTransition 
        }
      };
  }
};

export const scaleIn: Variants = {
  hidden: { 
    scale: 0.95, 
    opacity: 0 
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};
