export const config = {
  port: process.env.PORT || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  apiBaseUrl:
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
};
