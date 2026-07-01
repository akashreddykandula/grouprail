import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Login failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your GroupRail account"
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
          label="Email address"
          type="email"
          icon={HiMail}
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />

        <div>
          <Input
            label="Password"
            type="password"
            icon={HiLockClosed}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Sign In
        </Button>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
