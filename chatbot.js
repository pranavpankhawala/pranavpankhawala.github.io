// ===================================
// AI Chatbot - Dynamic Data Extraction
// ===================================

const CHATBOT_CONFIG = {
    name: "Portfolio Assistant",
    greeting: "Hi! I'm Pranav's AI assistant. How can I help you today?",
    typingDelay: 1000,
    responseDelay: 500
};

// State Management
let chatbotState = {
    isOpen: false,
    messageHistory: [],
    userName: null,
    context: null,
    portfolioData: null // Will store extracted data
};

// ===================================
// Data Extraction from HTML
// ===================================

function extractPortfolioData() {
    console.log('📊 Extracting portfolio data from HTML...');
    
    const data = {
        experience: extractExperience(),
        education: extractEducation(),
        skills: extractSkills(),
        projects: extractProjects(),
        contact: extractContact(),
        about: extractAbout(),
        stats: extractStats()
    };
    
    console.log('✅ Portfolio data extracted:', data);
    return data;
}

function extractExperience() {
    const experiences = [];
    const experienceSection = document.querySelector('#experience .vertical-timeline');
    
    if (!experienceSection) return experiences;
    
    const items = experienceSection.querySelectorAll('.timeline-item');
    items.forEach(item => {
        const title = item.querySelector('.job-title')?.textContent.trim();
        const company = item.querySelector('.company-name')?.textContent.trim();
        const date = item.querySelector('.timeline-date')?.textContent.trim().replace(/\s+/g, ' ');
        const location = item.querySelector('.timeline-location')?.textContent.trim().replace(/\s+/g, ' ');
        const responsibilities = Array.from(item.querySelectorAll('.responsibilities li'))
            .map(li => li.textContent.trim())
            .filter(text => text.length > 0);
        const technologies = Array.from(item.querySelectorAll('.tech-stack .tech-tag'))
            .map(tag => tag.textContent.trim())
            .filter(text => text.length > 0);
        
        if (title && company) {
            experiences.push({
                title,
                company,
                date: date || 'Present',
                location: location || 'Pune, India',
                responsibilities,
                technologies
            });
        }
    });
    
    return experiences;
}

function extractEducation() {
    const education = [];
    const educationSection = document.querySelector('#education .vertical-timeline-education');
    
    if (!educationSection) return education;
    
    const items = educationSection.querySelectorAll('.timeline-item');
    items.forEach(item => {
        const degree = item.querySelector('.job-title')?.textContent.trim();
        const institution = item.querySelector('.company-name')?.textContent.trim();
        const date = item.querySelector('.timeline-date')?.textContent.trim().replace(/\s+/g, ' ');
        const details = Array.from(item.querySelectorAll('.responsibilities li'))
            .map(li => li.textContent.trim())
            .filter(text => text.length > 0);
        const subjects = Array.from(item.querySelectorAll('.tech-stack .tech-tag'))
            .map(tag => tag.textContent.trim())
            .filter(text => text.length > 0);
        
        if (degree && institution) {
            education.push({
                degree,
                institution,
                date: date || '',
                details,
                subjects
            });
        }
    });
    
    return education;
}

function extractSkills() {
    const skills = {};
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        const categoryName = category.querySelector('.skill-category-title')?.textContent.trim();
        if (!categoryName) return;
        
        const skillItems = category.querySelectorAll('.skill-item');
        const categorySkills = [];
        
        skillItems.forEach(item => {
            const skillName = item.querySelector('.skill-name')?.textContent.trim();
            const skillLevel = item.getAttribute('data-level') || '75';
            
            if (skillName) {
                categorySkills.push({
                    name: skillName,
                    level: parseInt(skillLevel)
                });
            }
        });
        
        if (categorySkills.length > 0) {
            skills[categoryName] = categorySkills;
        }
    });
    
    return skills;
}

function extractProjects() {
    const projects = [];
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const title = card.querySelector('.project-title')?.textContent.trim();
        const description = card.querySelector('.project-description')?.textContent.trim();
        const technologies = Array.from(card.querySelectorAll('.tech-tag'))
            .map(tag => tag.textContent.trim());
        const category = card.getAttribute('data-category') || 'general';
        
        if (title) {
            projects.push({
                title,
                description,
                technologies,
                category
            });
        }
    });
    
    return projects;
}

