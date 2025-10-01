/**
 * DemoMode - Automated demonstration of SonicCanvas features
 * Auto-plays sample audio and demonstrates all features with explanatory overlays
 */
class DemoMode {
    constructor(visualizer, presetManager, gestureController) {
        this.visualizer = visualizer;
        this.presetManager = presetManager;
        this.gestureController = gestureController;

        this.isActive = false;
        this.currentStep = 0;
        this.stepTimeout = null;

        // Demo sequence steps
        this.demoSteps = [
            {
                duration: 5000,
                title: 'Welcome to SonicCanvas',
                description: 'An AI-powered audio visualizer with gesture control',
                action: () => {
                    this.presetManager.applyPreset('cosmic', true);
                }
            },
            {
                duration: 6000,
                title: '🌌 Cosmic Mode',
                description: 'Particles form spiral galaxy arms that react to bass frequencies',
                action: () => {
                    this.presetManager.applyPreset('cosmic', true);
                }
            },
            {
                duration: 6000,
                title: '🧠 Neural Network',
                description: 'Dynamic connections between particles create a living network',
                action: () => {
                    this.presetManager.applyPreset('neural', true);
                }
            },
            {
                duration: 6000,
                title: '💫 Pulse Waves',
                description: 'Expanding and contracting rings synchronized with the beat',
                action: () => {
                    this.presetManager.applyPreset('pulse', true);
                }
            },
            {
                duration: 6000,
                title: '⚡ Chaos Mode',
                description: 'Erratic particle swarm with chaotic motion patterns',
                action: () => {
                    this.presetManager.applyPreset('chaos', true);
                }
            },
            {
                duration: 6000,
                title: '📊 Minimal Bars',
                description: 'Clean frequency spectrum analyzer visualization',
                action: () => {
                    this.presetManager.applyPreset('minimal', true);
                }
            },
            {
                duration: 5000,
                title: '✨ Trail Effects',
                description: 'Particles leave light trails for motion blur effect',
                action: () => {
                    if (!this.visualizer.trailEffect) {
                        this.visualizer.toggleTrailEffect();
                    }
                    this.presetManager.applyPreset('cosmic', true);
                }
            },
            {
                duration: 5000,
                title: '🔷 Kaleidoscope',
                description: 'Radial symmetry creates mesmerizing patterns',
                action: () => {
                    this.visualizer.toggleRadialSymmetry();
                }
            },
            {
                duration: 4000,
                title: '🎨 Color Palettes',
                description: 'Switch between Cyberpunk, Sunset, and Ocean themes',
                action: () => {
                    this.visualizer.currentPalette = (this.visualizer.currentPalette + 1) % 3;
                }
            },
            {
                duration: 5000,
                title: '👋 Gesture Control',
                description: 'Control with hand gestures: Fist, Palm, Peace Sign',
                action: () => {
                    // Demo gesture effects
                    this.simulateGesture('pulse');
                }
            },
            {
                duration: 5000,
                title: '⏺ Recording',
                description: 'Record videos with synchronized audio up to 3 minutes',
                action: () => {
                    this.presetManager.applyPreset('cosmic', true);
                }
            },
            {
                duration: 5000,
                title: '⚡ Performance Mode',
                description: 'Full-screen mode optimized for 60fps rendering',
                action: () => {
                    // Don't actually enter performance mode in demo
                }
            },
            {
                duration: 5000,
                title: 'Thank You!',
                description: 'Press any key to start exploring on your own',
                action: () => {
                    this.presetManager.applyPreset('cosmic', true);
                }
            }
        ];

        this.overlayElement = null;
        this.init();
    }

    /**
     * Initialize demo mode
     */
    init() {
        this.createOverlay();
        console.log('DemoMode initialized');
    }

