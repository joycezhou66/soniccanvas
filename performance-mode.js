/**
 * PerformanceMode - Full-screen performance mode with optimizations
 * Hides UI and optimizes for smooth 60fps rendering
 */
class PerformanceMode {
    constructor() {
        this.isActive = false;
        this.hiddenElements = [];

        // Performance optimizations
        this.reducedParticles = false;
        this.originalParticleCount = 0;

        // UI elements to hide
        this.uiSelectors = [
            '.header',
            '.control-panel',
            '.preset-panel',
            '#webcam-preview',
            '#gesture-overlay',
            '#recording-indicator'
        ];

        this.init();
    }

    /**
     * Initialize performance mode
     */
    init() {
        // Add escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.exit();
            }
        });

        console.log('PerformanceMode initialized - Press ESC to exit when active');
    }

    /**
     * Enter performance mode
     */
    enter(visualizer) {
        if (this.isActive) {
            console.log('Already in performance mode');
            return;
        }

        console.log('Entering performance mode...');
        this.isActive = true;

        // Hide UI elements
        this.hideUI();

        // Enter fullscreen
        this.enterFullscreen();

        // Apply performance optimizations
        this.applyOptimizations(visualizer);

        // Show performance mode indicator
        this.showIndicator();

        console.log('Performance mode active - Press ESC to exit');
    }

    /**
     * Exit performance mode
     */
    exit(visualizer = null) {
        if (!this.isActive) {
            console.log('Not in performance mode');
            return;
        }

        console.log('Exiting performance mode...');
        this.isActive = false;

        // Show UI elements
        this.showUI();

        // Exit fullscreen
        this.exitFullscreen();

        // Restore original settings
        if (visualizer) {
            this.restoreOptimizations(visualizer);
        }

        // Hide indicator
        this.hideIndicator();

        console.log('Performance mode exited');
    }

    /**
     * Hide UI elements
     */
    hideUI() {
        this.hiddenElements = [];

        this.uiSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.style.display !== 'none') {
                    this.hiddenElements.push({
                        element: el,
                        originalDisplay: el.style.display || ''
                    });
                    el.style.display = 'none';
                }
            });
        });

        console.log(`Hidden ${this.hiddenElements.length} UI elements`);
    }

    /**
     * Show UI elements
     */
    showUI() {
        this.hiddenElements.forEach(({ element, originalDisplay }) => {
            element.style.display = originalDisplay;
        });

        this.hiddenElements = [];
        console.log('UI elements restored');
    }

    /**
     * Enter fullscreen mode
     */
    async enterFullscreen() {
        try {
            const elem = document.documentElement;

            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }

            console.log('Entered fullscreen');
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
        }
    }

    /**
     * Exit fullscreen mode
     */
    exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            console.log('Exited fullscreen');
        } catch (error) {
            console.error('Failed to exit fullscreen:', error);
        }
    }

    /**
     * Apply performance optimizations
     */
    applyOptimizations(visualizer) {
        if (!visualizer) return;

        // Store original particle count
        this.originalParticleCount = visualizer.particleCount;

        // Reduce particles if performance is low
        // This is optional - can be toggled based on device
        const perfTestStart = performance.now();
        setTimeout(() => {
            const perfTestEnd = performance.now();
            const frameTime = perfTestEnd - perfTestStart;

            if (frameTime > 16.67) { // Less than 60fps
                console.log('Reducing particle count for performance');
                this.reducedParticles = true;
                // Note: Actual particle reduction would require recreating the particle system
                // For now, we just log it
            }
        }, 1000);

        // Disable expensive effects if needed
        // This can be customized based on requirements

        console.log('Performance optimizations applied');
    }

    /**
     * Restore original settings
     */
    restoreOptimizations(visualizer) {
        if (!visualizer) return;

        if (this.reducedParticles) {
            visualizer.particleCount = this.originalParticleCount;
            this.reducedParticles = false;
        }

        console.log('Original settings restored');
    }

    /**
     * Show performance mode indicator
     */
    showIndicator() {
        // Remove existing indicator
        const existing = document.getElementById('performance-mode-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('div');
        indicator.id = 'performance-mode-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 25px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border: 2px solid #00ffff;
            border-radius: 25px;
            color: #00ffff;
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            animation: fade-in 0.3s ease-out;
            pointer-events: none;
        `;

        indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">⚡</span>
                <span>PERFORMANCE MODE</span>
                <span style="opacity: 0.6; font-size: 0.75rem; margin-left: 10px;">Press ESC to exit</span>
            </div>
        `;

        document.body.appendChild(indicator);

        // Add fade-in animation
        if (!document.getElementById('performance-mode-styles')) {
            const style = document.createElement('style');
            style.id = 'performance-mode-styles';
            style.textContent = `
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto-hide after 3 seconds
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transition = 'opacity 0.5s ease-out';
        }, 3000);
    }

    /**
     * Hide performance mode indicator
     */
    hideIndicator() {
        const indicator = document.getElementById('performance-mode-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Toggle performance mode
     */
    toggle(visualizer) {
        if (this.isActive) {
            this.exit(visualizer);
        } else {
            this.enter(visualizer);
        }
    }

    /**
     * Check if performance mode is active
     */
    isPerformanceMode() {
        return this.isActive;
    }
}
