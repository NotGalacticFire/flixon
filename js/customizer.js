// ===== LIVE COLOR CUSTOMIZER =====
// Real-time theme customization with live preview and presets

class LiveCustomizer {
    constructor() {
        this.panel = document.getElementById('color-customizer');
        this.toggle = document.getElementById('customizer-toggle');
        this.closeBtn = document.querySelector('.customizer-close');
        this.isOpen = false;
        
        // Color inputs
        this.colorInputs = {
            primary: document.getElementById('primary-color'),
            secondary: document.getElementById('secondary-color'),
            accent: document.getElementById('accent-color'),
            bgPrimary: document.getElementById('bg-primary'),
            bgSecondary: document.getElementById('bg-secondary')
        };
        
        // Hex inputs
        this.hexInputs = {
            primary: document.getElementById('primary-hex'),
            secondary: document.getElementById('secondary-hex'),
            accent: document.getElementById('accent-hex'),
            bgPrimary: document.getElementById('bg-primary-hex'),
            bgSecondary: document.getElementById('bg-secondary-hex')
        };
        
        // Font selectors
        this.fontSelectors = {
            primary: document.getElementById('font-primary'),
            heading: document.getElementById('font-heading')
        };
        
        // Effect controls
        this.effectControls = {
            glassEffect: document.getElementById('glass-effect'),
            particlesEffect: document.getElementById('particles-effect'),
            smoothScroll: document.getElementById('smooth-scroll'),
            animationSpeed: document.getElementById('animation-speed')
        };
        
        // Preset buttons
        this.presetBtns = document.querySelectorAll('.preset-btn');
        this.exportBtn = document.querySelector('.export-btn');
        this.importBtn = document.querySelector('.import-btn');
        this.resetBtn = document.querySelector('.reset-btn');
        
        this.previewIndicator = null;
        this.currentTheme = this.getDefaultTheme();
        
        this.init();
    }
    
    init() {
        this.createPreviewIndicator();
        this.bindEvents();
        this.loadSavedTheme();
        this.syncInputsWithTheme();
    }
    
    createPreviewIndicator() {
        this.previewIndicator = document.createElement('div');
        this.previewIndicator.className = 'live-preview-indicator';
        this.previewIndicator.textContent = 'Live Preview Active';
        document.body.appendChild(this.previewIndicator);
    }
    
