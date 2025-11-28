/**
 * BOOKING SYSTEM - PulseFit Center
 * Features: Interactive calendar, class booking, trainer appointments, 
 * validation, and booking management
 */

// ============================================
// STATE MANAGEMENT
// ============================================
const bookingState = {
    currentDate: new Date(),
    selectedDate: new Date(),
    selectedTrainer: null,
    userBookings: [],
    availableClasses: [],
    trainers: []
};

// ============================================
// SAMPLE DATA (Replace with API calls)
// ============================================
const classesData = [
    {
        id: 1,
        name: 'Morning Yoga Flow',
        type: 'yoga',
        time: '08:00 AM',
        duration: 60,
        trainer: 'Sarah Johnson',
        location: 'Studio A',
        capacity: 20,
        booked: 15,
        dates: ['2024-10-24', '2024-10-25', '2024-10-26', '2024-10-28', '2024-10-29']
    },
    {
        id: 2,
        name: 'HIIT Bootcamp',
        type: 'hiit',
        time: '06:00 PM',
        duration: 45,
        trainer: 'Mike Chen',
        location: 'Main Floor',
        capacity: 25,
        booked: 22,
        dates: ['2024-10-24', '2024-10-26', '2024-10-28']
    },
    {
        id: 3,
        name: 'Strength Training',
        type: 'strength',
        time: '07:00 AM',
        duration: 60,
        trainer: 'David Lee',
        location: 'Weight Room',
        capacity: 15,
        booked: 10,
        dates: ['2024-10-24', '2024-10-25', '2024-10-27', '2024-10-29']
    },
    {
        id: 4,
        name: 'Spin & Core',
        type: 'spin',
        time: '07:00 PM',
        duration: 50,
        trainer: 'David Lee',
        location: 'Spin Studio',
        capacity: 30,
        booked: 18,
        dates: ['2024-10-24', '2024-10-25', '2024-10-26', '2024-10-27', '2024-10-28', '2024-10-29']
    },
    {
        id: 5,
        name: 'Cardio Blast',
        type: 'cardio',
        time: '05:30 PM',
        duration: 45,
        trainer: 'Emma Wilson',
        location: 'Cardio Zone',
        capacity: 20,
        booked: 12,
        dates: ['2024-10-25', '2024-10-27', '2024-10-29']
    }
];

const trainersData = [
    {
        id: 1,
        name: 'Sarah Johnson',
        specialty: 'Yoga & Flexibility',
        rating: 4.9,
        price: 75,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        experience: '8 years'
    },
    {
        id: 2,
        name: 'Mike Chen',
        specialty: 'HIIT & Weight Loss',
        rating: 4.8,
        price: 85,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        experience: '10 years'
    },
    {
        id: 3,
        name: 'David Lee',
        specialty: 'Strength & Conditioning',
        rating: 5.0,
        price: 90,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        experience: '12 years'
    },
    {
        id: 4,
        name: 'Emma Wilson',
        specialty: 'Cardio & Endurance',
        rating: 4.7,
        price: 70,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        experience: '6 years'
    }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initBookingSystem();
    setupEventListeners();
    renderCalendar();
    loadAvailableClasses();
    loadTrainers();
    loadUserBookings();
    generateTimeSlots();
});

function initBookingSystem() {
    bookingState.trainers = trainersData;
    bookingState.availableClasses = classesData;
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.booking-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        tab.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(tab.dataset.tab);
            }
        });
    });

    // Calendar navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth')?.addEventListener('click', () => changeMonth(1));

    // Class filter
    document.getElementById('classTypeFilter')?.addEventListener('change', filterClasses);

    // Trainer booking form
    document.getElementById('trainerBookingForm')?.addEventListener('submit', handleTrainerBooking);
    
    // Date input for trainer booking
    document.getElementById('appointmentDate')?.addEventListener('change', updateAvailableTimeSlots);

    // Keyboard navigation for hamburger
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }
}

