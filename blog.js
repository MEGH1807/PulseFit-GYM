/**
 * BLOG SYSTEM - PulseFit Center
 * Features: Search, filter, pagination, SEO optimization, 
 * newsletter subscription, and social sharing
 */

// ============================================
// STATE MANAGEMENT
// ============================================
const blogState = {
    allPosts: [],
    displayedPosts: [],
    currentPage: 1,
    postsPerPage: 9,
    currentFilter: 'all',
    currentSort: 'newest',
    searchQuery: ''
};

// ============================================
// SAMPLE BLOG DATA (CMS-Ready Structure)
// ============================================
const blogPosts = [
    {
        id: 1,
        title: '10 Essential Exercises for Building Muscle Mass',
        slug: '10-essential-exercises-building-muscle-mass',
        excerpt: 'Discover the fundamental exercises that form the foundation of any effective muscle-building program. From compound movements to isolation exercises.',
        content: `
            <p>Building muscle mass requires a strategic approach to your workout routine. These 10 essential exercises will help you maximize your gains and build a well-rounded physique.</p>
            
            <h2>1. Barbell Squats</h2>
            <p>The king of all exercises, squats work your entire lower body and core. They're essential for building powerful legs and a strong foundation.</p>
            
            <h2>2. Deadlifts</h2>
            <p>Deadlifts engage more muscle groups than any other exercise. They're crucial for developing back, leg, and grip strength.</p>
            
            <h2>3. Bench Press</h2>
            <p>The classic chest builder. Bench press is fundamental for upper body development and overall pushing strength.</p>
            
            <p>Continue with proper form, progressive overload, and consistency to see remarkable results in your muscle-building journey.</p>
        `,
        category: 'workout',
        author: {
            name: 'Mike Chen',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        },
        date: '2024-10-20',
        readTime: 8,
        views: 1542,
        likes: 234,
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
        tags: ['Strength Training', 'Muscle Building', 'Workout Guide'],
        featured: true,
        metaDescription: 'Learn the 10 most essential exercises for building muscle mass effectively and safely'
    },
    {
        id: 2,
        title: 'Complete Guide to Nutrition for Fitness Success',
        slug: 'complete-guide-nutrition-fitness-success',
        excerpt: 'Master the fundamentals of nutrition to fuel your workouts and achieve your fitness goals faster.',
        content: '<p>Proper nutrition is 70% of your fitness success...</p>',
        category: 'nutrition',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
        },
        date: '2024-10-18',
        readTime: 12,
        views: 2103,
        likes: 412,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
        tags: ['Nutrition', 'Diet', 'Meal Planning'],
        featured: false,
        metaDescription: 'Complete guide to nutrition for achieving your fitness goals'
    },
    {
        id: 3,
        title: 'HIIT vs. Steady Cardio: Which Burns More Fat?',
        slug: 'hiit-vs-steady-cardio-burns-more-fat',
        excerpt: 'Compare the effectiveness of high-intensity interval training versus traditional steady-state cardio for fat loss.',
        content: '<p>The debate continues: HIIT or steady cardio for fat loss?...</p>',
        category: 'tips',
        author: {
            name: 'David Lee',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        },
        date: '2024-10-15',
        readTime: 6,
        views: 1876,
        likes: 298,
        image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=600&fit=crop',
        tags: ['Cardio', 'Fat Loss', 'HIIT'],
        featured: false,
        metaDescription: 'Scientific comparison of HIIT vs steady cardio for fat loss'
    },
    {
        id: 4,
        title: 'New State-of-the-Art Equipment Arrives at PulseFit',
        slug: 'new-equipment-arrives-pulsefit',
        excerpt: 'We\'re excited to announce the arrival of cutting-edge fitness equipment that will revolutionize your workout experience.',
        content: '<p>PulseFit Center continues to invest in the best equipment...</p>',
        category: 'news',
        author: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
        },
        date: '2024-10-22',
        readTime: 4,
        views: 987,
        likes: 156,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
        tags: ['Gym News', 'Equipment', 'Updates'],
        featured: false,
        metaDescription: 'PulseFit Center unveils new state-of-the-art fitness equipment'
    },
    {
        id: 5,
        title: '5 Morning Habits of Highly Fit People',
        slug: '5-morning-habits-highly-fit-people',
        excerpt: 'Learn the daily morning routines that separate fitness champions from the rest. Start your day right!',
        content: '<p>Success leaves clues. These morning habits are common among the fittest people...</p>',
        category: 'motivation',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
        },
        date: '2024-10-12',
        readTime: 5,
        views: 2341,
        likes: 523,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
        tags: ['Motivation', 'Habits', 'Lifestyle'],
        featured: false,
        metaDescription: 'Discover the morning habits that successful fitness enthusiasts follow'
    },
    {
        id: 6,
        title: 'Proper Form Guide: Avoiding Common Gym Injuries',
        slug: 'proper-form-guide-avoiding-gym-injuries',
        excerpt: 'Prevent injuries and maximize results by mastering proper exercise form. Your comprehensive safety guide.',
        content: '<p>Injury prevention starts with proper form. Here\'s everything you need to know...</p>',
        category: 'tips',
        author: {
            name: 'Mike Chen',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        },
        date: '2024-10-10',
        readTime: 10,
        views: 1654,
        likes: 287,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
        tags: ['Safety', 'Form', 'Injury Prevention'],
        featured: false,
        metaDescription: 'Learn proper exercise form to prevent injuries and maximize results'
    },
    {
        id: 7,
        title: 'Pre-Workout Nutrition: What to Eat and When',
        slug: 'pre-workout-nutrition-what-eat-when',
        excerpt: 'Optimize your workout performance with the right pre-workout nutrition strategy. Timing is everything!',
        content: '<p>What you eat before training can make or break your workout...</p>',
        category: 'nutrition',
        author: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
        },
        date: '2024-10-08',
        readTime: 7,
        views: 1923,
        likes: 356,
        image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&h=600&fit=crop',
        tags: ['Nutrition', 'Pre-Workout', 'Performance'],
        featured: false,
        metaDescription: 'Complete guide to pre-workout nutrition for optimal performance'
    },
    {
        id: 8,
        title: 'Full Body Workout for Beginners: Complete Program',
        slug: 'full-body-workout-beginners-complete-program',
        excerpt: 'Start your fitness journey with this comprehensive full-body workout designed specifically for beginners.',
        content: '<p>New to the gym? This beginner-friendly program will get you started...</p>',
        category: 'workout',
        author: {
            name: 'David Lee',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        },
        date: '2024-10-05',
        readTime: 9,
        views: 2567,
        likes: 478,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
        tags: ['Beginner', 'Full Body', 'Workout Program'],
        featured: false,
        metaDescription: 'Complete full-body workout program designed for beginners'
    },
    {
        id: 9,
        title: 'Mental Strength: The Hidden Key to Fitness Success',
        slug: 'mental-strength-hidden-key-fitness-success',
        excerpt: 'Physical strength starts in the mind. Develop the mental toughness needed to crush your fitness goals.',
        content: '<p>Your mind is your most powerful muscle. Learn to train it...</p>',
        category: 'motivation',
        author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
        },
        date: '2024-10-02',
        readTime: 6,
        views: 1432,
        likes: 289,
        image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=600&fit=crop',
        tags: ['Motivation', 'Mental Health', 'Mindset'],
        featured: false,
        metaDescription: 'Develop mental strength for achieving your fitness goals'
    },
    {
        id: 10,
        title: 'Recovery Essentials: Rest Days Done Right',
        slug: 'recovery-essentials-rest-days-done-right',
        excerpt: 'Maximize your gains by mastering the art of recovery. Learn why rest days are just as important as training days.',
        content: '<p>Rest and recovery are where the magic happens...</p>',
        category: 'tips',
        author: {
            name: 'Mike Chen',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        },
        date: '2024-09-28',
        readTime: 8,
        views: 1789,
        likes: 312,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
        tags: ['Recovery', 'Rest Days', 'Training'],
        featured: false,
        metaDescription: 'Essential guide to rest and recovery for optimal fitness results'
    }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initBlog();
    setupEventListeners();
});

