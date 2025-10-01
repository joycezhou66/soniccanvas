/**
 * GestureController - Hand gesture recognition using TensorFlow.js HandPose
 * Detects hand gestures to control visualization parameters
 */
class GestureController {
    constructor() {
        // TensorFlow.js model
        this.model = null;
        this.isModelLoaded = false;

        // Video and canvas elements
        this.video = null;
        this.videoCanvas = null;
        this.videoContext = null;

        // Gesture state
        this.currentGesture = 'none';
        this.lastGesture = 'none';
        this.gestureConfidence = 0;
        this.gestureHistory = [];
        this.gestureHistorySize = 5;

        // Gesture commands
        this.commands = {
            freeze: false,
            pulse: false,
            colorPalette: 0 // 0: cyberpunk, 1: sunset, 2: ocean
        };

        // Calibration mode
        this.calibrationMode = false;
        this.calibrationData = {
            openPalm: [],
            fist: [],
            peace: []
        };

        // Detection parameters
        this.detectionInterval = null;
        this.detectionFPS = 10; // Run detection 10 times per second
        this.isRunning = false;

        // UI elements
        this.gestureOverlay = null;
        this.webcamPreview = null;

        this.init();
    }

    /**
     * Initialize gesture controller
     */
    async init() {
        console.log('Initializing gesture controller...');

        // Create UI elements
        this.createUI();

        // Load TensorFlow.js HandPose model
        try {
            console.log('Loading HandPose model...');
            this.model = await handpose.load();
            this.isModelLoaded = true;
            console.log('HandPose model loaded successfully');
            this.updateGestureStatus('Model loaded - Ready to start', '#00ff00');
        } catch (error) {
            console.error('Failed to load HandPose model:', error);
            this.updateGestureStatus('Failed to load model', '#ff0000');
        }
    }

