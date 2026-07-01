import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdTrain } from 'react-icons/md';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 bg-primary-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:bg-primary-500 transition-colors">
              <MdTrain className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold font-display gradient-text">GroupRail</span>
          </Link>
          {title && (
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-slate-400 mt-1.5 text-sm">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
