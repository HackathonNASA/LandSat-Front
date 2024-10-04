import { defineConfig } from 'astro/config';

// Integrations
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// Astro configuration
export default defineConfig({
  // Global settings
  site: 'https://yourdomain.com',
  base: '/',
  trailingSlash: 'never',

  // Change output to 'server' for API routes
  output: 'server',

  // Integrations
  integrations: [
    react(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx(),
  ],

  // Vite configuration
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@assets': '/src/assets',
      },
    },
  },

  // Compress HTML output (optional)
  compressHTML: true,

  // TailwindCSS optimizations
  tailwindcss: {
    mode: 'jit',
    purge: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
    darkMode: 'media',
    theme: {
      extend: {
        colors: {
          primary: '#6366f1',
          secondary: '#fbbf24',
        },
      },
    },
    plugins: [],
  },

  // Optional: Markdown config (for static Markdown if needed)
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});