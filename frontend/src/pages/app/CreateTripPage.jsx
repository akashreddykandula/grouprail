import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MdTrain, MdAutoAwesome } from 'react-icons/md';
import { HiCalendar, HiLocationMarker, HiUsers, HiClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { tripService } from '../../services/tripService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const CreateTripPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { maxMembers: 10 } });

  const onSubmit = async (data) => {
    try {
      const res = await tripService.create({
        name: data.name,
        destination: data.destination,
        travelDate: data.travelDate,
        trainPreference: data.trainPreference || '',
        maxMembers: Number(data.maxMembers),
      });
      toast.success('Trip created successfully!');
      navigate(`/trips/${res.trip._id}`);
    } catch (err) {
      if (err.message) setError('root', { message: err.message });
      else toast.error('Failed to create trip. Please try again.');
    }
  };

  // Minimum date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp()}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
            <MdTrain className="text-primary-400" size={22} />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Create a New Trip</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Set up your group journey. You'll get an invite code to share with your group instantly.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div {...fadeUp(0.1)}>
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
              label="Trip Name"
              placeholder="e.g. Diwali family trip to Chennai"
              icon={HiClipboardList}
              required
              error={errors.name?.message}
              hint="Give your trip a memorable name"
              {...register('name', {
                required: 'Trip name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
              })}
            />

            <Input
              label="Destination"
              placeholder="e.g. Chennai, Hyderabad, Mumbai"
              icon={HiLocationMarker}
              required
              error={errors.destination?.message}
              {...register('destination', {
                required: 'Destination is required',
                minLength: { value: 2, message: 'Please enter a valid destination' },
              })}
            />

            <Input
              label="Travel Date"
              type="date"
              icon={HiCalendar}
              min={minDate}
              required
              error={errors.travelDate?.message}
              {...register('travelDate', {
                required: 'Travel date is required',
                validate: (v) => new Date(v) > new Date() || 'Travel date must be in the future',
              })}
            />

            <Input
              label="Train Preference"
              placeholder="e.g. Rajdhani Express, 12627 (optional)"
              icon={MdTrain}
              error={errors.trainPreference?.message}
              hint="Leave blank if not decided yet"
              {...register('trainPreference', {
                maxLength: { value: 100, message: 'Too long' },
              })}
            />

            <div>
              <label className="form-label">
                Maximum Members <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <HiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <select
                  className="form-input pl-10 appearance-none bg-slate-900/50"
                  {...register('maxMembers', { required: 'Please select maximum members' })}
                >
                  {[2, 5, 10, 15, 20, 25, 30, 40, 50].map((n) => (
                    <option key={n} value={n} className="bg-slate-900">
                      {n} members
                    </option>
                  ))}
                </select>
              </div>
              {errors.maxMembers && <p className="form-error">{errors.maxMembers.message}</p>}
              <p className="text-slate-500 text-xs mt-1">Each member can add up to 10 passengers</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="flex-1"
                icon={MdAutoAwesome}
              >
                Create Trip & Get Invite Code
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Info panel */}
      <motion.div {...fadeUp(0.2)}>
        <Card className="p-5">
          <h3 className="text-white font-medium text-sm mb-3">What happens next?</h3>
          <div className="space-y-2.5">
            {[
              'You get a unique 8-character invite code instantly',
              'Share it with your group via WhatsApp, email, or direct link',
              'Members join and enter their boarding stations and passenger details',
              'AI analyses the group and recommends the best boarding strategy',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary-600/20 text-primary-400 text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateTripPage;
