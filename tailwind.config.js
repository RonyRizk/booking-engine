/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Additive print tokens only — A4 geometry in pt, for the fiscal documents
    // under src/app/[domain]/[id]/printing/. Nothing here redefines an existing
    // Tailwind class, so non-print UI is unaffected.
    extend: {
      spacing: {
        page: "595.28pt",
        "page-margin": "36pt",
        "page-margin-tight": "18pt",
        content: "523.28pt",
      },
      width: {
        page: "595.28pt",
      },
      maxWidth: {
        page: "595.28pt",
        content: "523.28pt",
      },
      minHeight: {
        page: "841.89pt",
      },
    },
  },
  plugins: [],
}
