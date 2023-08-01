import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    preview: {
        port: 9999,
    },
    server: {
        port: 3001,
    }
});
