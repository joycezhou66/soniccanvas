/**
 * Recorder - Canvas and audio recording with export capabilities
 * Records visualization with synchronized audio
 */
class Recorder {
    constructor(canvas, audioEngine) {
        this.canvas = canvas;
        this.audioEngine = audioEngine;

        // Recording state
        this.isRecording = false;
        this.isPaused = false;
        this.recordingStartTime = 0;
        this.recordingDuration = 0;
        this.maxDuration = 180000; // 3 minutes in milliseconds

        // Media recorder
        this.canvasStream = null;
        this.audioStream = null;
        this.combinedStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];

        // Recording format
        this.videoMimeType = 'video/webm;codecs=vp9';
        this.videoBitsPerSecond = 5000000; // 5 Mbps

        // UI elements
        this.recordingIndicator = null;
        this.recordingTimer = null;
        this.timerInterval = null;

        this.init();
    }

    /**
     * Initialize recorder
     */
    init() {
        // Check for MediaRecorder support
        if (!window.MediaRecorder) {
            console.error('MediaRecorder API not supported');
            return;
        }

        // Check supported mime types
        const mimeTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/webm'
        ];

        for (const type of mimeTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                this.videoMimeType = type;
                console.log('Using mime type:', type);
                break;
            }
        }

        // Create recording UI
        this.createRecordingUI();

        console.log('Recorder initialized');
    }

    /**
     * Create recording indicator UI
     */
    createRecordingUI() {
        // Recording indicator
        this.recordingIndicator = document.createElement('div');
        this.recordingIndicator.id = 'recording-indicator';
        this.recordingIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            display: none;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            background: rgba(255, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 2px solid #ff0000;
            border-radius: 25px;
            color: #fff;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
            animation: recording-pulse 1.5s ease-in-out infinite;
        `;

        this.recordingIndicator.innerHTML = `
            <div style="width: 12px; height: 12px; background: #fff; border-radius: 50%; animation: recording-dot 1s ease-in-out infinite;"></div>
            <span>RECORDING</span>
            <span id="recording-timer" style="font-variant-numeric: tabular-nums;">0:00</span>
        `;

        document.body.appendChild(this.recordingIndicator);
        this.recordingTimer = document.getElementById('recording-timer');

        // Add CSS animations
        if (!document.getElementById('recording-animations')) {
            const style = document.createElement('style');
            style.id = 'recording-animations';
            style.textContent = `
                @keyframes recording-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.6); }
                    50% { box-shadow: 0 0 40px rgba(255, 0, 0, 1); }
                }
                @keyframes recording-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Start recording
     */
    async startRecording() {
        if (this.isRecording) {
            console.log('Already recording');
            return false;
        }

        try {
            // Get canvas stream (60fps)
            this.canvasStream = this.canvas.captureStream(60);

            // Get audio stream from audio context
            const audioContext = this.audioEngine.audioContext;

            // Check if audio context is running
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const audioDestination = audioContext.createMediaStreamDestination();

            // Connect audio analyser to destination (don't disconnect from speakers)
            const splitter = audioContext.createChannelSplitter(2);
            this.audioEngine.analyser.connect(splitter);
            splitter.connect(audioDestination);

            this.audioStream = audioDestination.stream;

            // Combine video and audio streams
            const videoTrack = this.canvasStream.getVideoTracks()[0];
            const audioTrack = this.audioStream.getAudioTracks()[0];

            this.combinedStream = new MediaStream([videoTrack, audioTrack]);

            // Create media recorder
            this.mediaRecorder = new MediaRecorder(this.combinedStream, {
                mimeType: this.videoMimeType,
                videoBitsPerSecond: this.videoBitsPerSecond
            });

            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            // Handle recording stop
            this.mediaRecorder.onstop = () => {
                this.onRecordingComplete();
            };

            // Handle errors
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                this.stopRecording();
            };

            // Start recording
            this.recordedChunks = [];
            this.mediaRecorder.start(100); // Collect data every 100ms

            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Show recording indicator
            this.recordingIndicator.style.display = 'flex';
            this.startTimer();

            // Auto-stop after max duration
            setTimeout(() => {
                if (this.isRecording) {
                    console.log('Max recording duration reached');
                    this.stopRecording();
                }
            }, this.maxDuration);

            console.log('Recording started');
            return true;
        } catch (error) {
            console.error('Failed to start recording:', error);
            alert('Failed to start recording. Please check permissions.');
            return false;
        }
    }

    /**
     * Stop recording
     */
    stopRecording() {
        if (!this.isRecording) {
            console.log('Not recording');
            return;
        }

        this.isRecording = false;

        // Stop media recorder
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        // Stop streams
        if (this.canvasStream) {
            this.canvasStream.getTracks().forEach(track => track.stop());
        }
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }

        // Hide recording indicator
        this.recordingIndicator.style.display = 'none';
        this.stopTimer();

        console.log('Recording stopped');
    }

    /**
     * Handle recording completion
     */
    onRecordingComplete() {
        if (this.recordedChunks.length === 0) {
            console.error('No data recorded');
            return;
        }

        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, {
            type: this.videoMimeType
        });

        // Calculate duration
        const duration = Math.floor(this.recordingDuration / 1000);
        console.log(`Recording complete: ${duration}s, ${(blob.size / 1024 / 1024).toFixed(2)}MB`);

        // Trigger download automatically
        this.downloadRecording(blob);

        // Clear chunks
        this.recordedChunks = [];
    }

    /**
     * Download recording
     */
    downloadRecording(blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `SonicCanvas_${timestamp}.webm`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);

        this.showDownloadNotification(filename);
    }

    /**
     * Start recording timer
     */
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.recordingDuration = Date.now() - this.recordingStartTime;
            const seconds = Math.floor(this.recordingDuration / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.recordingTimer.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        }, 100);
    }

    /**
     * Stop recording timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Capture screenshot
     */
    captureScreenshot(highRes = true) {
        try {
            // Get current canvas size
            const originalWidth = this.canvas.width;
            const originalHeight = this.canvas.height;

            let canvas = this.canvas;

            // If high-res requested, create a larger canvas
            if (highRes) {
                const scale = 2; // 2x resolution
                canvas = document.createElement('canvas');
                canvas.width = originalWidth * scale;
                canvas.height = originalHeight * scale;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
            }

            // Convert to PNG
            canvas.toBlob((blob) => {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `SonicCanvas_Screenshot_${timestamp}.png`;

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();

                setTimeout(() => URL.revokeObjectURL(url), 100);

                this.showDownloadNotification(filename);
            }, 'image/png', 1.0);

            console.log('Screenshot captured');
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            alert('Failed to capture screenshot');
        }
    }

    /**
     * Export settings preset as JSON
     */
    exportPreset(visualizer, presetManager) {
        try {
            const preset = {
                name: presetManager.currentPreset,
                timestamp: new Date().toISOString(),
                settings: {
                    visualMode: visualizer.visualMode,
                    colorPalette: visualizer.currentPalette,
                    trailEffect: visualizer.trailEffect,
                    trailOpacity: visualizer.trailOpacity,
                    radialSymmetry: visualizer.radialSymmetry,
                    symmetrySegments: visualizer.symmetrySegments,
                    cameraRadius: visualizer.cameraRadius,
                    particleCount: visualizer.particleCount
                },
                audioSettings: {
                    beatThreshold: this.audioEngine.beatThreshold,
                    fftSize: this.audioEngine.analyser.fftSize,
                    smoothingTimeConstant: this.audioEngine.analyser.smoothingTimeConstant
                }
            };

            const json = JSON.stringify(preset, null, 2);
            const blob = new Blob([json], { type: 'application/json' });

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `SonicCanvas_Preset_${preset.name}_${timestamp}.json`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();

            setTimeout(() => URL.revokeObjectURL(url), 100);

            this.showDownloadNotification(filename);
            console.log('Preset exported:', preset.name);
        } catch (error) {
            console.error('Failed to export preset:', error);
            alert('Failed to export preset');
        }
    }

    /**
     * Generate shareable link
     */
    generateShareLink() {
        // In a real implementation, this would upload the video to a server
        // For demo purposes, we'll just show the share dialog
        const demoUrl = 'https://soniccanvas-demo.example.com';

        this.showShareDialog(demoUrl);
    }

    /**
     * Show share dialog
     */
    showShareDialog(url) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 30px;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid #00ffff;
            border-radius: 16px;
            color: #fff;
            font-family: 'Inter', sans-serif;
            z-index: 2000;
            min-width: 400px;
            box-shadow: 0 10px 50px rgba(0, 255, 255, 0.5);
        `;

        dialog.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #00ffff; font-size: 1.5rem;">Share SonicCanvas</h3>
            <p style="margin: 0 0 15px 0; color: #aaa; font-size: 0.9rem;">
                Share this demo with your friends!
            </p>
            <input
                type="text"
                value="${url}"
                readonly
                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid #00ffff; border-radius: 8px; color: #fff; font-family: 'Inter', sans-serif; margin-bottom: 15px;"
                id="share-url-input"
            />
            <div style="display: flex; gap: 10px;">
                <button id="copy-link-btn" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #00ffff 0%, #0099cc 100%); border: none; border-radius: 8px; color: #000; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;">
                    Copy Link
                </button>
                <button id="close-share-btn" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid #fff; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(dialog);

        // Copy link handler
        document.getElementById('copy-link-btn').addEventListener('click', () => {
            const input = document.getElementById('share-url-input');
            input.select();
            document.execCommand('copy');

            const btn = document.getElementById('copy-link-btn');
            btn.textContent = '✓ Copied!';
            btn.style.background = 'linear-gradient(135deg, #00ff00 0%, #009900 100%)';

            setTimeout(() => {
                btn.textContent = 'Copy Link';
                btn.style.background = 'linear-gradient(135deg, #00ffff 0%, #0099cc 100%)';
            }, 2000);
        });

        // Close handler
        document.getElementById('close-share-btn').addEventListener('click', () => {
            dialog.remove();
        });
    }

    /**
     * Show download notification
     */
    showDownloadNotification(filename) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 25px;
            background: rgba(0, 255, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 2px solid #00ff00;
            border-radius: 12px;
            color: #000;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1500;
            animation: slide-in-bottom 0.3s ease-out;
            box-shadow: 0 5px 20px rgba(0, 255, 0, 0.5);
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">✓</span>
                <div>
                    <div style="font-weight: 700;">Download Started</div>
                    <div style="font-size: 0.75rem; opacity: 0.8;">${filename}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Add animation
        if (!document.getElementById('download-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'download-notification-styles';
            style.textContent = `
                @keyframes slide-in-bottom {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slide-in-bottom 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Check if currently recording
     */
    isCurrentlyRecording() {
        return this.isRecording;
    }
}
