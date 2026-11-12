# ✨ Shreya Tiwari's 18th Birthday Celebration Website ✨
### A Modern, Magical & Interactive Mobile-First Web Experience

Designed with a vibrant, playful, and trendy aesthetic featuring glassmorphism, pastel & neon gradients, 3D envelope unsealing, interactive candle-blowing, touch Polaroid swiper, live seconds ticker, and confetti particle physics — celebrating Shreya's official milestone into adulthood!

---

## 🌟 Key Features

1. **💌 3D Wax Seal Envelope Unwrapping (Hero Section)**
   - Interactive envelope with a 3D golden wax seal marked with **"18"**.
   - Tapping the seal triggers an authentic unsealing sound, dual confetti cannons, and reveals a personalized 18th birthday celebration invitation letter.

2. **🎶 Smart Audio System (Play/Pause with Equalizer)**
   - Floating music pill with animated equalizer bars and strict single-instance play/pause toggling.
   - Left with a clean blank placeholder (`<audio id="bgMusicAudio" src="">`) so you can easily drop in your own custom audio file path.
   - If left blank, plays a single-instance Web Audio API Music Box synthesizer rendition of *"Happy Birthday to You"*.

3. **📊 Animated Milestones & Real-Time Live Ticker**
   - **18 Years of Pure Joy**
   - **216 Months of Radiance** (18 × 12)
   - **6,574 Days of Spreading Happiness**
   - **157,776 Hours of Endless Love**
   - **Live Clock Ticker**: Dynamically calculates and displays elapsed seconds since 27th November 2008 in real-time.

4. **🎂 Virtual Cake with Candle Blowing Micro-Interaction**
   - 3-tiered frosted birthday cake topped with cherries, strawberries, sprinkles, and dual number "1" & "8" candles with golden ribbon *"FABULOUS 18 SHREYA"*.
   - **Extinguish the Flames 3 Ways**:
     - **Tap** the candles or "Tap to Blow Candles" button.
     - **Swipe** up or across the flames with your finger.
     - **Microphone Blowing**: Tap *"🎙️ Use Mic to Blow"* to blow gently into your phone's microphone to extinguish the candles with real breath!
   - On blow: smoke curls rise, haptic feedback triggers, celebratory fireworks fill the screen, and a *"Make an 18th Wish"* modal pops up with blessings.

5. **📸 10-Slot 9:16 Polaroid Memory Carousel (Touch Swiper)**
   - 10 vertical 9:16 Polaroid photo slots with smart blurred glowing backgrounds and `object-fit: contain` so portrait, landscape, and square photos display without cropping or stretching.
   - Each slot includes a custom quote tailored to Shreya's life phases (childhood, growing up, family, traditional looks, stylish portraits, and 18th celebration).
   - Smooth horizontal swipe gestures (`touchstart`/`touchend`) optimized for mobile touchscreens without interfering with vertical scrolling.
   - **Instant Photo Customizer**: Includes a button to select up to 10 real photos directly from your phone gallery/camera, or paste file paths into each `<img src="">` slot in `index.html`.

6. **🎈 Floating Balloons & Secret Wish Messages**
   - 4 floating pastel balloons: *Family*, *Dreams*, *Turned 18*, and *Future*.
   - Tap any balloon to pop it with a burst and reveal a sweet hidden message tailored to entering adulthood.
   - Expandable glassmorphic accordion with heartfelt blessings.

7. **💖 Interactive Heart Shower & WhatsApp Sharing**
   - Tap *"Shower Shreya With Love"* to spray floating emoji hearts upward with combo counters.
   - Milestones at multiples of 18 trigger celebratory fireworks!
   - One-tap WhatsApp share and clipboard link copy.

---

## 📱 How to Open & Run

### Method 1: Instant Browser Preview
- Simply double-click **`index.html`** or **`standalone.html`** in any web browser (Google Chrome, Safari, Edge, Firefox).
- **On Mobile**: Open `index.html` or `standalone.html` directly on your iPhone or Android phone, or host it on any free static host (GitHub Pages, Vercel, Netlify).

### Method 2: Local Server (Optional)
Run in PowerShell / terminal:
```bash
npx serve .
# or
python -m http.server 8000
```
Then visit `http://localhost:8000` on your desktop or mobile browser.

---

## 🎨 Files Included

| File | Purpose |
|------|---------|
| [index.html](file:///c:/Users/ASUS/Desktop/Shreya%20Bday/index.html) | Semantic, accessible mobile HTML structure (18th Birthday Edition) |
| [style.css](file:///c:/Users/ASUS/Desktop/Shreya%20Bday/style.css) | Mobile-first CSS, pastel/neon glassmorphism, responsive 360px-430px layout |
| [app.js](file:///c:/Users/ASUS/Desktop/Shreya%20Bday/app.js) | Interactive touch engine, Web Audio music box, candle blowing (1 & 8) & confetti |
| [standalone.html](file:///c:/Users/ASUS/Desktop/Shreya%20Bday/standalone.html) | Fully self-contained single-file version (HTML + CSS + JS inlined) |

---

## ✏️ Easy Customizations

- **Add Custom Music**: Paste your audio file path into the `src=""` attribute of `<audio id="bgMusicAudio">` in `index.html` (or `standalone.html`).
- **Update Real Photos**:
  - Open the site on your phone and tap *"🖼️ Tap to customize with Shreya's real photos"*, or
  - Add your 6 photo paths inside the 6 `<img src="">` tags in `index.html`.
- **Edit Messages**: All wish cards and quotes in `index.html` and `app.js` can be customized to include personal family nicknames and inside jokes!
# Happy-Birthday
