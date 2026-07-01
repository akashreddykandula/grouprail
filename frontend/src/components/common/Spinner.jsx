import { ImSpinner8 } from 'react-icons/im';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ImSpinner8 className={`animate-spin text-primary-400 ${sizes[size]}`} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" className="mb-4" />
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

export default Spinner;
