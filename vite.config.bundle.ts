import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// Vite config for building the standalone invoice form bundle
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/invoice-form.bundle.tsx'),
      name: 'InvoiceForm',
      fileName: (format) => `invoice-form.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: 'dist-bundle',
    sourcemap: true,
    cssCodeSplit: false,
  },
  css: {
    postcss: './postcss.config.js',
  }
});