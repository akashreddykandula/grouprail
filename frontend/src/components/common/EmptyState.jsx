import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Icon className="text-slate-500" size={28} />
      </div>
    )}
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    {description && <p className="text-slate-400 text-sm max-w-xs mb-6">{description}</p>}
    {action && action}
  </motion.div>
);

export default EmptyState;
