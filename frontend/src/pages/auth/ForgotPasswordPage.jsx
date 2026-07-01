import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiCheckCircle } from 'react-icons/hi';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (err) {
      // Still show success to prevent email enumeration
      setSubmittedEmail(data.email);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent you a reset link">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <HiCheckCircle className="text-emerald-400" size={32} />
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            If an account exists for <span className="text-white font-medium">{submittedEmail}</span>, you'll
            receive a password reset link within a few minutes.
          </p>
          <p className="text-slate-500 text-xs">
            Don't see it? Check your spam folder.
          </p>
          <div className="pt-2">
            <Link to="/login" className="btn-secondary w-full justify-center">
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
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
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
        />

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-slate-400">
          Remembered it?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Back to Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