    bindEvents() {
        // Panel toggle
        this.toggle?.addEventListener('click', () => this.togglePanel());
        this.closeBtn?.addEventListener('click', () => this.closePanel());
        
        // Color inputs
        Object.keys(this.colorInputs).forEach(key => {
            const colorInput = this.colorInputs[key];
            const hexInput = this.hexInputs[key];
            
            if (colorInput && hexInput) {
                colorInput.addEventListener('input', (e) => {
                    hexInput.value = e.target.value;
                    this.updateThemeColor(key, e.target.value);
                });
                
                hexInput.addEventListener('input', (e) => {
                    if (this.isValidHex(e.target.value)) {
                        colorInput.value = e.target.value;
                        this.updateThemeColor(key, e.target.value);
                    }
                });
            }
        });
        
        // Font selectors
        Object.keys(this.fontSelectors).forEach(key => {
            const selector = this.fontSelectors[key];
            if (selector) {
                selector.addEventListener('change', (e) => {
                    this.updateFont(key, e.target.value);
                });
            }
        });
        
        // Effect controls
        Object.keys(this.effectControls).forEach(key => {
            const control = this.effectControls[key];
            if (control) {
                if (control.type === 'checkbox') {
                    control.addEventListener('change', (e) => {
                        this.updateEffect(key, e.target.checked);
                    });
                } else if (control.type === 'range') {
                    control.addEventListener('input', (e) => {
                        this.updateEffect(key, e.target.value);
                        document.querySelector('.range-value').textContent = e.target.value + 'x';
                    });
                }
            }
        });
        
        // Preset buttons
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                this.applyPreset(preset);
                this.showPreviewIndicator(`Applied ${preset} theme`);
            });
        });
        
        // Theme presets
        document.querySelectorAll('.theme-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const themeType = preset.dataset.theme;
                this.applyPreset(themeType);
                this.updateActivePreset(preset);
            });
        });
        
        // Toggle buttons (Dark/Light mode)
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = btn.dataset.mode;
                this.toggleMode(mode);
                this.updateActiveToggle(btn);
            });
        });

        // Action buttons
        this.exportBtn?.addEventListener('click', () => this.exportTheme());
        this.importBtn?.addEventListener('click', () => this.importTheme());
        this.resetBtn?.addEventListener('click', () => this.resetTheme());
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.panel.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closePanel();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }
    
    getDefaultTheme() {
        return {
            colors: {
                primary: '#6366f1',
                secondary: '#06b6d4',
                accent: '#f59e0b',
                bgPrimary: '#ffffff',
                bgSecondary: '#f8fafc'
            },
            fonts: {
                primary: 'Outfit',
                heading: 'Space Grotesk'
            },
            effects: {
                glassEffect: true,
                particlesEffect: true,
                smoothScroll: false,
                animationSpeed: 1
            }
        };
    }
    
    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }
    
    openPanel() {
        this.panel.classList.add('open');
        this.toggle.style.transform = 'rotate(180deg)';
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }
    
    closePanel() {
        this.panel.classList.remove('open');
        this.toggle.style.transform = '';
        this.isOpen = false;
        document.body.style.overflow = '';
    }
    
    updateThemeColor(key, value) {
        const cssVarMap = {
            primary: '--primary-color',
            secondary: '--secondary-color',
            accent: '--accent-color',
            bgPrimary: '--bg-primary',
            bgSecondary: '--bg-secondary'
        };
        
        const cssVar = cssVarMap[key];
        if (cssVar) {
            document.documentElement.style.setProperty(cssVar, value);
            this.currentTheme.colors[key] = value;
            this.saveTheme();
            this.showPreviewIndicator('Color updated');
            
            // Notify other systems of theme change
            document.dispatchEvent(new CustomEvent('theme-changed', {
                detail: { property: key, value }
            }));
        }
    }
    
    updateFont(key, value) {
        const cssVarMap = {
            primary: '--font-primary',
            heading: '--font-heading'
        };
        
        const cssVar = cssVarMap[key];
        if (cssVar) {
            document.documentElement.style.setProperty(cssVar, `'${value}', sans-serif`);
            this.currentTheme.fonts[key] = value;
            this.saveTheme();
            this.showPreviewIndicator('Font updated');
        }
    }
    
    updateEffect(key, value) {
        switch (key) {
            case 'glassEffect':
                this.toggleGlassMorphism(value);
                break;
            case 'particlesEffect':
                this.toggleParticles(value);
                break;
            case 'smoothScroll':
                this.toggleSmoothScroll(value);
                break;
            case 'animationSpeed':
                this.updateAnimationSpeed(value);
                break;
        }
        
        this.currentTheme.effects[key] = value;
        this.saveTheme();
        this.showPreviewIndicator('Effect updated');
    }
    
    toggleGlassMorphism(enabled) {
        const cards = document.querySelectorAll('.card, .service-card, .testimonial-content');
        cards.forEach(card => {
            if (enabled) {
                card.classList.add('glass-card');
            } else {
                card.classList.remove('glass-card');
            }
        });
    }
    
    toggleParticles(enabled) {
        if (window.particleSystem) {
            window.particleSystem.toggle(enabled);
        }
    }
    
    toggleSmoothScroll(enabled) {
        if (enabled) {
            if (!window.ultraSmoothScroll) {
                // Create new instance if it doesn't exist
                window.ultraSmoothScroll = new UltraSmoothScroll();
            } else {
                window.ultraSmoothScroll.toggle(enabled);
            }
        } else {
            if (window.ultraSmoothScroll) {
                window.ultraSmoothScroll.toggle(enabled);
            }
        }
    }
    
    updateAnimationSpeed(speed) {
        document.documentElement.style.setProperty('--animation-speed-multiplier', speed);
        
        // Update CSS animation durations
        const animations = document.querySelectorAll('*');
        animations.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const animationDuration = computedStyle.animationDuration;
            
            if (animationDuration && animationDuration !== 'none') {
                const duration = parseFloat(animationDuration);
                const newDuration = duration / speed;
                element.style.animationDuration = newDuration + 's';
            }
        });
    }
    
    applyPreset(presetName) {
        const presets = {
            ocean: {
                colors: {
                    primary: '#0891b2',
                    secondary: '#0284c7',
                    accent: '#06b6d4',
                    bgPrimary: '#f0f9ff',
                    bgSecondary: '#e0f2fe'
                }
            },
            sunset: {
                colors: {
                    primary: '#ea580c',
                    secondary: '#dc2626',
                    accent: '#f59e0b',
                    bgPrimary: '#fff7ed',
                    bgSecondary: '#fed7aa'
                }
            },
            forest: {
                colors: {
                    primary: '#16a34a',
                    secondary: '#15803d',
                    accent: '#65a30d',
                    bgPrimary: '#f0fdf4',
                    bgSecondary: '#dcfce7'
                }
            },
            neon: {
                colors: {
                    primary: '#a855f7',
                    secondary: '#ec4899',
                    accent: '#06b6d4',
                    bgPrimary: '#0f0f0f',
                    bgSecondary: '#1a1a1a'
                }
            },
            minimal: {
                colors: {
                    primary: '#374151',
                    secondary: '#6b7280',
                    accent: '#9ca3af',
                    bgPrimary: '#ffffff',
                    bgSecondary: '#f9fafb'
                }
            },
            dark: {
                colors: {
                    primary: '#6366f1',
                    secondary: '#06b6d4',
                    accent: '#f59e0b',
                    bgPrimary: '#0f172a',
                    bgSecondary: '#1e293b'
                }
            }
        };
        
        const preset = presets[presetName];
        if (preset) {
            // Apply colors
            Object.keys(preset.colors).forEach(key => {
                this.updateThemeColor(key, preset.colors[key]);
            });
            
            // Update UI inputs
            this.syncInputsWithTheme();
        }
    }
    
    syncInputsWithTheme() {
        // Update color inputs
        Object.keys(this.currentTheme.colors).forEach(key => {
            const colorInput = this.colorInputs[key];
            const hexInput = this.hexInputs[key];
            const value = this.currentTheme.colors[key];
            
            if (colorInput) colorInput.value = value;
            if (hexInput) hexInput.value = value;
        });
        
        // Update font selectors
        Object.keys(this.currentTheme.fonts).forEach(key => {
            const selector = this.fontSelectors[key];
            if (selector) selector.value = this.currentTheme.fonts[key];
        });
        
        // Update effect controls
        Object.keys(this.currentTheme.effects).forEach(key => {
            const control = this.effectControls[key];
            if (control) {
                if (control.type === 'checkbox') {
                    control.checked = this.currentTheme.effects[key];
                } else {
                    control.value = this.currentTheme.effects[key];
                }
            }
        });
    }
    
    exportTheme() {
        const themeData = JSON.stringify(this.currentTheme, null, 2);
        const blob = new Blob([themeData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flixon-theme.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showPreviewIndicator('Theme exported successfully!');
    }
    
    importTheme() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const theme = JSON.parse(event.target.result);
                        this.currentTheme = { ...this.getDefaultTheme(), ...theme };
                        this.applyTheme(this.currentTheme);
                        this.syncInputsWithTheme();
                        this.saveTheme();
                        this.showPreviewIndicator('Theme imported successfully!');
                    } catch (error) {
                        this.showPreviewIndicator('Error importing theme file');
                    }
                };
                reader.readAsText(file);
            }
        });
        
        input.click();
    }
    
    resetTheme() {
        this.currentTheme = this.getDefaultTheme();
        this.applyTheme(this.currentTheme);
        this.syncInputsWithTheme();
        this.saveTheme();
        this.showPreviewIndicator('Theme reset to default');
    }
    
    applyTheme(theme) {
        // Apply colors
        Object.keys(theme.colors).forEach(key => {
            this.updateThemeColor(key, theme.colors[key]);
        });
        
        // Apply fonts
        Object.keys(theme.fonts).forEach(key => {
            this.updateFont(key, theme.fonts[key]);
        });
        
        // Apply effects
        Object.keys(theme.effects).forEach(key => {
            this.updateEffect(key, theme.effects[key]);
        });
    }
    
    saveTheme() {
        localStorage.setItem('flixon-theme', JSON.stringify(this.currentTheme));
    }
    
    loadSavedTheme() {
        const saved = localStorage.getItem('flixon-theme');
        if (saved) {
            try {
                this.currentTheme = JSON.parse(saved);
                this.applyTheme(this.currentTheme);
            } catch (error) {
                console.warn('Failed to load saved theme:', error);
            }
        }
    }
    
    showPreviewIndicator(message) {
        this.previewIndicator.textContent = message;
        this.previewIndicator.classList.add('show');
        
        setTimeout(() => {
            this.previewIndicator.classList.remove('show');
        }, 2000);
    }
    
    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
}

