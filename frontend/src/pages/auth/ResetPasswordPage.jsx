import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLockClosed, HiCheckCircle, HiXCircle } from 'react-icons/hi';
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

const ResetPasswordPage = () => {
  const { token } = useParams();
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
      const res = await authService.resetPassword(token, data.password);
      setUser(res.user);
      toast.success('Password reset successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('root', { message: err.message || 'Reset link is invalid or has expired.' });
    }
  };

  return (
    <AuthLayout title="Create new password" subtitle="Choose a strong password for your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {errors.root.message}{' '}
            <Link to="/forgot-password" className="underline hover:text-red-300">
              Request a new link.
            </Link>
          </motion.div>
        )}

        <div>
          <Input
            label="New password"
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
            {password && (
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
            )}
          </AnimatePresence>
        </div>

        <Input
          label="Confirm new password"
          type="password"
          icon={HiLockClosed}
          placeholder="Repeat your new password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
