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
    // Increase chunk size warning to 700kb since MDX compiler is legitimately large
    // (202kb gzipped is acceptable for a full markdown processor)
    chunkSizeWarningLimit: 700,
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Optimize chunk size thresholds for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        // Split vendor libraries into separate chunks for better caching
        manualChunks: (id) => {
          // React ecosystem - changes rarely, cache aggressively
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          // Inertia - changes rarely
          if (id.includes('node_modules/@inertiajs')) {
            return 'vendor-inertia'
          }
          // MDX runtime (smaller) - for rendering MDX
          if (id.includes('node_modules/@mdx-js/react') || id.includes('node_modules/@mdx-js/mdx/lib/run')) {
            return 'vendor-mdx-runtime'
          }
          // MDX compiler (larger) - separate chunk for compile-time processing
          if (id.includes('node_modules/@mdx-js') || id.includes('node_modules/remark-') || id.includes('node_modules/rehype-') || id.includes('node_modules/unified') || id.includes('node_modules/micromark')) {
            return 'vendor-mdx-compiler'
          }
          // Heavy UI libraries that are used globally
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) {
            return 'vendor-ui'
          }
          // Common utilities used across many pages
          if (id.includes('node_modules/axios') || id.includes('node_modules/clsx') ||
              id.includes('node_modules/class-variance-authority') || id.includes('node_modules/date-fns')) {
            return 'vendor-common'
          }
          // Force-graph: Keep it and its dependencies together
          // This prevents the "xr is not a function" error from splitting Canvas/WebGL code
          if (id.includes('node_modules/force-graph') || id.includes('node_modules/react-force-graph')) {
            return 'vendor-force-graph'
          }
          // Don't bundle other heavy specialized libraries - let them load with their pages
          // flexsearch, etc. will be bundled with the pages that use them
        },
      },
    },
  },
  esbuild: {
    // Remove console.log, console.warn, console.error in production
    drop: ['console', 'debugger'],
  },
})
