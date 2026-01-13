module.exports = {
  apps: [
    {
      name: 'next-fe-dev',
      cwd: '.',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev',
      env: {
        PORT: 4000
      }
    },
    {
      name: 'next-fe',
      cwd: '.',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
}
