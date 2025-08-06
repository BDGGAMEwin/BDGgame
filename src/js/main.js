// ===== BDG GAME - Main JavaScript File =====

// ===== Global Variables =====
let currentGameFilter = 'all';
let gamesData = [];
let isLoading = false;

// ===== Game Data =====
const gameCategories = {
    action: '动作',
    strategy: '策略',
    puzzle: '益智',
    sports: '体育',
    adventure: '冒险',
    racing: '竞速'
};

const sampleGames = [
    {
        id: 1,
        title: '王者荣耀',
        description: '5v5英雄公平对战手游，腾讯最受欢迎的MOBA游戏',
        category: 'action',
        rating: 4.8,
        players: '1亿+',
        image: 'game1.jpg'
    },
    {
        id: 2,
        title: '和平精英',
        description: '腾讯光子工作室群自研反恐军事竞赛体验手游',
        category: 'action',
        rating: 4.7,
        players: '5000万+',
        image: 'game2.jpg'
    },
    {
        id: 3,
        title: '原神',
        description: '开放世界冒险游戏，探索奇幻的提瓦特大陆',
        category: 'adventure',
        rating: 4.9,
        players: '2000万+',
        image: 'game3.jpg'
    },
    {
        id: 4,
        title: '英雄联盟手游',
        description: '经典MOBA游戏的移动端版本，5v5竞技对战',
        category: 'action',
        rating: 4.6,
        players: '8000万+',
        image: 'game4.jpg'
    },
    {
        id: 5,
        title: '部落冲突',
        description: '策略塔防游戏，建设村庄，训练军队，征战四方',
        category: 'strategy',
        rating: 4.5,
        players: '1亿+',
        image: 'game5.jpg'
    },
    {
        id: 6,
        title: '糖豆人',
        description: '多人在线竞技游戏，60人大乱斗，最后的胜利者',
        category: 'sports',
        rating: 4.4,
        players: '3000万+',
        image: 'game6.jpg'
    },
    {
        id: 7,
        title: '开心消消乐',
        description: '经典三消益智游戏，轻松休闲，老少皆宜',
        category: 'puzzle',
        rating: 4.3,
        players: '2亿+',
        image: 'game7.jpg'
    },
    {
        id: 8,
        title: 'FIFA Mobile',
        description: '官方授权足球手游，真实球员，精彩赛事',
        category: 'sports',
        rating: 4.2,
        players: '5000万+',
        image: 'game8.jpg'
    },
    {
        id: 9,
        title: '植物大战僵尸',
        description: '经典塔防游戏，用植物保卫家园，抵御僵尸入侵',
        category: 'strategy',
        rating: 4.7,
        players: '1.5亿+',
        image: 'game9.jpg'
    },
    {
        id: 10,
        title: '极品飞车',
        description: '顶级赛车游戏，超跑竞速，街头狂飙',
        category: 'racing',
        rating: 4.6,
        players: '4000万+',
        image: 'game10.jpg'
    }
];

// ===== Utility Functions =====
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (range * easeOutQuart(progress)));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!$('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--dark-card);
                color: var(--text-primary);
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                border-left: 4px solid var(--primary-color);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-success {
                border-left-color: var(--success-color);
            }
            .notification-error {
                border-left-color: var(--error-color);
            }
            .notification-warning {
                border-left-color: var(--warning-color);
            }
        `;
        document.head.appendChild(styles);
    }
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Loading Screen =====
function hideLoadingScreen() {
    const loadingScreen = $('#loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// ===== Navigation =====
function initNavigation() {
    const navToggle = $('#nav-toggle');
    const navMenu = $('#nav-menu');
    const navLinks = $$('.nav-link');
    const header = $('.header');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = $(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
    
    // Update active link on scroll
    const updateActiveLink = throttle(() => {
        const sections = $$('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100);
    
    window.addEventListener('scroll', updateActiveLink);
}

// ===== Hero Section =====
function initHeroSection() {
    const statNumbers = $$('.stat-number[data-count]');
    let animated = false;
    
    const animateStats = () => {
        if (animated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            animateNumber(stat, 0, target, 2000);
        });
        
        animated = true;
    };
    
    // Animate stats when hero section is in view
    const heroSection = $('#home');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroSection);
    }
    
    // Hero action buttons
    const startGamingBtn = $('#start-gaming');
    const learnMoreBtn = $('#learn-more');
    
    if (startGamingBtn) {
        startGamingBtn.addEventListener('click', () => {
            const gamesSection = $('#games');
            if (gamesSection) {
                gamesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const aboutSection = $('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== Games Section =====
function initGamesSection() {
    gamesData = [...sampleGames];
    
    // Filter buttons
    const filterBtns = $$('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setGameFilter(filter);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Load more games button
    const loadMoreBtn = $('#load-more-games');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreGames);
    }
    
    // Initial games load
    renderGames();
}

function setGameFilter(filter) {
    currentGameFilter = filter;
    renderGames();
}

function renderGames() {
    const gamesGrid = $('#games-grid');
    if (!gamesGrid) return;
    
    const filteredGames = currentGameFilter === 'all' 
        ? gamesData 
        : gamesData.filter(game => game.category === currentGameFilter);
    
    gamesGrid.innerHTML = '';
    
    filteredGames.forEach((game, index) => {
        const gameCard = createGameCard(game);
        gameCard.style.animationDelay = `${index * 0.1}s`;
        gamesGrid.appendChild(gameCard);
    });
    
    // Add entrance animation
    setTimeout(() => {
        const gameCards = $$('.game-card');
        gameCards.forEach(card => {
            card.classList.add('animate-fade-in-up');
        });
    }, 100);
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-image" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);">
            <div class="game-overlay">
                <button class="btn btn-primary play-btn" data-game-id="${game.id}">
                    <i class="fas fa-play"></i>
                    立即游戏
                </button>
            </div>
        </div>
        <div class="game-content">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-description">${game.description}</p>
            <div class="game-meta">
                <span class="game-category">${gameCategories[game.category] || game.category}</span>
                <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}</span>
                </div>
            </div>
            <div class="game-stats">
                <div class="game-stat">
                    <i class="fas fa-users"></i>
                    <span>${game.players}</span>
                </div>
            </div>
            <div class="game-actions">
                <button class="btn btn-primary btn-full play-game-btn" data-game-id="${game.id}">
                    <i class="fas fa-gamepad"></i>
                    开始游戏
                </button>
            </div>
        </div>
    `;
    
    // Add play button event listeners
    const playBtns = card.querySelectorAll('.play-btn, .play-game-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.getAttribute('data-game-id');
            playGame(gameId);
        });
    });
    
    return card;
}

