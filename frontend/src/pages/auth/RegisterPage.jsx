import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'At least one number', test: (p) => /[0-9]/.test(p) },
];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-1.5"
    >
      {passwordRules.map((rule) => {
        const pass = rule.test(password);
        return (
          <div key={rule.label} className="flex items-center gap-2">
            {pass ? (
              <HiCheckCircle className="text-emerald-400 shrink-0" size={14} />
            ) : (
              <HiXCircle className="text-slate-600 shrink-0" size={14} />
            )}
            <span className={`text-xs ${pass ? 'text-emerald-400' : 'text-slate-500'}`}>
              {rule.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUser(res.user);
      toast.success(`Welcome to GroupRail, ${res.user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning group train journeys together"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {errors.root.message}
          </motion.div>
        )}

        <Input
          label="Full name"
          type="text"
          icon={HiUser}
          placeholder="Rahul Sharma"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
          })}
        />

        <Input
          label="Email address"
          type="email"
          icon={HiMail}
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
        />

        <div>
          <Input
            label="Password"
            type="password"
            icon={HiLockClosed}
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: {
                uppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
                number: (v) => /[0-9]/.test(v) || 'Must contain at least one number',
              },
            })}
          />
          <AnimatePresence>
            {password && <PasswordStrength password={password} />}
          </AnimatePresence>
        </div>

        <Input
          label="Confirm password"
          type="password"
          icon={HiLockClosed}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Create Account
        </Button>

        <p className="text-center text-xs text-slate-500">
          By creating an account you agree to our{' '}
          <span className="text-slate-400">Terms of Service</span> and{' '}
          <span className="text-slate-400">Privacy Policy</span>.
        </p>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
