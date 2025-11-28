// PulseFit Center - Main JavaScript File
// Author: PulseFit Development Team

// ========== GLOBAL VARIABLES ==========
let currentSlide = 0;
let slideInterval;

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCarousel();
    initScrollAnimations();
    initBackToTop();
    initChatbot();
    initStatsCounter();
    initScheduleData();
    initDashboard();
    
    console.log('PulseFit Center initialized successfully!');
});

// ========== NAVIGATION ==========
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
}

// ========== HERO CAROUSEL ==========
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    // Auto-advance carousel
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Reset interval
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));
}

// ========== STATS COUNTER ANIMATION ==========
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ========== BACK TO TOP BUTTON ==========
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========== CHATBOT FUNCTIONALITY ==========
function initChatbot() {
    const chatbotBody = document.getElementById('chatbotBody');
    if (chatbotBody) {
        chatbotBody.classList.remove('open');
    }
}

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbotBody');
    const chatToggle = document.getElementById('chatToggle');
    
    chatbotBody.classList.toggle('open');
    
    if (chatbotBody.classList.contains('open')) {
        chatToggle.style.transform = 'rotate(180deg)';
    } else {
        chatToggle.style.transform = 'rotate(0deg)';
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Generate bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(message.toLowerCase());
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `<p>${botResponse}</p>`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// AI Chatbot Response Generator
function generateBotResponse(message) {
    // Simple pattern matching for common queries
    const responses = {
        // Membership queries
        membership: "We offer three membership plans: Monthly ($49), Annual ($499 - best value!), and Premium ($99/month). Which would you like to know more about?",
        price: "Our plans start at $49/month. The Annual plan is $499/year (saves $89!), and Premium is $99/month with unlimited personal training.",
        join: "Great! You can join by visiting our Contact page or calling us at (555) 123-4567. We're offering a free trial day for new members!",
        
        // Classes queries
        classes: "We offer Yoga, HIIT, Strength Training, Cardio, Pilates, Spinning, and more! Check our Classes page for the full schedule.",
        schedule: "Classes run from 6 AM to 8 PM daily. Visit our Classes page to see the complete weekly schedule and book your spot!",
        yoga: "We have Morning Yoga (6 AM), Power Yoga (5:30 PM), and Vinyasa Flow classes. Suitable for all levels!",
        hiit: "Our HIIT classes include Bootcamp, Tabata, and Metcon sessions. Perfect for intense fat-burning workouts!",
        
        // Hours queries
        hours: "We're open Mon-Fri: 5 AM-11 PM, Sat: 6 AM-10 PM, Sun: 7 AM-9 PM. Premium members get 24/7 access!",
        open: "We're open Mon-Fri: 5 AM-11 PM, Sat: 6 AM-10 PM, Sun: 7 AM-9 PM. Premium members get 24/7 access!",
        
        // Trainers queries
        trainer: "We have 50+ certified trainers specializing in various areas. Visit our Trainers page to see their profiles and specialties!",
        personal: "Personal training is included with Premium membership or available as an add-on for $199/month (4 sessions).",
        
        // Location queries
        location: "We're located at 123 Fitness Avenue, New York, NY 10001. Easy access by subway and free parking available!",
        parking: "Yes! We have free parking for all members. Premium members get reserved spots.",
        
        // Facilities queries
        equipment: "We have state-of-the-art cardio machines, free weights, resistance equipment, Olympic lifting platforms, spin studio, and more!",
        facilities: "Our facilities include cardio zone, strength area, 3 group studios, spa, sauna, steam room, and recovery lounge!",
        
        // Trial queries
        trial: "Yes! We offer a free trial day including gym access and one complimentary class. Contact us to schedule your trial!",
        tour: "Absolutely! We'd love to show you around. Visit during business hours or schedule a tour by calling (555) 123-4567.",
        
        // Contact queries
        contact: "Call us at (555) 123-4567, email info@pulsefitcenter.com, or visit our Contact page to send a message!",
        phone: "You can reach us at (555) 123-4567. We're here Mon-Fri 9 AM-7 PM!",
        
        // Default
        default: "I'm here to help! You can ask me about membership plans, class schedules, trainers, facilities, or general information. What would you like to know?"
    };
    
    // Check for keywords in message
    if (message.includes('membership') || message.includes('member') || message.includes('plan')) {
        return responses.membership;
    } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
        return responses.price;
    } else if (message.includes('join') || message.includes('sign up') || message.includes('register')) {
        return responses.join;
    } else if (message.includes('class') && !message.includes('schedule')) {
        return responses.classes;
    } else if (message.includes('schedule') || message.includes('time')) {
        return responses.schedule;
    } else if (message.includes('yoga')) {
        return responses.yoga;
    } else if (message.includes('hiit') || message.includes('bootcamp') || message.includes('intense')) {
        return responses.hiit;
    } else if (message.includes('hour') || message.includes('open') || message.includes('close')) {
        return responses.hours;
    } else if (message.includes('trainer') || message.includes('coach')) {
        return responses.trainer;
    } else if (message.includes('personal training') || message.includes('pt')) {
        return responses.personal;
    } else if (message.includes('location') || message.includes('address') || message.includes('where')) {
        return responses.location;
    } else if (message.includes('parking') || message.includes('park')) {
        return responses.parking;
    } else if (message.includes('equipment') || message.includes('machine')) {
        return responses.equipment;
    } else if (message.includes('facilities') || message.includes('amenities')) {
        return responses.facilities;
    } else if (message.includes('trial') || message.includes('try') || message.includes('free')) {
        return responses.trial;
    } else if (message.includes('tour') || message.includes('visit')) {
        return responses.tour;
    } else if (message.includes('contact') || message.includes('reach') || message.includes('call')) {
        return responses.contact;
    } else if (message.includes('phone') || message.includes('number')) {
        return responses.phone;
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! Welcome to PulseFit Center! How can I assist you today?";
    } else if (message.includes('thank') || message.includes('thanks')) {
        return "You're welcome! Feel free to ask if you have any other questions. We're here to help!";
    } else {
        return responses.default;
    }
}

