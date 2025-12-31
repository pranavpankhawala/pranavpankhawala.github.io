// ===================================
// Timeline - Supporting Both Experience & Education
// ===================================

console.log('🎯 Timeline script loading...');

// Run as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineImmediately);
} else {
    initTimelineImmediately();
}

function initTimelineImmediately() {
    console.log('🔧 DOM Ready - Initializing Timelines NOW');
    
    // Add small delay to ensure CSS is loaded
    setTimeout(() => {
        setupExperienceTimeline();
        setupEducationTimeline();
    }, 100);
}

function setupExperienceTimeline() {
    console.log('📊 Setting up Experience timeline...');
    
    // Get elements
    const verticalTimeline = document.querySelector('.vertical-timeline');
    const horizontalTimeline = document.querySelector('.horizontal-timeline');
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    
    console.log('Experience elements found:', {
        verticalTimeline: !!verticalTimeline,
        horizontalTimeline: !!horizontalTimeline,
        horizontalScroll: !!horizontalScroll
    });
    
    if (!verticalTimeline || !horizontalTimeline || !horizontalScroll) {
        console.error('❌ Critical experience timeline elements missing!');
        return;
    }
    
    cloneTimelineItems(verticalTimeline, horizontalScroll, horizontalTimeline, 'Experience');
}

function setupEducationTimeline() {
    console.log('📊 Setting up Education timeline...');
    
    // Get elements
    const verticalTimeline = document.querySelector('.vertical-timeline-education');
    const horizontalTimeline = document.querySelector('.horizontal-timeline-education');
    const horizontalScroll = document.querySelector('.horizontal-scroll-education');
    
    console.log('Education elements found:', {
        verticalTimeline: !!verticalTimeline,
        horizontalTimeline: !!horizontalTimeline,
        horizontalScroll: !!horizontalScroll
    });
    
    if (!verticalTimeline || !horizontalTimeline || !horizontalScroll) {
        console.error('❌ Critical education timeline elements missing!');
        return;
    }
    
    cloneTimelineItems(verticalTimeline, horizontalScroll, horizontalTimeline, 'Education');
}

function cloneTimelineItems(verticalTimeline, horizontalScroll, horizontalTimeline, sectionName) {
    // Temporarily show vertical to clone items
    verticalTimeline.style.display = 'block';
    verticalTimeline.style.visibility = 'hidden';
    verticalTimeline.style.position = 'absolute';
    
    const verticalItems = verticalTimeline.querySelectorAll('.timeline-item');
    console.log(`📋 Found ${verticalItems.length} ${sectionName} timeline items`);
    
    if (verticalItems.length === 0) {
        console.error(`❌ No ${sectionName} timeline items found!`);
        return;
    }
    
    // Clear horizontal scroll
    horizontalScroll.innerHTML = '';
    
    // Clone all items
    verticalItems.forEach((item, index) => {
        const clone = item.cloneNode(true);
        
        // Force text visibility with inline styles as fallback
        const textElements = clone.querySelectorAll('h3, h4, p, li, span, div, .job-title, .company-name, .timeline-meta, .responsibilities li');
        textElements.forEach(el => {
            // Only set if element has text content
            if (el.textContent && el.textContent.trim()) {
                if (el.classList.contains('job-title')) {
                    el.style.color = '#1f2937';
                } else if (el.classList.contains('company-name')) {
                    el.style.color = '#2563eb';
                } else if (el.classList.contains('timeline-meta') || el.closest('.timeline-meta')) {
                    el.style.color = '#9ca3af';
                } else if (el.tagName === 'LI' && el.closest('.responsibilities')) {
                    el.style.color = '#6b7280';
                } else if (el.classList.contains('tech-tag')) {
                    el.style.color = '#1f2937';
                } else {
                    el.style.color = '#1f2937';
                }
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            }
        });
        
        horizontalScroll.appendChild(clone);
        console.log(`✓ Cloned ${sectionName} item ${index + 1}`);
    });
    
    // Force a reflow to ensure CSS is applied
    horizontalScroll.offsetHeight;
    
    // Hide vertical, show horizontal
    verticalTimeline.style.display = 'none';
    verticalTimeline.style.visibility = 'visible';
    verticalTimeline.style.position = 'static';
    
    horizontalTimeline.style.display = 'block';
    horizontalTimeline.style.visibility = 'visible';
    horizontalTimeline.style.opacity = '1';
    
    console.log(`✅ ${sectionName} timeline visible with ${horizontalScroll.children.length} items!`);
}

// Global utility
window.scrollToTimeline = function() {
    const section = document.getElementById('experience');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.scrollToEducation = function() {
    const section = document.getElementById('education');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

console.log('%c✅ Timeline Script Ready', 'color: #10b981; font-size: 14px; font-weight: bold;');