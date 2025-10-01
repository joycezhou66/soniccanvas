# SonicCanvas - AI Performance Visualizer


**SonicCanvas** is a next-generation web-based audio visualizer that bridges music production and interactive art. Built for musicians, producers, and visual artists, it transforms sound into mesmerizing 3D particle animations with AI-powered gesture control, professional post-processing effects, and real-time audio analysis.

Perfect for live performances, music production visualization, and creating stunning audio-reactive content for social media and music videos.

---

## 🎯 Project Overview

A professional-grade audio visualization platform that combines:
- **Real-time 3D Graphics** using Three.js and WebGL
- **Advanced Audio Processing** with Web Audio API FFT analysis
- **AI Gesture Recognition** via TensorFlow.js HandPose model
- **Professional Recording Capabilities** with synchronized audio/video export
- **5 Unique Visual Modes** each optimized for different music genres and moods

## Features

- **Real-time Audio Visualization**: Watch 2000+ particles dance to your music
- **Multiple Input Sources**:
  - Upload audio files (MP3, WAV)
  - Live microphone input for real-time performance
- **5 Visual Presets**: Switch between stunning visualization modes
  - 🌌 **Cosmic** - Spiral galaxy formation with bass-reactive spiral arms
  - 🧠 **Neural** - Connected node network with dynamic connections
  - 💫 **Pulse** - Expanding concentric rings from center
  - ⚡ **Chaos** - Erratic particle swarm with chaotic motion
  - 📊 **Minimal** - Clean frequency bars visualization
- **Professional Effects**:
  - Trail effects (particles leave light trails)
  - Bass-reactive camera shake
  - Radial symmetry mode (kaleidoscope effect)
  - High-frequency spike detection for cymbals/hi-hats
- **Hand Gesture Control**: Control the visualization with hand gestures using TensorFlow.js
  - ✊ **Fist**: Freeze particles in place
  - ✋ **Open Palm**: Trigger pulse effect
  - ✌️ **Peace Sign**: Cycle through color palettes
- **Color Palettes**: Three distinct visual themes
  - Cyberpunk (cyan/magenta)
  - Sunset (orange/pink)
  - Ocean (blue/cyan)
- **Recording & Export**:
  - Record visualization as video (WebM format, max 3 minutes)
  - Synchronized audio and video recording
  - High-resolution screenshot capture (PNG)
  - Export settings presets as JSON
  - Share link generation
- **Performance Mode**:
  - Full-screen visualization
  - Hide all UI elements
  - Optimized for smooth 60fps
  - ESC key to exit
- **Keyboard Shortcuts**: Fast preset switching (1-5) and effect toggles (T, K, R)
- **Frequency-Reactive Animations**: Particles respond to different frequency bands
- **Beat Detection**: Visual pulses synchronized with music beats
- **Dynamic Camera**: Orbiting camera that moves with audio intensity
- **Smooth Transitions**: Animated transitions between presets
- **Neon Aesthetic**: Stunning glassmorphism UI with smooth animations

## 🚀 Live Demo

**[Launch SonicCanvas →](landing.html)**

Experience the full application with your own audio files or use your microphone for real-time visualization.

---

## 💡 Technology Stack

### Core Technologies
- **Three.js (r128)** - 3D graphics engine and particle system rendering
- **Web Audio API** - Real-time audio processing and FFT analysis
- **TensorFlow.js (v3.11.0)** - Machine learning framework
- **HandPose Model (v0.0.7)** - 21-point hand landmark detection
- **MediaRecorder API** - High-quality video recording with audio sync
- **WebGL** - GPU-accelerated graphics rendering
- **ES6+ JavaScript** - Modern, performant, zero-dependency codebase

### Audio Processing Pipeline
- **2048-bin FFT** for high-resolution frequency analysis
- **6 frequency bands** (sub-bass, bass, low-mid, mid, high-mid, treble)
- **Beat detection algorithm** with adaptive thresholding
- **Real-time audio effects** capture and synchronization

## 🎨 Use Cases