    /**
     * Create overlay for text displays
     */
    createOverlay() {
        this.overlayElement = document.createElement('div');
        this.overlayElement.id = 'demo-overlay';
        this.overlayElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 500;
            display: none;
            pointer-events: none;
        `;

        this.overlayElement.innerHTML = `
            <div id="demo-title" style="
                font-size: 3rem;
                font-weight: 700;
                color: #00ffff;
                text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
                margin-bottom: 20px;
                font-family: 'Inter', sans-serif;
                animation: fade-in-scale 0.5s ease-out;
            "></div>
            <div id="demo-description" style="
                font-size: 1.3rem;
                color: #fff;
                max-width: 600px;
                line-height: 1.6;
                font-family: 'Inter', sans-serif;
                animation: fade-in-scale 0.5s ease-out 0.2s both;
                padding: 0 20px;
            "></div>
            <div id="demo-progress" style="
                margin-top: 30px;
                font-size: 0.9rem;
                color: #aaa;
                animation: fade-in 0.5s ease-out 0.4s both;
            "></div>
        `;

        document.body.appendChild(this.overlayElement);

        // Add animations
        if (!document.getElementById('demo-animations')) {
            const style = document.createElement('style');
            style.id = 'demo-animations';
            style.textContent = `
                @keyframes fade-in-scale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Start demo mode
     */
    start() {
        if (this.isActive) {
            console.log('Demo mode already active');
            return;
        }

        console.log('Starting demo mode...');
        this.isActive = true;
        this.currentStep = 0;

        // Show overlay
        this.overlayElement.style.display = 'block';

        // Start demo sequence
        this.runDemoStep();

        // Add skip handler
        this.skipHandler = (e) => {
            if (e.key) {
                this.stop();
            }
        };
        document.addEventListener('keydown', this.skipHandler);
    }

    /**
     * Run current demo step
     */
    runDemoStep() {
        if (!this.isActive || this.currentStep >= this.demoSteps.length) {
            this.stop();
            return;
        }

        const step = this.demoSteps[this.currentStep];

        // Update overlay
        document.getElementById('demo-title').textContent = step.title;
        document.getElementById('demo-description').textContent = step.description;
        document.getElementById('demo-progress').textContent =
            `Step ${this.currentStep + 1} of ${this.demoSteps.length}`;

        // Execute step action
        step.action();

        // Schedule next step
        this.stepTimeout = setTimeout(() => {
            this.currentStep++;
            this.runDemoStep();
        }, step.duration);
    }

    /**
     * Stop demo mode
     */
    stop() {
        if (!this.isActive) return;

        console.log('Stopping demo mode...');
        this.isActive = false;

        // Clear timeout
        if (this.stepTimeout) {
            clearTimeout(this.stepTimeout);
            this.stepTimeout = null;
        }

        // Hide overlay with fade out
        this.overlayElement.style.animation = 'fade-out 0.5s ease-out';
        setTimeout(() => {
            this.overlayElement.style.display = 'none';
            this.overlayElement.style.animation = '';
        }, 500);

        // Remove skip handler
        if (this.skipHandler) {
            document.removeEventListener('keydown', this.skipHandler);
            this.skipHandler = null;
        }

        // Add fade-out animation
        if (!document.getElementById('demo-fade-out')) {
            const style = document.createElement('style');
            style.id = 'demo-fade-out';
            style.textContent = `
                @keyframes fade-out {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        console.log('Demo mode stopped');
    }

    /**
     * Simulate gesture effect
     */
    simulateGesture(type) {
        switch (type) {
            case 'pulse':
                this.visualizer.triggerPulse(1.5);
                break;
            case 'freeze':
                this.visualizer.isFrozen = true;
                setTimeout(() => {
                    this.visualizer.isFrozen = false;
                }, 2000);
                break;
            case 'palette':
                this.visualizer.currentPalette = (this.visualizer.currentPalette + 1) % 3;
                break;
        }
    }

    /**
     * Check if demo mode is active
     */
    isDemo() {
        return this.isActive;
    }
}
