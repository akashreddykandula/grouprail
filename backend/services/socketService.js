const connectedUsers = new Map(); // userId → socketId

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Register user with their socket
    socket.on('register', (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`👤 User ${userId} registered on socket ${socket.id}`);
    });

    // Join a trip room for real-time updates
    socket.on('join_trip_room', (tripId) => {
      socket.join(`trip:${tripId}`);
      console.log(`🚂 Socket ${socket.id} joined trip room: trip:${tripId}`);
    });

    // Leave a trip room
    socket.on('leave_trip_room', (tripId) => {
      socket.leave(`trip:${tripId}`);
    });

    // Chat message — handled in Phase 9
    socket.on('send_message', async (data) => {
      // Full implementation in Phase 9
      io.to(`trip:${data.tripId}`).emit('receive_message', data);
    });

    // Typing indicator
    socket.on('typing_start', (data) => {
      socket.to(`trip:${data.tripId}`).emit('user_typing', {
        userId: data.userId,
        name: data.name,
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`trip:${data.tripId}`).emit('user_stopped_typing', {
        userId: data.userId,
      });
    });

    socket.on('disconnect', () => {
      // Remove from connected users map
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

// Emit to a specific user by userId
export const emitToUser = (io, userId, event, data) => {
  const socketId = connectedUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Emit to all members of a trip room
export const emitToTrip = (io, tripId, event, data) => {
  io.to(`trip:${tripId}`).emit(event, data);
};