function extractContact() {
    const contact = {
        email: '',
        github: '',
        linkedin: ''
    };
    
    // Extract from contact section
    const contactItems = document.querySelectorAll('.contact-info-item');
    contactItems.forEach(item => {
        const heading = item.querySelector('h4')?.textContent.trim().toLowerCase();
        const link = item.querySelector('a');
        
        if (heading && link) {
            if (heading.includes('email')) {
                contact.email = link.textContent.trim() || link.href.replace('mailto:', '');
            } else if (heading.includes('github')) {
                contact.github = link.textContent.trim() || link.href;
            } else if (heading.includes('linkedin')) {
                contact.linkedin = link.textContent.trim() || link.href;
            }
        }
    });
    
    return contact;
}

function extractAbout() {
    const about = {
        description: '',
        interests: []
    };
    
    const aboutBios = document.querySelectorAll('.about-bio');
    const bioTexts = Array.from(aboutBios).map(bio => bio.textContent.trim());
    about.description = bioTexts.join(' ');
    
    const interestItems = document.querySelectorAll('.interest-item');
    interestItems.forEach(item => {
        const title = item.querySelector('h3')?.textContent.trim();
        const description = item.querySelector('p')?.textContent.trim();
        
        if (title) {
            about.interests.push({ title, description });
        }
    });
    
    return about;
}

function extractStats() {
    const stats = {};
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        const number = item.querySelector('.stat-number')?.getAttribute('data-count') || 
                      item.querySelector('.stat-number')?.textContent.trim();
        const label = item.querySelector('.stat-label')?.textContent.trim();
        
        if (label && number) {
            stats[label] = number;
        }
    });
    
    return stats;
}

// ===================================
// Dynamic Response Generation
// ===================================

function generateDynamicResponse(message) {
    const lowerMessage = message.toLowerCase();
    const data = chatbotState.portfolioData;
    
    if (!data) {
        return {
            text: "I'm still loading Pranav's portfolio data. Please try again in a moment!"
        };
    }
    
    // Greetings
    if (isGreeting(lowerMessage)) {
        return {
            text: `Hello! 👋 I'm here to help you learn about Pranav's experience, skills, and projects. I have access to real-time data from this portfolio. What would you like to know?`,
            actions: [
                { text: "View Experience", action: "scrollToSection", params: "experience" },
                { text: "See Projects", action: "scrollToSection", params: "projects" }
            ]
        };
    }
    
    // Name query
    if (lowerMessage.includes('your name') || lowerMessage.includes('who are you')) {
        return {
            text: `I'm ${CHATBOT_CONFIG.name}, an AI assistant with real-time access to Pranav's portfolio. I can tell you about his ${data.experience.length} work experiences, ${data.education.length} educational qualifications, ${data.projects.length} projects, and expertise across ${Object.keys(data.skills).length} skill categories!`
        };
    }
    
    // Experience queries
    if (containsAny(lowerMessage, ['experience', 'work', 'job', 'career', 'professional', 'worked', 'employment'])) {
        return generateExperienceResponse(data.experience);
    }
    
    // Education queries
    if (containsAny(lowerMessage, ['education', 'degree', 'university', 'college', 'study', 'qualification', 'diploma', 'masters', 'bachelor'])) {
        return generateEducationResponse(data.education);
    }
    
    // Skills queries
    if (containsAny(lowerMessage, ['skill', 'technology', 'tech', 'expertise', 'proficient', 'know', 'capable', 'programming'])) {
        return generateSkillsResponse(data.skills);
    }
    
    // Projects queries
    if (containsAny(lowerMessage, ['project', 'portfolio', 'built', 'created', 'developed', 'showcase'])) {
        return generateProjectsResponse(data.projects);
    }
    
    // Contact queries
    if (containsAny(lowerMessage, ['contact', 'reach', 'email', 'connect', 'message', 'talk', 'discuss'])) {
        return generateContactResponse(data.contact);
    }
    
    // About queries
    if (containsAny(lowerMessage, ['about', 'who is', 'tell me about', 'interests', 'background'])) {
        return generateAboutResponse(data.about);
    }
    
    // Stats queries
    if (containsAny(lowerMessage, ['stats', 'statistics', 'numbers', 'how many', 'count'])) {
        return generateStatsResponse(data.stats);
    }
    
    // Specific technology queries
    const techKeywords = ['python', 'javascript', 'react', 'flask', 'node', 'machine learning', 'ml', 'iot', 'database'];
    for (const tech of techKeywords) {
        if (lowerMessage.includes(tech)) {
            return generateTechnologyResponse(tech, data);
        }
    }
    
    // Default response with suggestions
    return {
        text: "I can help you with information about:",
        list: [
            `${data.experience.length} work experiences at various companies`,
            `${data.education.length} educational qualifications`,
            `${Object.keys(data.skills).length} skill categories with specific technologies`,
            `${data.projects.length} featured projects`,
            "Contact information and ways to connect",
            "Background and interests"
        ],
        actions: [
            { text: "View All Experience", action: "scrollToSection", params: "experience" },
            { text: "Browse Projects", action: "scrollToSection", params: "projects" }
        ]
    };
}

