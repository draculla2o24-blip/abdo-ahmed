/**
 * عبدو أحمد | الموقع الشخصي
 * Version: 2.2.0
 * Author: Abdou Ahmed
 * تم التحديث: إضافة باقات اشتراك POS وتحسينات عامة
 */

// ========================================
// DOM Elements
// ========================================
const domElements = {
    themeToggle: document.getElementById('themeToggle'),
    scrollTop: document.getElementById('scrollTop'),
    profileImage: document.getElementById('profileImage'),
    navLinks: document.querySelectorAll('nav a'),
    statNumbers: document.querySelectorAll('.stat-number'),
    faqItems: document.querySelectorAll('.faq-item')
};

// ========================================
// Theme Management (Dark/Light Mode)
// ========================================
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light') {
            this.setLightMode();
        } else if (savedTheme === 'dark') {
            this.setDarkMode();
        } else if (!prefersDark) {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }
        
        this.setupToggle();
    },
    
    setLightMode() {
        document.body.classList.add('light-mode');
        const icon = domElements.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
        localStorage.setItem('theme', 'light');
    },
    
    setDarkMode() {
        document.body.classList.remove('light-mode');
        const icon = domElements.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-moon';
        }
        localStorage.setItem('theme', 'dark');
    },
    
    setupToggle() {
        domElements.themeToggle?.addEventListener('click', () => {
            const isLightMode = document.body.classList.contains('light-mode');
            if (isLightMode) {
                this.setDarkMode();
            } else {
                this.setLightMode();
            }
        });
    }
};

// ========================================
// Scroll to Top
// ========================================
const ScrollManager = {
    init() {
        this.setupScrollListener();
        this.setupClickHandler();
    },
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                domElements.scrollTop?.classList.add('show');
            } else {
                domElements.scrollTop?.classList.remove('show');
            }
        });
    },
    
    setupClickHandler() {
        domElements.scrollTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// ========================================
// Active Navigation Link (Scroll Spy)
// ========================================
const NavigationManager = {
    init() {
        this.setupScrollSpy();
        this.setupClickListener();
    },
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveLink(id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    },
    
    setActiveLink(currentId) {
        domElements.navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },
    
    setupClickListener() {
        domElements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
};

// ========================================
// Animated Statistics
// ========================================
const StatsManager = {
    init() {
        this.setupObserver();
    },
    
    setupObserver() {
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumbers();
                    observer.disconnect();
                }
            });
        }, observerOptions);
        
        observer.observe(statsSection);
    },
    
    animateNumbers() {
        const numbers = document.querySelectorAll('.hero-stat-number');
        numbers.forEach(stat => {
            const text = stat.innerText;
            const target = parseInt(text);
            if (target && !stat.hasAttribute('data-animated')) {
                let current = 0;
                const increment = target / 40;
                
                const updateNumber = () => {
                    if (current < target) {
                        current += increment;
                        let displayValue = Math.floor(current);
                        if (text.includes('+')) {
                            stat.innerText = displayValue + '+';
                        } else if (text.includes('%')) {
                            stat.innerText = displayValue + '%';
                        } else {
                            stat.innerText = displayValue;
                        }
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.innerText = text;
                        stat.setAttribute('data-animated', 'true');
                    }
                };
                
                setTimeout(updateNumber, 100);
            }
        });
    }
};

// ========================================
// FAQ Accordion
// ========================================
const FAQManager = {
    init() {
        domElements.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');
                    // إغلاق جميع الأسئلة الأخرى
                    domElements.faqItems.forEach(i => i.classList.remove('open'));
                    if (!isOpen) item.classList.add('open');
                });
            }
        });
    }
};

