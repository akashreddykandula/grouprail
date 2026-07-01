import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, glow = false, onClick }) => {
  const base = `glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${glow ? 'shadow-glow' : ''} ${className}`;
  if (onClick) {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} className={base} onClick={onClick}>
        {children}
      </motion.div>
    );
  }
  return <div className={base}>{children}</div>;
};

export default Card;
