import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ name = '', size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };
  return (
    <div
      className={`rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${getAvatarColor(name)} ${sizes[size]} ${className}`}
    >
      {getInitials(name) || '?'}
    </div>
  );
};

export default Avatar;