function switchTab(tabName) {
    // Update tabs
    document.querySelectorAll('.booking-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });

    // Update panels
    document.querySelectorAll('.booking-panel').forEach(panel => {
        const isActive = panel.id === `${tabName}-panel`;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
    });
}

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================
function renderCalendar() {
    const year = bookingState.currentDate.getFullYear();
    const month = bookingState.currentDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    // Calculate calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayElement = createCalendarDay(day, true, false);
        calendarDays.appendChild(dayElement);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        currentDate.setHours(0, 0, 0, 0);
        
        const isToday = currentDate.getTime() === today.getTime();
        const isPast = currentDate < today;
        const isSelected = currentDate.getTime() === bookingState.selectedDate.getTime();
        const hasClasses = checkIfDateHasClasses(currentDate);

        const dayElement = createCalendarDay(day, false, isPast, isToday, isSelected, hasClasses);
        calendarDays.appendChild(dayElement);
    }

    // Next month days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createCalendarDay(day, true, false);
        calendarDays.appendChild(dayElement);
    }
}

function createCalendarDay(day, isOtherMonth, isPast, isToday = false, isSelected = false, hasClasses = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    dayElement.setAttribute('role', 'gridcell');
    dayElement.setAttribute('tabindex', isPast || isOtherMonth ? '-1' : '0');

    if (isOtherMonth) dayElement.classList.add('other-month');
    if (isPast) dayElement.classList.add('disabled');
    if (isToday) dayElement.classList.add('today');
    if (isSelected) dayElement.classList.add('selected');
    if (hasClasses) dayElement.classList.add('has-classes');

    if (!isPast && !isOtherMonth) {
        dayElement.addEventListener('click', () => selectDate(day));
        dayElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectDate(day);
            }
        });
    }

    return dayElement;
}

function selectDate(day) {
    const year = bookingState.currentDate.getFullYear();
    const month = bookingState.currentDate.getMonth();
    bookingState.selectedDate = new Date(year, month, day);
    bookingState.selectedDate.setHours(0, 0, 0, 0);
    
    renderCalendar();
    loadAvailableClasses();
    updateSelectedDateDisplay();
}

function changeMonth(direction) {
    bookingState.currentDate.setMonth(bookingState.currentDate.getMonth() + direction);
    renderCalendar();
}

function updateSelectedDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = bookingState.selectedDate.toLocaleDateString('en-US', options);
    document.getElementById('selectedDate').textContent = dateString;
}

function checkIfDateHasClasses(date) {
    const dateString = date.toISOString().split('T')[0];
    return bookingState.availableClasses.some(cls => cls.dates.includes(dateString));
}

