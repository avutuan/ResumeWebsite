// Advanced animations and visual effects
class AnimationManager {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.initScrollTriggers();
        this.initHoverEffects();
        this.initTextAnimations();
    }

    // Enhanced particle system
    createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particleContainer);

        // Create floating particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }

        // Create interactive particles on mouse move
        hero.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.8) {
                this.createInteractiveParticle(e, particleContainer);
            }
        });
    }

    createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 1;
        const animationDuration = Math.random() * 3 + 2;
        const opacity = Math.random() * 0.5 + 0.2;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${opacity});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${animationDuration}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (animationDuration + 2) * 1000);
    }

    createInteractiveParticle(event, container) {
        const particle = document.createElement('div');
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: pulseParticle 1s ease-out forwards;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    // Scroll-triggered animations
    initScrollTriggers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe different element types
        document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
        document.querySelectorAll('.project-card').forEach(el => observer.observe(el));
        document.querySelectorAll('.highlight-item').forEach(el => observer.observe(el));
        document.querySelectorAll('.contact-item').forEach(el => observer.observe(el));
    }

    triggerElementAnimation(element) {
        if (element.classList.contains('skill-category')) {
            this.animateSkillCategory(element);
        } else if (element.classList.contains('project-card')) {
            this.animateProjectCard(element);
        } else if (element.classList.contains('contact-item')) {
            this.animateContactItem(element);
        }
        
        element.classList.add('animate');
    }

    animateSkillCategory(element) {
        const skillItems = element.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1)';
                item.style.opacity = '1';
            }, index * 100);
        });
    }

    animateProjectCard(element) {
        element.style.animation = 'slideInUp 0.6s ease-out forwards';
        
        // Animate project tech tags
        const techTags = element.querySelectorAll('.project-tech span');
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(0)';
                tag.style.opacity = '1';
            }, 300 + (index * 50));
        });
    }

    animateContactItem(element) {
        element.style.animation = 'bounceIn 0.6s ease-out forwards';
    }

    // Hover effects
    initHoverEffects() {
        // Skill items hover effect
        document.querySelectorAll('.skill-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createSkillParticle(item);
            });
        });

        // Project cards 3D effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.apply3DEffect(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRipple(e, btn);
            });
        });
    }

    createSkillParticle(skillItem) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: skillParticle 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        skillItem.style.position = 'relative';
        skillItem.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 600);
    }

    apply3DEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    }

    createRipple(event, button) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Text animations
    initTextAnimations() {
        this.animateCounters();
        this.initTypeWriter();
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCountAnimation(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    startCountAnimation(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    initTypeWriter() {
        const typeWriterElements = document.querySelectorAll('[data-typewriter]');
        typeWriterElements.forEach(element => {
            const text = element.getAttribute('data-typewriter');
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            this.typeWriter(element, text, speed);
        });
    }

    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
}

// CSS animations (add to components.css)
const animationStyles = `
@keyframes floatParticle {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-20px) translateX(10px); }
    50% { transform: translateY(-10px) translateX(-5px); }
    75% { transform: translateY(-30px) translateX(15px); }
}

@keyframes pulseParticle {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
}

@keyframes slideInUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes skillParticle {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -200%) scale(1); opacity: 0; }
}

@keyframes ripple {
    to { transform: scale(2); opacity: 0; }
}

.skill-item {
    transform: scale(0.8);
    opacity: 0;
    transition: all 0.3s ease;
}

.project-tech span {
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});

// Export for use in other files
window.AnimationManager = AnimationManager;
