/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: "#facd05", // Book Yellow
                primary: "#18181b", // Zinc 900
                secondary: "#52525b", // Zinc 600
                accent: "#facd05", // Use brand as accent
                background: "#fafafa", // Zinc 50
                surface: "#ffffff",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                hand: ['Patrick Hand', 'cursive'], // Add hand-drawn font if we can import it
            }
        },
    },
    plugins: [],
}
