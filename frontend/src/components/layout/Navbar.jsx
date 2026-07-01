import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdTrain } from 'react-icons/md';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <MdTrain className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              GroupRail
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="section-container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-slate-300 hover:text-white text-sm font-medium py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary text-sm justify-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-sm justify-center">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-primary text-sm justify-center">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
