// ===================================
// Advanced Portfolio Features JavaScript
// ===================================

// Configuration
const ADVANCED_CONFIG = {
    enableCustomCursor: false,  // DISABLED - Set to true if you want custom cursor
    enableCommandPalette: true,
    enableKeyboardShortcuts: true,
    githubUsername: 'pranavpankhawala',
    githubTheme: 'tokyonight'
};

// State Management
const advancedState = {
    commandPaletteOpen: false,
    shortcutsModalOpen: false,
    selectedCommandIndex: 0,
    commands: []
};

// ===================================
// Reading Progress Bar
// ===================================

function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// ===================================
// Custom Cursor
// ===================================

function initCustomCursor() {
    if (!ADVANCED_CONFIG.enableCustomCursor) return;
    if (window.innerWidth < 1024) return; // Disable on mobile/tablet

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    document.body.classList.add('custom-cursor-enabled');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursors
        cursor.classList.add('active');
        follower.classList.add('active');
    });

    // Animate cursor position
    function animateCursor() {
        // Smooth following for cursor
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Slower following for follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        follower.style.transform = `translate(${followerX - 4}px, ${followerY - 4}px)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const interactiveElements = 'a, button, [role="button"], input, textarea, select';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches(interactiveElements)) {
            cursor.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.matches(interactiveElements)) {
            cursor.classList.remove('hover');
        }
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
}

// ===================================
// Command Palette
// ===================================

function initCommandPalette() {
    if (!ADVANCED_CONFIG.enableCommandPalette) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'command-palette-overlay';
    overlay.id = 'commandPaletteOverlay';

    // Create palette
    const palette = document.createElement('div');
    palette.className = 'command-palette';

    palette.innerHTML = `
        <div class="command-palette-header">
            <i class="fas fa-search command-palette-icon"></i>
            <input 
                type="text" 
                class="command-palette-input" 
                placeholder="Type a command or search..."
                id="commandPaletteInput"
                autocomplete="off"
            >
            <span class="command-palette-hint">ESC</span>
        </div>
        <div class="command-palette-results" id="commandPaletteResults"></div>
        <div class="command-palette-footer">
            <div class="command-palette-footer-item">
                <span class="command-palette-key">↑</span>
                <span class="command-palette-key">↓</span>
                <span>Navigate</span>
            </div>
            <div class="command-palette-footer-item">
                <span class="command-palette-key">Enter</span>
                <span>Select</span>
            </div>
            <div class="command-palette-footer-item">
                <span class="command-palette-key">ESC</span>
                <span>Close</span>
            </div>
        </div>
    `;

    overlay.appendChild(palette);
    document.body.appendChild(overlay);

    // Define commands
    advancedState.commands = [
        {
            id: 'home',
            title: 'Go to Home',
            description: 'Navigate to homepage',
            icon: 'fas fa-home',
            section: 'Navigation',
            action: () => scrollToSection('home')
        },
        {
            id: 'about',
            title: 'Go to About',
            description: 'Learn more about me',
            icon: 'fas fa-user',
            section: 'Navigation',
            action: () => scrollToSection('about')
        },
        {
            id: 'experience',
            title: 'Go to Experience',
            description: 'View work timeline',
            icon: 'fas fa-briefcase',
            section: 'Navigation',
            action: () => scrollToSection('experience')
        },
        {
            id: 'skills',
            title: 'Go to Skills',
            description: 'See technical expertise',
            icon: 'fas fa-code',
            section: 'Navigation',
            action: () => scrollToSection('skills')
        },
        {
            id: 'projects',
            title: 'Go to Projects',
            description: 'Browse project portfolio',
            icon: 'fas fa-folder',
            section: 'Navigation',
            action: () => scrollToSection('projects')
        },
        {
            id: 'blog',
            title: 'Go to Blog',
            description: 'Read latest articles',
            icon: 'fas fa-rss',
            section: 'Navigation',
            action: () => scrollToSection('blog')
        },
        {
            id: 'contact',
            title: 'Go to Contact',
            description: 'Get in touch',
            icon: 'fas fa-envelope',
            section: 'Navigation',
            action: () => scrollToSection('contact')
        },
        {
            id: 'theme-toggle',
            title: 'Toggle Theme',
            description: 'Switch between light and dark mode',
            icon: 'fas fa-adjust',
            section: 'Actions',
            action: () => document.getElementById('themeToggle').click()
        },
        {
            id: 'download-resume',
            title: 'Download Resume',
            description: 'Get PDF resume',
            icon: 'fas fa-download',
            section: 'Actions',
            action: () => document.getElementById('resumeBtn').click()
        },
        {
            id: 'copy-email',
            title: 'Copy Email',
            description: 'Copy email to clipboard',
            icon: 'fas fa-copy',
            section: 'Actions',
            action: () => copyToClipboard('pranav.pankhawala@gmail.com', 'Email copied!')
        },
        {
            id: 'github',
            title: 'Open GitHub',
            description: 'Visit GitHub profile',
            icon: 'fab fa-github',
            section: 'Social',
            action: () => window.open('https://github.com/pranavpankhawala', '_blank')
        },
        {
            id: 'linkedin',
            title: 'Open LinkedIn',
            description: 'Visit LinkedIn profile',
            icon: 'fab fa-linkedin',
            section: 'Social',
            action: () => window.open('https://linkedin.com/in/pranavpankhawala', '_blank')
        },
        {
            id: 'shortcuts',
            title: 'Keyboard Shortcuts',
            description: 'View all shortcuts',
            icon: 'fas fa-keyboard',
            section: 'Help',
            action: () => openShortcutsModal()
        }
    ];

    // Input handler
    const input = document.getElementById('commandPaletteInput');
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderCommandResults(query);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            advancedState.selectedCommandIndex++;
            renderCommandResults(input.value.toLowerCase());
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            advancedState.selectedCommandIndex--;
            renderCommandResults(input.value.toLowerCase());
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeSelectedCommand();
        } else if (e.key === 'Escape') {
            closeCommandPalette();
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeCommandPalette();
        }
    });

    // Initial render
    renderCommandResults('');
}

function renderCommandResults(query) {
    const resultsContainer = document.getElementById('commandPaletteResults');
    const filteredCommands = advancedState.commands.filter(cmd => 
        cmd.title.toLowerCase().includes(query) || 
        cmd.description.toLowerCase().includes(query)
    );

    // Clamp selected index
    advancedState.selectedCommandIndex = Math.max(0, Math.min(
        advancedState.selectedCommandIndex,
        filteredCommands.length - 1
    ));

    // Group by section
    const sections = {};
    filteredCommands.forEach(cmd => {
        if (!sections[cmd.section]) {
            sections[cmd.section] = [];
        }
        sections[cmd.section].push(cmd);
    });

    let html = '';
    let globalIndex = 0;

    Object.entries(sections).forEach(([section, commands]) => {
        html += `
            <div class="command-palette-section">
                <div class="command-palette-section-title">${section}</div>
                ${commands.map((cmd, localIndex) => {
                    const isSelected = globalIndex === advancedState.selectedCommandIndex;
                    globalIndex++;
                    return `
                        <div class="command-palette-item ${isSelected ? 'selected' : ''}" data-command="${cmd.id}">
                            <div class="command-palette-item-icon">
                                <i class="${cmd.icon}"></i>
                            </div>
                            <div class="command-palette-item-content">
                                <div class="command-palette-item-title">${cmd.title}</div>
                                <div class="command-palette-item-description">${cmd.description}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    });

    resultsContainer.innerHTML = html || '<div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">No results found</div>';

    // Add click handlers
    document.querySelectorAll('.command-palette-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            advancedState.selectedCommandIndex = index;
            executeSelectedCommand();
        });
    });

    // Scroll selected into view
    const selected = resultsContainer.querySelector('.command-palette-item.selected');
    if (selected) {
        selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function executeSelectedCommand() {
    const filteredCommands = advancedState.commands.filter(cmd => {
        const query = document.getElementById('commandPaletteInput').value.toLowerCase();
        return cmd.title.toLowerCase().includes(query) || 
               cmd.description.toLowerCase().includes(query);
    });

    const command = filteredCommands[advancedState.selectedCommandIndex];
    if (command) {
        command.action();
        closeCommandPalette();
    }
}

function openCommandPalette() {
    const overlay = document.getElementById('commandPaletteOverlay');
    const input = document.getElementById('commandPaletteInput');
    
    advancedState.commandPaletteOpen = true;
    advancedState.selectedCommandIndex = 0;
    
    overlay.classList.add('active');
    setTimeout(() => {
        input.focus();
        input.value = '';
        renderCommandResults('');
    }, 100);
}

function closeCommandPalette() {
    const overlay = document.getElementById('commandPaletteOverlay');
    advancedState.commandPaletteOpen = false;
    overlay.classList.remove('active');
}

// ===================================
// Keyboard Shortcuts Modal
// ===================================

function initKeyboardShortcuts() {
    if (!ADVANCED_CONFIG.enableKeyboardShortcuts) return;

    // Create modal
    const overlay = document.createElement('div');
    overlay.className = 'shortcuts-modal-overlay';
    overlay.id = 'shortcutsModalOverlay';

    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';

    modal.innerHTML = `
        <div class="shortcuts-modal-header">
            <div class="shortcuts-modal-title">
                <i class="fas fa-keyboard"></i>
                Keyboard Shortcuts
            </div>
            <button class="shortcuts-modal-close" id="shortcutsModalClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="shortcuts-modal-body">
            <div class="shortcuts-section">
                <div class="shortcuts-section-title">Navigation</div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <span class="shortcut-description">Scroll to top</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">G</span>
                            <span class="shortcut-key">G</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Scroll to timeline</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">T</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Scroll up/down</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">J</span>
                            <span class="shortcut-key">/</span>
                            <span class="shortcut-key">K</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="shortcuts-section">
                <div class="shortcuts-section-title">Actions</div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <span class="shortcut-description">Command palette</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">⌘</span>
                            <span class="shortcut-key">K</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Toggle theme</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">D</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Open chatbot</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">C</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Download resume</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">R</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="shortcuts-section">
                <div class="shortcuts-section-title">Help</div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <span class="shortcut-description">Show this help</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">?</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Close modal</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">ESC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close button
    document.getElementById('shortcutsModalClose').addEventListener('click', closeShortcutsModal);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeShortcutsModal();
        }
    });
}

