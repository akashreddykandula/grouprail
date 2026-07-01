import { forwardRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = 'text',
      className = '',
      hint,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon size={17} />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`form-input ${Icon ? 'pl-10' : ''} ${isPassword ? 'pr-11' : ''} ${
              error ? 'border-red-500/50 focus:ring-red-500' : ''
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <HiEyeOff size={17} /> : <HiEye size={17} />}
            </button>
          )}
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="form-error"
            >
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <p className="text-slate-500 text-xs mt-1">{hint}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
