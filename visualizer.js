/**
 * Visualizer - Three.js based audio visualization
 * Creates a particle system that reacts to audio frequency data
 */
class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.isRunning = false;

        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleSystem = null;

        // Particle configuration
        this.particleCount = 2000;
        this.particlePositions = [];
        this.particleVelocities = [];
        this.particleColors = [];

        // Animation parameters
        this.time = 0;
        this.cameraAngle = 0;
        this.cameraRadius = 150;
        this.cameraHeight = 50;

        // Audio reactive parameters
        this.bassIntensity = 0;
        this.midIntensity = 0;
        this.trebleIntensity = 0;

        // Gesture control parameters
        this.isFrozen = false;
        this.pulseEffect = false;
        this.pulseIntensity = 0;
        this.currentPalette = 0; // 0: cyberpunk, 1: sunset, 2: ocean

        // Color palettes
        this.colorPalettes = {
            cyberpunk: { hueBase: 0.5, hueRange: 0.3, saturation: 1.0 }, // Cyan to magenta
            sunset: { hueBase: 0.05, hueRange: 0.15, saturation: 0.9 }, // Orange to pink
            ocean: { hueBase: 0.55, hueRange: 0.15, saturation: 0.8 }   // Blue to cyan
        };

        // Professional effects
        this.trailEffect = true;
        this.trailOpacity = 0.15;
        this.bloomEnabled = true;
        this.radialSymmetry = false;
        this.symmetrySegments = 6;
        this.cameraShake = { x: 0, y: 0, z: 0 };
        this.cameraShakeIntensity = 0;

        // Visual mode parameters
        this.visualMode = 'cosmic'; // cosmic, neural, pulse, chaos, minimal
        this.particleConnections = [];
        this.connectionDistance = 50;

        // Spiral parameters
        this.spiralAngle = 0;
        this.spiralTightness = 0.1;

        // Spike parameters
        this.spikes = [];
        this.spikeIntensity = 0;

        this.init();
    }

    /**
     * Initialize Three.js scene, camera, and renderer
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.001);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 150;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Set clear color with alpha for trail effect
        // Enable alpha for trail effects to work
        this.renderer.setClearColor(0x000000, this.trailEffect ? this.trailOpacity : 1.0);

        // Create particle system
        this.createParticleSystem();

        // Add ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        console.log('Visualizer initialized');
    }

    /**
     * Create particle system with initial positions and colors
     */
    createParticleSystem() {
        const geometry = new THREE.BufferGeometry();

        // Generate particle positions
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            // Random spherical distribution
            const radius = Math.random() * 100 + 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Store for velocity calculations
            this.particlePositions.push(new THREE.Vector3(x, y, z));
            this.particleVelocities.push(new THREE.Vector3(0, 0, 0));

            // Initial colors (cyan to magenta gradient)
            const color = new THREE.Color();
            color.setHSL(0.5 + Math.random() * 0.3, 1.0, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            this.particleColors.push(color);

            // Random sizes
            sizes[i] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create particle material
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        // Create particle system
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Store geometry reference
        this.particles = geometry;
    }

    /**
     * Update visualization based on audio data and gesture commands
     */
    update(audioData, gestureCommands = null) {
        if (!audioData || !this.isRunning) return;

        this.time += 0.01;

        // Extract audio features
        const { frequencyData, average, beat, beatIntensity, bands } = audioData;

        // Update intensity values
        this.bassIntensity = bands.bass * 2;
        this.midIntensity = bands.mid * 1.5;
        this.trebleIntensity = bands.treble * 1.2;

        // Process gesture commands
        if (gestureCommands) {
            this.processGestureCommands(gestureCommands, beat, beatIntensity);
        }

        // Update camera shake based on bass
        this.updateCameraShake(bands.bass, beat);

        // Update spike intensity based on treble
        this.spikeIntensity = bands.treble * 3;

        // Update spiral angle
        this.spiralAngle += 0.01 + bands.bass * 0.05;

        // Update particles based on visual mode
        if (!this.isFrozen) {
            switch (this.visualMode) {
                case 'cosmic':
                    this.updateParticlesCosmic(frequencyData, average, beat, beatIntensity);
                    break;
                case 'neural':
                    this.updateParticlesNeural(frequencyData, average, beat, beatIntensity);
                    break;
                case 'pulse':
                    this.updateParticlesPulse(frequencyData, average, beat, beatIntensity);
                    break;
                case 'chaos':
                    this.updateParticlesChaos(frequencyData, average, beat, beatIntensity);
                    break;
                case 'minimal':
                    this.updateParticlesMinimal(frequencyData, average, beat, beatIntensity);
                    break;
                default:
                    this.updateParticles(frequencyData, average, beat, beatIntensity);
            }
        } else {
            // Still update colors and render when frozen
            this.updateParticleColors(frequencyData, average);
        }

        // Update camera position (orbiting)
        this.updateCamera(average);

        // Apply radial symmetry if enabled
        if (this.radialSymmetry) {
            this.applyRadialSymmetry();
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Update particle positions and colors based on audio
     */
    updateParticles(frequencyData, average, beat, beatIntensity) {
        const positions = this.particles.attributes.position.array;
        const colors = this.particles.attributes.color.array;
        const sizes = this.particles.attributes.size.array;

        // Get current color palette
        const paletteNames = ['cyberpunk', 'sunset', 'ocean'];
        const palette = this.colorPalettes[paletteNames[this.currentPalette]];

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Get current position
            const pos = this.particlePositions[i];
            const vel = this.particleVelocities[i];

            // Map particle to frequency bin
            const freqIndex = Math.floor((i / this.particleCount) * frequencyData.length);
            const freqValue = frequencyData[freqIndex] / 255;

            // Calculate forces based on frequency
            const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
            const normalizedDistance = distance / 150;

            // Frequency-reactive force
            const force = freqValue * 5;
            const directionX = pos.x / distance;
            const directionY = pos.y / distance;
            const directionZ = pos.z / distance;

            // Apply forces
            vel.x += directionX * force * 0.1;
            vel.y += directionY * force * 0.1;
            vel.z += directionZ * force * 0.1;

            // Beat reaction - pulse outward
            if (beat || this.pulseEffect) {
                const pulseStrength = this.pulseEffect ? this.pulseIntensity : beatIntensity;
                vel.x += directionX * pulseStrength * 0.5;
                vel.y += directionY * pulseStrength * 0.5;
                vel.z += directionZ * pulseStrength * 0.5;
            }

            // Apply velocity with damping
            pos.x += vel.x;
            pos.y += vel.y;
            pos.z += vel.z;

            vel.multiplyScalar(0.95); // Damping

            // Restore force (pull back to original sphere)
            const targetDistance = 100 + this.bassIntensity * 50;
            const restoreForce = (targetDistance - distance) * 0.01;
            pos.x += directionX * restoreForce;
            pos.y += directionY * restoreForce;
            pos.z += directionZ * restoreForce;

            // Update positions
            positions[i3] = pos.x;
            positions[i3 + 1] = pos.y;
            positions[i3 + 2] = pos.z;

            // Update colors based on audio intensity and palette
            const color = this.particleColors[i];

            // Color shift based on current palette
            const hue = palette.hueBase + freqValue * palette.hueRange - average * 0.2;
            const saturation = palette.saturation + freqValue * 0.1;
            const lightness = 0.4 + freqValue * 0.4;

            color.setHSL(hue, saturation, lightness);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size pulsing based on frequency
            const pulseSize = this.pulseEffect ? this.pulseIntensity * 2 : 0;
            sizes[i] = 1 + freqValue * 3 + (beat ? beatIntensity : 0) + pulseSize;
        }

        // Mark attributes as needing update
        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.color.needsUpdate = true;
        this.particles.attributes.size.needsUpdate = true;
    }

    /**
     * Update only particle colors (used when frozen)
     */
    updateParticleColors(frequencyData, average) {
        const colors = this.particles.attributes.color.array;
        const sizes = this.particles.attributes.size.array;

        const paletteNames = ['cyberpunk', 'sunset', 'ocean'];
        const palette = this.colorPalettes[paletteNames[this.currentPalette]];

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Map particle to frequency bin
            const freqIndex = Math.floor((i / this.particleCount) * frequencyData.length);
            const freqValue = frequencyData[freqIndex] / 255;

            // Update colors
            const color = this.particleColors[i];
            const hue = palette.hueBase + freqValue * palette.hueRange - average * 0.2;
            const saturation = palette.saturation + freqValue * 0.1;
            const lightness = 0.4 + freqValue * 0.4;

            color.setHSL(hue, saturation, lightness);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Update sizes
            const pulseSize = this.pulseEffect ? this.pulseIntensity * 2 : 0;
            sizes[i] = 1 + freqValue * 3 + pulseSize;
        }

        this.particles.attributes.color.needsUpdate = true;
        this.particles.attributes.size.needsUpdate = true;
    }

    /**
     * Process gesture commands from gesture controller
     */
    processGestureCommands(commands, beat, beatIntensity) {
        // Handle freeze command
        this.isFrozen = commands.freeze;

        // Handle pulse command
        if (commands.pulse && !this.pulseEffect) {
            this.triggerPulse(beatIntensity);
        }

        // Handle color palette change
        if (commands.colorPalette !== this.currentPalette) {
            this.currentPalette = commands.colorPalette;
            const palettes = ['Cyberpunk', 'Sunset', 'Ocean'];
            console.log('Palette changed to:', palettes[this.currentPalette]);
        }
    }

    /**
     * Trigger pulse effect
     */
    triggerPulse(intensity = 1.0) {
        this.pulseEffect = true;
        this.pulseIntensity = intensity + 1.5;

        // Animate pulse decay
        const decayPulse = () => {
            this.pulseIntensity *= 0.85;
            if (this.pulseIntensity > 0.1) {
                requestAnimationFrame(decayPulse);
            } else {
                this.pulseEffect = false;
                this.pulseIntensity = 0;
            }
        };
        decayPulse();
    }

    /**
     * Update camera shake based on bass
     */
    updateCameraShake(bassIntensity, beat) {
        if (beat) {
            this.cameraShakeIntensity = bassIntensity * 10;
        }

        // Decay shake intensity
        this.cameraShakeIntensity *= 0.9;

        // Generate random shake offset
        if (this.cameraShakeIntensity > 0.1) {
            this.cameraShake.x = (Math.random() - 0.5) * this.cameraShakeIntensity;
            this.cameraShake.y = (Math.random() - 0.5) * this.cameraShakeIntensity;
            this.cameraShake.z = (Math.random() - 0.5) * this.cameraShakeIntensity;
        } else {
            this.cameraShake = { x: 0, y: 0, z: 0 };
        }
    }

    /**
     * Update camera position with orbiting animation
     */
    updateCamera(audioIntensity) {
        // Orbit camera around the scene
        this.cameraAngle += 0.002 + audioIntensity * 0.001;

        // Dynamic camera distance based on audio
        const dynamicRadius = this.cameraRadius + audioIntensity * 50;
        const dynamicHeight = this.cameraHeight + this.bassIntensity * 30;

        this.camera.position.x = Math.cos(this.cameraAngle) * dynamicRadius + this.cameraShake.x;
        this.camera.position.z = Math.sin(this.cameraAngle) * dynamicRadius + this.cameraShake.z;
        this.camera.position.y = dynamicHeight + this.cameraShake.y;

        // Look at center
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Apply radial symmetry (kaleidoscope effect)
     */
    applyRadialSymmetry() {
        const positions = this.particles.attributes.position.array;
        const segmentAngle = (Math.PI * 2) / this.symmetrySegments;

        for (let segment = 1; segment < this.symmetrySegments; segment++) {
            const angle = segmentAngle * segment;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            for (let i = 0; i < this.particleCount / this.symmetrySegments; i++) {
                const sourceIdx = i * 3;
                const targetIdx = (i + (this.particleCount / this.symmetrySegments) * segment) * 3;

                const x = positions[sourceIdx];
                const z = positions[sourceIdx + 2];

                positions[targetIdx] = x * cos - z * sin;
                positions[targetIdx + 1] = positions[sourceIdx + 1];
                positions[targetIdx + 2] = x * sin + z * cos;
            }
        }

        this.particles.attributes.position.needsUpdate = true;
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Start visualization
     */
    start() {
        this.isRunning = true;
        console.log('Visualizer started');
    }

    /**
     * Stop visualization
     */
    stop() {
        this.isRunning = false;
        console.log('Visualizer stopped');
    }

    /**
     * Set visual mode
     */
    setVisualMode(mode) {
        this.visualMode = mode;
        console.log('Visual mode set to:', mode);
    }

    /**
     * COSMIC MODE - Spiral galaxy formation
     */
    updateParticlesCosmic(frequencyData, average, beat, beatIntensity) {
        const positions = this.particles.attributes.position.array;
        const colors = this.particles.attributes.color.array;
        const sizes = this.particles.attributes.size.array;

        const paletteNames = ['cyberpunk', 'sunset', 'ocean'];
        const palette = this.colorPalettes[paletteNames[this.currentPalette]];

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const pos = this.particlePositions[i];
            const vel = this.particleVelocities[i];

            const freqIndex = Math.floor((i / this.particleCount) * frequencyData.length);
            const freqValue = frequencyData[freqIndex] / 255;

            // Spiral galaxy motion
            const distance = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
            const angle = Math.atan2(pos.z, pos.x) + this.spiralAngle * this.spiralTightness;

            // Bass creates spiral arms
            const targetRadius = 100 + this.bassIntensity * 80 + freqValue * 50;
            const targetX = Math.cos(angle) * targetRadius;
            const targetZ = Math.sin(angle) * targetRadius;

            // Attract towards spiral position
            vel.x += (targetX - pos.x) * 0.01;
            vel.z += (targetZ - pos.z) * 0.01;
            vel.y += (freqValue * 50 - pos.y) * 0.01;

            // Beat pulse
            if (beat || this.pulseEffect) {
                const pulseStrength = this.pulseEffect ? this.pulseIntensity : beatIntensity;
                const directionX = pos.x / Math.max(distance, 1);
                const directionZ = pos.z / Math.max(distance, 1);
                vel.x += directionX * pulseStrength * 0.5;
                vel.z += directionZ * pulseStrength * 0.5;
            }

            pos.x += vel.x;
            pos.y += vel.y;
            pos.z += vel.z;
            vel.multiplyScalar(0.92);

            positions[i3] = pos.x;
            positions[i3 + 1] = pos.y;
            positions[i3 + 2] = pos.z;

            // Color based on distance from center
            const color = this.particleColors[i];
            const normalizedDist = Math.min(distance / 200, 1);
            const hue = palette.hueBase + normalizedDist * palette.hueRange;
            color.setHSL(hue, palette.saturation, 0.5 + freqValue * 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = 1 + freqValue * 4 + (beat ? beatIntensity : 0);
        }

        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.color.needsUpdate = true;
        this.particles.attributes.size.needsUpdate = true;
    }

    /**
     * NEURAL MODE - Connected node network
     */
    updateParticlesNeural(frequencyData, average, beat, beatIntensity) {
        // First update positions
        this.updateParticles(frequencyData, average, beat, beatIntensity);

        // Clear existing connections
        this.particleConnections.forEach(line => this.scene.remove(line));
        this.particleConnections = [];

        // Create connections between nearby particles
        const positions = this.particles.attributes.position.array;
        const connectionThreshold = 60 + this.midIntensity * 30;

        for (let i = 0; i < Math.min(this.particleCount, 200); i += 5) {
            for (let j = i + 5; j < Math.min(this.particleCount, 200); j += 5) {
                const i3 = i * 3;
                const j3 = j * 3;

                const dx = positions[i3] - positions[j3];
                const dy = positions[i3 + 1] - positions[j3 + 1];
                const dz = positions[i3 + 2] - positions[j3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < connectionThreshold) {
                    const geometry = new THREE.BufferGeometry();
                    const vertices = new Float32Array([
                        positions[i3], positions[i3 + 1], positions[i3 + 2],
                        positions[j3], positions[j3 + 1], positions[j3 + 2]
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

                    const opacity = 1 - (distance / connectionThreshold);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00ffff,
                        transparent: true,
                        opacity: opacity * 0.5,
                        blending: THREE.AdditiveBlending
                    });

                    const line = new THREE.Line(geometry, material);
                    this.scene.add(line);
                    this.particleConnections.push(line);
                }
            }
        }
    }

    /**
     * PULSE MODE - Expanding rings from center
     */
    updateParticlesPulse(frequencyData, average, beat, beatIntensity) {
        const positions = this.particles.attributes.position.array;
        const colors = this.particles.attributes.color.array;
        const sizes = this.particles.attributes.size.array;

        const paletteNames = ['cyberpunk', 'sunset', 'ocean'];
        const palette = this.colorPalettes[paletteNames[this.currentPalette]];

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const pos = this.particlePositions[i];
            const vel = this.particleVelocities[i];

            const freqIndex = Math.floor((i / this.particleCount) * frequencyData.length);
            const freqValue = frequencyData[freqIndex] / 255;

            // Calculate distance from center
            const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
            const directionX = pos.x / Math.max(distance, 1);
            const directionY = pos.y / Math.max(distance, 1);
            const directionZ = pos.z / Math.max(distance, 1);

            // Pulsing motion - expand and contract
            const pulsePhase = Math.sin(this.time * 2 + (i / this.particleCount) * Math.PI * 4);
            const targetDistance = 80 + pulsePhase * 40 + freqValue * 60 + this.bassIntensity * 40;

            // Attract to target distance
            const force = (targetDistance - distance) * 0.05;
            vel.x += directionX * force;
            vel.y += directionY * force;
            vel.z += directionZ * force;

            // Beat creates wave
            if (beat) {
                vel.x += directionX * beatIntensity * 2;
                vel.y += directionY * beatIntensity * 2;
                vel.z += directionZ * beatIntensity * 2;
            }

            pos.x += vel.x;
            pos.y += vel.y;
            pos.z += vel.z;
            vel.multiplyScalar(0.88);

            positions[i3] = pos.x;
            positions[i3 + 1] = pos.y;
            positions[i3 + 2] = pos.z;

            // Color based on pulse phase
            const color = this.particleColors[i];
            const hue = palette.hueBase + (pulsePhase * 0.5 + 0.5) * palette.hueRange;
            color.setHSL(hue, palette.saturation, 0.4 + freqValue * 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = 2 + freqValue * 5 + Math.abs(pulsePhase) * 2;
        }

        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.color.needsUpdate = true;
        this.particles.attributes.size.needsUpdate = true;
    }

    /**
     * CHAOS MODE - Erratic particle swarm
     */
    updateParticlesChaos(frequencyData, average, beat, beatIntensity) {
        const positions = this.particles.attributes.position.array;
        const colors = this.particles.attributes.color.array;
        const sizes = this.particles.attributes.size.array;

        const paletteNames = ['cyberpunk', 'sunset', 'ocean'];
        const palette = this.colorPalettes[paletteNames[this.currentPalette]];

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const pos = this.particlePositions[i];
            const vel = this.particleVelocities[i];

            const freqIndex = Math.floor((i / this.particleCount) * frequencyData.length);
            const freqValue = frequencyData[freqIndex] / 255;

            // Chaotic forces
            const chaosX = Math.sin(this.time * 3 + i * 0.1) * freqValue * 5;
            const chaosY = Math.cos(this.time * 4 + i * 0.15) * freqValue * 5;
            const chaosZ = Math.sin(this.time * 2.5 + i * 0.12) * freqValue * 5;

            vel.x += chaosX * 0.1;
            vel.y += chaosY * 0.1;
            vel.z += chaosZ * 0.1;

            // Random jitter on beat
            if (beat) {
                vel.x += (Math.random() - 0.5) * beatIntensity * 3;
                vel.y += (Math.random() - 0.5) * beatIntensity * 3;
                vel.z += (Math.random() - 0.5) * beatIntensity * 3;
            }

            // Keep particles in bounds
            const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
            if (distance > 200) {
                vel.x += (-pos.x / distance) * 0.5;
                vel.y += (-pos.y / distance) * 0.5;
                vel.z += (-pos.z / distance) * 0.5;
            }

            pos.x += vel.x;
            pos.y += vel.y;
            pos.z += vel.z;
            vel.multiplyScalar(0.96);

            positions[i3] = pos.x;
            positions[i3 + 1] = pos.y;
            positions[i3 + 2] = pos.z;

            // Rapidly changing colors
            const color = this.particleColors[i];
            const hue = palette.hueBase + Math.sin(this.time * 5 + i * 0.1) * palette.hueRange;
            color.setHSL(hue, palette.saturation, 0.3 + freqValue * 0.7);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = 1 + freqValue * 6;
        }

        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.color.needsUpdate = true;
        this.particles.attributes.size.needsUpdate = true;
    }

    /**
     * MINIMAL MODE - Clean frequency bars
     */
    updateParticlesMinimal(frequencyData, average, beat, beatIntensity) {
        const positions = this.particles.attributes.position.array;
        const colors = this.particles.attributes.color.array;
        const sizes = this.particles.attributes.size.array;

        const paletteNames = ['cyberpunk', 'sunset', 'ocean'];
        const palette = this.colorPalettes[paletteNames[this.currentPalette]];

        const barCount = 64;
        const particlesPerBar = Math.floor(this.particleCount / barCount);

        for (let bar = 0; bar < barCount; bar++) {
            const freqIndex = Math.floor((bar / barCount) * frequencyData.length);
            const freqValue = frequencyData[freqIndex] / 255;
            const barHeight = freqValue * 150;

            for (let p = 0; p < particlesPerBar; p++) {
                const i = bar * particlesPerBar + p;
                if (i >= this.particleCount) break;

                const i3 = i * 3;
                const pos = this.particlePositions[i];

                // Arrange in grid
                const x = (bar - barCount / 2) * 8;
                const y = (p / particlesPerBar) * barHeight - 50;
                const z = 0;

                // Smooth movement to target
                pos.x += (x - pos.x) * 0.15;
                pos.y += (y - pos.y) * 0.15;
                pos.z += (z - pos.z) * 0.15;

                positions[i3] = pos.x;
                positions[i3 + 1] = pos.y;
                positions[i3 + 2] = pos.z;

                // Color based on height
                const color = this.particleColors[i];
                const hue = palette.hueBase + (y / 100 + 0.5) * palette.hueRange;
                color.setHSL(hue, palette.saturation, 0.5 + freqValue * 0.5);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;

                sizes[i] = 3 + freqValue * 4;
            }
        }

        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.color.needsUpdate = true;
        this.particles.attributes.size.needsUpdate = true;
    }

    /**
     * Toggle trail effect
     */
    toggleTrailEffect() {
        this.trailEffect = !this.trailEffect;
        if (this.trailEffect) {
            this.renderer.setClearColor(0x000000, this.trailOpacity);
        } else {
            this.renderer.setClearColor(0x000000, 1);
        }
        console.log('Trail effect:', this.trailEffect ? 'ON' : 'OFF');
    }

    /**
     * Toggle radial symmetry
     */
    toggleRadialSymmetry() {
        this.radialSymmetry = !this.radialSymmetry;
        console.log('Radial symmetry:', this.radialSymmetry ? 'ON' : 'OFF');
    }
}