function openShortcutsModal() {
    const overlay = document.getElementById('shortcutsModalOverlay');
    advancedState.shortcutsModalOpen = true;
    overlay.classList.add('active');
}

function closeShortcutsModal() {
    const overlay = document.getElementById('shortcutsModalOverlay');
    advancedState.shortcutsModalOpen = false;
    overlay.classList.remove('active');
}

// ===================================
// Global Keyboard Shortcuts
// ===================================

function initGlobalKeyboardShortcuts() {
    let lastKeyTime = 0;
    let lastKey = '';

    document.addEventListener('keydown', (e) => {
        // Skip if typing in input/textarea
        if (e.target.matches('input, textarea')) return;

        const now = Date.now();
        const key = e.key.toLowerCase();

        // Command palette (Cmd+K or Ctrl+K)
        if ((e.metaKey || e.ctrlKey) && key === 'k') {
            e.preventDefault();
            openCommandPalette();
            return;
        }

        // Help modal (?)
        if (e.shiftKey && key === '?') {
            e.preventDefault();
            openShortcutsModal();
            return;
        }

        // Escape key
        if (key === 'escape') {
            if (advancedState.commandPaletteOpen) {
                closeCommandPalette();
            } else if (advancedState.shortcutsModalOpen) {
                closeShortcutsModal();
            }
            return;
        }

        // Single key shortcuts
        switch (key) {
            case 'd':
                e.preventDefault();
                document.getElementById('themeToggle')?.click();
                break;
            case 'c':
                e.preventDefault();
                window.toggleChatbot?.();
                break;
            case 'r':
                e.preventDefault();
                document.getElementById('resumeBtn')?.click();
                break;
            case 't':
                e.preventDefault();
                window.scrollToTimeline?.();
                break;
            case 'j':
                e.preventDefault();
                window.scrollBy({ top: 100, behavior: 'smooth' });
                break;
            case 'k':
                e.preventDefault();
                window.scrollBy({ top: -100, behavior: 'smooth' });
                break;
            case 'g':
                // Double G to scroll to top
                if (lastKey === 'g' && now - lastKeyTime < 500) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    lastKey = '';
                } else {
                    lastKey = 'g';
                    lastKeyTime = now;
                }
                break;
        }
    });
}