// ============================================
// CLASSES MANAGEMENT
// ============================================
function loadAvailableClasses() {
    const container = document.getElementById('availableClasses');
    const dateString = bookingState.selectedDate.toISOString().split('T')[0];
    const filter = document.getElementById('classTypeFilter')?.value || 'all';

    let classes = bookingState.availableClasses.filter(cls => 
        cls.dates.includes(dateString) &&
        (filter === 'all' || cls.type === filter)
    );

    if (classes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No Classes Available</h3>
                <p>There are no classes scheduled for this date.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = classes.map(cls => {
        const capacityPercent = (cls.booked / cls.capacity) * 100;
        const isFull = cls.booked >= cls.capacity;
        const isAlmostFull = capacityPercent >= 80;
        const capacityClass = isFull ? 'full' : (isAlmostFull ? 'almost-full' : '');

        return `
            <div class="class-item" data-class-id="${cls.id}">
                <div class="class-header">
                    <div class="class-info">
                        <h3>${cls.name}</h3>
                        <div class="class-time">
                            <i class="fas fa-clock" aria-hidden="true"></i> ${cls.time}
                        </div>
                    </div>
                    <span class="class-badge ${cls.type}">${cls.type}</span>
                </div>
                <div class="class-details">
                    <span><i class="fas fa-user" aria-hidden="true"></i> ${cls.trainer}</span>
                    <span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${cls.location}</span>
                    <span><i class="fas fa-hourglass-half" aria-hidden="true"></i> ${cls.duration} min</span>
                </div>
                <div class="class-capacity">
                    <div class="capacity-bar">
                        <div class="capacity-fill ${capacityClass}" style="width: ${capacityPercent}%"></div>
                    </div>
                    <span class="capacity-text">${cls.booked}/${cls.capacity}</span>
                </div>
                <button class="book-class-btn" 
                        onclick="bookClass(${cls.id})" 
                        ${isFull ? 'disabled' : ''}
                        aria-label="Book ${cls.name}">
                    ${isFull ? 'Class Full' : 'Book Now'}
                </button>
            </div>
        `;
    }).join('');
}

function filterClasses() {
    loadAvailableClasses();
}

function bookClass(classId) {
    if (!window.API || !API.createBooking) {
        console.error('API helper is not available');
        showNotification('Booking service is currently unavailable.', 'error');
        return;
    }

    const classInfo = bookingState.availableClasses.find(c => c.id === classId);
    if (!classInfo) return;

    const dateString = bookingState.selectedDate.toISOString().split('T')[0];

    (async () => {
        try {
            const payload = {
                bookingType: 'class',
                class: classId,
                date: dateString,
                time: classInfo.time,
                notes: '',
            };

            const { booking: bookingFromApi } = await API.createBooking(payload);

            const booking = {
                id: bookingFromApi._id,
                type: 'class',
                classId: classId,
                className: classInfo.name,
                date: bookingFromApi.date || dateString,
                time: bookingFromApi.time || classInfo.time,
                trainer: classInfo.trainer,
                location: classInfo.location,
                duration: classInfo.duration,
            };

            bookingState.userBookings.push(booking);
            loadUserBookings();

            // Update class capacity in UI
            classInfo.booked++;
            loadAvailableClasses();

            showBookingConfirmation(booking);
            showNotification('Booking created successfully', 'success');
        } catch (error) {
            console.error('Error creating booking:', error);
            showNotification(error.message || 'Failed to create booking. Please try again.', 'error');
        }
    })();
}

// ============================================
// USER BOOKINGS
// ============================================
function loadUserBookings() {
    const container = document.getElementById('bookingsList');
    
    if (!window.API || !API.getMyBookings) {
        console.error('API helper is not available');
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>Bookings unavailable</h3>
                <p>Booking service is currently unavailable.</p>
            </div>
        `;
        return;
    }

    (async () => {
        try {
            const { bookings } = await API.getMyBookings();

            if (!bookings || bookings.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-check"></i>
                        <h3>No Upcoming Bookings</h3>
                        <p>Book a class or trainer session to get started!</p>
                    </div>
                `;
                bookingState.userBookings = [];
                return;
            }

            bookingState.userBookings = bookings.map(b => {
                const className = b.class?.name || b.className || '';
                const trainerName = b.trainer
                    ? `${b.trainer.firstName} ${b.trainer.lastName}`
                    : b.trainerName || '';

                return {
                    id: b._id,
                    type: b.bookingType || b.type,
                    classId: b.class?._id || b.classId,
                    className,
                    trainer: trainerName,
                    location: b.class?.schedule?.[0]?.location || b.location,
                    duration: b.class?.duration || b.duration || 60,
                    date: b.date,
                    time: b.time,
                };
            });

            // Sort bookings by date
            const sortedBookings = bookingState.userBookings.sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );

            container.innerHTML = sortedBookings.map(booking => {
        const bookingDate = new Date(booking.date);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const dateString = bookingDate.toLocaleDateString('en-US', options);

        return `
            <div class="booking-card">
                <div class="booking-card-header">
                    <div>
                        <h3>${booking.className || booking.trainerName}</h3>
                        <div class="booking-date-time">${dateString} at ${booking.time}</div>
                    </div>
                </div>
                <div class="class-details" style="color: rgba(255,255,255,0.9);">
                    ${booking.trainer ? `<span><i class="fas fa-user"></i> ${booking.trainer}</span>` : ''}
                    ${booking.location ? `<span><i class="fas fa-map-marker-alt"></i> ${booking.location}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${booking.duration} min</span>
                </div>
                <div class="booking-actions">
                    <button class="cancel-booking-btn" onclick="cancelBooking('${booking.id}')" aria-label="Cancel booking">
                        Cancel Booking
                    </button>
                    ${isToday(booking.date) ? '<button class="checkin-btn" aria-label="Check in">Check In</button>' : ''}
                </div>
            </div>
        `;
    }).join('');
        } catch (error) {
            console.error('Error loading bookings:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <h3>Unable to load bookings</h3>
                    <p>${error.message || 'Please try again later.'}</p>
                </div>
            `;
        }
    })();
}