// ===================================
// Response Generators
// ===================================

function generateExperienceResponse(experiences) {
    if (experiences.length === 0) {
        return { text: "No work experience information is currently available." };
    }
    
    const latestExp = experiences[0];
    const responseList = experiences.map((exp, index) => {
        const techList = exp.technologies.length > 0 
            ? ` (Technologies: ${exp.technologies.slice(0, 3).join(', ')}${exp.technologies.length > 3 ? '...' : ''})` 
            : '';
        return `${exp.title} at ${exp.company} - ${exp.date}${techList}`;
    });
    
    return {
        text: `Pranav has ${experiences.length} professional experience${experiences.length > 1 ? 's' : ''}:`,
        list: responseList,
        actions: [
            { text: "View Full Timeline", action: "scrollToSection", params: "experience" }
        ]
    };
}

function generateEducationResponse(education) {
    if (education.length === 0) {
        return { text: "No education information is currently available." };
    }
    
    const responseList = education.map(edu => {
        const gpaInfo = edu.details.find(d => d.toLowerCase().includes('gpa') || d.toLowerCase().includes('honors'));
        return `${edu.degree} - ${edu.institution} (${edu.date})${gpaInfo ? ': ' + gpaInfo : ''}`;
    });
    
    return {
        text: `Pranav's educational background includes ${education.length} qualification${education.length > 1 ? 's' : ''}:`,
        list: responseList,
        actions: [
            { text: "View Education Timeline", action: "scrollToSection", params: "education" }
        ]
    };
}

function generateSkillsResponse(skills) {
    const categories = Object.keys(skills);
    if (categories.length === 0) {
        return { text: "No skills information is currently available." };
    }
    
    const responseList = categories.map(category => {
        const categorySkills = skills[category];
        const topSkills = categorySkills
            .sort((a, b) => b.level - a.level)
            .slice(0, 3)
            .map(s => s.name)
            .join(', ');
        return `${category}: ${topSkills}${categorySkills.length > 3 ? '...' : ''}`;
    });
    
    return {
        text: `Pranav has expertise across ${categories.length} skill categories:`,
        list: responseList,
        actions: [
            { text: "See Detailed Skills", action: "scrollToSection", params: "skills" }
        ]
    };
}

function generateProjectsResponse(projects) {
    if (projects.length === 0) {
        return { text: "No projects information is currently available." };
    }
    
    const responseList = projects.map(project => {
        const techList = project.technologies.slice(0, 3).join(', ');
        return `${project.title} - ${project.description.substring(0, 80)}... (${techList})`;
    });
    
    return {
        text: `Here are ${projects.length} featured projects:`,
        list: responseList.slice(0, 3),
        actions: [
            { text: "View All Projects", action: "scrollToSection", params: "projects" }
        ]
    };
}

function generateContactResponse(contact) {
    const contactList = [];
    
    if (contact.email) contactList.push(`Email: ${contact.email}`);
    if (contact.github) contactList.push(`GitHub: ${contact.github}`);
    if (contact.linkedin) contactList.push(`LinkedIn: ${contact.linkedin}`);
    
    return {
        text: "You can reach Pranav through:",
        list: contactList.length > 0 ? contactList : ["Contact information is being updated"],
        actions: [
            { text: "Send Message", action: "scrollToSection", params: "contact" }
        ]
    };
}

function generateAboutResponse(about) {
    const interestsList = about.interests.map(interest => 
        `${interest.title}: ${interest.description}`
    );
    
    return {
        text: about.description || "Pranav is a software developer with diverse interests and expertise.",
        list: interestsList.length > 0 ? interestsList : undefined,
        actions: [
            { text: "Learn More", action: "scrollToSection", params: "about" }
        ]
    };
}

function generateStatsResponse(stats) {
    const statsList = Object.entries(stats).map(([label, value]) => 
        `${value}+ ${label}`
    );
    
    return {
        text: "Here are some key statistics:",
        list: statsList.length > 0 ? statsList : ["Statistics are being calculated"],
        actions: [
            { text: "View Portfolio", action: "scrollToSection", params: "home" }
        ]
    };
}