- **Live Performances**: Full-screen performance mode with gesture control
- **Music Production**: Visualize frequency content and dynamics
- **Content Creation**: Record high-quality video for music videos and social media
- **DJ Sets**: Real-time visualization synced to your mix
- **Educational**: Teach audio engineering concepts visually
- **Art Installations**: Interactive audio-reactive installations

---

## ⚙️ Setup Instructions

### Quick Start (No Installation Required!)

1. **Download** or clone this repository
2. **Open** `landing.html` in a modern web browser (Chrome/Edge recommended)
3. **Click** "Launch Experience" button
4. **Upload** an audio file or enable microphone input
5. **Explore** different presets and effects

### Running Locally

Since this project uses Web Audio API and microphone access, it's recommended to serve it over HTTPS or localhost.

**Option 1: Using Node.js (Recommended)**
```bash
# Install Node.js if not already installed (https://nodejs.org/)

# Run the development server
npm start

# Server will start at http://localhost:8080
# Open http://localhost:8080/landing.html in your browser
```

**Option 2: Using Python**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Option 3: Using VS Code**
- Install the "Live Server" extension
- Right-click on `landing.html` and select "Open with Live Server"

## Usage

### Upload Audio File
1. Click the **"Upload Audio"** button
2. Select an MP3 or WAV file from your computer
3. Click **"Play"** to start visualization
4. Click **"Stop"** to pause

### Use Microphone
1. Click the **"🎤 Microphone"** button
2. Allow microphone access when prompted
3. The visualization will react to live audio input
4. Click again to stop microphone input

### Visual Presets
1. Use the **preset panel** on the right side of the screen
2. Click any preset button or use keyboard shortcuts:
   - **1** - Cosmic (spiral galaxy)
   - **2** - Neural (node network)
   - **3** - Pulse (expanding rings)
   - **4** - Chaos (erratic swarm)
   - **5** - Minimal (frequency bars)
3. Toggle effects:
   - **T** - Trail effect (particles leave light trails)
   - **K** - Kaleidoscope (radial symmetry)
   - **R** - Random preset
4. Smooth animated transitions between presets

### Hand Gesture Control
1. Click the **"👋 Gestures"** button
2. Allow webcam access when prompted
3. A small webcam preview will appear in the top-right corner
4. Show your hand to the camera and make gestures:
   - **✊ Fist** (closed hand): Toggle freeze - particles stop moving
   - **✋ Open Palm** (all fingers extended): Trigger pulse effect - particles expand outward
   - **✌️ Peace Sign** (index + middle finger up): Cycle color palettes
5. Gesture status overlay shows current gesture and available commands
6. Click **"👋 Gestures"** again to stop gesture control

### Recording & Export
1. Click the **"⏺ Record"** button to start recording
2. Recording includes both canvas video and synchronized audio
3. Max recording duration: 3 minutes
4. Click **"⏹ Stop"** to stop and automatically download
5. Recording indicator shows in top-left corner with timer

**Export Options** (click **"💾 Export"** button):
- **📸 Screenshot**: Captures high-resolution PNG (2x native resolution)
- **🔗 Share Link**: Generates shareable demo link
- **⚙️ Export Preset**: Saves current settings as JSON file for later import

### Performance Mode
1. Click the **"⚡ Performance"** button
2. Enters full-screen mode
3. Hides all UI elements for clean recording
4. Optimized for smooth 60fps rendering
5. Press **ESC** to exit performance mode

### Keyboard Shortcuts
- **1-5**: Switch between visual presets
- **T**: Toggle trail effect
- **K**: Toggle kaleidoscope mode
- **R**: Random preset selection
- **ESC**: Exit performance mode

## File Structure

```
SonicCanvas/
├── index.html            # Main HTML structure
├── style.css             # Styling and UI design
├── audio-engine.js       # Audio processing and analysis
├── visualizer.js         # Three.js visualization logic
├── gesture-controller.js # Hand gesture recognition
├── presets.js            # Visual preset management
├── recorder.js           # Recording and export functionality
├── performance-mode.js   # Performance mode implementation
└── README.md            # This file
```

## Key Components

### audio-engine.js
- Web Audio API initialization
- FFT analysis with 2048 bins
- Beat detection algorithm
- Frequency band extraction (sub-bass, bass, mid, high, treble)
- Audio source management (file upload, microphone)