// ========================================
// Order Form Handler (محدث لدعم باقات POS)
// ========================================
const OrderFormManager = {
    init() {
        this.setupOrderForm();
        this.setupQuickContactForm();
        this.setupProjectTypePresets();
        this.setupPOSPackagePresets();
    },
    
    setupOrderForm() {
        const form = document.getElementById('serviceOrderForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName')?.value;
            const phone = document.getElementById('phone')?.value;
            
            if (!fullName || !phone) {
                this.showNotification('يرجى إدخال الاسم ورقم الهاتف', 'error');
                return;
            }
            
            const formData = {
                fullName: fullName,
                phone: phone,
                email: document.getElementById('email')?.value || 'غير مدخل',
                projectType: document.getElementById('projectType')?.value || 'غير محدد',
                budget: document.getElementById('budget')?.value || 'غير محدد',
                timeline: document.getElementById('timeline')?.value || 'غير محدد',
                message: document.getElementById('message')?.value || 'لا توجد تفاصيل',
                timestamp: new Date().toLocaleString('ar-EG')
            };
            
            const whatsappMessage = this.formatWhatsAppMessage(formData);
            const whatsappUrl = `https://wa.me/201150603363?text=${encodeURIComponent(whatsappMessage)}`;
            
            this.showNotification('جاري تحويلك إلى واتساب لإكمال الطلب...');
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1000);
            
            form.reset();
        });
    },
    
    formatWhatsAppMessage(data) {
        return `*طلب خدمة جديد من الموقع*
        
*الاسم:* ${data.fullName}
*الهاتف:* ${data.phone}
*البريد:* ${data.email}

*نوع المشروع:* ${data.projectType}
*الميزانية:* ${data.budget}
*الفترة:* ${data.timeline}

*تفاصيل إضافية:*
${data.message}

*تم الإرسال:* ${data.timestamp}`;
    },
    
    setupQuickContactForm() {
        const form = document.getElementById('quickContactForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('input[placeholder="اسمك"]')?.value;
            const phone = form.querySelector('input[placeholder="رقم هاتفك"]')?.value;
            const message = form.querySelector('textarea')?.value;
            
            if (!name || !phone) {
                this.showNotification('يرجى إدخال الاسم ورقم الهاتف', 'error');
                return;
            }
            
            const whatsappMsg = `مرحباً عبدو،

الاسم: ${name}
الهاتف: ${phone}

الرسالة: ${message || 'لا توجد رسالة'}`;
            
            window.open(`https://wa.me/201150603363?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
            this.showNotification('تم الإرسال! سيتم تحويلك إلى واتساب');
            form.reset();
        });
    },
    
    setupProjectTypePresets() {
        window.setProjectType = (type) => {
            const select = document.getElementById('projectType');
            if (select) {
                select.value = type;
                const orderForm = document.getElementById('order-form');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const phoneInput = document.getElementById('phone');
                        if (phoneInput) phoneInput.focus();
                    }, 500);
                }
            }
        };
        
        window.setPackageBasic = () => {
            const select = document.getElementById('projectType');
            if (select) {
                select.value = 'باقة أساسية - 5000 جنيه';
                const budgetSelect = document.getElementById('budget');
                if (budgetSelect) budgetSelect.value = '5000 - 10000 جنيه';
                const orderForm = document.getElementById('order-form');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth' });
                }
                this.showNotification('تم اختيار الباقة الأساسية', 'success');
            }
        };
        
        window.setPackageProfessional = () => {
            const select = document.getElementById('projectType');
            if (select) {
                select.value = 'باقة احترافية - 12000 جنيه';
                const budgetSelect = document.getElementById('budget');
                if (budgetSelect) budgetSelect.value = '10000 - 15000 جنيه';
                const orderForm = document.getElementById('order-form');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth' });
                }
                this.showNotification('تم اختيار الباقة الاحترافية', 'success');
            }
        };
        
        window.setPackagePremium = () => {
            const select = document.getElementById('projectType');
            if (select) {
                select.value = 'باقة متكاملة - 3000 جنيه';
                const budgetSelect = document.getElementById('budget');
                if (budgetSelect) budgetSelect.value = '3000 - 5000 جنيه';
                const orderForm = document.getElementById('order-form');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth' });
                }
                this.showNotification('تم اختيار الباقة المتكاملة', 'success');
            }
        };
    },
    
    // إضافة وظائف باقات POS الجديدة
    setupPOSPackagePresets() {
        window.setPOSPackage = (period, price) => {
            const select = document.getElementById('projectType');
            if (select) {
                let packageText = '';
                switch(period) {
                    case 'شهري':
                        packageText = `POS اشتراك شهري - ${price} جنيه/شهر`;
                        break;
                    case '3 شهور':
                        packageText = `POS اشتراك 3 شهور - ${price} جنيه`;
                        break;
                    case 'سنوي':
                        packageText = `POS اشتراك سنوي - ${price} جنيه`;
                        break;
                    default:
                        packageText = `POS اشتراك ${period} - ${price} جنيه`;
                }
                select.value = packageText;
                
                // تعيين الميزانية المناسبة
                const budgetSelect = document.getElementById('budget');
                if (budgetSelect) {
                    if (price <= 3000) budgetSelect.value = 'أقل من 3000 جنيه';
                    else if (price <= 5000) budgetSelect.value = '3000 - 5000 جنيه';
                    else if (price <= 10000) budgetSelect.value = '5000 - 10000 جنيه';
                    else if (price <= 15000) budgetSelect.value = '10000 - 15000 جنيه';
                    else budgetSelect.value = 'أكثر من 15000 جنيه';
                }
                
                const orderForm = document.getElementById('order-form');
                if (orderForm) {
                    orderForm.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const messageField = document.getElementById('message');
                        if (messageField) {
                            messageField.focus();
                            messageField.placeholder = `أود الاشتراك في الباقة ${period} لنظام POS...`;
                        }
                    }, 500);
                }
                this.showNotification(`تم اختيار اشتراك POS (${period})`, 'success');
            }
        };
    },
    
    showNotification(message, type = 'success') {
        // إزالة الإشعارات السابقة
        const oldNotifications = document.querySelectorAll('.custom-notification');
        oldNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        const bgColor = type === 'error' ? '#ff4444' : '#25D366';
        const icon = type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle';
        
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            z-index: 2000;
            animation: fadeInOut 3s ease;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            font-family: 'Cairo', sans-serif;
            direction: rtl;
        `;
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification && notification.remove) {
                notification.remove();
            }
        }, 3000);
    }
};

