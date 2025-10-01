/**
 * PresetManager - Manages visual presets and keyboard shortcuts
 * Provides smooth transitions between different visualization modes
 */
class PresetManager {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.currentPreset = 'cosmic';

        // Define presets with their settings
        this.presets = {
            cosmic: {
                name: 'Cosmic',
                description: 'Spiral galaxy particles',
                visualMode: 'cosmic',
                trailEffect: true,
                trailOpacity: 0.15,
                radialSymmetry: false,
                cameraRadius: 150,
                particleCount: 2000,
                icon: '🌌'
            },
            neural: {
                name: 'Neural',
                description: 'Connected node network',
                visualMode: 'neural',
                trailEffect: false,
                trailOpacity: 1.0,
                radialSymmetry: false,
                cameraRadius: 180,
                particleCount: 2000,
                icon: '🧠'
            },
            pulse: {
                name: 'Pulse',
                description: 'Expanding rings from center',
                visualMode: 'pulse',
                trailEffect: true,
                trailOpacity: 0.2,
                radialSymmetry: false,
                cameraRadius: 140,
                particleCount: 2000,
                icon: '💫'
            },
            chaos: {
                name: 'Chaos',
                description: 'Erratic particle swarm',
                visualMode: 'chaos',
                trailEffect: true,
                trailOpacity: 0.1,
                radialSymmetry: false,
                cameraRadius: 160,
                particleCount: 2000,
                icon: '⚡'
            },
            minimal: {
                name: 'Minimal',
                description: 'Clean frequency bars',
                visualMode: 'minimal',
                trailEffect: false,
                trailOpacity: 1.0,
                radialSymmetry: false,
                cameraRadius: 200,
                particleCount: 2000,
                icon: '📊'
            }
        };

        // Keyboard shortcuts mapping
        this.keyMap = {
            '1': 'cosmic',
            '2': 'neural',
            '3': 'pulse',
            '4': 'chaos',
            '5': 'minimal',
            't': 'toggleTrail',
            'k': 'toggleKaleidoscope',
            'r': 'randomize'
        };

        // Transition parameters
        this.isTransitioning = false;
        this.transitionDuration = 1000; // ms
        this.transitionStart = 0;

