// ===================================
// Timeline - Bulletproof Working Version
// ===================================

console.log('🎯 Timeline script loading...');

// Run as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineImmediately);
} else {
    initTimelineImmediately();
}

function initTimelineImmediately() {
    console.log('🔧 DOM Ready - Initializing Timeline NOW');
    
    // Add small delay to ensure CSS is loaded
    setTimeout(() => {
        setupTimeline();
    }, 100);
}

function setupTimeline() {
    console.log('📊 Setting up timeline...');
    
    // Get elements
    const verticalTimeline = document.querySelector('.vertical-timeline');
    const horizontalTimeline = document.querySelector('.horizontal-timeline');
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    
    console.log('Elements found:', {
        verticalTimeline: !!verticalTimeline,
        horizontalTimeline: !!horizontalTimeline,
        horizontalScroll: !!horizontalScroll
    });
    
    if (!verticalTimeline || !horizontalTimeline || !horizontalScroll) {
        console.error('❌ Critical timeline elements missing!');
        return;
    }
    
    // Temporarily show vertical to clone items
    verticalTimeline.style.display = 'block';
    verticalTimeline.style.visibility = 'hidden';
    verticalTimeline.style.position = 'absolute';
    
    const verticalItems = verticalTimeline.querySelectorAll('.timeline-item');
    console.log('📋 Found', verticalItems.length, 'timeline items');
    
    if (verticalItems.length === 0) {
        console.error('❌ No timeline items found!');
        return;
    }
    
    // Clear horizontal scroll
    horizontalScroll.innerHTML = '';
    
    // Clone all items
    verticalItems.forEach((item, index) => {
        const clone = item.cloneNode(true);
        horizontalScroll.appendChild(clone);
        console.log(`✓ Cloned item ${index + 1}`);
    });
    
    // Hide vertical, show horizontal
    verticalTimeline.style.display = 'none';
    verticalTimeline.style.visibility = 'visible';
    verticalTimeline.style.position = 'static';
    
    horizontalTimeline.style.display = 'block';
    horizontalTimeline.style.visibility = 'visible';
    horizontalTimeline.style.opacity = '1';
    
    console.log('✅ Timeline visible with', horizontalScroll.children.length, 'items!');
    console.log('✅ SUCCESS: Horizontal timeline is now displayed');
}

// Global utility
window.scrollToTimeline = function() {
    const section = document.getElementById('experience');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

console.log('%c✅ Timeline Script Ready', 'color: #10b981; font-size: 14px; font-weight: bold;');