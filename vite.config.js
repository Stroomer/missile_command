import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // optional, ensures Vite starts from this folder
  resolve: {
    extensions: ['.mjs', '.js', '.json'],
  },
  server: {
    open: true,
  },
});
