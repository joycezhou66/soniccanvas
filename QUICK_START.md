# SonicCanvas - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Run Locally
```bash
npm start
```
Opens at `http://localhost:8080/landing.html`

### 2. Open in Browser
- Click "Launch Experience"
- Upload an audio file (MP3/WAV) OR enable microphone
- Start visualizing!

### 3. Explore Features
- **Presets**: Press 1-5 to switch visual modes
- **Gestures**: Click 👋 Gestures button (requires webcam)
- **Record**: Click ⏺ Record to save video
- **Export**: Click 💾 Export for screenshots/presets
- **Performance**: Click ⚡ Performance for full-screen

---

## 📁 Project Structure

```
SonicCanvas/
├── landing.html           ⭐ Start here
├── index.html             Main application
├── server.js              Development server
├── package.json           Node.js config
│
├── Core Engines:
│   ├── audio-engine.js    Audio processing & FFT
│   ├── visualizer.js      3D particle rendering
│   ├── gesture-controller.js  Hand tracking AI
│   ├── presets.js         5 visual modes
│   ├── recorder.js        Video recording
│   ├── performance-mode.js Full-screen mode
│   └── demo-mode.js       Auto-demonstration
│
├── Styling:
│   └── style.css          UI & animations
│
├── Documentation:
│   ├── README.md          Full documentation
│   ├── CREDITS.md         Attribution
│   └── QUICK_START.md     This file
│
└── Deployment:
    ├── .gitignore         Git exclusions
    ├── vercel.json        Vercel config
    └── netlify.toml       Netlify config
```

---

## 🎮 Controls

### Keyboard Shortcuts
- **1-5**: Switch presets (Cosmic, Neural, Pulse, Chaos, Minimal)
- **T**: Toggle trail effects
- **K**: Toggle kaleidoscope mode
- **R**: Random preset
- **ESC**: Exit performance mode

### Gesture Controls (requires webcam)
- **✊ Fist**: Freeze particles
- **✋ Palm**: Trigger pulse effect
- **✌️ Peace**: Cycle color palettes

---

## 🎨 Visual Modes

1. **🌌 Cosmic** - Spiral galaxy with bass-reactive arms
2. **🧠 Neural** - Connected node network
3. **💫 Pulse** - Expanding rings from center
4. **⚡ Chaos** - Erratic particle swarm
5. **📊 Minimal** - Frequency bars

---

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 8080 is in use
# Try different port:
PORT=3000 npm start
```

### No audio visualization
- Ensure audio is playing
- Check browser console for errors
- Try uploading a different audio file
- Enable microphone and speak

### Gestures not working
- Allow webcam permissions
- Ensure good lighting
- Keep hand 30-60cm from camera
- Check webcam preview shows landmarks

### Recording failed
- Ensure audio is playing before recording
- Check browser supports MediaRecorder (Chrome/Edge)
- Max 3 minutes per recording

---

## 🌐 Deploy Online

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages
```bash
git init
git add .
git commit -m "SonicCanvas"
git push origin main
# Enable in Settings → Pages
```

---

## 💡 Tips

- **Best Audio**: Upload high-quality MP3/WAV files
- **Best Browser**: Chrome or Edge for full feature support
- **Performance**: Reduce particles if lag occurs
- **Recording**: Use Performance Mode for clean recordings
- **Gestures**: Practice gestures before live performance

---

## 📱 Mobile Support

- ✅ Touch controls work
- ✅ Responsive UI
- ⚠️ Gesture control requires webcam (rear camera on mobile)
- ⚠️ Recording may not work on iOS
- ⚠️ Reduced particles recommended

---

## 🎓 GRAMMY U Submission

This project demonstrates:
- Real-time audio analysis
- 3D graphics programming
- AI/ML integration
- Creative coding
- Music technology innovation

**Category**: Music Technology & Innovation
**Year**: 2024

---

## 🆘 Need Help?

1. Check [README.md](README.md) for full documentation
2. Check [CREDITS.md](CREDITS.md) for technology details
3. Check browser console for error messages
4. Ensure all files are in same directory
5. Use Chrome/Edge for best compatibility

---

**Ready to create amazing audio visualizations!** 🎵✨

Start: `npm start` → Open browser → Upload audio → Enjoy!
