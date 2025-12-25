import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // чтобы Tailwind видел все файлы в src
    ],
    theme: {
        extend: {
        },
    },
    plugins: [],
};

export default config;
