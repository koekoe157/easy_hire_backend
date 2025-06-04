const allowOrigins = [];

export const corsConfig = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  allowedHeaders: ["Content-Type", "Authorization", "authorization"],
  optionsSuccessStatus: 200,
  credentials: true,
};
