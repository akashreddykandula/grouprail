import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiUser, HiMail, HiPhone, HiPencil, HiSave } from 'react-icons/hi';
import { MdTrain } from 'react-icons/md';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { tripService } from '../../services/tripService';
import { authService } from '../../services/authService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { formatDate, daysUntil, getTripStatusConfig } from '../../utils/helpers';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const ProfilePage = () => {
  const { user, setUser, updateUser } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: savingProfile },
    reset: resetProfile,
  } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors, isSubmitting: savingPwd },
    reset: resetPwd,
    watch,
  } = useForm();

  useEffect(() => {
    tripService.getAll().then((res) => setTrips(res.trips || [])).catch(() => {});
  }, []);

  const onSaveProfile = async (data) => {
    try {
      const res = await tripService.updateProfile({ name: data.name, phone: data.phone });
      updateUser(res.user);
      toast.success('Profile updated');
      setEditingProfile(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const onChangePassword = async (data) => {
    try {
      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      setEditingPassword(false);
      resetPwd();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  const upcoming = trips.filter((t) => new Date(t.travelDate) > new Date());
  const completed = trips.filter((t) => new Date(t.travelDate) <= new Date());
  const organised = trips.filter((t) => t.memberRole === 'organizer');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp()}>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and view your trips</p>
      </motion.div>

      {/* Profile card */}
      <motion.div {...fadeUp(0.05)}>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar name={user?.name || ''} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <Badge variant="primary" size="xs">Member</Badge>
              </div>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              {user?.phone && <p className="text-slate-500 text-sm mt-1">{user?.phone}</p>}
              <p className="text-slate-600 text-xs mt-2">
                Joined {formatDate(user?.createdAt, 'MMMM yyyy')}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={HiPencil}
              onClick={() => { setEditingProfile(!editingProfile); resetProfile({ name: user?.name, phone: user?.phone }); }}
            >
              Edit
            </Button>
          </div>

          {/* Edit profile form */}
          {editingProfile && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleProfile(onSaveProfile)}
              className="mt-5 pt-5 border-t border-white/10 space-y-4"
              noValidate
            >
              <Input
                label="Full Name"
                icon={HiUser}
                error={profileErrors.name?.message}
                {...regProfile('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
              />
              <Input
                label="Phone Number"
                icon={HiPhone}
                placeholder="+91 9876543210"
                error={profileErrors.phone?.message}
                {...regProfile('phone')}
              />
              <div className="flex gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingProfile(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" loading={savingProfile} icon={HiSave}>Save Changes</Button>
              </div>
            </motion.form>
          )}
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: trips.length },
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Completed', value: completed.length },
          { label: 'Organised', value: organised.length },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-2xl font-bold gradient-text">{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Upcoming trips */}
      {upcoming.length > 0 && (
        <motion.div {...fadeUp(0.15)}>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MdTrain className="text-primary-400" /> Upcoming Trips
          </h2>
          <div className="space-y-3">
            {upcoming.map((trip) => {
              const cfg = getTripStatusConfig(trip.status);
              const days = daysUntil(trip.travelDate);
              return (
                <Card key={trip._id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-medium text-sm">{trip.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {trip.destination} · {formatDate(trip.travelDate, 'MMM dd, yyyy')}
                        {days > 0 && <span className="text-primary-400 ml-2">{days}d away</span>}
                      </p>
                    </div>
                    <Badge variant={trip.status === 'ready' ? 'success' : 'warning'}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Change password */}
      <motion.div {...fadeUp(0.2)}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Password & Security</h3>
              <p className="text-slate-400 text-xs mt-0.5">Change your account password</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setEditingPassword(!editingPassword); resetPwd(); }}
            >
              {editingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {editingPassword && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handlePwd(onChangePassword)}
              className="space-y-4"
              noValidate
            >
              <Input
                label="Current Password"
                type="password"
                error={pwdErrors.currentPassword?.message}
                {...regPwd('currentPassword', { required: 'Current password is required' })}
              />
              <Input
                label="New Password"
                type="password"
                error={pwdErrors.newPassword?.message}
                {...regPwd('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                  validate: {
                    uppercase: (v) => /[A-Z]/.test(v) || 'Must contain uppercase letter',
                    number: (v) => /[0-9]/.test(v) || 'Must contain a number',
                  },
                })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                error={pwdErrors.confirmPassword?.message}
                {...regPwd('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (v) => v === watch('newPassword') || 'Passwords do not match',
                })}
              />
              <Button type="submit" variant="primary" size="sm" loading={savingPwd}>
                Update Password
              </Button>
            </motion.form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
