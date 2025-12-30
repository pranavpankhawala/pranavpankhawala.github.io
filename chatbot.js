// ===================================
// AI Chatbot Configuration
// ===================================

const CHATBOT_CONFIG = {
    name: "Portfolio Assistant",
    greeting: "Hi! I'm Pranav's AI assistant. How can I help you today?",
    typingDelay: 1000,
    responseDelay: 500
};

// Comprehensive FAQ Database
const FAQ_DATABASE = {
    experience: {
        keywords: ['experience', 'work', 'job', 'career', 'professional', 'worked', 'employment'],
        responses: [
            {
                text: "Pranav has 3+ years of professional experience as a Software Developer, including:",
                list: [
                    "Senior Software Developer at Tech Innovators Inc. (2023-Present)",
                    "Full Stack Developer at Digital Solutions Ltd. (2021-2022)",
                    "ML Engineer Intern at AI Analytics Corp. (2021)"
                ],
                actions: [
                    { text: "View Full Timeline", action: "scrollToSection", params: "experience" }
                ]
            }
        ]
    },
    skills: {
        keywords: ['skill', 'technology', 'tech stack', 'expertise', 'proficient', 'know', 'capable'],
        responses: [
            {
                text: "Pranav's technical expertise includes:",
                list: [
                    "Web Development: HTML5, CSS3, JavaScript, React, Flask",
                    "Backend: Python, Node.js, REST APIs, Database Design",
                    "Machine Learning: Supervised Learning, Data Analysis, Model Training",
                    "IoT Systems: IoT Architecture, Device-to-Cloud, Secure Systems"
                ],
                actions: [
                    { text: "See Detailed Skills", action: "scrollToSection", params: "skills" }
                ]
            }
        ]
    },
    projects: {
        keywords: ['project', 'portfolio', 'work', 'built', 'created', 'developed', 'showcase'],
        responses: [
            {
                text: "Here are some of Pranav's notable projects:",
                list: [
                    "Interactive Dashboard Platform - Real-time data visualization (Python, Flask, Chart.js)",
                    "Smart Data Screener - Intelligent filtering and ranking system",
                    "Realtime Analytics Viewer - Streaming data visualization with WebSockets"
                ],
                actions: [
                    { text: "View All Projects", action: "scrollToSection", params: "projects" }
                ]
            }
        ]
    },
    contact: {
        keywords: ['contact', 'reach', 'email', 'phone', 'connect', 'message', 'talk', 'discuss'],
        responses: [
            {
                text: "You can reach Pranav through:",
                list: [
                    "Email: pranav.pankhawala@gmail.com",
                    "GitHub: @pranavpankhawala",
                    "LinkedIn: pranavpankhawala"
                ],
                actions: [
                    { text: "Send Message", action: "scrollToSection", params: "contact" },
                    { text: "Schedule Meeting", action: "scheduleMeeting" }
                ]
            }
        ]
    },
    education: {
        keywords: ['education', 'degree', 'university', 'college', 'study', 'qualification'],
        responses: [
            {
                text: "Pranav holds a Bachelor of Technology in Computer Science & Engineering (2017-2021) with First Class Honors (GPA: 8.5/10). He was actively involved in the Coding Club and participated in multiple hackathons.",
                actions: [
                    { text: "View Timeline", action: "scrollToSection", params: "experience" }
                ]
            }
        ]
    },
    hire: {
        keywords: ['hire', 'freelance', 'available', 'job', 'opportunity', 'work together', 'collaborate'],
        responses: [
            {
                text: "Pranav is currently open to new opportunities! He specializes in full-stack development, ML solutions, and IoT systems. Would you like to:",
                actions: [
                    { text: "View Resume", action: "downloadResume" },
                    { text: "Schedule Consultation", action: "scheduleMeeting" },
                    { text: "Send Message", action: "scrollToSection", params: "contact" }
                ]
            }
        ]
    },
    technologies: {
        keywords: ['python', 'javascript', 'react', 'flask', 'node', 'database', 'api', 'docker', 'aws'],
        responses: [
            {
                text: "Yes, Pranav has extensive experience with that technology! His tech stack includes:",
                list: [
                    "Languages: Python, JavaScript (ES6+), SQL",
                    "Frameworks: Flask, React, Node.js",
                    "Tools: Docker, AWS, Git, REST APIs",
                    "Databases: PostgreSQL, MongoDB, Redis"
                ],
                actions: [
                    { text: "See All Skills", action: "scrollToSection", params: "skills" }
                ]
            }
        ]
    },
    blog: {
        keywords: ['blog', 'article', 'write', 'post', 'content', 'tutorial'],
        responses: [
            {
                text: "Pranav regularly writes about web development, machine learning, and IoT. Recent posts include:",
                list: [
                    "Building Responsive Dashboards with Modern CSS",
                    "Introduction to Supervised Learning Models",
                    "Securing IoT Device Communication"
                ],
                actions: [
                    { text: "Read Blog", action: "scrollToSection", params: "blog" }
                ]
            }
        ]
    }
};