function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    if (!window.API || !API.cancelBookingApi) {
        console.error('API helper is not available');
        showNotification('Booking service is currently unavailable.', 'error');
        return;
    }

    (async () => {
        try {
            await API.cancelBookingApi(bookingId);

            const bookingIndex = bookingState.userBookings.findIndex(b => String(b.id) === String(bookingId));
            if (bookingIndex !== -1) {
                const booking = bookingState.userBookings[bookingIndex];

                if (booking.type === 'class') {
                    const classInfo = bookingState.availableClasses.find(c => c.id === booking.classId);
                    if (classInfo) classInfo.booked = Math.max(0, (classInfo.booked || 0) - 1);
                }

                bookingState.userBookings.splice(bookingIndex, 1);
            }

            loadUserBookings();
            loadAvailableClasses();

            showNotification('Booking cancelled successfully', 'success');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showNotification(error.message || 'Failed to cancel booking. Please try again.', 'error');
        }
    })();
}

function isToday(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0);
    return today.getTime() === checkDate.getTime();
}

// ============================================
// TRAINER BOOKING
// ============================================
function loadTrainers() {
    const container = document.getElementById('trainersList');
    
    container.innerHTML = bookingState.trainers.map(trainer => `
        <div class="trainer-card" data-trainer-id="${trainer.id}" onclick="selectTrainer(${trainer.id})" 
             role="button" tabindex="0" aria-label="Select trainer ${trainer.name}">
            <img src="${trainer.image}" alt="${trainer.name}" class="trainer-avatar" loading="lazy">
            <div class="trainer-info">
                <h3>${trainer.name}</h3>
                <div class="trainer-specialty">${trainer.specialty}</div>
                <div class="trainer-rating">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <span>${trainer.rating} (${Math.floor(Math.random() * 100) + 50} reviews)</span>
                </div>
                <div class="trainer-price">$${trainer.price}/session</div>
            </div>
        </div>
    `).join('');
    
    // Add keyboard support
    document.querySelectorAll('.trainer-card').forEach(card => {
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const trainerId = parseInt(card.dataset.trainerId);
                selectTrainer(trainerId);
            }
        });
    });
}

function selectTrainer(trainerId) {
    bookingState.selectedTrainer = bookingState.trainers.find(t => t.id === trainerId);
    
    // Update UI
    document.querySelectorAll('.trainer-card').forEach(card => {
        card.classList.toggle('selected', parseInt(card.dataset.trainerId) === trainerId);
    });

    // Update form info
    const infoContainer = document.getElementById('selectedTrainerInfo');
    if (bookingState.selectedTrainer) {
        infoContainer.innerHTML = `
            <p><strong>Selected Trainer:</strong> ${bookingState.selectedTrainer.name}</p>
            <p><strong>Specialty:</strong> ${bookingState.selectedTrainer.specialty}</p>
            <p><strong>Rate:</strong> $${bookingState.selectedTrainer.price} per session</p>
        `;
        document.getElementById('bookTrainerBtn').disabled = false;
    }
}

function generateTimeSlots() {
    const timeSelect = document.getElementById('appointmentTime');
    if (!timeSelect) return;

    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
            slots.push(`<option value="${time}">${displayTime}</option>`);
        }
    }

    timeSelect.innerHTML += slots.join('');
}

function updateAvailableTimeSlots() {
    // In a real application, this would check trainer availability
    // For now, all time slots are available
}

