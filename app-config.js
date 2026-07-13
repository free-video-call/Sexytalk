/* ============================================================
   app-config.js
   -------------------------------------------------------------
   EDIT ONLY THIS FILE to customize the page.
   Never touch index.html, style.css, or script.js to change
   app details — they read everything from the APP object below.

   To swap images: replace the files inside /assets/ using the
   SAME filenames referenced here (icon.png, ss1.jpg … ss4.jpg),
   or point these paths at your own filenames. Either way, the
   page updates automatically on reload — no code changes needed.
   ============================================================ */

const APP = {
  name: "Sexy Talk",
  developer: "SexyTalks Inc.",
  icon: "assets/icon.png",

  screenshots: [
    "assets/ss1.png",
    "assets/ss2.png",
    "assets/ss3.png",
    "assets/ss4.png"
  ],

  rating: "4.8",
  reviews: "500K",
  downloads: "5M+",
  size: "13.6 MB",
  age: "18+",
  category: "Communication",
  installText: "Install",
https://github.com/free-video-call/Sexytalk/raw/refs/heads/main/Sexy%20talk.apk

  description: "Your app description goes here. Explain what the app does, why people should install it, and what makes it useful. Keep it concise and scannable — this text will be truncated in the About section with a button to expand.",

  /* Ratings & Reviews breakdown — percentage of reviewers who gave
     5, 4, 3, 2, and 1 stars, in that order. Should sum to ~100. */
  ratingBreakdown: [68, 18, 8, 4, 2],

  /* Data safety bullet points shown in the Data Safety section. */
  dataSafety: [
    { label: "Data is encrypted in transit", safe: true },
    { label: "You can request data deletion", safe: true },
    { label: "Shares data with third parties", safe: false }
  ]
};