// ========================================
// Intersection Observer for Cards Animation
// ========================================
const AnimationManager = {
    init() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        this.animateElementsOnScroll();
    },
    
    animateElementsOnScroll() {
        const elements = document.querySelectorAll('.why-me-card, .service-card, .project-card, .pricing-card, .pos-card, .testimonial-card, .faq-item');
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(el => observer.observe(el));
    }
};

// ========================================
// Image Handler
// ========================================
const ImageManager = {
    init() {
        console.log('✅ ImageManager: تم تحميل الصور بنجاح');
    }
};

// ========================================
// Smooth Scroll for All Anchor Links
// ========================================
const SmoothScrollManager = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '' && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
};

// ========================================
// Lead Conversion Tracking (محدث)
// ========================================
const LeadManager = {
    init() {
        this.trackCTAClicks();
        this.trackWhatsAppClicks();
        this.trackFormViews();
        this.trackPhoneNumbers();
        this.trackPOSPackageClicks();
    },
    
    trackCTAClicks() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-whatsapp, .btn-outline, .btn');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('📊 CTA Clicked:', btn.innerText.trim());
            });
        });
    },
    
    trackWhatsAppClicks() {
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('📊 WhatsApp Clicked - Lead Generated');
            });
        });
    },
    
    trackFormViews() {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('📊 Order Form Viewed - High Intent');
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(orderForm);
        }
    },
    
    trackPhoneNumbers() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('📊 Phone Number Clicked');
            });
        });
    },
    
    // تتبع نقرات باقات POS الجديدة
    trackPOSPackageClicks() {
        const posCards = document.querySelectorAll('.pos-card .btn-primary');
        posCards.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.pos-card');
                const planName = card?.querySelector('h3')?.innerText || 'POS Package';
                console.log('📊 POS Package Selected:', planName);
            });
        });
    }
};

// ========================================
// Pricing Cards Animation (محدث لدعم POS)
// ========================================
const PricingManager = {
    init() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        const cards = document.querySelectorAll('.pricing-card, .pos-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }
};

// ========================================
// POS Subscription Table Hover Effects
// ========================================
const POSTableManager = {
    init() {
        const tableRows = document.querySelectorAll('.comparison-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(255, 106, 0, 0.05)';
                row.style.transition = 'background-color 0.3s ease';
            });
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    }
};

