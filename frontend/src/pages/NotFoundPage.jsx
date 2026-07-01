import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdTrain } from 'react-icons/md';
import { HiArrowLeft } from 'react-icons/hi';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <MdTrain className="text-slate-600 mx-auto mb-6 animate-float" size={60} />
      <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">This train has left the station</h2>
      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary">
        <HiArrowLeft size={18} /> Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
