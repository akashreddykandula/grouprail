import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdTrain } from 'react-icons/md';
import { HiLocationMarker, HiCalendar, HiUserGroup } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { tripService } from '../../services/tripService';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { formatDate } from '../../utils/helpers';

const JoinTripPage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!inviteCode) return;
    const load = async () => {
      try {
        const res = await tripService.getByInviteCode(inviteCode);
        setTrip(res.trip);
      } catch {
        setError('This invite link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [inviteCode]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/join/${inviteCode}`);
      return;
    }
    setJoining(true);
    try {
      const res = await tripService.join(inviteCode);
      toast.success('You have joined the trip!');
      navigate(`/trips/${res.trip._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to join trip');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-sm w-full">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-white font-bold text-xl mb-2">Invalid Link</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/')} className="w-full">Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <MdTrain className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">You're invited!</h1>
          <p className="text-slate-400 mt-1 text-sm">Join this group train journey on GroupRail</p>
        </div>

        <Card className="p-6 mb-4">
          <h2 className="text-xl font-bold text-white mb-1">{trip.name}</h2>
          <div className="space-y-2.5 mt-4">
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <HiLocationMarker className="text-primary-400 shrink-0" size={16} />
              <span>Destination: <span className="text-white font-medium">{trip.destination}</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <HiCalendar className="text-primary-400 shrink-0" size={16} />
              <span>Travel Date: <span className="text-white font-medium">{formatDate(trip.travelDate, 'PPPP')}</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <HiUserGroup className="text-primary-400 shrink-0" size={16} />
              <span>Organised by: <span className="text-white font-medium">{trip.organizer?.name}</span></span>
            </div>
          </div>
        </Card>

        <Button
          variant="primary"
          size="xl"
          loading={joining}
          onClick={handleJoin}
          className="w-full"
        >
          {isAuthenticated ? 'Join This Trip' : 'Sign In to Join'}
        </Button>

        {!isAuthenticated && (
          <p className="text-center text-slate-500 text-xs mt-3">
            Don't have an account?{' '}
            <span
              onClick={() => navigate(`/register?redirect=/join/${inviteCode}`)}
              className="text-primary-400 cursor-pointer hover:underline"
            >
              Create one free
            </span>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default JoinTripPage;