function generateTechnologyResponse(tech, data) {
    const techLower = tech.toLowerCase();
    const relatedProjects = data.projects.filter(p => 
        p.technologies.some(t => t.toLowerCase().includes(techLower)) ||
        p.title.toLowerCase().includes(techLower) ||
        p.description.toLowerCase().includes(techLower)
    );
    
    const relatedExperience = data.experience.filter(exp =>
        exp.technologies.some(t => t.toLowerCase().includes(techLower))
    );
    
    const skillInfo = [];
    Object.entries(data.skills).forEach(([category, skills]) => {
        skills.forEach(skill => {
            if (skill.name.toLowerCase().includes(techLower)) {
                skillInfo.push(`${skill.name} (${skill.level}% proficiency) in ${category}`);
            }
        });
    });
    
    const responseList = [];
    
    if (skillInfo.length > 0) {
        responseList.push(...skillInfo);
    }
    
    if (relatedProjects.length > 0) {
        responseList.push(`Used in ${relatedProjects.length} project${relatedProjects.length > 1 ? 's' : ''}: ${relatedProjects.map(p => p.title).join(', ')}`);
    }
    
    if (relatedExperience.length > 0) {
        responseList.push(`Applied in ${relatedExperience.length} professional role${relatedExperience.length > 1 ? 's' : ''}`);
    }
    
    if (responseList.length === 0) {
        return {
            text: `${tech} is mentioned in the portfolio. Let me show you where it appears.`,
            actions: [
                { text: "View Skills", action: "scrollToSection", params: "skills" },
                { text: "View Projects", action: "scrollToSection", params: "projects" }
            ]
        };
    }
    
    return {
        text: `Here's what I found about ${tech}:`,
        list: responseList,
        actions: [
            { text: "See Related Projects", action: "scrollToSection", params: "projects" }
        ]
    };
}

// ===================================
// Utility Functions
// ===================================

function containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

function isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'hola', 'namaste'];
    return greetings.some(greeting => message.startsWith(greeting) || message === greeting);
}

// ===================================
// Chatbot Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
    
    // Extract portfolio data after a short delay to ensure DOM is ready
    setTimeout(() => {
        chatbotState.portfolioData = extractPortfolioData();
        console.log('✅ Chatbot initialized with dynamic data');
    }, 500);
});

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbot = document.getElementById('chatbot');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const quickReplies = document.querySelectorAll('.quick-reply');

    if (!chatbotToggle || !chatbot) {
        console.error('❌ Chatbot elements not found in HTML');
        return;
    }

    console.log('✅ Chatbot elements found');

    // Toggle chatbot
    chatbotToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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

   // New behavior - only auto-opens on desktop
    if (!localStorage.getItem('chatbotVisited') && window.innerWidth >= 1024) 
        {
            setTimeout(() => toggleChatbot(), 5000);
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

    if (chatbotState.isOpen) {
        const input = document.getElementById('chatbotInput');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
        if (notification) notification.style.display = 'none';
    }
}

window.toggleChatbot = toggleChatbot;

// ===================================
// Message Handling
// ===================================

function handleUserMessage(message) {
    addMessage(message, 'user');
    chatbotState.messageHistory.push({ role: 'user', content: message });
    showTypingIndicator();

    setTimeout(() => {
        const response = generateDynamicResponse(message);
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

    if (response.text) {
        const p = document.createElement('p');
        p.textContent = response.text;
        contentDiv.appendChild(p);
    }

    if (response.list) {
        const ul = document.createElement('ul');
        response.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        contentDiv.appendChild(ul);
    }

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

    chatbotState.messageHistory.push({ role: 'bot', content: response.text });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    const email = chatbotState.portfolioData?.contact?.email || 'pranav.pankhawala@gmail.com';
    addBotResponse({
        text: "To schedule a consultation with Pranav:",
        list: [
            `Email: ${email}`,
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
// Keyboard Shortcuts
// ===================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
        if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            toggleChatbot();
        }
    }

    if (e.key === 'Escape' && chatbotState.isOpen) {
        toggleChatbot();
    }
});

// ===================================
// Context Awareness
// ===================================

function updateChatbotContext() {
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
// Console Message
// ===================================

console.log('%c🤖 Dynamic AI Chatbot Loaded', 'color: #2563eb; font-size: 14px; font-weight: bold;');
console.log('%cPress "C" to toggle chatbot', 'color: #6b7280; font-size: 12px;');
console.log('%cChatbot uses real-time data from the portfolio!', 'color: #10b981; font-size: 12px;');