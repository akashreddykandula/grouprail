# GroupRail — Smart Group Train Journey Planner

> AI-powered group train journey coordination platform. Plan together, board together.

GroupRail is **not** a ticket booking website. It helps groups travelling from different cities coordinate their journey and then redirects them to the official IRCTC website to book.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Zustand |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + httpOnly Cookies |
| Deployment | Frontend → Vercel · Backend → Render · DB → MongoDB Atlas |

---

## Folder Structure

```
grouprail/
├── frontend/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route-level pages
│       ├── store/         # Zustand state stores
│       ├── services/      # Axios API calls + socket
│       ├── utils/         # Helpers and formatters
│       └── styles/        # Global CSS
├── backend/
│   ├── controllers/       # Request handlers
│   ├── routes/            # Express routers
│   ├── models/            # Mongoose schemas
│   ├── services/          # Business logic + AI
│   ├── middleware/        # Auth, error, rate limiting
│   └── utils/             # Token, response helpers
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI, JWT_SECRET, EMAIL_* values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
npm run dev
```

---

## Environment Variables

### Backend `.env`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=min_32_char_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_IRCTC_URL=https://www.irctc.co.in/nget/train-search
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | No | Logout |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/forgot-password | No | Request reset email |
| POST | /api/auth/reset-password/:token | No | Reset password |
| PATCH | /api/auth/update-password | Yes | Change password |

### Trips
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/trips | Yes | Get all my trips |
| POST | /api/trips | Yes | Create trip |
| POST | /api/trips/join | Yes | Join via invite code |
| GET | /api/trips/invite/:code | Yes | Preview trip by code |
| GET | /api/trips/:tripId | Yes | Get trip details |
| PATCH | /api/trips/:tripId | Yes | Update trip (organizer) |
| DELETE | /api/trips/:tripId | Yes | Delete trip (organizer) |
| POST | /api/trips/:tripId/recommend | Yes | Generate AI recommendation |

### Members
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/members/trips/:tripId/membership | Yes | Get my membership |
| PATCH | /api/members/trips/:tripId/membership | Yes | Update my details |
| POST | /api/members/trips/:tripId/ready | Yes | Mark myself ready |
| DELETE | /api/members/trips/:tripId/leave | Yes | Leave trip |

### Messages
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/messages/trips/:tripId/messages | Yes | Get messages |
| POST | /api/messages/trips/:tripId/messages | Yes | Send message |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/notifications | Yes | Get notifications |
| PATCH | /api/notifications/:id/read | Yes | Mark read |
| PATCH | /api/notifications/read-all | Yes | Mark all read |

---

## Deployment

### Backend → Render
1. Push backend to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`
6. Deploy

### Frontend → Vercel
1. Push frontend to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` to your Render backend URL
4. Set `VITE_SOCKET_URL` to same Render URL
5. Deploy

### Database → MongoDB Atlas
1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` in Network Access (or Render IPs)
3. Copy the connection string to `MONGODB_URI`

---

## Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `register` | Client → Server | Register user socket |
| `join_trip_room` | Client → Server | Subscribe to trip updates |
| `leave_trip_room` | Client → Server | Unsubscribe from trip |
| `send_message` | Client → Server | Send chat message |
| `receive_message` | Server → Client | New message in trip |
| `member_joined` | Server → Client | New member joined |
| `member_updated` | Server → Client | Member details updated |
| `member_ready` | Server → Client | Member marked ready |
| `trip_updated` | Server → Client | Trip details changed |
| `typing_start` | Client → Server | User started typing |
| `typing_stop` | Client → Server | User stopped typing |
| `user_typing` | Server → Client | Someone is typing |

---

## Features

- **Auth**: Register, Login, Forgot/Reset Password, JWT + Cookies
- **Trip Creation**: Name, destination, date, train, max members → instant invite code
- **Join Trip**: Via 8-char code or share link
- **Member Dashboard**: All members, boarding stations, passenger count, ready status
- **Seat Preferences**: Window, Lower Berth, Upper Berth, Side Lower/Upper, Adjacent, Same Coach/Compartment
- **AI Recommendation**: Analyses all boarding stations and recommends the optimal one
- **Real-Time Chat**: Socket.IO group chat with typing indicators
- **Booking Checklist**: Smart checklist → redirects to IRCTC when all green
- **Trip Timeline**: Created → Joined → Planning → Booking → Journey
- **Notifications**: Member joined, details updated, journey approaching
- **User Profile**: Stats, upcoming/completed trips, password change

---

## License

MIT © GroupRail
