if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
} else {
    initTimeline();
}

function initTimeline() {
    // CSS-only horizontal scroll — no DOM cloning needed.
    // Dark mode works correctly via CSS variables; no inline style overrides.
}

window.Portfolio = window.Portfolio || {};

window.Portfolio.scrollToTimeline = function () {
    const section = document.getElementById('experience');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.Portfolio.scrollToEducation = function () {
    const section = document.getElementById('education');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Legacy aliases for keyboard shortcut handler in advanced-features.js
window.scrollToTimeline = window.Portfolio.scrollToTimeline;
window.scrollToEducation = window.Portfolio.scrollToEducation;
