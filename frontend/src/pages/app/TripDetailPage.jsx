import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdTrain, MdAutoAwesome, MdChat, MdGroups, MdCheckCircle, MdNotifications,
} from 'react-icons/md';
import {
  HiCalendar, HiLocationMarker, HiClipboardList, HiShare,
  HiCheckCircle, HiXCircle, HiRefresh, HiExternalLink,
} from 'react-icons/hi';
import { FiUsers, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { tripService } from '../../services/tripService';
import useAuthStore from '../../store/authStore';
import { getSocket, joinTripRoom, leaveTripRoom } from '../../services/socket';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Countdown from '../../components/common/Countdown';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import {
  formatDate, daysUntil, getTripStatusConfig, getMemberStatusConfig,
  formatSeatPreference, getInitials,
} from '../../utils/helpers';

const SEAT_OPTIONS = [
  { value: 'lower_berth', label: 'Lower Berth' },
  { value: 'upper_berth', label: 'Upper Berth' },
  { value: 'window', label: 'Window Seat' },
  { value: 'side_lower', label: 'Side Lower' },
  { value: 'side_upper', label: 'Side Upper' },
  { value: 'adjacent_seats', label: 'Adjacent Seats' },
  { value: 'same_coach', label: 'Same Coach' },
  { value: 'same_compartment', label: 'Same Compartment' },
];

/* ─── sub-components ─── */
const MemberCard = ({ member, isCurrentUser }) => {
  const statusCfg = getMemberStatusConfig(member.status);
  return (
    <div className={`glass-card p-4 ${isCurrentUser ? 'border-primary-500/30' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar name={member.user?.name || ''} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-medium">{member.user?.name}</span>
            {member.isOrganizer && <Badge variant="violet" size="xs">Organizer</Badge>}
            {isCurrentUser && <Badge variant="info" size="xs">You</Badge>}
          </div>
          {member.boardingStation ? (
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
              <FiMapPin size={11} />
              <span>{member.boardingStation}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-xs">No station set</span>
          )}
          {member.passengerCount > 0 && (
            <span className="text-slate-500 text-xs">{member.passengerCount} passenger{member.passengerCount > 1 ? 's' : ''}</span>
          )}
        </div>
        <Badge variant={member.status === 'ready' ? 'success' : 'warning'} size="xs">
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </Badge>
      </div>
    </div>
  );
};

const ChecklistItem = ({ done, label }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
    {done
      ? <HiCheckCircle className="text-emerald-400 shrink-0" size={18} />
      : <HiXCircle className="text-slate-600 shrink-0" size={18} />}
    <span className={`text-sm ${done ? 'text-slate-200' : 'text-slate-500'}`}>{label}</span>
  </div>
);

const AIRecommendationPanel = ({ recommendation, loading, onGenerate }) => {
  if (loading) return <div className="py-8"><Spinner className="mx-auto" /></div>;
  if (!recommendation?.summary) {
    return (
      <div className="text-center py-8">
        <MdAutoAwesome className="text-slate-500 mx-auto mb-3" size={32} />
        <p className="text-slate-400 text-sm mb-4">
          Generate an AI recommendation once members have entered their boarding stations.
        </p>
        <Button variant="primary" onClick={onGenerate} icon={MdAutoAwesome}>
          Generate Recommendation
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/15">
        <p className="text-slate-200 text-sm leading-relaxed">{recommendation.summary}</p>
        {recommendation.recommendedStation && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-slate-400 text-xs">Recommended:</span>
            <Badge variant="primary">{recommendation.recommendedStation}</Badge>
          </div>
        )}
      </div>
      {recommendation.advantages?.length > 0 && (
        <div>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-2">Advantages</p>
          <div className="space-y-1.5">
            {recommendation.advantages.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                <HiCheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={13} />
                {a}
              </div>
            ))}
          </div>
        </div>
      )}
      {recommendation.tradeoffs?.length > 0 && (
        <div>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-2">Trade-offs</p>
          <div className="space-y-1.5">
            {recommendation.tradeoffs.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                <span className="text-amber-400 shrink-0">⚠</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={onGenerate} icon={HiRefresh}>
        Regenerate
      </Button>
    </div>
  );
};

/* ─── main page ─── */
const TripDetailPage = () => {
  const { tripId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [myMembership, setMyMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [memberForm, setMemberForm] = useState({ boardingStation: '', passengerCount: 1, passengers: [] });
  const [savingMember, setSavingMember] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadTrip();
    joinTripRoom(tripId);
    return () => leaveTripRoom(tripId);
  }, [tripId]);

  useEffect(() => {
    if (activeTab === 'chat') loadMessages();
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onMemberJoined = () => loadTrip();
    const onMemberUpdated = () => loadTrip();
    const onTripUpdated = (data) => setTrip((prev) => ({ ...prev, ...data.trip }));
    const onReceiveMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on('member_joined', onMemberJoined);
    socket.on('member_updated', onMemberUpdated);
    socket.on('trip_updated', onTripUpdated);
    socket.on('receive_message', onReceiveMessage);
    return () => {
      socket.off('member_joined', onMemberJoined);
      socket.off('member_updated', onMemberUpdated);
      socket.off('trip_updated', onTripUpdated);
      socket.off('receive_message', onReceiveMessage);
    };
  }, []);

  const loadTrip = async () => {
    try {
      const [tripRes, memberRes] = await Promise.all([
        tripService.getById(tripId),
        tripService.getMembership(tripId).catch(() => ({ member: null })),
      ]);
      setTrip(tripRes.trip);
      setMyMembership(memberRes.member);
      setRecommendation(tripRes.trip.aiRecommendation?.summary ? tripRes.trip.aiRecommendation : null);
      if (memberRes.member) {
        setMemberForm({
          boardingStation: memberRes.member.boardingStation || '',
          passengerCount: memberRes.member.passengerCount || 1,
          passengers: memberRes.member.passengers || [],
        });
      }
    } catch {
      toast.error('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await tripService.getMessages(tripId);
      setMessages(res.messages || []);
    } catch {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setSendingMsg(true);
    try {
      await tripService.sendMessage(tripId, msgInput.trim());
      setMsgInput('');
    } catch { toast.error('Failed to send message'); }
    finally { setSendingMsg(false); }
  };

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const res = await tripService.getRecommendation(tripId);
      setRecommendation(res.recommendation);
      toast.success('Recommendation generated!');
    } catch (err) {
      toast.error(err.message || 'Failed to generate recommendation');
    } finally {
      setAiLoading(false);
    }
  };

  const saveMemberDetails = async () => {
    setSavingMember(true);
    try {
      const res = await tripService.updateMembership(tripId, memberForm);
      setMyMembership(res.member);
      setEditModal(false);
      toast.success('Details saved!');
      loadTrip();
    } catch (err) {
      toast.error(err.message || 'Failed to save details');
    } finally {
      setSavingMember(false);
    }
  };

  const handleMarkReady = async () => {
    try {
      await tripService.markReady(tripId);
      toast.success('Marked as ready!');
      loadTrip();
    } catch (err) {
      toast.error(err.message || 'Please complete your details first');
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(trip.inviteCode);
    toast.success('Invite code copied!');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${trip.inviteCode}`);
    toast.success('Invite link copied!');
  };

  const addPassenger = () => {
    setMemberForm((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { name: '', age: '', gender: 'prefer_not_to_say', seatPreferences: [] }],
    }));
  };

  const removePassenger = (index) => {
    setMemberForm((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  };

  const updatePassenger = (index, field, value) => {
    setMemberForm((prev) => ({
      ...prev,
      passengers: prev.passengers.map((p, i) => i === index ? { ...p, [field]: value } : p),
    }));
  };

  const toggleSeatPref = (index, pref) => {
    setMemberForm((prev) => {
      const passengers = [...prev.passengers];
      const prefs = passengers[index].seatPreferences || [];
      passengers[index].seatPreferences = prefs.includes(pref)
        ? prefs.filter((p) => p !== pref)
        : [...prefs, pref];
      return { ...prev, passengers };
    });
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!trip) return null;

  const members = trip.members || [];
  const isOrganizer = trip.organizer?._id === user?._id || trip.organizer === user?._id;
  const readyMembers = members.filter((m) => m.status === 'ready');
  const allReady = members.length > 0 && readyMembers.length === members.length;
  const statusCfg = getTripStatusConfig(trip.status);
  const days = daysUntil(trip.travelDate);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MdTrain },
    { id: 'members', label: `Members (${members.length})`, icon: MdGroups },
    { id: 'ai', label: 'AI Advice', icon: MdAutoAwesome },
    { id: 'chat', label: 'Group Chat', icon: MdChat },
    { id: 'checklist', label: 'Checklist', icon: HiClipboardList },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-white truncate">{trip.name}</h1>
              <Badge variant={trip.status === 'ready' ? 'success' : 'warning'}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5"><HiLocationMarker size={14} />{trip.destination}</span>
              <span className="flex items-center gap-1.5"><HiCalendar size={14} />{formatDate(trip.travelDate, 'PPP')}</span>
              {days > 0 && <span className="text-primary-400 font-medium">{days} days away</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" icon={HiShare} onClick={copyInviteLink}>
              Share Link
            </Button>
            <Button variant="secondary" size="sm" onClick={copyInviteCode}>
              Code: {trip.inviteCode}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      {days > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-4">
            <p className="text-slate-400 text-xs mb-3">Journey starts in</p>
            <Countdown targetDate={trip.travelDate} />
          </Card>
        </motion.div>
      )}

      {/* My details quick action */}
      {myMembership && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card className={`p-4 ${myMembership.status === 'ready' ? 'border-emerald-500/30' : 'border-amber-500/20'}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white text-sm font-medium">Your Journey Details</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {myMembership.boardingStation
                    ? `Boarding: ${myMembership.boardingStation} · ${myMembership.passengerCount} passenger${myMembership.passengerCount > 1 ? 's' : ''}`
                    : 'Please add your boarding station and passenger details'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditModal(true)}>
                  {myMembership.boardingStation ? 'Edit Details' : 'Add Details'}
                </Button>
                {myMembership.status !== 'ready' && myMembership.boardingStation && (
                  <Button variant="success" size="sm" onClick={handleMarkReady}>
                    Mark Ready
                  </Button>
                )}
                {myMembership.status === 'ready' && (
                  <Badge variant="success"><HiCheckCircle size={12} /> Ready</Badge>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-primary-400 border-b-2 border-primary-400 bg-primary-400/5'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="text-white font-semibold mb-4">Trip Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Destination', value: trip.destination, icon: HiLocationMarker },
                    { label: 'Travel Date', value: formatDate(trip.travelDate, 'PPPP'), icon: HiCalendar },
                    { label: 'Train', value: trip.trainPreference || 'Not specified', icon: MdTrain },
                    { label: 'Max Members', value: `${members.length} / ${trip.maxMembers}`, icon: FiUsers },
                    { label: 'Status', value: statusCfg.label, icon: MdCheckCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="text-slate-400 shrink-0" size={15} />
                      <span className="text-slate-400 text-sm w-28 shrink-0">{label}</span>
                      <span className="text-white text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-white font-semibold mb-4">Trip Timeline</h3>
                <div className="space-y-3">
                  {(trip.timeline || []).map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                        {i < trip.timeline.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                      </div>
                      <div className="pb-3">
                        <p className="text-white text-sm font-medium">{event.event}</p>
                        {event.description && <p className="text-slate-500 text-xs mt-0.5">{event.description}</p>}
                        <p className="text-slate-600 text-xs mt-1">{formatDate(event.timestamp, 'PPp')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                  {readyMembers.length}/{members.length} members ready
                </p>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${members.length ? (readyMembers.length / members.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.map((member) => (
                  <MemberCard
                    key={member._id}
                    member={member}
                    isCurrentUser={member.user?._id === user?._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center">
                  <MdAutoAwesome className="text-primary-400" size={16} />
                </div>
                <h3 className="text-white font-semibold">AI Boarding Recommendation</h3>
              </div>
              <AIRecommendationPanel
                recommendation={recommendation}
                loading={aiLoading}
                onGenerate={generateAI}
              />
            </Card>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <MdChat className="text-primary-400" size={18} />
                <h3 className="text-white font-semibold text-sm">Group Chat</h3>
                <Badge variant="info" size="xs">{members.length} members</Badge>
              </div>
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <MdChat className="text-slate-600 mx-auto mb-2" size={28} />
                    <p className="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMe = msg.sender?._id === user?._id;
                  return (
                    <div key={i} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <Avatar name={msg.sender?.name || ''} size="xs" className="shrink-0 mt-1" />
                      <div className={`max-w-xs ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!isMe && <span className="text-xs text-slate-500 mb-1">{msg.sender?.name}</span>}
                        <div className={`px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-primary-600 text-white' : 'bg-white/10 text-slate-200'}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Type a message..."
                  className="form-input flex-1 text-sm py-2"
                  maxLength={1000}
                />
                <Button type="submit" variant="primary" size="sm" loading={sendingMsg} icon={FiSend}>
                  Send
                </Button>
              </form>
            </Card>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="text-white font-semibold mb-4">Booking Checklist</h3>
                <ChecklistItem done={members.length >= 2} label="At least 2 members have joined" />
                <ChecklistItem done={members.every((m) => !!m.boardingStation)} label="All members have entered their boarding station" />
                <ChecklistItem done={members.every((m) => m.passengers?.length > 0)} label="All members have added passenger information" />
                <ChecklistItem done={allReady} label="All members are marked Ready" />
                <ChecklistItem done={!!recommendation?.summary} label="AI boarding recommendation generated" />
                <ChecklistItem done={isOrganizer} label="Trip organizer is confirmed" />
              </Card>

              {allReady ? (
                <Card className="p-6 border-emerald-500/30 text-center">
                  <MdCheckCircle className="text-emerald-400 mx-auto mb-3" size={36} />
                  <h3 className="text-white font-bold text-lg mb-1">Ready to Book!</h3>
                  <p className="text-slate-400 text-sm mb-5">
                    All members are ready. Proceed to the official IRCTC website to book your tickets.
                  </p>
                  <a
                    href={import.meta.env.VITE_IRCTC_URL || 'https://www.irctc.co.in/nget/train-search'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="success" size="lg" icon={HiExternalLink} iconPosition="right">
                      Book on IRCTC
                    </Button>
                  </a>
                  <p className="text-slate-600 text-xs mt-3">
                    GroupRail does not book tickets. You will be redirected to the official IRCTC website.
                  </p>
                </Card>
              ) : (
                <Card className="p-4 border-amber-500/20">
                  <p className="text-amber-400 text-sm font-medium">
                    ⚠ Complete all checklist items above before booking.
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {members.filter((m) => m.status !== 'ready').length} member(s) still pending.
                  </p>
                </Card>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Edit Member Details Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Your Journey Details" size="lg">
        <div className="space-y-5">
          <div>
            <label className="form-label">Boarding Station <span className="text-red-400">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Vijayawada, Guntur, Hyderabad"
              value={memberForm.boardingStation}
              onChange={(e) => setMemberForm((p) => ({ ...p, boardingStation: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="form-label mb-0">Passengers</label>
              <Button variant="secondary" size="sm" onClick={addPassenger}>+ Add Passenger</Button>
            </div>
            <div className="space-y-4">
              {memberForm.passengers.map((p, i) => (
                <div key={i} className="glass-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">Passenger {i + 1}</span>
                    <button
                      onClick={() => removePassenger(i)}
                      className="text-red-400 hover:text-red-300 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input text-sm py-2"
                    placeholder="Full name"
                    value={p.name}
                    onChange={(e) => updatePassenger(i, 'name', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      className="form-input text-sm py-2"
                      placeholder="Age"
                      min={1} max={120}
                      value={p.age}
                      onChange={(e) => updatePassenger(i, 'age', e.target.value)}
                    />
                    <select
                      className="form-input text-sm py-2 bg-slate-900/50"
                      value={p.gender}
                      onChange={(e) => updatePassenger(i, 'gender', e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-2">Seat Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {SEAT_OPTIONS.map((opt) => {
                        const selected = p.seatPreferences?.includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleSeatPref(i, opt.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                              selected
                                ? 'bg-primary-600/30 border-primary-500/50 text-primary-300'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {memberForm.passengers.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">
                  Click "Add Passenger" to add your travel companions
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              loading={savingMember}
              onClick={saveMemberDetails}
              disabled={!memberForm.boardingStation}
            >
              Save Details
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TripDetailPage;
