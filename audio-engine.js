/**
 * AudioEngine - Handles all Web Audio API operations
 * Manages audio input, analysis, and beat detection
 */
class AudioEngine {
    constructor() {
        // Initialize Web Audio API context
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = null;

        // Audio sources
        this.audioElement = document.getElementById('audio-element');
        this.sourceNode = null;
        this.micStream = null;
        this.isMicActive = false;

        // Beat detection
        this.beatThreshold = 1.3;
        this.beatDecayRate = 0.98;
        this.beatMinInterval = 200; // milliseconds
        this.lastBeatTime = 0;
        this.currentBeat = 0;

        // Frequency bands for analysis
        this.frequencyBands = {
            sub: { start: 0, end: 60 },      // Sub bass
            bass: { start: 60, end: 250 },   // Bass
            low: { start: 250, end: 500 },   // Low midrange
            mid: { start: 500, end: 2000 },  // Midrange
            high: { start: 2000, end: 4000 }, // High midrange
            treble: { start: 4000, end: 8000 } // Treble
        };

        this.initAudioContext();
    }

    /**
     * Initialize the Audio Context and Analyser
     */
    initAudioContext() {
        try {
            // Create audio context (supports different browsers)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // Create analyser node with 2048 FFT bins
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;

            // Create buffer for frequency data
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            console.log('Audio context initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }

    /**
     * Load and setup audio file for playback
     */
    loadAudioFile(file) {
        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Stop any existing microphone input
        if (this.isMicActive) {
            this.toggleMicrophone();
        }

        // Create URL for the audio file
        const audioURL = URL.createObjectURL(file);
        this.audioElement.src = audioURL;

        // Disconnect existing source if any
        if (this.sourceNode) {
            this.sourceNode.disconnect();
        }

        // Create media element source and connect to analyser
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        console.log('Audio file loaded:', file.name);
    }

    /**
     * Toggle microphone input on/off
     */
    async toggleMicrophone() {
        if (this.isMicActive) {
            // Stop microphone
            if (this.micStream) {
                this.micStream.getTracks().forEach(track => track.stop());
                this.micStream = null;
            }
            if (this.sourceNode) {
                this.sourceNode.disconnect();
                this.sourceNode = null;
            }
            this.isMicActive = false;
            console.log('Microphone stopped');
            return false;
        } else {
            // Start microphone
            try {
                // Request microphone access
                this.micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    }
                });

                // Resume audio context if needed
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }

                // Disconnect existing sources
                if (this.sourceNode) {
                    this.sourceNode.disconnect();
                }

                // Stop audio playback
                this.audioElement.pause();

                // Create microphone source and connect
                this.sourceNode = this.audioContext.createMediaStreamSource(this.micStream);
                this.sourceNode.connect(this.analyser);

                this.isMicActive = true;
                console.log('Microphone started');
                return true;
            } catch (error) {
                console.error('Failed to access microphone:', error);
                alert('Could not access microphone. Please check permissions.');
                return false;
            }
        }
    }

    /**
     * Play audio
     */
    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.audioElement.play();
        console.log('Audio playing');
    }

    /**
     * Stop audio
     */
    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        console.log('Audio stopped');
    }

    /**
     * Get frequency data from analyser
     * Returns normalized frequency data and beat detection
     */
    getFrequencyData() {
        // Get frequency data from analyser
        if (!this.analyser || !this.dataArray) {
            // Return safe default values if not initialized
            return {
                frequencyData: new Uint8Array(1024).fill(0),
                average: 0,
                beat: false,
                beatIntensity: 0,
                bands: {
                    sub: 0,
                    bass: 0,
                    low: 0,
                    mid: 0,
                    high: 0,
                    treble: 0
                }
            };
        }

        this.analyser.getByteFrequencyData(this.dataArray);

        // Calculate average amplitude
        const average = this.dataArray.reduce((sum, value) => sum + value, 0) / this.bufferLength;

        // Detect beats
        const beatDetected = this.detectBeat(average);

        // Extract frequency bands
        const bands = this.extractFrequencyBands();

        return {
            frequencyData: this.dataArray,
            average: average / 255, // Normalize to 0-1
            beat: beatDetected,
            beatIntensity: this.currentBeat / 255, // Normalize
            bands: bands
        };
    }

    /**
     * Beat detection algorithm
     * Compares current amplitude against historical average
     */
    detectBeat(currentAverage) {
        const now = Date.now();
        let beatDetected = false;

        // Check if enough time has passed since last beat
        if (now - this.lastBeatTime > this.beatMinInterval) {
            // Beat detected if current average exceeds threshold
            if (currentAverage > this.currentBeat * this.beatThreshold) {
                beatDetected = true;
                this.lastBeatTime = now;
                this.currentBeat = currentAverage;
            }
        }

        // Decay the beat intensity
        this.currentBeat *= this.beatDecayRate;
        this.currentBeat = Math.max(this.currentBeat, currentAverage * 0.5);

        return beatDetected;
    }

    /**
     * Extract normalized values for different frequency bands
     */
    extractFrequencyBands() {
        const nyquist = this.audioContext.sampleRate / 2;
        const bands = {};

        for (const [name, range] of Object.entries(this.frequencyBands)) {
            // Convert Hz to bin indices
            const startBin = Math.floor((range.start / nyquist) * this.bufferLength);
            const endBin = Math.floor((range.end / nyquist) * this.bufferLength);

            // Calculate average for this band
            let sum = 0;
            for (let i = startBin; i < endBin; i++) {
                sum += this.dataArray[i];
            }

            // Normalize to 0-1
            bands[name] = (sum / (endBin - startBin)) / 255;
        }

        return bands;
    }

    /**
     * Get current playback time
     */
    getCurrentTime() {
        return this.audioElement.currentTime;
    }

    /**
     * Get audio duration
     */
    getDuration() {
        return this.audioElement.duration;
    }
}
