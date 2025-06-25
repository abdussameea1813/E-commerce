// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Assuming this is correct

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            // This rule will intercept any request from your frontend starting with /api
            // and forward it to your backend running at http://localhost:5000.
            // The /api prefix WILL be included in the forwarded request to the backend.
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true, // Needed for virtual hosting or name-based virtual hosts
                // IMPORTANT: Do NOT include a `rewrite` rule here unless your backend
                // routes DO NOT have `/api` as their prefix.
                // Since your backend uses `app.use('/api/auth', authRoutes);`,
                // it expects the `/api` prefix, so no rewrite is needed.
            },
        },
    },
});