import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => ({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
    react(),
    tailwindcss(),
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/frontend'),
    },
  },
  build: {
    // Disable source maps in production to prevent source code exposure
    sourcemap: false,
    // Use esbuild for minification (default, faster than terser)
    minify: 'esbuild',
    // Let Vite handle automatic code splitting (safer than manual chunks)
    rollupOptions: {
      output: {
        // Optimize chunk size thresholds for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks: undefined, // Use Vite's automatic chunking
      },
    },
  },
  esbuild: {
    // Remove console.log, console.warn, console.error in production
    drop: ['console', 'debugger'],
  },
  server: mode === 'development'
    ? {
        host: '0.0.0.0',
        hmr: {
          host: 'lvh.me',
          port: 3036,
          protocol: 'ws',
        },
      }
    : undefined,
}))
