import Member from '../models/Member.js';
import Trip from '../models/Trip.js';
import { AppError } from '../middleware/errorHandler.js';

// Known originating stations for major Indian trains (simplified heuristic)
const MAJOR_ORIGINATING_STATIONS = new Set([
  'NDLS', 'CSTM', 'HWH', 'MAS', 'SBC', 'BZA', 'SC', 'ADI', 'LTT', 'PNBE',
  'VSKP', 'BBS', 'NGP', 'NZM', 'BCT', 'PUNE', 'JP', 'LKO', 'GKP', 'DBRG',
]);

const normaliseStation = (name = '') => name.trim().toUpperCase();

const getStationFrequency = (members) => {
  const freq = {};
  members.forEach((m) => {
    const station = normaliseStation(m.boardingStation);
    if (station) freq[station] = (freq[station] || 0) + (m.passengerCount || 1);
  });
  return freq;
};

const getSeatPreferenceSummary = (members) => {
  const counts = {};
  members.forEach((m) => {
    m.passengers?.forEach((p) => {
      p.seatPreferences?.forEach((pref) => {
        counts[pref] = (counts[pref] || 0) + 1;
      });
    });
  });
  return counts;
};

export const generateRecommendation = async (tripId, userId) => {
  const trip = await Trip.findById(tripId).populate('organizer', '_id');
  if (!trip) throw new AppError('Trip not found.', 404);

  const isMember = await Member.findOne({ trip: tripId, user: userId });
  if (!isMember) throw new AppError('Access denied.', 403);

  const members = await Member.find({ trip: tripId }).populate('user', 'name');
  const completedMembers = members.filter((m) => m.boardingStation);

  if (completedMembers.length === 0) {
    throw new AppError('No members have entered their boarding station yet.', 400);
  }

  const freq = getStationFrequency(completedMembers);
  const stations = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const totalPassengers = Object.values(freq).reduce((s, v) => s + v, 0);

  const recommendedStation = stations[0][0];
  const recommendedCount = stations[0][1];
  const isOriginating = MAJOR_ORIGINATING_STATIONS.has(recommendedStation);
  const otherStations = stations.slice(1);
  const extraTravellers = totalPassengers - recommendedCount;

  const prefSummary = getSeatPreferenceSummary(completedMembers);
  const topPrefs = Object.entries(prefSummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pref]) => pref.replace(/_/g, ' '));

  // Build recommendation text
  const summary = otherStations.length === 0
    ? `All members are already boarding from ${recommendedStation}. No change needed — you're set to travel together!`
    : `Booking from ${recommendedStation} gives your group the best chance of travelling together. ${
        isOriginating ? 'This is an originating station, meaning the train starts here and typically has more confirmed quota available.' : ''
      } ${extraTravellers > 0 ? `${extraTravellers} passenger${extraTravellers > 1 ? 's' : ''} from other stations would need to adjust their journey to board here.` : ''}`;

  const advantages = [];
  if (isOriginating) advantages.push(`${recommendedStation} is an originating station — the train departs from here with full quota`);
  advantages.push(`${recommendedCount} of ${totalPassengers} passengers already board here — minimal disruption`);
  advantages.push(`Higher probability of confirmed berths in the same coach`);
  if (topPrefs.length > 0) advantages.push(`Common seat preferences (${topPrefs.join(', ')}) are easier to fulfil when booking together`);

  const tradeoffs = [];
  if (otherStations.length > 0) {
    otherStations.forEach(([station, count]) => {
      tradeoffs.push(
        `${count} passenger${count > 1 ? 's' : ''} currently boarding from ${station} will need to travel to ${recommendedStation}`
      );
    });
  }
  if (!isOriginating) {
    tradeoffs.push(`${recommendedStation} is an intermediate station — confirm quota availability before booking`);
  }
  if (totalPassengers > 6) {
    tradeoffs.push(`Large group (${totalPassengers} passengers) — consider booking as early as possible (Tatkal/ARP 60 days)`);
  }

  const recommendation = {
    summary,
    recommendedStation,
    advantages,
    tradeoffs,
    generatedAt: new Date(),
  };

  // Persist on trip
  await Trip.findByIdAndUpdate(tripId, { aiRecommendation: recommendation });

  return recommendation;
};