        this.init();
    }

    /**
     * Initialize preset manager
     */
    init() {
        // Set up keyboard event listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Apply initial preset
        this.applyPreset('cosmic', false);

        console.log('PresetManager initialized');
        console.log('Keyboard shortcuts: 1-5 (presets), T (trail), K (kaleidoscope), R (random)');
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyPress(event) {
        const key = event.key.toLowerCase();

        // Ignore if typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        if (this.keyMap[key]) {
            const action = this.keyMap[key];

            // Check if it's a special action
            if (action === 'toggleTrail') {
                this.visualizer.toggleTrailEffect();
                this.updatePresetDisplay();
            } else if (action === 'toggleKaleidoscope') {
                this.visualizer.toggleRadialSymmetry();
                this.updatePresetDisplay();
            } else if (action === 'randomize') {
                this.randomizePreset();
            } else if (this.presets[action]) {
                // It's a preset
                this.applyPreset(action, true);
            }
        }
    }

    /**
     * Apply a preset configuration
     */
    applyPreset(presetName, animate = true) {
        if (!this.presets[presetName]) {
            console.error('Preset not found:', presetName);
            return;
        }

        if (this.isTransitioning) {
            console.log('Transition in progress, please wait...');
            return;
        }

        const preset = this.presets[presetName];
        const previousPreset = this.currentPreset;
        this.currentPreset = presetName;

        console.log(`Switching to preset: ${preset.name}`);

        if (animate && previousPreset !== presetName) {
            this.smoothTransition(preset);
        } else {
            this.applyPresetImmediate(preset);
        }

        // Update UI
        this.updatePresetDisplay();
        this.highlightActivePreset(presetName);

        // Show notification
        this.showPresetNotification(preset);
    }

    /**
     * Apply preset immediately without transition
     */
    applyPresetImmediate(preset) {
        this.visualizer.setVisualMode(preset.visualMode);
        this.visualizer.trailEffect = preset.trailEffect;
        this.visualizer.trailOpacity = preset.trailOpacity;
        this.visualizer.radialSymmetry = preset.radialSymmetry;
        this.visualizer.cameraRadius = preset.cameraRadius;

        // Update renderer clear settings
        if (preset.trailEffect) {
            this.visualizer.renderer.setClearColor(0x000000, preset.trailOpacity);
        } else {
            this.visualizer.renderer.setClearColor(0x000000, 1);
        }
    }

    /**
     * Smooth transition between presets
     */
    smoothTransition(targetPreset) {
        this.isTransitioning = true;
        this.transitionStart = Date.now();

        const initialRadius = this.visualizer.cameraRadius;
        const targetRadius = targetPreset.cameraRadius;

        const animate = () => {
            const elapsed = Date.now() - this.transitionStart;
            const progress = Math.min(elapsed / this.transitionDuration, 1);

            // Easing function (ease-in-out)
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            // Interpolate camera radius
            this.visualizer.cameraRadius = initialRadius + (targetRadius - initialRadius) * eased;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Transition complete
                this.applyPresetImmediate(targetPreset);
                this.isTransitioning = false;
            }
        };

        // Start transition
        animate();
    }

    /**
     * Randomize current preset settings
     */
    randomizePreset() {
        const presetNames = Object.keys(this.presets);
        const randomPreset = presetNames[Math.floor(Math.random() * presetNames.length)];
        this.applyPreset(randomPreset, true);
    }

    /**
     * Get current preset info
     */
    getCurrentPreset() {
        return this.presets[this.currentPreset];
    }

    /**
     * Update preset display in UI
     */
    updatePresetDisplay() {
        const currentPreset = this.getCurrentPreset();
        const displayEl = document.getElementById('current-preset-display');

        if (displayEl) {
            displayEl.innerHTML = `
                <span class="preset-icon">${currentPreset.icon}</span>
                <span class="preset-name">${currentPreset.name}</span>
            `;
        }

        // Update effects indicators
        const trailIndicator = document.getElementById('trail-indicator');
        const symmetryIndicator = document.getElementById('symmetry-indicator');

        if (trailIndicator) {
            trailIndicator.style.opacity = this.visualizer.trailEffect ? '1' : '0.3';
        }

        if (symmetryIndicator) {
            symmetryIndicator.style.opacity = this.visualizer.radialSymmetry ? '1' : '0.3';
        }
    }

    /**
     * Highlight active preset button
     */
    highlightActivePreset(presetName) {
        // Remove active class from all preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to current preset button
        const activeBtn = document.querySelector(`.preset-btn[data-preset="${presetName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * Show preset notification
     */
    showPresetNotification(preset) {
        // Remove existing notification
        const existingNotification = document.getElementById('preset-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'preset-notification';
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            border: 2px solid #00ffff;
            border-radius: 12px;
            color: #00ffff;
            font-family: 'Inter', sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            z-index: 1000;
            animation: preset-fade-in 0.3s ease-out;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
        `;

        notification.innerHTML = `
            <span style="font-size: 1.5rem; margin-right: 10px;">${preset.icon}</span>
            <span>${preset.name}</span>
            <div style="font-size: 0.75rem; font-weight: 400; margin-top: 5px; color: #aaa;">
                ${preset.description}
            </div>
        `;

        document.body.appendChild(notification);

        // Add CSS animation
        if (!document.getElementById('preset-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'preset-notification-styles';
            style.textContent = `
                @keyframes preset-fade-in {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes preset-fade-out {
                    from {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'preset-fade-out 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    /**
     * Get all presets for UI display
     */
    getAllPresets() {
        return this.presets;
    }
}