function handleTrainerBooking(e) {
    e.preventDefault();

    // Validate form
    const form = e.target;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const sessionType = document.getElementById('sessionType').value;
    const goals = document.getElementById('sessionGoals').value;

    if (!validateTrainerForm(date, time, sessionType)) return;

    if (!bookingState.selectedTrainer) {
        alert('Please select a trainer');
        return;
    }

    if (!window.API || !API.createBooking) {
        console.error('API helper is not available');
        showNotification('Booking service is currently unavailable.', 'error');
        return;
    }

    (async () => {
        try {
            const payload = {
                bookingType: 'personal',
                trainer: bookingState.selectedTrainer.id,
                date,
                time,
                notes: goals,
            };

            const { booking: bookingFromApi } = await API.createBooking(payload);

            const booking = {
                id: bookingFromApi._id,
                type: 'trainer',
                trainerId: bookingState.selectedTrainer.id,
                trainerName: bookingState.selectedTrainer.name,
                date,
                time: convertTo12Hour(time),
                sessionType,
                goals,
                duration: getSessionDuration(sessionType),
                price: bookingState.selectedTrainer.price,
            };

            bookingState.userBookings.push(booking);
            loadUserBookings();

            // Reset form and UI
            form.reset();
            bookingState.selectedTrainer = null;
            document
                .querySelectorAll('.trainer-card')
                .forEach(card => card.classList.remove('selected'));
            document.getElementById('bookTrainerBtn').disabled = true;

            showBookingConfirmation(booking);
            showNotification('Trainer session booked successfully', 'success');
        } catch (error) {
            console.error('Error booking trainer session:', error);
            showNotification(
                error.message || 'Failed to book trainer session. Please try again.',
                'error'
            );
        }
    })();
}

function validateTrainerForm(date, time, sessionType) {
    let isValid = true;
    const fields = [
        { id: 'appointmentDate', value: date, message: 'Please select a date' },
        { id: 'appointmentTime', value: time, message: 'Please select a time' },
        { id: 'sessionType', value: sessionType, message: 'Please select a session type' }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = input.nextElementSibling;
        
        if (!field.value) {
            input.classList.add('error');
            error.textContent = field.message;
            error.classList.add('active');
            isValid = false;
        } else {
            input.classList.remove('error');
            error.classList.remove('active');
        }
    });

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        const input = document.getElementById('appointmentDate');
        const error = input.nextElementSibling;
        input.classList.add('error');
        error.textContent = 'Please select a future date';
        error.classList.add('active');
        isValid = false;
    }

    return isValid;
}

function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
}

function getSessionDuration(sessionType) {
    const durations = {
        consultation: 30,
        standard: 60,
        extended: 90,
        assessment: 45
    };
    return durations[sessionType] || 60;
}

// ============================================
// BOOKING CONFIRMATION & NOTIFICATIONS
// ============================================
function showBookingConfirmation(booking) {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');

    const bookingDate = new Date(booking.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = bookingDate.toLocaleDateString('en-US', options);

    modalBody.innerHTML = `
        <p><strong>Date:</strong> ${dateString}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        ${booking.className ? `<p><strong>Class:</strong> ${booking.className}</p>` : ''}
        ${booking.trainerName ? `<p><strong>Trainer:</strong> ${booking.trainerName}</p>` : ''}
        ${booking.trainer ? `<p><strong>Instructor:</strong> ${booking.trainer}</p>` : ''}
        ${booking.location ? `<p><strong>Location:</strong> ${booking.location}</p>` : ''}
        <p><strong>Duration:</strong> ${booking.duration} minutes</p>
        ${booking.price ? `<p><strong>Price:</strong> $${booking.price}</p>` : ''}
    `;

    modal.hidden = false;
    modal.querySelector('.modal-close').focus();

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function closeModal() {
    document.getElementById('bookingModal').hidden = true;
}

function addToCalendar() {
    // In a real application, this would generate an .ics file
    alert('Calendar integration coming soon!');
    closeModal();
}

function showNotification(message, type = 'info') {
    // Simple notification implementation
    // In production, use a proper notification library
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// DATA PERSISTENCE
// ============================================
// Bookings are now persisted via backend API; localStorage is no longer used for bookings.

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard accessibility for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('bookingModal');
        if (modal && !modal.hidden) {
            closeModal();
        }
    }
});