### visualizer.js
- Three.js scene setup
- Particle system with 2000 particles
- **5 visual modes**: Cosmic, Neural, Pulse, Chaos, Minimal
- **Professional effects**:
  - Trail rendering for motion blur effect
  - Bass-reactive camera shake
  - Radial symmetry (kaleidoscope mode)
  - Spiral galaxy formation on low frequencies
  - High-frequency spike detection
- Three color palettes (cyberpunk, sunset, ocean)
- Dynamic color shifting
- Gesture-responsive effects (freeze, pulse)
- Orbiting camera animation with shake
- Real-time rendering

### gesture-controller.js
- TensorFlow.js HandPose model integration
- Real-time hand landmark detection (21 points)
- Gesture recognition algorithm
- Gesture smoothing and filtering
- Webcam preview with visual feedback
- Three gesture commands: fist, open palm, peace sign

### presets.js
- Preset management system
- 5 distinct visual modes with unique behaviors
- Keyboard shortcut handling (1-5, T, K, R)
- Smooth animated transitions between presets
- Preset notification system
- Effect toggle management
- UI state synchronization

### recorder.js
- Canvas video recording via MediaRecorder API
- Audio stream capture with synchronization
- WebM format with VP9/VP8 codecs
- Recording timer and duration limits (3 min max)
- High-resolution screenshot capture (2x resolution)
- Settings preset export as JSON
- Share link generation
- Download notifications

### performance-mode.js
- Full-screen mode management
- UI element hiding/showing
- ESC key handler for quick exit
- Performance optimization toggles
- Fullscreen API with cross-browser support
- Visual performance mode indicator

## Browser Compatibility

- Chrome/Edge (recommended) - Full support
- Firefox - Full support
- Safari - Full support (iOS requires user interaction for audio)
- Opera - Full support

**Minimum Requirements:**
- ES6+ JavaScript support
- Web Audio API support
- WebGL support
- Webcam (for gesture control)
- MediaDevices API (for camera/microphone access)
- MediaRecorder API (for recording)
- Fullscreen API (for performance mode)

## Performance Tips

- For best performance, use a modern GPU
- Reduce particle count in `visualizer.js` if experiencing lag:
  ```javascript
  this.particleCount = 1000; // Instead of 2000
  ```
- Close other GPU-intensive applications
- Use hardware acceleration in your browser

## Customization

### Create Custom Presets
In `presets.js`, add new presets:
```javascript
myPreset: {
    name: 'My Preset',
    description: 'Custom visualization',
    visualMode: 'cosmic', // or create new mode in visualizer.js
    trailEffect: true,
    trailOpacity: 0.15,
    radialSymmetry: false,
    cameraRadius: 150,
    icon: '✨'
}
```

### Adjust Color Palettes
In `visualizer.js`, modify the color palette settings:
```javascript
this.colorPalettes = {
    cyberpunk: { hueBase: 0.5, hueRange: 0.3, saturation: 1.0 },
    sunset: { hueBase: 0.05, hueRange: 0.15, saturation: 0.9 },
    ocean: { hueBase: 0.55, hueRange: 0.15, saturation: 0.8 }
};
```

### Trail Effect Intensity
In `visualizer.js`:
```javascript
this.trailOpacity = 0.15; // 0 = no trail, 1 = full persistence
```

### Camera Shake Sensitivity
In `visualizer.js`:
```javascript
this.cameraShakeIntensity = bassIntensity * 10; // Adjust multiplier
```

### Modify Beat Sensitivity
In `audio-engine.js`:
```javascript
this.beatThreshold = 1.3; // Lower = more sensitive
```

### Kaleidoscope Segments
In `visualizer.js`:
```javascript
this.symmetrySegments = 6; // Number of radial segments
```

### Gesture Detection Settings
In `gesture-controller.js`:
```javascript
this.detectionFPS = 10; // Detections per second
this.gestureHistorySize = 5; // Smoothing buffer size
```

## Troubleshooting

**Microphone not working:**
- Ensure you've granted microphone permissions
- Check browser console for errors
- Try HTTPS or localhost

