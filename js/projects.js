// Project management and filtering functionality
class ProjectManager {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.currentSort = 'recent';
        this.init();
    }

    init() {
        this.loadProjects();
        this.initFilters();
        this.initModal();
        this.initLazyLoading();
        this.initSearch();
    }

    // Sample projects data (replace with your actual projects)
    loadProjects() {
        this.projects = [
            {
                id: 1,
                title: "E-Commerce Platform",
                description: "A full-stack e-commerce solution with React and Node.js",
                longDescription: "Complete e-commerce platform featuring user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Built with modern technologies and best practices.",
                image: "images/projects/ecommerce.jpg",
                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                category: "fullstack",
                demoUrl: "https://demo.example.com",
                githubUrl: "https://github.com/yourusername/ecommerce",
                date: "2024-12-01",
                featured: true,
                status: "completed"
            },
            {
                id: 2,
                title: "Task Management App",
                description: "React-based task management application with drag-and-drop functionality",
                longDescription: "Intuitive task management application with features like drag-and-drop task organization, team collaboration, real-time updates, and detailed analytics.",
                image: "images/projects/taskmanager.jpg",
                technologies: ["React", "TypeScript", "Firebase"],
                category: "frontend",
                demoUrl: "https://tasks.example.com",
                githubUrl: "https://github.com/yourusername/taskmanager",
                date: "2024-11-15",
                featured: true,
                status: "completed"
            },
            {
                id: 3,
                title: "Weather Dashboard",
                description: "Weather forecasting dashboard with interactive maps",
                longDescription: "Comprehensive weather dashboard providing real-time weather data, 7-day forecasts, interactive maps, and severe weather alerts for multiple locations.",
                image: "images/projects/weather.jpg",
                technologies: ["JavaScript", "API Integration", "Chart.js"],
                category: "frontend",
                demoUrl: "https://weather.example.com",
                githubUrl: "https://github.com/yourusername/weather",
                date: "2024-10-20",
                featured: false,
                status: "completed"
            },
            {
                id: 4,
                title: "Blog CMS",
                description: "Content management system for bloggers and content creators",
                longDescription: "Feature-rich content management system with WYSIWYG editor, media management, SEO optimization, user roles, and analytics dashboard.",
                image: "images/projects/cms.jpg",
                technologies: ["PHP", "MySQL", "JavaScript"],
                category: "backend",
                demoUrl: "https://cms.example.com",
                githubUrl: "https://github.com/yourusername/cms",
                date: "2024-09-10",
                featured: false,
                status: "completed"
            },
            {
                id: 5,
                title: "AI Chat Assistant",
                description: "Intelligent chatbot using natural language processing",
                longDescription: "Advanced chatbot application utilizing machine learning and NLP to provide intelligent responses, context awareness, and multi-language support.",
                image: "images/projects/chatbot.jpg",
                technologies: ["Python", "TensorFlow", "Flask"],
                category: "ai",
                demoUrl: "https://chat.example.com",
                githubUrl: "https://github.com/yourusername/chatbot",
                date: "2024-08-25",
                featured: true,
                status: "in-progress"
            }
        ];
        
        this.renderProjects();
    }

    renderProjects(projectsToRender = this.projects) {
        const container = document.querySelector('.projects-grid');
        if (!container) return;

        // Filter and sort projects
        let filteredProjects = this.filterProjects(projectsToRender);
        filteredProjects = this.sortProjects(filteredProjects);

        container.innerHTML = '';

        if (filteredProjects.length === 0) {
            container.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        filteredProjects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            container.appendChild(projectCard);
        });

        // Trigger animations
        this.animateProjectCards();
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.style.animationDelay = `${index * 0.1}s`;

        const statusClass = project.status === 'in-progress' ? 'status-progress' : 'status-completed';
        const featuredClass = project.featured ? 'featured' : '';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-small btn-primary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                        <a href="${project.githubUrl}" class="btn btn-small btn-secondary" target="_blank">
                            <i class="fab fa-github"></i> Code
                        </a>
                        <button class="btn btn-small btn-info" onclick="projectManager.openModal(${project.id})">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                </div>
                ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
                <div class="status-badge ${statusClass}">${project.status.replace('-', ' ')}</div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-meta">
                    <span class="project-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(project.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        `;

        return card;
    }

    initFilters() {
        // Create filter buttons if they don't exist
        this.createFilterButtons();
        this.createSortOptions();

        // Add event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setFilter(filter);
            });
        });

        document.querySelector('.sort-select')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderProjects();
        });
    }

    createFilterButtons() {
        const filtersContainer = document.querySelector('.project-filters');
        if (!filtersContainer) {
            // Create filters if they don't exist
            const projectsSection = document.querySelector('.projects .container');
            const filtersDiv = document.createElement('div');
            filtersDiv.className = 'project-filters';
            filtersDiv.innerHTML = `
                <div class="filter-controls">
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All Projects</button>
                        <button class="filter-btn" data-filter="frontend">Frontend</button>
                        <button class="filter-btn" data-filter="backend">Backend</button>
                        <button class="filter-btn" data-filter="fullstack">Full Stack</button>
                        <button class="filter-btn" data-filter="ai">AI/ML</button>
                    </div>
                    <div class="sort-controls">
                        <select class="sort-select">
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">A-Z</option>
                            <option value="featured">Featured First</option>
                        </select>
                    </div>
                </div>
            `;
            
            const title = projectsSection.querySelector('.section-title');
            title.insertAdjacentElement('afterend', filtersDiv);
        }
    }

    createSortOptions() {
        // Already handled in createFilterButtons
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });

        this.renderProjects();
    }

    filterProjects(projects) {
        if (this.currentFilter === 'all') return projects;
        return projects.filter(project => project.category === this.currentFilter);
    }

    sortProjects(projects) {
        switch (this.currentSort) {
            case 'recent':
                return projects.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return projects.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'alphabetical':
                return projects.sort((a, b) => a.title.localeCompare(b.title));
            case 'featured':
                return projects.sort((a, b) => b.featured - a.featured);
            default:
                return projects;
        }
    }

    initSearch() {
        // Create search input if it doesn't exist
        const filtersContainer = document.querySelector('.project-filters');
        if (filtersContainer && !document.querySelector('.project-search')) {
            const searchDiv = document.createElement('div');
            searchDiv.className = 'project-search';
            searchDiv.innerHTML = `
                <div class="search-input-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" class="search-input" placeholder="Search projects...">
                    <button class="search-clear" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            filtersContainer.appendChild(searchDiv);

            const searchInput = searchDiv.querySelector('.search-input');
            const clearBtn = searchDiv.querySelector('.search-clear');

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                clearBtn.style.display = query ? 'block' : 'none';
                this.searchProjects(query);
            });

            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearBtn.style.display = 'none';
                this.renderProjects();
            });
        }
    }

    searchProjects(query) {
        const filtered = this.projects.filter(project => 
            project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.technologies.some(tech => tech.toLowerCase().includes(query))
        );
        this.renderProjects(filtered);
    }

    initModal() {
        // Create modal if it doesn't exist
        if (!document.querySelector('.project-modal')) {
            const modal = document.createElement('div');
            modal.className = 'project-modal';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body">
                        <!-- Content will be populated dynamically -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add event listeners
            modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
            modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
        }
    }

    openModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.querySelector('.project-modal');
        const modalBody = modal.querySelector('.modal-body');

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${project.image}" alt="${project.title}" class="modal-image">
                <div class="modal-title-section">
                    <h2>${project.title}</h2>
                    <div class="modal-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-description">
                <h3>About This Project</h3>
                <p>${project.longDescription}</p>
            </div>
            <div class="modal-links">
                ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> View Live Demo
                </a>` : ''}
                <a href="${project.githubUrl}" class="btn btn-secondary" target="_blank">
                    <i class="fab fa-github"></i> View Source Code
                </a>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.querySelector('.project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    initLazyLoading() {
        // Intersection Observer for lazy loading images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
    }

    // Public method to add new projects
    addProject(project) {
        project.id = this.projects.length + 1;
        this.projects.push(project);
        this.renderProjects();
    }

    // Public method to update project
    updateProject(projectId, updates) {
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
            this.projects[projectIndex] = { ...this.projects[projectIndex], ...updates };
            this.renderProjects();
        }
    }
}

// Initialize project manager
let projectManager;
document.addEventListener('DOMContentLoaded', () => {
    projectManager = new ProjectManager();
});

// Export for global use
window.projectManager = projectManager;
