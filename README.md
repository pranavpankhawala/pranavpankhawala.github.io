# 🚀 Pranav Pankhawala - Portfolio Website

A modern, feature-rich portfolio website showcasing professional experience, projects, and technical skills. Built with vanilla JavaScript, HTML5, and CSS3 with glassmorphism design and advanced interactive features.

![Portfolio Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🎨 Design & UI
- **Glassmorphism Design** - Modern, premium aesthetic with layered depth and soft blur effects
- **Dark/Light Mode** - Automatic theme switching with system preference detection
- **Fully Responsive** - Mobile-first design that works seamlessly on all devices
- **WCAG 2.2 AA Compliant** - Accessible design with proper contrast ratios and ARIA attributes
- **Smooth Animations** - CSS and JavaScript animations using AOS-like effects
- **Custom Cursor** (Desktop) - Interactive cursor with hover effects
- **Reading Progress Bar** - Visual indicator of scroll progress

### 🧠 Interactive Features
- **AI Chatbot Widget** - Context-aware assistant with dynamic data extraction from portfolio
- **Command Palette** (⌘K / Ctrl+K) - Quick navigation and actions
- **Keyboard Shortcuts** - Extensive keyboard navigation support
- **Trial Registration System** - Modal-based registration for projects with form validation
- **Project Filter** - Category-based filtering (Web, ML, IoT)
- **Animated Statistics** - Counter animations for achievements
- **Skill Progress Bars** - Visual representation of technical expertise

### 📊 Content Sections
1. **Hero Section** - Animated typing effect and particle background
2. **About Me** - Professional summary and interests
3. **Work Experience** - Horizontal timeline with professional positions
4. **Education** - Academic background timeline
5. **Skills** - 4 categories with progress indicators
6. **Showcase** - Bento grid layout with achievements
7. **Projects** - Featured work with live demos and GitHub links
8. **Blog** - Latest articles and technical writing
9. **Contact** - Form with Formspree integration

---

## 📁 Project Structure

```
portfolio/
├── index.html                      # Main HTML file (55KB)
├── styles.css                      # Core styles and theme variables (30KB)
├── script.js                       # Main JavaScript logic (20KB)
├── timeline.css                    # Timeline component styles (8KB)
├── timeline.js                     # Timeline functionality (6KB)
├── chatbot.css                     # AI chatbot widget styles (12KB)
├── chatbot.js                      # Chatbot logic with dynamic data extraction (18KB)
├── advanced-features.css           # Command palette, shortcuts, GitHub stats (15KB)
├── advanced-features.js            # Advanced interactive features (14KB)
├── trial-popup.css                 # Trial registration modal styles (10KB)
├── trial-popup.js                  # Trial system logic (12KB)
├── resume.pdf                      # Your resume (add this file)
└── README.md                       # This file
```

**Total Size**: ~200 KB (uncompressed, excluding images)

---

## 🚀 Quick Start (5 Minutes)

### 1. Download the Files
Save all files to a single folder on your computer.

### 2. Add Your Resume
Place your `resume.pdf` file in the same folder.

### 3. Setup Contact Form
1. Go to [Formspree.io](https://formspree.io) and create a free account
2. Click "New Form" → Name it "Portfolio Contact Form"
3. Copy your form ID (looks like `mrgpvxyz`)
4. Open `script.js` and find line 9:
   ```javascript
   emailServiceURL: 'https://formspree.io/f/YOUR_FORM_ID',
   ```
5. Replace `YOUR_FORM_ID` with your actual ID:
   ```javascript
   emailServiceURL: 'https://formspree.io/f/mrgpvxyz',
   ```

### 4. Open in Browser
Double-click `index.html` or open it in your browser.

**That's it!** Your portfolio is ready to customize.

---

## ⚙️ Personalization (10 Minutes)

### Update Your Information

1. **Open `index.html` in a text editor**

2. **Update Personal Details** (Lines 10-20):
```html
<meta name="description" content="Your description here">
<meta name="author" content="Your Name">
<title>Your Name - Your Title</title>
```

3. **Update Hero Section** (Line ~100):
```html
<h1 class="hero-title">
    Hi, I'm <span class="gradient-text">Your Name</span>
</h1>
```

4. **Update Contact Email** (Line ~1050):
```html
<a href="mailto:your-email@example.com">your-email@example.com</a>
```

5. **Update Social Links** (Footer, Line ~1100):
```html
<a href="https://github.com/your-username">GitHub</a>
<a href="https://linkedin.com/in/your-username">LinkedIn</a>
```

6. **Update GitHub Stats** in `advanced-features.js` (Line 10):
```javascript
githubUsername: 'your-github-username',
```

---

## 📝 Content Customization

### Experience Section

Edit `index.html` starting at line ~200. Each job looks like this:

```html
<div class="timeline-item">
    <div class="timeline-header">
        <h3 class="job-title">Your Job Title</h3>
        <h4 class="company-name">Company Name</h4>
        <span class="timeline-date">Jan 2024 - Present</span>
        <span class="timeline-location">City, Country</span>
    </div>
    <div class="timeline-body">
        <ul class="responsibilities">
            <li>Achievement or responsibility 1</li>
            <li>Achievement or responsibility 2</li>
        </ul>
        <div class="tech-stack">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">JavaScript</span>
        </div>
    </div>
</div>
```

### Skills Section

Update `index.html` starting at line ~400:

```html
<div class="skill-item" data-level="90">
    <span class="skill-name">Your Skill Name</span>
    <div class="skill-bar">
        <div class="skill-progress"></div>
    </div>
</div>
```

**`data-level`**: Set from 0-100 to show your proficiency

### Projects Section

Update `index.html` starting at line ~700:

```html
<div class="project-card" data-category="web">
    <div class="project-content">
        <h3 class="project-title">Project Name</h3>
        <p class="project-description">Brief description...</p>
        <div class="project-tech">
            <span class="tech-tag">Tech 1</span>
            <span class="tech-tag">Tech 2</span>
        </div>
    </div>
    <div class="project-links">
        <a href="https://github.com/..." class="project-link-icon">
            <i class="fab fa-github"></i>
        </a>
        <a href="https://demo.com" class="project-link-icon">
            <i class="fas fa-external-link-alt"></i>
        </a>
    </div>
</div>
```

**Categories**: `web`, `ml`, or `iot` (for filtering)

---

## 🌐 Deployment

### Option 1: Vercel (Easiest - Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Run in your project folder:
   ```bash
   vercel
   ```

3. Follow the prompts - done! ✅

**You get**: Free HTTPS, auto-deployments, custom domain support

### Option 2: Netlify (Drag & Drop)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your entire portfolio folder
3. Wait for deployment - done! ✅

### Option 3: GitHub Pages (Free Hosting)

1. Create a GitHub repository
2. Upload all your files
3. Go to Settings → Pages
4. Select `main` branch → Save
5. Your site is live at `https://username.github.io/repository-name`

---

## 🎨 Theme Customization

### Change Color Scheme

Open `styles.css` and update lines 1-10:

```css
:root {
    --primary-color: #2563eb;      /* Main color - change this */
    --secondary-color: #1e40af;    /* Darker shade */
    --accent-color: #06b6d4;       /* Accent highlights */
}
```

**Try these color schemes:**

**Purple Theme**:
```css
--primary-color: #8b5cf6;
--secondary-color: #7c3aed;
--accent-color: #a78bfa;
```

**Green Theme**:
```css
--primary-color: #10b981;
--secondary-color: #059669;
--accent-color: #34d399;
```

**Orange Theme**:
```css
--primary-color: #f59e0b;
--secondary-color: #d97706;
--accent-color: #fbbf24;
```

---

## 🔧 Features Configuration

### Disable Chatbot Auto-Open

Open `chatbot.js` and comment out lines ~450-452:

```javascript
// if (!localStorage.getItem('chatbotVisited') && window.innerWidth >= 1024) {
//     setTimeout(() => toggleChatbot(), 5000);
// }
```

### Disable Custom Cursor

Open `advanced-features.js` and change line 10:

```javascript
enableCustomCursor: false,  // Changed from true
```

### Update Typing Effect

Open `script.js` and update lines 13-19:

```javascript
const typingTexts = [
    'Your Text 1',
    'Your Text 2',
    'Your Text 3',
    'Your Text 4',
    'Your Text 5'
];
```

---

## ⌨️ Keyboard Shortcuts

Already built-in! Try these:

| Shortcut | Action |
|----------|--------|
| `⌘K` or `Ctrl+K` | Open command palette |
| `?` | Show shortcuts help |
| `D` | Toggle dark mode |
| `C` | Open chatbot |
| `R` | Download resume |
| `T` | Scroll to timeline |
| `J` | Scroll down |
| `K` | Scroll up |
| `G G` | Scroll to top |
| `ESC` | Close modals |

---

## 🐛 Common Issues & Fixes

### Contact Form Not Working

**Problem**: Form doesn't send emails

**Solution**:
1. Check your Formspree form ID in `script.js` line 9
2. Verify you confirmed the email sent by Formspree (first-time setup)
3. Check spam folder for test emails

### Resume Download Doesn't Work

**Problem**: Clicking "Download Resume" does nothing

**Solution**:
1. Make sure `resume.pdf` is in the same folder as `index.html`
2. File name must be exactly `resume.pdf` (lowercase)
3. Try a different browser

### Timeline Not Showing

**Problem**: Experience or Education timeline is blank

**Solution**:
1. Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) to hard reload
2. Open browser console (F12) and check for errors
3. Ensure `timeline.js` loads after `timeline.css`

### Dark Mode Doesn't Switch

**Problem**: Theme toggle doesn't work

**Solution**:
1. Clear browser cache
2. Check browser console for JavaScript errors
3. Try incognito/private mode

---

## 📊 Performance Tips

### Already Optimized ✅
- Lazy loading images
- Debounced scroll events
- GPU-accelerated animations
- Optimized fonts with preconnect
- Efficient DOM queries

### For Production (Optional)

1. **Compress Images**:
   - Use tools like [TinyPNG](https://tinypng.com)
   - Convert to WebP format

2. **Minify CSS/JS**:
   ```bash
   npx minify styles.css > styles.min.css
   npx minify script.js > script.min.js
   ```
   Then update `index.html` to reference `.min.css` and `.min.js`

3. **Enable Browser Caching**:
   - Automatic on Vercel/Netlify
   - For custom servers, add cache headers

---

## 📚 Additional Documentation

Included in your download:

- **FORMSPREE_COMPLETE_GUIDE.md** - Detailed contact form setup
- **ACTION_PLAN.md** - Step-by-step deployment checklist
- **PRIORITY_MATRIX.md** - What to do first
- **BACKEND-SETUP.md** - Optional trial system backend
- **DEPLOYMENT_GUIDE.md** - Full deployment instructions

---

## 🎯 What's Included

### ✅ **Completed Features**
- [x] Glassmorphism design
- [x] Dark/Light mode
- [x] AI Chatbot
- [x] Command Palette
- [x] Keyboard shortcuts
- [x] Timeline visualization
- [x] Trial registration system
- [x] GitHub stats
- [x] Form validation
- [x] Fully responsive
- [x] WCAG AA accessibility

### 📋 **Optional Additions** (Not Included)
- [ ] Blog CMS integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Newsletter signup
- [ ] Advanced SEO tools
- [ ] PWA features

---

## 💡 Tips for Success

1. **Start Simple**: Replace content first, customize design later
2. **Test Everything**: Check on mobile, tablet, and desktop
3. **Use Real Content**: Replace placeholder text with your actual work
4. **Keep It Updated**: Add new projects and skills regularly
5. **Monitor Performance**: Use [PageSpeed Insights](https://pagespeed.web.dev)
6. **Get Feedback**: Share with friends before going live

---

## 🔒 Security Notes

### ✅ Already Secure
- No inline JavaScript
- Input validation on forms
- HTTPS-only external resources
- Secure form submission (Formspree)
- No sensitive data in frontend

### ⚠️ Important
- Never commit API keys to public repositories
- Use environment variables for backend secrets
- Enable HTTPS on deployment (automatic on Vercel/Netlify)

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| IE 11 | - | ⚠️ Limited |

---

## 🎓 Learning Resources

Want to understand how it works?

- **HTML Basics**: [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
- **CSS Flexbox**: [CSS-Tricks Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- **JavaScript**: [JavaScript.info](https://javascript.info)
- **Web Accessibility**: [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 💬 Support & Help

Need assistance?

1. **Check Browser Console** (F12) for errors
2. **Review Documentation** (all `.md` files)
3. **Test in Incognito Mode** (rules out extensions)
4. **Email**: pranav.pankhawala@gmail.com

---

## 🙏 Credits

- **Font Awesome** - Icons
- **Google Fonts** - Inter typeface
- **Formspree** - Contact form backend
- **GitHub** - Stats integration

---

## 📄 License

MIT License - Free to use for personal and commercial projects.

**Please**:
- ⭐ Star the repository if you found it useful
- 📝 Replace all content with your own information
- 🔗 Give credit if you want (optional but appreciated)

---

## 📞 Contact

**Pranav Pankhawala**
- 📧 Email: pranav.pankhawala@gmail.com
- 💼 LinkedIn: [linkedin.com/in/pranavpankhawala](https://linkedin.com/in/pranavpankhawala)
- 🐙 GitHub: [github.com/pranavpankhawala](https://github.com/pranavpankhawala)

---

<div align="center">

**Built with ❤️ and vanilla JavaScript**

No frameworks • Production ready • Easy to customize

[⬆ Back to Top](#-pranav-pankhawala---portfolio-website)

</div>

---

