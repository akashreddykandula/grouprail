import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdTrain, MdDashboard } from 'react-icons/md';
import { HiPlus, HiUser, HiLogout } from 'react-icons/hi';
import { FiUsers } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { to: '/trips/create', icon: HiPlus, label: 'Create Trip' },
  { to: '/profile', icon: HiUser, label: 'My Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    logout();
    navigate('/login');
    toast.success('Signed out successfully');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <MdTrain className="text-white text-lg" />
        </div>
        <span className="text-xl font-bold font-display gradient-text">GroupRail</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <HiLogout size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-white/10 z-30 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
