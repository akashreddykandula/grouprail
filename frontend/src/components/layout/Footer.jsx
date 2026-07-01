import { Link } from 'react-router-dom';
import { MdTrain } from 'react-icons/md';
import { FiGithub, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <MdTrain className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold font-display gradient-text">GroupRail</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              AI-powered group train journey planning. Coordinate your group, pick the best boarding strategy,
              and travel together.
            </p>
            <p className="text-slate-500 text-xs mt-4">
              GroupRail does not book tickets. We help you plan — booking is done on the official railway website.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-2">
              {['Features', 'How It Works', 'FAQ'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Account</h3>
            <ul className="space-y-2">
              {[
                { label: 'Sign In', to: '/login' },
                { label: 'Create Account', to: '/register' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {year} GroupRail. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
