export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev-secret-change-me',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
