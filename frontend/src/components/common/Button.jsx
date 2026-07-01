import { motion } from 'framer-motion';
import { ImSpinner8 } from 'react-icons/im';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white focus:ring-primary-500 shadow-glow/30',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/30',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5 focus:ring-white/20',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <ImSpinner8 className="animate-spin" size={15} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={17} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={17} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