// ===================================
// Chatbot State Management
// ===================================

let chatbotState = {
    isOpen: false,
    messageHistory: [],
    userName: null,
    context: null
};

// ===================================
// Chatbot Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
    console.log('✅ Chatbot initialized successfully');
});

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbot = document.getElementById('chatbot');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Check if elements exist
    if (!chatbotToggle || !chatbot) {
        console.error('❌ Chatbot elements not found in HTML');
        return;
    }

    console.log('✅ Chatbot elements found:', {
        toggle: !!chatbotToggle,
        container: !!chatbot,
        close: !!chatbotClose
    });

    // Toggle chatbot
    chatbotToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Chatbot toggle clicked');
        toggleChatbot();
    });

    if (chatbotClose) {
        chatbotClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleChatbot();
        });
    }

    // Handle form submission
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (message) {
            handleUserMessage(message);
            chatbotInput.value = '';
        }
    });

    // Handle quick replies
    quickReplies.forEach(reply => {
        reply.addEventListener('click', () => {
            const message = reply.getAttribute('data-message');
            handleUserMessage(message);
            hideQuickReplies();
        });
    });

    // Auto-open chatbot after delay (first visit)
    if (!localStorage.getItem('chatbotVisited')) {
        setTimeout(() => {
            toggleChatbot();
            localStorage.setItem('chatbotVisited', 'true');
        }, 5000);
    }
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const notification = chatbotToggle ? chatbotToggle.querySelector('.chatbot-notification') : null;

    if (!chatbot) {
        console.error('❌ Chatbot container not found');
        return;
    }

    chatbotState.isOpen = !chatbotState.isOpen;
    chatbot.classList.toggle('active');
    
    console.log('🤖 Chatbot toggled:', chatbotState.isOpen ? 'OPEN' : 'CLOSED');

    if (chatbotState.isOpen) {
        const input = document.getElementById('chatbotInput');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
        if (notification) notification.style.display = 'none';
    }
}

// Make function globally accessible
window.toggleChatbot = toggleChatbot;

// ===================================
// Message Handling
// ===================================

function handleUserMessage(message) {
    // Add user message to chat
    addMessage(message, 'user');

    // Store in history
    chatbotState.messageHistory.push({ role: 'user', content: message });

    // Show typing indicator
    showTypingIndicator();

    // Process message and generate response
    setTimeout(() => {
        const response = generateResponse(message);
        hideTypingIndicator();
        addBotResponse(response);
    }, CHATBOT_CONFIG.typingDelay);
}

function addMessage(content, type) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (typeof content === 'string') {
        const p = document.createElement('p');
        p.textContent = content;
        contentDiv.appendChild(p);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotResponse(response) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Add text
    if (response.text) {
        const p = document.createElement('p');
        p.textContent = response.text;
        contentDiv.appendChild(p);
    }

    // Add list
    if (response.list) {
        const ul = document.createElement('ul');
        response.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        contentDiv.appendChild(ul);
    }

    // Add actions
    if (response.actions) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        response.actions.forEach(actionData => {
            const button = document.createElement('button');
            button.className = 'message-action-btn';
            button.textContent = actionData.text;
            button.addEventListener('click', () => {
                handleAction(actionData.action, actionData.params);
            });
            actionsDiv.appendChild(button);
        });
        contentDiv.appendChild(actionsDiv);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Store in history
    chatbotState.messageHistory.push({ role: 'bot', content: response.text });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===================================
// Response Generation
// ===================================

function generateResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check for greetings
    if (isGreeting(lowerMessage)) {
        return {
            text: "Hello! 👋 I'm here to help you learn about Pranav's experience, skills, and projects. What would you like to know?",
            actions: [
                { text: "View Experience", action: "scrollToSection", params: "experience" },
                { text: "See Projects", action: "scrollToSection", params: "projects" }
            ]
        };
    }

    // Check for name
    if (lowerMessage.includes('your name') || lowerMessage.includes('who are you')) {
        return {
            text: `I'm ${CHATBOT_CONFIG.name}, an AI assistant created to help visitors learn about Pranav Pankhawala's portfolio. I can answer questions about his experience, skills, projects, and more!`
        };
    }

    // Check FAQ database
    for (const [category, data] of Object.entries(FAQ_DATABASE)) {
        if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return data.responses[0];
        }
    }

    // Default response with suggestions
    return {
        text: "I'm not quite sure about that, but I can help you with:",
        list: [
            "Pranav's work experience and career timeline",
            "Technical skills and expertise",
            "Project portfolio and case studies",
            "Contact information and scheduling",
            "Education and qualifications"
        ],
        actions: [
            { text: "Browse Portfolio", action: "scrollToSection", params: "projects" }
        ]
    };
}

function isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    return greetings.some(greeting => message.startsWith(greeting));
}

// ===================================
// Action Handlers
// ===================================

function handleAction(action, params) {
    switch (action) {
        case 'scrollToSection':
            scrollToSection(params);
            setTimeout(() => toggleChatbot(), 500);
            break;
        case 'downloadResume':
            downloadResume();
            break;
        case 'scheduleMeeting':
            scheduleMeeting();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function downloadResume() {
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.click();
        addBotResponse({
            text: "Resume download initiated! 📄"
        });
    }
}

function scheduleMeeting() {
    addBotResponse({
        text: "To schedule a consultation with Pranav:",
        list: [
            "Email: pranav.pankhawala@gmail.com",
            "Mention your preferred date and time",
            "Briefly describe the project or opportunity"
        ],
        actions: [
            { text: "Send Email", action: "scrollToSection", params: "contact" }
        ]
    });
}

// ===================================
// UI Helpers
// ===================================

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function hideQuickReplies() {
    const quickReplies = document.getElementById('chatbotQuickReplies');
    if (quickReplies) {
        quickReplies.style.display = 'none';
    }
}

// ===================================
// Analytics & Tracking
// ===================================

function trackChatbotInteraction(action, details) {
    // Log chatbot interactions for analytics
    console.log('Chatbot Interaction:', { action, details, timestamp: new Date().toISOString() });

    // You can integrate with Google Analytics here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'chatbot_interaction', {
            event_category: 'Chatbot',
            event_label: action,
            value: details
        });
    }
}

// ===================================
// Keyboard Shortcuts
// ===================================

document.addEventListener('keydown', (e) => {
    // Press 'C' to toggle chatbot
    if (e.key === 'c' || e.key === 'C') {
        if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            toggleChatbot();
        }
    }

    // ESC to close chatbot
    if (e.key === 'Escape' && chatbotState.isOpen) {
        toggleChatbot();
    }
});

// ===================================
// Chatbot Context Awareness
// ===================================

function updateChatbotContext() {
    // Detect current section and provide context-aware suggestions
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            chatbotState.context = section.id;
        }
    });
}

window.addEventListener('scroll', debounce(updateChatbotContext, 200));

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Export Chat History
// ===================================

function exportChatHistory() {
    const history = chatbotState.messageHistory;
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `chat-history-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Make export function available globally
window.exportChatHistory = exportChatHistory;

// ===================================
// Persistent Chat State (Optional)
// ===================================

function saveChatState() {
    localStorage.setItem('chatbotState', JSON.stringify(chatbotState));
}

function loadChatState() {
    const saved = localStorage.getItem('chatbotState');
    if (saved) {
        chatbotState = JSON.parse(saved);
    }
}

// Save state on beforeunload
window.addEventListener('beforeunload', saveChatState);

// ===================================
// Console Message
// ===================================

console.log('%c🤖 AI Chatbot Loaded', 'color: #2563eb; font-size: 14px; font-weight: bold;');
console.log('%cPress "C" to toggle chatbot', 'color: #6b7280; font-size: 12px;');
console.log('%cAvailable functions:', 'color: #6b7280; font-size: 12px;');
console.log('  - exportChatHistory(): Export chat as JSON');
console.log('  - toggleChatbot(): Open/close chatbot');