**Gesture control not working:**
- Allow webcam permissions when prompted
- Ensure good lighting for hand detection
- Keep hand clearly visible in camera frame
- Try different hand positions/distances
- Check browser console for model loading errors
- Wait for "Model loaded" status before starting

**No visualization:**
- Check if audio is playing
- Verify browser supports Web Audio API
- Open browser console to check for errors

**Poor performance:**
- Reduce particle count
- Lower FFT size in `audio-engine.js`
- Reduce gesture detection FPS in `gesture-controller.js`
- Close other tabs/applications
- Disable gesture control if not needed

**Gestures not recognized:**
- Ensure hand is clearly visible with no obstructions
- Try making gestures more deliberately
- Check webcam preview to see if landmarks are detected
- Adjust distance from camera (30-60cm works best)
- Ensure adequate lighting

**Recording not working:**
- Check browser supports MediaRecorder API (Chrome/Edge/Firefox)
- Ensure audio is playing before recording
- Check console for codec support messages
- Try different browser if issues persist
- Recording limited to 3 minutes max

**Performance mode issues:**
- Press ESC to exit if stuck
- Some browsers may block fullscreen requests
- UI elements should auto-restore on exit
- Check browser fullscreen permissions

## How It Works

### Audio Processing
1. Audio input (file or microphone) is processed through Web Audio API
2. FFT analysis extracts frequency data across 2048 bins
3. Frequency bands (bass, mid, treble) are calculated
4. Beat detection algorithm identifies rhythm patterns
5. Audio data drives particle movement and colors
6. Bass frequencies trigger camera shake
7. Treble frequencies create spike effects

### Visual Modes
Each preset has unique particle behavior:
- **Cosmic**: Particles form spiral galaxy arms, bass creates tighter spirals
- **Neural**: Particles connect when close, forming a dynamic node network
- **Pulse**: Particles expand and contract in concentric waves
- **Chaos**: Particles follow chaotic trigonometric paths with random jitter
- **Minimal**: Particles arrange in clean frequency bars (spectrum analyzer)

### Gesture Recognition
1. Webcam captures video at 30fps
2. TensorFlow.js HandPose model detects 21 hand landmarks
3. Finger extensions are calculated from landmark positions
4. Gestures are recognized based on finger patterns
5. Gesture history smoothing prevents false detections
6. Commands are sent to visualizer for real-time effects

### Visualization Pipeline
1. Particles distributed based on current visual mode
2. Each particle maps to a frequency bin
3. Audio intensity applies mode-specific forces to particles
4. Professional effects applied: trails, camera shake, symmetry
5. Gesture commands modify particle behavior
6. Colors shift based on palette and frequency
7. Camera orbits dynamically with bass-reactive shake
8. Preset transitions smoothly animate camera radius

### Recording System
1. MediaRecorder API captures canvas at 60fps
2. Audio context destination captures audio with effects
3. Video and audio streams combined into single MediaStream
4. WebM container with VP9/VP8 video codec and Opus audio
5. Data collected in chunks every 100ms
6. Recording stops at 3-minute limit or manual stop
7. Blob created and automatically downloaded
8. Notifications confirm successful download

### Performance Mode
1. Fullscreen API requests full-screen display
2. All UI elements hidden via display:none
3. Performance optimizations applied (optional particle reduction)
4. ESC key listener for quick exit
5. On exit, UI elements restored to original state
6. Fullscreen exited automatically
7. Performance mode indicator shown briefly

## 📚 Documentation

- **[CREDITS.md](CREDITS.md)** - Detailed credits, technologies, and inspiration
- **[Landing Page](landing.html)** - Professional project overview
- **[Main Application](index.html)** - Full interactive experience

---

## 🎓 Educational Value

SonicCanvas demonstrates:
- **Audio Engineering**: FFT analysis, frequency bands, beat detection
- **Computer Graphics**: Particle systems, 3D rendering, post-processing
- **Machine Learning**: Real-time inference, gesture recognition
- **Web Development**: Modern APIs, performance optimization
- **User Experience**: Intuitive controls, visual feedback, accessibility

Perfect for learning about:
- Music visualization techniques
- Real-time audio processing
- WebGL and 3D graphics
- AI/ML in creative applications
- Web platform capabilities
