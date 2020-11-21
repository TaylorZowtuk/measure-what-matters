module.exports = {
  apps: [
    {
      name: 'mwm-backend',
      script: 'backend/dist/main.js',
      interpreter: '/home/ubuntu/n/n/versions/node/14.15.1/bin/node',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 4019,
        DATABASE_TYPE: 'postgres',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 5984,
        DATABASE_NAME: 'mwm',
        DATABASE_USER: 'mwm',
        DATABASE_PASSWORD: 'VOtgTCqCIA3IpLEGqtV6GCVp',
      },
    },
    {
      name: 'mwm-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: '.',
        PM2_SERVE_PORT: 4018,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: 'frontend/build/index.html',
      },
    },
  ],
};