function playGame(gameId) {
    const game = gamesData.find(g => g.id == gameId);
    if (game) {
        showNotification(`正在启动 ${game.title}...`, 'info');
        
        // Simulate game loading
        setTimeout(() => {
            showNotification(`${game.title} 启动成功！`, 'success');
        }, 2000);
    }
}

function loadMoreGames() {
    if (isLoading) return;
    
    isLoading = true;
    const loadMoreBtn = $('#load-more-games');
    
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        loadMoreBtn.disabled = true;
    }
    
    // Simulate loading more games
    setTimeout(() => {
        const newGames = [
            {
                id: gamesData.length + 1,
                title: '新游戏 ' + (gamesData.length + 1),
                description: '这是一个新加载的游戏，提供更多精彩内容',
                category: 'action',
                rating: 4.5,
                players: '1000万+',
                image: 'new-game.jpg'
            }
        ];
        
        gamesData.push(...newGames);
        renderGames();
        
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> 加载更多游戏';
            loadMoreBtn.disabled = false;
        }
        
        isLoading = false;
        showNotification('新游戏加载完成！', 'success');
    }, 1500);
}

// ===== Contact Form =====
function initContactForm() {
    const contactForm = $('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validate form
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('消息发送成功！我们会尽快回复您。', 'success');
                contactForm.reset();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTopBtn = $('#back-to-top');
    
    if (backToTopBtn) {
        const handleScroll = throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = $$('.feature-card, .game-card, .about-content, .contact-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== User Authentication (Mock) =====
function initAuth() {
    const loginBtn = $('#login-btn');
    const registerBtn = $('#register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showNotification('登录功能即将上线，敬请期待！', 'info');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            showNotification('注册功能即将上线，敬请期待！', 'info');
        });
    }
}

// ===== Performance Monitoring =====
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Send analytics (mock)
        if (loadTime > 3000) {
            console.warn('Page load time is slow:', loadTime);
        }
    });
    
    // Monitor scroll performance
    let scrollCount = 0;
    const scrollMonitor = throttle(() => {
        scrollCount++;
        if (scrollCount % 100 === 0) {
            console.log(`Scroll events: ${scrollCount}`);
        }
    }, 100);
    
    window.addEventListener('scroll', scrollMonitor);
}

// ===== Error Handling =====
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        showNotification('发生了一个错误，请刷新页面重试', 'error');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        showNotification('网络请求失败，请检查网络连接', 'error');
    });
}

// ===== Keyboard Navigation =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            const navToggle = $('#nav-toggle');
            const navMenu = $('#nav-menu');
            
            if (navMenu?.classList.contains('active')) {
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        }
        
        // Arrow keys for game navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const gameCards = $$('.game-card');
            const focusedCard = document.activeElement.closest('.game-card');
            
            if (focusedCard) {
                const currentIndex = Array.from(gameCards).indexOf(focusedCard);
                let nextIndex;
                
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : gameCards.length - 1;
                } else {
                    nextIndex = currentIndex < gameCards.length - 1 ? currentIndex + 1 : 0;
                }
                
                const nextCard = gameCards[nextIndex];
                const playBtn = nextCard?.querySelector('.play-game-btn');
                playBtn?.focus();
            }
        }
    });
}

// ===== Theme Management =====
function initThemeManagement() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('bdg-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Theme toggle functionality (if needed in future)
    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('bdg-theme', newTheme);
            
            showNotification(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
        });
    }
}

// ===== Analytics (Mock) =====
function initAnalytics() {
    // Track page views
    const trackPageView = () => {
        console.log('Page view tracked:', window.location.pathname);
    };
    
    // Track user interactions
    const trackEvent = (category, action, label) => {
        console.log('Event tracked:', { category, action, label });
    };
    
    // Track button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn')) {
            const btnText = e.target.textContent.trim();
            trackEvent('Button', 'Click', btnText);
        }
    });
    
    trackPageView();
}

// ===== Main Initialization =====
function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    try {
        // Initialize all modules
        initErrorHandling();
        initThemeManagement();
        initNavigation();
        initHeroSection();
        initGamesSection();
        initContactForm();
        initBackToTop();
        initScrollAnimations();
        initAuth();
        initKeyboardNavigation();
        initPerformanceMonitoring();
        initAnalytics();
        
        // Hide loading screen
        hideLoadingScreen();
        
        console.log('BDG GAME website initialized successfully!');
        
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('网站初始化失败，请刷新页面重试', 'error');
    }
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== Start the application =====
init();

// ===== Export functions for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        setGameFilter,
        playGame,
        showNotification,
        isValidEmail
    };
}