// ========================================
// Performance Monitoring
// ========================================
const PerformanceManager = {
    init() {
        if (typeof window.performance !== 'undefined') {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page Load Time: ${loadTime}ms`);
        }
    }
};

// ========================================
// Console Welcome Message (محدث)
// ========================================
const ConsoleManager = {
    init() {
        console.log('%c✨ عبدو أحمد | مطور ويب محترف ✨', 'color: #ff6a00; font-size: 18px; font-weight: bold;');
        console.log('%c📞 للتواصل: 01150603363', 'color: #25D366; font-size: 14px;');
        console.log('%c📧 البريد: draculla2o24@gmail.com', 'color: #ff6a00; font-size: 14px;');
        console.log('%c🌐 فيسبوك: https://www.facebook.com/share/1aT5wHPW2S/', 'color: #1877f2; font-size: 14px;');
        console.log('%c💰 باقات POS: شهري (1200ج) | 3 شهور (3000ج) | سنوي (10000ج)', 'color: #ff6a00; font-size: 12px;');
        console.log('%c⚡ الموقع جاهز للتحويل وجذب العملاء | Version 2.2.0', 'color: #ff6a00; font-size: 12px;');
        console.log('%c✅ تمت إضافة باقات اشتراك POS بنجاح', 'color: #00ff00; font-size: 12px;');
    }
};

// ========================================
// Service Worker for PWA
// ========================================
const PWAManager = {
    init() {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                console.log('📱 Service Worker registered:', reg);
            }).catch(err => {
                console.log('❌ Service Worker registration failed:', err);
            });
        }
    }
};

// ========================================
// Initialize All Modules
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 جاري تحميل الموقع...');
    
    ThemeManager.init();
    ScrollManager.init();
    NavigationManager.init();
    StatsManager.init();
    FAQManager.init();
    OrderFormManager.init();
    AnimationManager.init();
    ImageManager.init();
    SmoothScrollManager.init();
    LeadManager.init();
    PricingManager.init();
    POSTableManager.init();
    PerformanceManager.init();
    ConsoleManager.init();
    // PWAManager.init(); // فعّل عند إضافة sw.js
    
    console.log('✅ الموقع جاهز بالكامل!');
    console.log('✅ باقات POS (شهري، 3 شهور، سنوي) تمت إضافتها بنجاح!');
});

// إضافة تأثير fadeInOut للرسائل
if (!document.querySelector('#fadeInOutStyle')) {
    const style = document.createElement('style');
    style.id = 'fadeInOutStyle';
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        
        /* تحسينات جدول المقارنة */
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .comparison-table th,
        .comparison-table td {
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .comparison-table th {
            background: linear-gradient(135deg, #ff6a00, #ff8c00);
            color: white;
            font-weight: bold;
        }
        
        .comparison-table td:first-child {
            text-align: right;
            font-weight: bold;
            background-color: rgba(255, 106, 0, 0.05);
        }
        
        /* تحسينات بطاقات POS */
        .pos-card .plan-icon {
            font-size: 48px;
            color: #ff6a00;
            margin-bottom: 15px;
        }
        
        .pos-note {
            background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
            padding: 15px 20px;
            border-radius: 12px;
            margin-top: 30px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .pos-note i {
            font-size: 24px;
            color: #2e7d32;
        }
        
        .pos-note p {
            margin: 0;
            color: #1b5e20;
        }
        
        .subscription-comparison {
            margin-top: 40px;
            padding: 20px;
            background: rgba(255,255,255,0.5);
            border-radius: 20px;
        }
        
        .subscription-comparison h3 {
            text-align: center;
            margin-bottom: 20px;
            color: #ff6a00;
        }
        
        .comparison-table-wrapper {
            overflow-x: auto;
        }
        
        @media (max-width: 768px) {
            .comparison-table th,
            .comparison-table td {
                padding: 10px 5px;
                font-size: 12px;
            }
            
            .pos-note {
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
}