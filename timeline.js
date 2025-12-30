// ===================================
// Timeline View Switcher
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing Timeline Views...');
    setTimeout(() => {
        initTimelineViews();
    }, 500); // Wait for DOM to fully load
});

function initTimelineViews() {
    const viewButtons = document.querySelectorAll('.timeline-view-btn');
    const timelineContainers = document.querySelectorAll('.timeline-container');
    const verticalTimeline = document.querySelector('.vertical-timeline');
    const horizontalTimeline = document.querySelector('.horizontal-timeline');
    const gridTimeline = document.querySelector('.grid-timeline');

    console.log('📊 Timeline Elements Found:', {
        viewButtons: viewButtons.length,
        timelineContainers: timelineContainers.length,
        verticalTimeline: !!verticalTimeline,
        horizontalTimeline: !!horizontalTimeline,
        gridTimeline: !!gridTimeline
    });

    if (!viewButtons.length) {
        console.error('❌ Timeline view buttons not found!');
        return;
    }

    if (!verticalTimeline || !horizontalTimeline || !gridTimeline) {
        console.error('❌ Timeline containers not found!');
        return;
    }

    // Clone timeline items for different views
    cloneTimelineItems();

    // View switcher
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const view = button.getAttribute('data-view');
            console.log('🔄 Switching to view:', view);

            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active timeline
            timelineContainers.forEach(container => {
                container.classList.remove('active');
            });

            switch (view) {
                case 'vertical':
                    verticalTimeline.classList.add('active');
                    console.log('✅ Vertical timeline activated');
                    break;
                case 'horizontal':
                    horizontalTimeline.classList.add('active');
                    console.log('✅ Horizontal timeline activated');
                    initHorizontalScroll();
                    break;
                case 'grid':
                    gridTimeline.classList.add('active');
                    console.log('✅ Grid timeline activated');
                    break;
            }
        });
    });

    console.log('✅ Timeline views initialized successfully');
}

function cloneTimelineItems() {
    const verticalItems = document.querySelectorAll('.vertical-timeline .timeline-item');
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    const gridTimeline = document.querySelector('.grid-timeline');

    console.log('🔄 Cloning timeline items:', {
        verticalItems: verticalItems.length,
        horizontalScroll: !!horizontalScroll,
        gridTimeline: !!gridTimeline
    });

    if (!verticalItems.length) {
        console.error('❌ No timeline items found in vertical timeline!');
        return;
    }
    
    if (!horizontalScroll || !gridTimeline) {
        console.error('❌ Horizontal or grid timeline containers not found!');
        return;
    }

    // Clone for horizontal timeline
    horizontalScroll.innerHTML = '';
    verticalItems.forEach((item, index) => {
        const clone = item.cloneNode(true);
        horizontalScroll.appendChild(clone);
    });
    console.log('✅ Cloned', verticalItems.length, 'items to horizontal timeline');

    // Clone for grid timeline
    gridTimeline.innerHTML = '';
    verticalItems.forEach((item, index) => {
        const clone = item.cloneNode(true);
        gridTimeline.appendChild(clone);
    });
    console.log('✅ Cloned', verticalItems.length, 'items to grid timeline');
}