// ========== FAQ ACCORDION ==========
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ========== CONTACT FORM ==========
function submitContactForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Simulate form submission
    formMessage.className = 'form-message success';
    formMessage.textContent = 'Thank you for contacting us! We\'ll get back to you within 24 hours.';
    formMessage.style.display = 'block';
    
    // Reset form
    form.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
    
    return false;
}

// ========== MEMBERSHIP PLAN SELECTION ==========
function selectPlan(planType) {
    alert(`You've selected the ${planType.toUpperCase()} plan! Redirecting to contact page...`);
    window.location.href = 'contact.html';
}

// ========== SCHEDULE FILTER ==========
function filterSchedule(day) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const daySchedules = document.querySelectorAll('.day-schedule');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide schedules
    if (day === 'all') {
        daySchedules.forEach(schedule => {
            schedule.style.display = 'block';
        });
    } else {
        daySchedules.forEach(schedule => {
            if (schedule.getAttribute('data-day') === day) {
                schedule.style.display = 'block';
            } else {
                schedule.style.display = 'none';
            }
        });
    }
}

// ========== DYNAMIC SCHEDULE DATA ==========
function initScheduleData() {
    const scheduleContainer = document.getElementById('scheduleContainer');
    if (!scheduleContainer) return;
    
    const scheduleData = {
        monday: [
            { time: '6:00 AM - 7:00 AM', name: 'Morning Yoga', level: 'beginner', trainer: 'Sarah Johnson', location: 'Studio A' },
            { time: '7:30 AM - 8:30 AM', name: 'HIIT Bootcamp', level: 'advanced', trainer: 'Mike Chen', location: 'Main Floor' },
            { time: '12:00 PM - 1:00 PM', name: 'Lunchtime Spin', level: 'all-levels', trainer: 'David Lee', location: 'Spin Studio' },
            { time: '5:30 PM - 6:30 PM', name: 'Power Yoga', level: 'intermediate', trainer: 'Emily Davis', location: 'Studio A' }
        ],
        tuesday: [
            { time: '6:00 AM - 7:00 AM', name: 'Sunrise Pilates', level: 'beginner', trainer: 'Amanda White', location: 'Studio A' },
            { time: '7:30 AM - 8:30 AM', name: 'Kettlebell Strength', level: 'intermediate', trainer: 'Ryan Murphy', location: 'Main Floor' },
            { time: '12:00 PM - 1:00 PM', name: 'Express HIIT', level: 'intermediate', trainer: 'Chris Anderson', location: 'Main Floor' },
            { time: '5:30 PM - 6:30 PM', name: 'TRX Training', level: 'advanced', trainer: 'Jennifer Clark', location: 'Studio A' }
        ],
        wednesday: [
            { time: '6:00 AM - 7:00 AM', name: 'Tabata HIIT', level: 'advanced', trainer: 'Mike Chen', location: 'Main Floor' },
            { time: '9:00 AM - 10:00 AM', name: 'Barre Fusion', level: 'beginner', trainer: 'Amanda White', location: 'Studio A' },
            { time: '12:00 PM - 1:00 PM', name: 'Olympic Lifting', level: 'advanced', trainer: 'Marcus Thompson', location: 'Lifting Area' },
            { time: '5:30 PM - 6:30 PM', name: 'Circuit Training', level: 'all-levels', trainer: 'Chris Anderson', location: 'Main Floor' }
        ],
        thursday: [
            { time: '6:00 AM - 7:00 AM', name: 'Morning Stretch', level: 'all-levels', trainer: 'Emily Davis', location: 'Studio A' },
            { time: '7:30 AM - 8:30 AM', name: 'Bootcamp Challenge', level: 'advanced', trainer: 'Ryan Murphy', location: 'Main Floor' },
            { time: '12:00 PM - 1:00 PM', name: 'Power Hour Spin', level: 'intermediate', trainer: 'David Lee', location: 'Spin Studio' },
            { time: '7:00 PM - 8:00 PM', name: 'Metcon Madness', level: 'advanced', trainer: 'Mike Chen', location: 'Main Floor' }
        ],
        friday: [
            { time: '6:00 AM - 7:00 AM', name: 'Friday Sweat', level: 'intermediate', trainer: 'Chris Anderson', location: 'Main Floor' },
            { time: '9:00 AM - 10:00 AM', name: 'Zumba Party', level: 'all-levels', trainer: 'Sofia Rodriguez', location: 'Studio B' },
            { time: '5:30 PM - 6:30 PM', name: 'Weekend Warrior HIIT', level: 'advanced', trainer: 'Mike Chen', location: 'Main Floor' },
            { time: '7:00 PM - 8:00 PM', name: 'Yin Yoga', level: 'all-levels', trainer: 'Emily Davis', location: 'Studio A' }
        ],
        saturday: [
            { time: '8:00 AM - 9:00 AM', name: 'Saturday Bootcamp', level: 'all-levels', trainer: 'Ryan Murphy', location: 'Main Floor' },
            { time: '9:30 AM - 10:30 AM', name: 'Power Yoga', level: 'intermediate', trainer: 'Sarah Johnson', location: 'Studio A' },
            { time: '11:00 AM - 12:00 PM', name: 'Family Fitness', level: 'beginner', trainer: 'Jennifer Clark', location: 'Studio B' },
            { time: '1:00 PM - 2:00 PM', name: 'Boxing Technique', level: 'intermediate', trainer: 'Marcus Thompson', location: 'Studio B' }
        ],
        sunday: [
            { time: '8:00 AM - 9:00 AM', name: 'Sunday Stretch & Restore', level: 'all-levels', trainer: 'Emily Davis', location: 'Studio A' },
            { time: '9:30 AM - 10:30 AM', name: 'Meditation & Mindfulness', level: 'all-levels', trainer: 'Sarah Johnson', location: 'Studio A' },
            { time: '11:00 AM - 12:00 PM', name: 'Gentle Yoga', level: 'beginner', trainer: 'Amanda White', location: 'Studio A' }
        ]
    };
    
    let html = '';
    for (const [day, classes] of Object.entries(scheduleData)) {
        html += `<div class="day-schedule" data-day="${day}">
            <h3 class="day-title">${day.toUpperCase()}</h3>
            <div class="schedule-items">`;
        
        classes.forEach(cls => {
            html += `<div class="schedule-item">
                <div class="time">${cls.time}</div>
                <div class="class-info">
                    <h4>${cls.name} <span class="difficulty ${cls.level}">${cls.level.replace('-', ' ')}</span></h4>
                    <p><i class="fas fa-user"></i> ${cls.trainer} | <i class="fas fa-map-marker-alt"></i> ${cls.location}</p>
                    <button class="book-btn" onclick="bookClass('${cls.name}', '${day}', '${cls.time}')">BOOK CLASS</button>
                </div>
            </div>`;
        });
        
        html += `</div></div>`;
    }
    
    scheduleContainer.innerHTML = html;
}

function bookClass(className, day, time) {
    alert(`Class booked successfully!\n\nClass: ${className}\nDay: ${day}\nTime: ${time}\n\nYou'll receive a confirmation email shortly.`);
}

// ========== DASHBOARD FUNCTIONALITY ==========
function initDashboard() {
    // Initialize chart if on dashboard page
    const chartCanvas = document.getElementById('weeklyChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        createWeeklyChart();
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update nav items
    document.querySelectorAll('.dash-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

function createWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Workouts (hours)',
                data: [2, 3, 2.5, 2, 3.5, 2.5, 3],
                backgroundColor: 'rgba(220, 20, 60, 0.8)',
                borderColor: 'rgba(220, 20, 60, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#888' },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#888' }
                }
            }
        }
    });
}

function showAddWorkout() {
    alert('Add Workout feature coming soon! This will allow you to log custom workouts with exercises, sets, reps, and weights.');
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('🏋️ PulseFit Center - Transform Your Body, Elevate Your Life! 💪');