function initBlog() {
    blogState.allPosts = blogPosts;
    blogState.displayedPosts = blogPosts;
    
    renderFeaturedPost();
    renderBlogGrid();
    updateLoadMoreButton();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filters
    document.getElementById('categoryFilter')?.addEventListener('change', handleCategoryFilter);
    document.getElementById('sortFilter')?.addEventListener('change', handleSort);

    // Load More
    document.getElementById('loadMoreBtn')?.addEventListener('click', loadMorePosts);

    // Newsletter
    document.getElementById('newsletterForm')?.addEventListener('submit', handleNewsletterSubmit);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('articleModal');
        if (e.target === modal) {
            closeArticle();
        }
    });

    // Keyboard accessibility for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('articleModal');
            if (modal && !modal.hidden) {
                closeArticle();
            }
        }
    });
}

// ============================================
// FEATURED POST
// ============================================
function renderFeaturedPost() {
    const featuredPost = blogState.allPosts.find(post => post.featured);
    if (!featuredPost) return;

    const container = document.getElementById('featuredPost');
    container.innerHTML = `
        <div class="featured-post-content">
            <div class="featured-post-image">
                <img src="${featuredPost.image}" alt="${featuredPost.title}" loading="eager">
                <span class="featured-badge">Featured</span>
            </div>
            <div class="featured-post-text">
                <span class="post-category">${featuredPost.category}</span>
                <h2>${featuredPost.title}</h2>
                <div class="post-meta">
                    <span><i class="fas fa-user" aria-hidden="true"></i> ${featuredPost.author.name}</span>
                    <span><i class="fas fa-calendar" aria-hidden="true"></i> ${formatDate(featuredPost.date)}</span>
                    <span><i class="fas fa-clock" aria-hidden="true"></i> ${featuredPost.readTime} min read</span>
                </div>
                <p class="post-excerpt">${featuredPost.excerpt}</p>
                <button class="read-more-btn" onclick="openArticle(${featuredPost.id})" aria-label="Read full article">
                    Read Full Article
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;
}

// ============================================
// BLOG GRID
// ============================================
function renderBlogGrid() {
    const container = document.getElementById('blogGrid');
    const startIndex = 0;
    const endIndex = blogState.currentPage * blogState.postsPerPage;
    
    // Filter out featured post from grid
    const postsToShow = blogState.displayedPosts
        .filter(post => !post.featured)
        .slice(startIndex, endIndex);

    if (postsToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No Articles Found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = postsToShow.map(post => `
        <article class="blog-card" onclick="openArticle(${post.id})" tabindex="0" role="button" aria-label="Read ${post.title}">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="blog-card-category ${post.category}">${post.category}</span>
            </div>
            <div class="blog-card-content">
                <h3>${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <div class="blog-card-author">
                        <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar" loading="lazy">
                        <div class="author-info">
                            <div class="author-name">${post.author.name}</div>
                            <div class="post-date">${formatDate(post.date)}</div>
                        </div>
                    </div>
                    <div class="post-stats">
                        <span><i class="fas fa-eye" aria-hidden="true"></i> ${formatNumber(post.views)}</span>
                        <span><i class="fas fa-heart" aria-hidden="true"></i> ${formatNumber(post.likes)}</span>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
    
    // Add keyboard support for cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// ============================================
// SEARCH & FILTER
// ============================================
function handleSearch(e) {
    blogState.searchQuery = e.target.value.toLowerCase();
    applyFilters();
}

function handleCategoryFilter(e) {
    blogState.currentFilter = e.target.value;
    applyFilters();
}

function handleSort(e) {
    blogState.currentSort = e.target.value;
    applyFilters();
}

function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    blogState.currentFilter = category;
    applyFilters();
    
    // Scroll to blog grid
    document.querySelector('.blog-section').scrollIntoView({ behavior: 'smooth' });
}

function applyFilters() {
    let filtered = [...blogState.allPosts];

    // Apply search
    if (blogState.searchQuery) {
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(blogState.searchQuery) ||
            post.excerpt.toLowerCase().includes(blogState.searchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(blogState.searchQuery))
        );
    }

    // Apply category filter
    if (blogState.currentFilter !== 'all') {
        filtered = filtered.filter(post => post.category === blogState.currentFilter);
    }

    // Apply sort
    filtered.sort((a, b) => {
        switch (blogState.currentSort) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'popular':
                return b.views - a.views;
            default:
                return 0;
        }
    });

    blogState.displayedPosts = filtered;
    blogState.currentPage = 1;
    renderBlogGrid();
    updateLoadMoreButton();
}