// ===================================
// GitHub Stats Integration
// ===================================

function initGitHubStats() {
    const githubSection = document.getElementById('github-stats');
    if (!githubSection) return;

    const username = ADVANCED_CONFIG.githubUsername;
    const theme = ADVANCED_CONFIG.githubTheme;

    const statsHTML = `
<div class="github-stats-container">
    <div class="github-stat-card" data-aos="fade-up">
        <img 
          src="https://github-readme-stats-sigma-five.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&bg_color=1a1a2e&title_color=00d9ff&icon_color=00d9ff&text_color=ffffff&cache_seconds=86400"
          alt="GitHub Stats"
        />
    </div>

    <div class="github-stat-card" data-aos="fade-up" data-aos-delay="100">
        <img 
          src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=true&background=1a1a2e&ring=00d9ff&fire=00d9ff&currStreakLabel=00d9ff"
          alt="GitHub Streak"
        />
    </div>

    <div class="github-stat-card" data-aos="fade-up" data-aos-delay="200">
        <img 
          src="https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true&bg_color=1a1a2e&title_color=00d9ff&text_color=ffffff&cache_seconds=86400"
          alt="Top Languages"
        />
    </div>
</div>
`;


    githubSection.innerHTML = statsHTML;
}


// ===================================
// Utility Functions
// ===================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function copyToClipboard(text, successMessage = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        font-weight: 600;
        animation: fadeInUp 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initCustomCursor();
    initCommandPalette();
    initKeyboardShortcuts();
    initGlobalKeyboardShortcuts();
    initGitHubStats();
    
    console.log('%c🚀 Advanced Features Loaded', 'color: #2563eb; font-size: 14px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #6b7280; font-size: 12px;');
    console.log('  ⌘+K or Ctrl+K : Open command palette');
    console.log('  ? : Show keyboard shortcuts');
    console.log('  D : Toggle dark mode');
    console.log('  C : Open chatbot');
    console.log('  T : Scroll to timeline');
    console.log('  J/K : Scroll down/up');
    console.log('  GG : Scroll to top');
});

// Export for use in other scripts
window.openCommandPalette = openCommandPalette;
window.closeCommandPalette = closeCommandPalette;
window.openShortcutsModal = openShortcutsModal;
window.closeShortcutsModal = closeShortcutsModal;
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;