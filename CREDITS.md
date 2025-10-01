# Credits & Acknowledgments

## SonicCanvas - AI Performance Visualizer

### Technologies & Libraries

#### Core Frameworks
- **[Three.js](https://threejs.org/)** (r128)
  - 3D graphics engine
  - Particle system rendering
  - WebGL abstraction layer
  - Created by Ricardo Cabello (Mr.doob)

- **[TensorFlow.js](https://www.tensorflow.org/js)** (v3.11.0)
  - Machine learning framework for JavaScript
  - Browser-based inference
  - Developed by Google Brain Team

- **[HandPose Model](https://github.com/tensorflow/tfjs-models/tree/master/handpose)** (v0.0.7)
  - Real-time hand tracking model
  - 21 hand landmark detection
  - TensorFlow.js Models Team

#### Web APIs
- **Web Audio API**
  - Real-time audio processing
  - FFT analysis and frequency decomposition
  - W3C standard

- **MediaRecorder API**
  - Canvas and audio stream recording
  - WebM video encoding
  - VP9/VP8 codec support

- **Fullscreen API**
  - Full-screen mode for performance presentations
  - Cross-browser compatibility

- **MediaDevices API**
  - Webcam and microphone access
  - Audio/video stream management

### Audio Processing Techniques

#### FFT Analysis
- **Fast Fourier Transform** for frequency domain analysis
- 2048-bin resolution for detailed spectrum visualization
- Smoothing time constant optimization for visual appeal

#### Beat Detection Algorithm
- Adaptive threshold-based beat detection
- Energy-based onset detection
- Temporal smoothing for false-positive reduction
- Inspired by research in Music Information Retrieval (MIR)

#### Frequency Band Extraction
- Sub-bass: 0-60 Hz
- Bass: 60-250 Hz
- Low-midrange: 250-500 Hz
- Midrange: 500-2000 Hz
- High-midrange: 2000-4000 Hz
- Treble: 4000-8000 Hz

Based on standard audio engineering frequency divisions

### Visual Design & Effects

#### Particle Systems
- GPU-accelerated particle rendering via Three.js
- Physics-based motion with velocity and damping
- Frequency-mapped particle behaviors
- Inspired by:
  - **Winamp AVS** (Advanced Visualization Studio)
  - **MilkDrop** visualization plugin
  - **Processing** creative coding framework

#### Color Theory
- **Cyberpunk Palette**: Cyan-Magenta gradient (complementary colors)
- **Sunset Palette**: Orange-Pink gradient (warm harmonics)
- **Ocean Palette**: Blue-Cyan gradient (analogous colors)
- Based on color psychology in visual media

#### Post-Processing Effects
- **Motion Blur/Trails**: Frame persistence technique
- **Camera Shake**: Procedural animation for rhythm emphasis
- **Radial Symmetry**: Kaleidoscope effect using polar coordinates
- **Bloom/Glow**: Additive blending for luminous particles

### Machine Learning

#### Hand Gesture Recognition
- **MediaPipe HandPose** architecture
- Real-time landmark detection at 30fps
- Finger extension calculation using geometric algorithms
- Gesture classification via rule-based system
- Smoothing via temporal filtering (5-frame history)

Reference:
- Zhang et al. "MediaPipe Hands: On-device Real-time Hand Tracking"

### Artistic Inspiration

- **Ryoji Ikeda** - Data visualization and audiovisual art
- **Robert Hodgin (Flight404)** - Particle systems and generative art
- **Memo Akten** - AI and creative coding
- **Joshua Davis** - Generative design
- **Zach Lieberman** - Interactive installations

### Music Production Tools Reference
- **iZotope Insight** - Audio analysis visualization
- **Serum Wavetable Synth** - Oscilloscope visualizations
- **GRAMS Spectrum Analyzer** - Frequency visualization
- **Ableton Live** - Session view and audio routing

### Development Tools

- **Claude Code** by Anthropic
  - AI-assisted development
  - Code generation and debugging
  - Architecture design consultation

- **Visual Studio Code**
  - Primary development environment

- **Chrome DevTools**
  - Performance profiling
  - WebGL debugging

### Fonts & Typography

- **[Inter](https://fonts.google.com/specimen/Inter)** by Rasmus Andersson
  - Professional sans-serif typeface
  - Optimized for digital interfaces
  - Open source (SIL Open Font License)

### Browser Compatibility Testing

Tested on:
- Google Chrome 120+
- Microsoft Edge 120+
- Mozilla Firefox 121+
- Safari 17+
- Opera 106+

### Performance Optimization Techniques

- **RequestAnimationFrame** for smooth 60fps rendering
- **GPU particle rendering** via Three.js Points
- **Efficient geometry updates** with buffer attributes
- **Minimal DOM manipulation** for UI updates
- **Web Workers** consideration for future audio processing

### Research & Learning Resources

#### Audio Visualization
- "Handbook of Software Solutions for ICME" - Multimedia processing techniques
- "The Computer Music Tutorial" by Curtis Roads
- "Designing Sound" by Andy Farnell
- Real-time Audio Programming lectures (Stanford CCRMA)

#### WebGL & Graphics
- "WebGL Programming Guide" by Kouichi Matsuda
- Three.js documentation and examples
- Shader tutorials by The Book of Shaders

#### Machine Learning
- TensorFlow.js documentation
- "Hands-On Machine Learning with JavaScript" by Burak Kanber
- MediaPipe documentation

### Special Thanks

- **GRAMMY U** - For providing the opportunity and platform
- **Music Technology Community** - For continuous inspiration
- **Web Audio Developers** - For sharing knowledge and techniques
- **Open Source Contributors** - For making these technologies accessible

### License Notes

This project uses multiple open-source technologies:
- Three.js: MIT License
- TensorFlow.js: Apache License 2.0
- Inter Font: SIL Open Font License 1.1

All original code in this project is created for educational and demonstration purposes.

---

## Created For

**GRAMMY U 2024**
Music Technology & Innovation

**Built with ❤️ using:**
- Modern Web Technologies
- AI-Assisted Development (Claude Code)
- Passion for Music & Visual Art

---

*"Where sound meets vision, technology meets art"*