// ============================================
// PAGINATION
// ============================================
function loadMorePosts() {
    blogState.currentPage++;
    renderBlogGrid();
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;

    const totalPosts = blogState.displayedPosts.filter(p => !p.featured).length;
    const displayedCount = blogState.currentPage * blogState.postsPerPage;

    if (displayedCount >= totalPosts) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'inline-flex';
    }
}

// ============================================
// ARTICLE MODAL
// ============================================
function openArticle(postId) {
    const post = blogState.allPosts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('articleModal');
    const content = document.getElementById('articleContent');

    // Update browser history (for SEO)
    if (window.history) {
        window.history.pushState({ postId }, post.title, `#${post.slug}`);
    }

    // Update page title
    document.title = `${post.title} - PulseFit Blog`;

    content.innerHTML = `
        <div class="article-full-header">
            <img src="${post.image}" alt="${post.title}" class="article-full-image" loading="eager">
            <span class="post-category">${post.category}</span>
            <h1 id="articleTitle">${post.title}</h1>
            <div class="post-meta">
                <span><i class="fas fa-user" aria-hidden="true"></i> ${post.author.name}</span>
                <span><i class="fas fa-calendar" aria-hidden="true"></i> ${formatDate(post.date)}</span>
                <span><i class="fas fa-clock" aria-hidden="true"></i> ${post.readTime} min read</span>
                <span><i class="fas fa-eye" aria-hidden="true"></i> ${formatNumber(post.views)} views</span>
            </div>
        </div>
        <div class="article-full-body">
            ${post.content}
        </div>
        <div class="article-tags">
            ${post.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
        </div>
        <div class="article-share">
            <span>Share:</span>
            <button class="share-btn facebook" onclick="shareArticle('facebook', '${post.slug}')" aria-label="Share on Facebook">
                <i class="fab fa-facebook-f" aria-hidden="true"></i>
            </button>
            <button class="share-btn twitter" onclick="shareArticle('twitter', '${post.slug}')" aria-label="Share on Twitter">
                <i class="fab fa-twitter" aria-hidden="true"></i>
            </button>
            <button class="share-btn linkedin" onclick="shareArticle('linkedin', '${post.slug}')" aria-label="Share on LinkedIn">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
            </button>
            <button class="share-btn whatsapp" onclick="shareArticle('whatsapp', '${post.slug}')" aria-label="Share on WhatsApp">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
            </button>
        </div>
    `;

    modal.hidden = false;
    modal.querySelector('.modal-close').focus();

    // Increment views (in real app, this would be an API call)
    post.views++;
}