// ===== ADVANCED THEME MANAGER =====
class AdvancedThemeManager extends ThemeManager {
    constructor() {
        super();
        this.gradientOverlays = [];
        this.glassMorphismElements = [];
    }
    
    setTheme(theme) {
        super.setTheme(theme);
        
        // Apply advanced theming effects
        this.applyGradientOverlays();
        this.applyGlassMorphism();
        this.updateParticleColors();
    }
    
    applyGradientOverlays() {
        const overlayElements = document.querySelectorAll('.hero-overlay, .section-overlay');
        
        overlayElements.forEach(overlay => {
            if (this.currentTheme === 'dark') {
                overlay.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(15,23,42,0.9) 100%)';
            } else {
                overlay.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)';
            }
        });
    }
    
    applyGlassMorphism() {
        const glassElements = document.querySelectorAll('.glass-card, .navbar');
        
        glassElements.forEach(element => {
            if (this.currentTheme === 'dark') {
                element.style.background = 'rgba(15, 23, 42, 0.8)';
                element.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            } else {
                element.style.background = 'rgba(255, 255, 255, 0.9)';
                element.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    updateParticleColors() {
        // Trigger particle system color update
        document.dispatchEvent(new CustomEvent('theme-changed'));
    }
    
    updateActivePreset(activePreset) {
        document.querySelectorAll('.theme-preset').forEach(preset => {
            preset.classList.remove('active');
        });
        activePreset.classList.add('active');
    }
    
    updateActiveToggle(activeToggle) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeToggle.classList.add('active');
    }
    
    toggleMode(mode) {
        const root = document.documentElement;
        
        if (mode === 'dark') {
            root.style.setProperty('--bg-primary', '#0a0a0a');
            root.style.setProperty('--bg-secondary', '#111111');
            root.style.setProperty('--bg-tertiary', '#1a1a1a');
            root.style.setProperty('--bg-card', '#1a1a1a');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#cccccc');
            root.style.setProperty('--text-tertiary', '#999999');
            root.style.setProperty('--border-color', '#333333');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--bg-tertiary', '#f1f5f9');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--text-tertiary', '#94a3b8');
            root.style.setProperty('--border-color', '#e2e8f0');
        }
        
        this.showPreviewIndicator(`Switched to ${mode} mode`);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the live customizer
    window.liveCustomizer = new LiveCustomizer();
    
    // Replace the basic theme manager with advanced one
    if (window.themeManager) {
        window.themeManager = new AdvancedThemeManager();
    }
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LiveCustomizer,
        AdvancedThemeManager
    };
}