    /**
     * Create UI elements for webcam preview and gesture status
     */
    createUI() {
        // Create webcam preview container
        this.webcamPreview = document.createElement('div');
        this.webcamPreview.id = 'webcam-preview';
        this.webcamPreview.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 240px;
            height: 180px;
            border: 2px solid #00ffff;
            border-radius: 12px;
            overflow: hidden;
            z-index: 200;
            display: none;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            background: #000;
        `;

        // Create video element
        this.video = document.createElement('video');
        this.video.width = 240;
        this.video.height = 180;
        this.video.autoplay = true;
        this.video.style.cssText = 'width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);';

        // Create canvas for hand landmarks overlay
        this.videoCanvas = document.createElement('canvas');
        this.videoCanvas.width = 240;
        this.videoCanvas.height = 180;
        this.videoCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            transform: scaleX(-1);
        `;
        this.videoContext = this.videoCanvas.getContext('2d');

        this.webcamPreview.appendChild(this.video);
        this.webcamPreview.appendChild(this.videoCanvas);
        document.body.appendChild(this.webcamPreview);

        // Create gesture status overlay
        this.gestureOverlay = document.createElement('div');
        this.gestureOverlay.id = 'gesture-overlay';
        this.gestureOverlay.style.cssText = `
            position: fixed;
            top: 220px;
            right: 20px;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid #00ffff;
            border-radius: 12px;
            color: #00ffff;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            z-index: 200;
            display: none;
            min-width: 200px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        `;
        this.gestureOverlay.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">Gesture Control</div>
            <div id="gesture-status" style="font-size: 0.85rem; color: #fff;">Initializing...</div>
            <div id="gesture-commands" style="margin-top: 10px; font-size: 0.75rem; color: #aaa; line-height: 1.6;">
                ✊ Fist: Freeze<br>
                ✋ Palm: Pulse<br>
                ✌️ Peace: Colors
            </div>
        `;
        document.body.appendChild(this.gestureOverlay);
    }

    /**
     * Start webcam and gesture detection
     */
    async start() {
        if (!this.isModelLoaded) {
            alert('HandPose model not loaded yet. Please wait...');
            return false;
        }

        if (this.isRunning) {
            console.log('Gesture controller already running');
            return true;
        }

        try {
            // Request webcam access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });

            this.video.srcObject = stream;
            this.isRunning = true;

            // Show UI elements
            this.webcamPreview.style.display = 'block';
            this.gestureOverlay.style.display = 'block';

            // Start detection loop
            this.startDetectionLoop();

            console.log('Gesture controller started');
            this.updateGestureStatus('Active - Show hand gestures', '#00ff00');
            return true;
        } catch (error) {
            console.error('Failed to access webcam:', error);
            alert('Could not access webcam. Please check permissions.');
            this.updateGestureStatus('Webcam access denied', '#ff0000');
            return false;
        }
    }

    /**
     * Stop webcam and gesture detection
     */
    stop() {
        if (!this.isRunning) return;

        // Stop video stream
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }

        // Stop detection loop
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }

        // Hide UI elements
        this.webcamPreview.style.display = 'none';
        this.gestureOverlay.style.display = 'none';

        // Reset state
        this.isRunning = false;
        this.currentGesture = 'none';
        this.commands.freeze = false;
        this.commands.pulse = false;

        console.log('Gesture controller stopped');
    }

    /**
     * Start gesture detection loop
     */
    startDetectionLoop() {
        const detectGesture = async () => {
            if (!this.isRunning) return;

            try {
                // Detect hand landmarks
                const predictions = await this.model.estimateHands(this.video);

                // Clear canvas
                this.videoContext.clearRect(0, 0, this.videoCanvas.width, this.videoCanvas.height);

                if (predictions.length > 0) {
                    const hand = predictions[0];

                    // Draw hand landmarks
                    this.drawHandLandmarks(hand);

                    // Recognize gesture
                    const gesture = this.recognizeGesture(hand);
                    this.updateGesture(gesture);

                    // Update UI
                    this.updateGestureStatus(`Gesture: ${gesture}`, '#00ffff');
                } else {
                    this.updateGesture('none');
                    this.updateGestureStatus('No hand detected', '#ffaa00');
                }
            } catch (error) {
                console.error('Detection error:', error);
            }
        };

        // Run detection at specified FPS
        this.detectionInterval = setInterval(detectGesture, 1000 / this.detectionFPS);
    }

    /**
     * Draw hand landmarks on canvas
     */
    drawHandLandmarks(hand) {
        const landmarks = hand.landmarks;

        // Draw points for each landmark
        this.videoContext.fillStyle = '#00ffff';
        landmarks.forEach(([x, y]) => {
            const scaledX = (x / 640) * 240;
            const scaledY = (y / 480) * 180;
            this.videoContext.beginPath();
            this.videoContext.arc(scaledX, scaledY, 4, 0, 2 * Math.PI);
            this.videoContext.fill();
        });

        // Draw connections between landmarks
        this.videoContext.strokeStyle = '#ff00ff';
        this.videoContext.lineWidth = 2;

        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],  // Index
            [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
            [0, 13], [13, 14], [14, 15], [15, 16],  // Ring
            [0, 17], [17, 18], [18, 19], [19, 20],  // Pinky
            [5, 9], [9, 13], [13, 17]  // Palm
        ];

        connections.forEach(([start, end]) => {
            const [x1, y1] = landmarks[start];
            const [x2, y2] = landmarks[end];
            const scaledX1 = (x1 / 640) * 240;
            const scaledY1 = (y1 / 480) * 180;
            const scaledX2 = (x2 / 640) * 240;
            const scaledY2 = (y2 / 480) * 180;

            this.videoContext.beginPath();
            this.videoContext.moveTo(scaledX1, scaledY1);
            this.videoContext.lineTo(scaledX2, scaledY2);
            this.videoContext.stroke();
        });
    }

    /**
     * Recognize gesture from hand landmarks
     */
    recognizeGesture(hand) {
        const landmarks = hand.landmarks;

        // Calculate finger extensions
        const fingers = this.getFingerExtensions(landmarks);

        // Count extended fingers
        const extendedCount = fingers.filter(f => f).length;

        // Recognize gestures
        if (extendedCount === 0) {
            // All fingers closed = Fist
            return 'fist';
        } else if (extendedCount === 5) {
            // All fingers extended = Open Palm
            return 'palm';
        } else if (extendedCount === 2 && fingers[1] && fingers[2]) {
            // Index and middle extended = Peace sign
            return 'peace';
        }

        return 'unknown';
    }

    /**
     * Determine which fingers are extended
     * Returns array: [thumb, index, middle, ring, pinky]
     */
    getFingerExtensions(landmarks) {
        const fingers = [];

        // Thumb: Compare tip (4) with base (2)
        const thumbTip = landmarks[4];
        const thumbBase = landmarks[2];
        const thumbExtended = Math.abs(thumbTip[0] - thumbBase[0]) > 30;
        fingers.push(thumbExtended);

        // Other fingers: Compare tip with PIP joint
        const fingerIndices = [
            [8, 6],   // Index
            [12, 10], // Middle
            [16, 14], // Ring
            [20, 18]  // Pinky
        ];

        fingerIndices.forEach(([tipIdx, pipIdx]) => {
            const tip = landmarks[tipIdx];
            const pip = landmarks[pipIdx];
            const extended = tip[1] < pip[1]; // Tip is above PIP joint
            fingers.push(extended);
        });

        return fingers;
    }

    /**
     * Update gesture state with smoothing
     */
    updateGesture(gesture) {
        // Add to history
        this.gestureHistory.push(gesture);
        if (this.gestureHistory.length > this.gestureHistorySize) {
            this.gestureHistory.shift();
        }

        // Find most common gesture in history (smoothing)
        const gestureCounts = {};
        this.gestureHistory.forEach(g => {
            gestureCounts[g] = (gestureCounts[g] || 0) + 1;
        });

        const mostCommon = Object.keys(gestureCounts).reduce((a, b) =>
            gestureCounts[a] > gestureCounts[b] ? a : b
        );

        // Update if gesture changed
        if (mostCommon !== this.currentGesture && mostCommon !== 'unknown' && mostCommon !== 'none') {
            this.lastGesture = this.currentGesture;
            this.currentGesture = mostCommon;
            this.onGestureChange(mostCommon);
        }
    }

    /**
     * Handle gesture change - trigger commands
     */
    onGestureChange(gesture) {
        console.log('Gesture detected:', gesture);

        switch (gesture) {
            case 'fist':
                // Toggle freeze
                this.commands.freeze = !this.commands.freeze;
                console.log('Freeze:', this.commands.freeze ? 'ON' : 'OFF');
                break;

            case 'palm':
                // Trigger pulse effect
                this.commands.pulse = true;
                setTimeout(() => {
                    this.commands.pulse = false;
                }, 500);
                console.log('Pulse triggered');
                break;

            case 'peace':
                // Cycle color palette
                this.commands.colorPalette = (this.commands.colorPalette + 1) % 3;
                const palettes = ['Cyberpunk', 'Sunset', 'Ocean'];
                console.log('Color palette:', palettes[this.commands.colorPalette]);
                break;
        }
    }

    /**
     * Get current commands
     */
    getCommands() {
        return this.commands;
    }

    /**
     * Update gesture status display
     */
    updateGestureStatus(text, color = '#00ffff') {
        const statusEl = document.getElementById('gesture-status');
        if (statusEl) {
            statusEl.textContent = text;
            statusEl.style.color = color;
        }
    }

    /**
     * Start calibration mode
     */
    startCalibration() {
        this.calibrationMode = true;
        this.updateGestureStatus('Calibration mode active', '#ffaa00');
        console.log('Calibration mode started');
    }

    /**
     * Stop calibration mode
     */
    stopCalibration() {
        this.calibrationMode = false;
        this.updateGestureStatus('Calibration complete', '#00ff00');
        console.log('Calibration mode stopped');
    }

    /**
     * Check if gesture controller is running
     */
    isActive() {
        return this.isRunning;
    }
}
