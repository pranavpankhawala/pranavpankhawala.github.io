// ===================================
// Horizontal Timeline - FIXED VERSION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing Timeline...');
    
    // Wait for everything to load
    setTimeout(() => {
        initTimeline();
    }, 1000);
});

function initTimeline() {
    console.log('📊 Starting timeline initialization...');
    
    const verticalItems = document.querySelectorAll('.vertical-timeline .timeline-item');
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    
    console.log('Found vertical items:', verticalItems.length);
    console.log('Found horizontal scroll:', !!horizontalScroll);
    
    if (!verticalItems || verticalItems.length === 0) {
        console.error('❌ No timeline items found in HTML!');
        return;
    }
    
    if (!horizontalScroll) {
        console.error('❌ Horizontal scroll container not found!');
        return;
    }
    
    // Clear any existing content
    horizontalScroll.innerHTML = '';
    
    // Clone each item
    verticalItems.forEach((item, index) => {
        console.log(`Cloning item ${index + 1}...`);
        const clone = item.cloneNode(true);
        horizontalScroll.appendChild(clone);
    });
    
    console.log('✅ Cloned', verticalItems.length, 'items successfully');
    
    // Force display
    const verticalTimeline = document.querySelector('.vertical-timeline');
    const horizontalTimeline = document.querySelector('.horizontal-timeline');
    
    if (verticalTimeline) {
        verticalTimeline.style.display = 'none';
    }
    
    if (horizontalTimeline) {
        horizontalTimeline.style.display = 'block';
        horizontalTimeline.style.visibility = 'visible';
        horizontalTimeline.style.opacity = '1';
    }
    
    console.log('✅ Timeline initialized and visible!');
}

// Utility functions
window.scrollToTimeline = function() {
    const section = document.getElementById('experience');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

console.log('%c📅 Timeline Script Loaded', 'color: #2563eb; font-size: 14px; font-weight: bold;');