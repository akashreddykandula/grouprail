import { Link } from 'react-router-dom';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IoNotificationsOutline } from 'react-icons/io5';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const AppNavbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 h-16">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          aria-label="Open sidebar"
        >
          <HiMenuAlt2 size={22} />
        </button>

        {/* Spacer on desktop */}
        <div className="hidden lg:block" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Link
            to="/dashboard"
            className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Notifications"
          >
            <IoNotificationsOutline size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(
                user?.name || ''
              )}`}
            >
              {getInitials(user?.name || 'U')}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-300">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
