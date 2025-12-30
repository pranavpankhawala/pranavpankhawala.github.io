// ===================================
// Horizontal Timeline Only
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing Horizontal Timeline...');
    setTimeout(() => {
        initHorizontalTimeline();
    }, 500);
});

function initHorizontalTimeline() {
    const verticalItems = document.querySelectorAll('.vertical-timeline .timeline-item');
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    const horizontalTimeline = document.querySelector('.horizontal-timeline');

    console.log('📊 Timeline Elements Found:', {
        verticalItems: verticalItems.length,
        horizontalScroll: !!horizontalScroll,
        horizontalTimeline: !!horizontalTimeline
    });

    if (!verticalItems.length) {
        console.error('❌ No timeline items found!');
        return;
    }

    if (!horizontalScroll || !horizontalTimeline) {
        console.error('❌ Horizontal timeline container not found!');
        return;
    }

    // Clone items to horizontal timeline
    horizontalScroll.innerHTML = '';
    verticalItems.forEach((item) => {
        const clone = item.cloneNode(true);
        horizontalScroll.appendChild(clone);
    });
    console.log('✅ Cloned', verticalItems.length, 'items to horizontal timeline');

    // Show horizontal timeline and hide vertical
    const verticalTimeline = document.querySelector('.vertical-timeline');
    if (verticalTimeline) {
        verticalTimeline.style.display = 'none';
    }
    horizontalTimeline.style.display = 'block';

    // Initialize horizontal scroll
    initHorizontalScroll();
    
    console.log('✅ Horizontal timeline initialized successfully');
}

function initHorizontalScroll() {
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    if (!horizontalScroll) return;

    // Auto-scroll to start
    setTimeout(() => {
        horizontalScroll.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
    }, 100);
}

// ===================================
// Timeline Item Interactions
// ===================================

function initTimelineInteractions() {
    const timelineCards = document.querySelectorAll('.timeline-card');

    timelineCards.forEach(card => {
        const responsibilities = card.querySelector('.responsibilities');
        if (!responsibilities) return;

        const items = responsibilities.querySelectorAll('li');
        if (items.length > 4) {
            addExpandButton(card, responsibilities, items);
        }
    });
}

function addExpandButton(card, responsibilities, items) {
    const button = document.createElement('button');
    button.className = 'expand-btn';
    button.innerHTML = '<i class="fas fa-chevron-down"></i> Show More';
    button.style.cssText = `
        background: none;
        border: none;
        color: var(--primary-color);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
    `;

    items.forEach((item, index) => {
        if (index >= 4) {
            item.style.display = 'none';
        }
    });

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = button.classList.contains('expanded');

        items.forEach((item, index) => {
            if (index >= 4) {
                item.style.display = isExpanded ? 'none' : 'list-item';
            }
        });

        button.classList.toggle('expanded');
        button.innerHTML = isExpanded
            ? '<i class="fas fa-chevron-down"></i> Show More'
            : '<i class="fas fa-chevron-up"></i> Show Less';
    });

    responsibilities.parentElement.insertBefore(button, responsibilities.nextSibling);
}

setTimeout(initTimelineInteractions, 1000);

// ===================================
// Export Timeline Data
// ===================================

function exportTimelineData() {
    const items = document.querySelectorAll('.horizontal-scroll .timeline-item');
    const data = [];

    items.forEach(item => {
        const jobTitle = item.querySelector('.job-title')?.textContent || '';
        const companyName = item.querySelector('.company-name')?.textContent || '';
        const date = item.querySelector('.timeline-date')?.textContent || '';
        const location = item.querySelector('.timeline-location')?.textContent || '';
        const responsibilities = Array.from(item.querySelectorAll('.responsibilities li')).map(li => li.textContent);
        const techStack = Array.from(item.querySelectorAll('.tech-tag')).map(tag => tag.textContent);

        data.push({
            jobTitle,
            companyName,
            date,
            location,
            responsibilities,
            techStack
        });
    });

    return data;
}

window.exportTimelineData = exportTimelineData;

// ===================================
// Print Timeline
// ===================================

function printTimeline() {
    window.print();
}

window.printTimeline = printTimeline;

// ===================================
// Timeline Statistics
// ===================================

function calculateTimelineStats() {
    const items = document.querySelectorAll('.horizontal-scroll .timeline-item');
    const techTags = document.querySelectorAll('.tech-tag');

    const techCount = {};
    techTags.forEach(tag => {
        const tech = tag.textContent.trim();
        techCount[tech] = (techCount[tech] || 0) + 1;
    });

    const sortedTech = Object.entries(techCount).sort((a, b) => b[1] - a[1]);

    return {
        totalExperiences: items.length,
        totalTechnologies: Object.keys(techCount).length,
        topTechnologies: sortedTech.slice(0, 5).map(([tech]) => tech)
    };
}

window.calculateTimelineStats = calculateTimelineStats;

// ===================================
// Smooth Scroll to Timeline
// ===================================

function scrollToTimeline() {
    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
        experienceSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

window.scrollToTimeline = scrollToTimeline;

// ===================================
// Timeline Item Hover Effects
// ===================================

function enhanceTimelineHoverEffects() {
    const timelineCards = document.querySelectorAll('.timeline-card');

    timelineCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

setTimeout(enhanceTimelineHoverEffects, 1000);

// ===================================
// Keyboard Navigation
// ===================================

document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            scrollToTimeline();
        }
    }
});

// ===================================
// Console Message
// ===================================

console.log('%c📅 Horizontal Timeline Loaded', 'color: #2563eb; font-size: 14px; font-weight: bold;');
console.log('%cAvailable functions:', 'color: #6b7280; font-size: 12px;');
console.log('  - exportTimelineData(): Export timeline as JSON');
console.log('  - printTimeline(): Print timeline view');
console.log('  - calculateTimelineStats(): Get timeline statistics');
console.log('  - scrollToTimeline(): Scroll to experience section');