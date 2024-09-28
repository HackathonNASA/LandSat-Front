import { defineConfig } from 'astro/config';

// Integrations
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx'; // Optional: Add MDX support

// Astro configuration
export default defineConfig({
  // Global settings
  site: 'https://yourdomain.com', // Add site URL for SEO
  base: '/', // Base path for your site
  trailingSlash: 'never', // Control trailing slashes in URLs

  // Integrations
  integrations: [
    react(),
    tailwind({
      config: {
        applyBaseStyles: false, // Optional: disable base styles if needed
      },
    }),
    mdx(), // Optional: enable MDX support
  ],

  // Vite configuration
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components', // Adjust the path as necessary
        '@assets': '/src/assets',
      },
    },
  },

  // Compress HTML output (optional)
  compressHTML: true, // Enable HTML compression for performance

  // TailwindCSS optimizations
  tailwindcss: {
    mode: 'jit', // Just-in-time mode
    purge: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'], // Purge unused CSS in production
    darkMode: 'media', // Enable dark mode based on media query
    theme: {
      extend: {
        colors: {
          primary: '#6366f1',
          secondary: '#fbbf24',
        },
      },
    },
    plugins: [], // Add additional TailwindCSS plugins if necessary
  },

  // Optional: Markdown config (for static Markdown if needed)
  markdown: {
    syntaxHighlight: 'shiki', // Enable syntax highlighting with Shiki
    shikiConfig: {
      theme: 'github-dark', // Choose theme for Shiki
    },
  },
});
