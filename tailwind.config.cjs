/** @type {import('tailwindcss').Config}*/
const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {}
    },

    plugins: [require("@tailwindcss/typography"),require("daisyui")],

    daisyui: {
        themes: ["light", "dark", "retro"],
    },
};

module.exports = config;
