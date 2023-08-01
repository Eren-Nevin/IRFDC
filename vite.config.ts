import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    preview: {
        port: 9999,
    },
    server: {
        host: '0.0.0.0',
        port: 3001,
    }
});
