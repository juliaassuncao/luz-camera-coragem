import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function absoluteSiteUrl(rawUrl: string) {
  const value = rawUrl.trim().replace(/\/+$/, '');
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function siteMetadata(siteUrl: string): Plugin {
  return {
    name: 'site-metadata',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl);
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configuredUrl = absoluteSiteUrl(env.VITE_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || '');
  if (env.VERCEL && !configuredUrl) {
    throw new Error('Defina VITE_SITE_URL ou habilite VERCEL_PROJECT_PRODUCTION_URL antes do deploy.');
  }
  const siteUrl = configuredUrl || `http://localhost:${command === 'serve' ? '5173' : '4173'}`;

  return {
    base: '/',
    plugins: [react(), siteMetadata(siteUrl)],
  };
});
