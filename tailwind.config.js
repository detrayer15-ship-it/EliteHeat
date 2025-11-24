/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF7A00',
                'primary-dark': '#E66D00',
                background: '#F4F4F6',
                text: '#2E2E3A',
                'ai-blue': '#2F80ED',
                success: '#28C76F',
                error: '#EB5757',
            },
        },
    },
    plugins: [],
}
