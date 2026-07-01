const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
    primary: 'bg-primary-500/10 text-primary-300 border-primary-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
