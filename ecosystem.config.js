module.exports = {
  apps: [
    {
      name: 'mwm-backend',
      script: 'backend/dist/main.js',
      env_production: {
        NODE_ENV: 'production',
        APP_PORT: 4019,
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
