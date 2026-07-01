const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:3000',
    ];

    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
  maxAge: 86400,
};

export default corsOptions;
