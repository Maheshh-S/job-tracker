import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ y: -4 }}
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100/50 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;