function initHorizontalScroll() {
    const horizontalScroll = document.querySelector('.horizontal-scroll');
    if (!horizontalScroll) return;

    // Auto-scroll to center on first item
    setTimeout(() => {
        const firstItem = horizontalScroll.querySelector('.timeline-item');
        if (firstItem) {
            const scrollLeft = firstItem.offsetLeft - (horizontalScroll.offsetWidth / 2) + (firstItem.offsetWidth / 2);
            horizontalScroll.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }, 100);
}

// ===================================
// Timeline Item Interactions
// ===================================

// Add expand/collapse functionality for responsibilities
function initTimelineInteractions() {
    const timelineCards = document.querySelectorAll('.timeline-card');

    timelineCards.forEach(card => {
        const responsibilities = card.querySelector('.responsibilities');
        if (!responsibilities) return;

        // Add expand/collapse button if more than 4 items
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

    // Hide items after the 4th
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

// Initialize interactions
setTimeout(initTimelineInteractions, 500);

// ===================================
// Timeline Filtering (Optional)
// ===================================

function initTimelineFiltering() {
    // Add filter functionality if needed
    const filterBtns = document.querySelectorAll('.timeline-filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterTimelineItems(filter);

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function filterTimelineItems(filter) {
    const items = document.querySelectorAll('.timeline-item');

    items.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
            item.style.display = '';
            item.style.animation = 'slideInLeft 0.6s ease-out';
        } else {
            item.style.display = 'none';
        }
    });
}

// ===================================
// Export Timeline Data (Optional)
// ===================================

function exportTimelineData() {
    const items = document.querySelectorAll('.vertical-timeline .timeline-item');
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

// Make export function available globally
window.exportTimelineData = exportTimelineData;

// ===================================
// Print Timeline
// ===================================

function printTimeline() {
    // Ensure vertical view is active for printing
    const verticalTimeline = document.querySelector('.vertical-timeline');
    const timelineContainers = document.querySelectorAll('.timeline-container');

    timelineContainers.forEach(container => container.classList.remove('active'));
    verticalTimeline.classList.add('active');

    setTimeout(() => {
        window.print();
    }, 100);
}

// Make print function available globally
window.printTimeline = printTimeline;

// ===================================
// Timeline Statistics
// ===================================

function calculateTimelineStats() {
    const items = document.querySelectorAll('.vertical-timeline .timeline-item');
    const techTags = document.querySelectorAll('.tech-tag');

    // Count technologies
    const techCount = {};
    techTags.forEach(tag => {
        const tech = tag.textContent.trim();
        techCount[tech] = (techCount[tech] || 0) + 1;
    });

    // Get most used technologies
    const sortedTech = Object.entries(techCount).sort((a, b) => b[1] - a[1]);

    return {
        totalExperiences: items.length,
        totalTechnologies: Object.keys(techCount).length,
        topTechnologies: sortedTech.slice(0, 5).map(([tech]) => tech)
    };
}

// Make stats function available globally
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

// Make scroll function available globally
window.scrollToTimeline = scrollToTimeline;

// ===================================
// Timeline Item Hover Effects
// ===================================

function enhanceTimelineHoverEffects() {
    const timelineCards = document.querySelectorAll('.timeline-card');

    timelineCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            // Add subtle scale effect
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// Initialize hover effects
setTimeout(enhanceTimelineHoverEffects, 500);

// ===================================
// Timeline Progress Indicator
// ===================================

function initTimelineProgress() {
    const verticalTimeline = document.querySelector('.vertical-timeline');
    if (!verticalTimeline) return;

    const progressLine = document.createElement('div');
    progressLine.className = 'timeline-progress-line';
    progressLine.style.cssText = `
        position: absolute;
        left: 30px;
        top: 0;
        width: 2px;
        background: var(--accent-color);
        transform-origin: top;
        transition: height 0.3s ease;
        z-index: 1;
    `;

    verticalTimeline.insertBefore(progressLine, verticalTimeline.firstChild);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        updateTimelineProgress(progressLine, verticalTimeline);
    });

    // Initial update
    updateTimelineProgress(progressLine, verticalTimeline);
}

function updateTimelineProgress(progressLine, verticalTimeline) {
    const timelineRect = verticalTimeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
        const visibleHeight = Math.min(windowHeight, timelineRect.bottom) - Math.max(0, timelineRect.top);
        const progress = (visibleHeight / timelineRect.height) * 100;
        progressLine.style.height = `${Math.min(progress, 100)}%`;
    }
}

// Initialize progress indicator
setTimeout(initTimelineProgress, 500);

// ===================================
// Keyboard Navigation
// ===================================

document.addEventListener('keydown', (e) => {
    // Press 'T' to scroll to timeline
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            scrollToTimeline();
        }
    }

    // Arrow keys to switch timeline views
    if (e.target.matches('.timeline-view-btn')) {
        const buttons = Array.from(document.querySelectorAll('.timeline-view-btn'));
        const currentIndex = buttons.indexOf(e.target);

        if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
            buttons[currentIndex + 1].focus();
            buttons[currentIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            buttons[currentIndex - 1].focus();
            buttons[currentIndex - 1].click();
        }
    }
});

// ===================================
// Console Message
// ===================================

console.log('%c📅 Timeline Feature Loaded', 'color: #2563eb; font-size: 14px; font-weight: bold;');
console.log('%cAvailable functions:', 'color: #6b7280; font-size: 12px;');
console.log('  - exportTimelineData(): Export timeline as JSON');
console.log('  - printTimeline(): Print timeline view');
console.log('  - calculateTimelineStats(): Get timeline statistics');
console.log('  - scrollToTimeline(): Scroll to experience section');