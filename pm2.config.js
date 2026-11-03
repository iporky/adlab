module.exports = {
  apps: [
    {
      name: 'adlab-ui',
      script: 'pnpm',
      args: 'run preview:docker',
      cwd: './packages/adlab-ui',
      env: {
        PORT: 3000,
      },
    },
    {
      name: 'adlab-service',
      script: 'pnpm',
      args: 'run start',
      cwd: './packages/adlab-service',
      env: {
        PORT: 8080,
      },
    },
  ],
};