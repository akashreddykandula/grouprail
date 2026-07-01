import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected');
    if (userId) {
      socket.emit('register', userId);
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const joinTripRoom = (tripId) => {
  if (socket) {
    socket.emit('join_trip_room', tripId);
  }
};

export const leaveTripRoom = (tripId) => {
  if (socket) {
    socket.emit('leave_trip_room', tripId);
  }
};
