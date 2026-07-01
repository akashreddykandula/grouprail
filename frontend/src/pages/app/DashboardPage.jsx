import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdTrain, MdGroups, MdAdd } from 'react-icons/md';
import { HiArrowRight, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { tripService } from '../../services/tripService';
import useAuthStore from '../../store/authStore';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import { formatDate, daysUntil, getTripStatusConfig } from '../../utils/helpers';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const TripCard = ({ trip }) => {
  const days = daysUntil(trip.travelDate);
  const statusCfg = getTripStatusConfig(trip.status);

  return (
    <Link to={`/trips/${trip._id}`}>
      <motion.div
        whileHover={{ y: -3 }}
        className="glass-card p-5 hover:border-primary-500/30 hover:shadow-glow transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{trip.name}</h3>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
              <HiLocationMarker size={13} className="shrink-0" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
          <Badge variant={trip.status === 'ready' ? 'success' : trip.status === 'planning' ? 'warning' : 'default'}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <HiCalendar size={13} />
            <span>{formatDate(trip.travelDate, 'MMM dd, yyyy')}</span>
          </div>
          {days !== null && days > 0 && (
            <span className="text-primary-400 font-medium">{days}d away</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <FiUsers size={13} />
            <span>Up to {trip.maxMembers} members</span>
          </div>
          {trip.memberRole === 'organizer' && (
            <Badge variant="violet" size="xs">Organizer</Badge>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await tripService.getAll();
        setTrips(res.trips || []);
      } catch {
        toast.error('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      const res = await tripService.join(joinCode.trim().toUpperCase());
      toast.success('Joined trip successfully!');
      navigate(`/trips/${res.trip._id}`);
    } catch (err) {
      toast.error(err.message || 'Invalid invite code');
    } finally {
      setJoining(false);
    }
  };

  const upcoming = trips.filter((t) => new Date(t.travelDate) > new Date() && t.status !== 'cancelled');
  const past = trips.filter((t) => new Date(t.travelDate) <= new Date() || t.status === 'completed');
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {upcoming.length > 0
              ? `You have ${upcoming.length} upcoming trip${upcoming.length > 1 ? 's' : ''}`
              : 'Plan your next group journey'}
          </p>
        </div>
        <Link to="/trips/create">
          <Button variant="primary" icon={MdAdd}>New Trip</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: trips.length, icon: MdTrain, color: 'text-primary-400', bg: 'bg-primary-400/10' },
          { label: 'Upcoming', value: upcoming.length, icon: HiCalendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Completed', value: past.length, icon: MdGroups, color: 'text-violet-400', bg: 'bg-violet-400/10' },
          { label: 'As Organizer', value: trips.filter((t) => t.memberRole === 'organizer').length, icon: FiUsers, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={stat.color} size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-xs">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Join via code */}
      <motion.div {...fadeUp(0.1)}>
        <Card className="p-5">
          <h2 className="text-white font-semibold mb-3 text-sm">Join a Trip</h2>
          <form onSubmit={handleJoin} className="flex gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 8-character invite code"
              maxLength={8}
              className="form-input flex-1 font-mono tracking-widest text-sm uppercase"
            />
            <Button type="submit" loading={joining} variant="primary" icon={HiArrowRight} iconPosition="right">
              Join
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Upcoming trips */}
      <motion.div {...fadeUp(0.15)}>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <HiCalendar className="text-primary-400" />
          Upcoming Trips
        </h2>
        {loading ? (
          <Spinner className="py-12" />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={MdTrain}
            title="No upcoming trips"
            description="Create a new trip or join one using an invite code."
            action={
              <Link to="/trips/create">
                <Button variant="primary" icon={MdAdd}>Create a Trip</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((trip, i) => (
              <motion.div key={trip._id} {...fadeUp(i * 0.05)}>
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Past trips */}
      {past.length > 0 && (
        <motion.div {...fadeUp(0.2)}>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MdGroups className="text-slate-400" />
            Past Trips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((trip, i) => (
              <motion.div key={trip._id} {...fadeUp(i * 0.05)}>
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
