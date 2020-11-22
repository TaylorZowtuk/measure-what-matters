module.exports = {
  apps: [
    {
      name: 'mwm-backend',
      script: 'node dist/main',
      cwd: '/home/ubuntu/mwm/backend',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 4019,
        DATABASE_TYPE: 'postgres',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 5432,
        DATABASE_NAME: 'mwm',
        DATABASE_USER: 'mwm',
        DATABASE_PASSWORD: 'VOtgTCqCIA3IpLEGqtV6GCVp',
        JWT_SECRET:
          'iSTzo8slM5axIjPwZWX1SBltTyxy23B6Wi7nEhnXHm92uRPs5dA9WR2DRih19uU0',
        JWT_EXPIRES_IN: '10080m',
      },
    },
    {
      name: 'mwm-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: '/frontend/build',
        PM2_SERVE_PORT: 4018,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
    },
  ],
};