function closeArticle() {
    const modal = document.getElementById('articleModal');
    modal.hidden = true;
    
    // Restore page title
    document.title = 'Blog - PulseFit Center | Fitness Tips & Expert Advice';
    
    // Update browser history
    if (window.history) {
        window.history.pushState({}, '', 'blog.html');
    }
}

// ============================================
// SOCIAL SHARING
// ============================================
function shareArticle(platform, slug) {
    const url = encodeURIComponent(`https://pulsefitcenter.com/blog/${slug}`);
    const text = encodeURIComponent(document.getElementById('articleTitle').textContent);
    
    let shareUrl;
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ============================================
// NEWSLETTER
// ============================================
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    const errorMsg = document.querySelector('.newsletter-form .error-message');
    const successMsg = document.querySelector('.newsletter-form .success-message');
    
    // Reset messages
    errorMsg.classList.remove('active');
    successMsg.classList.remove('active');
    
    // Validate email
    if (!validateEmail(email)) {
        errorMsg.textContent = 'Please enter a valid email address';
        errorMsg.classList.add('active');
        return;
    }
    
    // In real application, send to backend API
    setTimeout(() => {
        successMsg.textContent = 'Successfully subscribed! Check your email for confirmation.';
        successMsg.classList.add('active');
        emailInput.value = '';
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, 500);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// ============================================
// HANDLE BROWSER BACK/FORWARD
// ============================================
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.postId) {
        openArticle(e.state.postId);
    } else {
        closeArticle();
    }
});
