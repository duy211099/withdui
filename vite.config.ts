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

export default defineConfig({
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
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks for better caching
          if (id.includes('node_modules')) {
            // React and related libraries in their own chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('@inertiajs')) {
              return 'vendor-react'
            }
            // UI libraries (shadcn, radix, etc.) in their own chunk
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx')) {
              return 'vendor-ui'
            }
            // Everything else from node_modules goes to vendor
            return 'vendor'
          }
        },
      },
    },
  },
  esbuild: {
    // Remove console.log, console.warn, console.error in production
    drop: ['console', 'debugger'],
  },
})
