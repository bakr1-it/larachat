import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
server: {
    host: 'localhost',
    port: 5173,
    cors: true,
    hmr: {
        host: 'localhost',
    },
    watch: {
        usePolling: true,
        interval: 100,
    },
},
});
