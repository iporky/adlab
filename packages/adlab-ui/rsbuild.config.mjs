import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';

const isRunningInDocker = process.env.PUBLIC_RUNNING_IN_DOCKER === 'true';
const appContext = process.env.PUBLIC_APP_CONTEXT;
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [pluginReact(), pluginSass(), ...(isDev ? [pluginBasicSsl()] : [])],
  html: {
    template: './public/index.html',
  },
  server: isRunningInDocker
    ? undefined
    : {
        open: `https://localhost:3000/${appContext}`,
        host: 'localhost',
      },
});
