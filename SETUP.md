# PulseFit Center - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Download & Extract
- Download all files from the repository
- Extract to a folder on your computer
- Ensure all files are in the same directory

### 2. Open in Browser
**Option A: Direct Open** (Easiest)
- Double-click `index.html`
- Most features will work, but push notifications require a server

**Option B: Local Server** (Recommended)
```bash
# Python (if installed)
python -m http.server 8000

# Node.js (if installed)
npx http-server -p 8000

# PHP (if installed)
php -S localhost:8000
```
Then visit: `http://localhost:8000`

### 3. Explore Features
- **Homepage**: Navigate through the carousel
- **Booking**: Try the interactive booking system
- **Blog**: Search and filter fitness articles
- **Progress Tracker**: View Chart.js visualizations
- **Dashboard**: Explore workout tracking

## 📂 File Overview

### Essential HTML Pages
- `index.html` - Homepage with carousel
- `booking.html` - Booking system (NEW)
- `blog.html` - Blog section (NEW)
- `progress-tracker.html` - Advanced tracking (NEW)
- `dashboard.html` - Member dashboard
- `about.html`, `membership.html`, `classes.html`, `trainers.html`, `contact.html`

### CSS Files
- `styles.css` - Main styles
- `styles-extended.css` - Additional page styles
- `booking-styles.css` - Booking system styles (NEW)
- `blog-styles.css` - Blog styles (NEW)
- `progress-tracker-styles.css` - Progress tracker styles (NEW)

### JavaScript Files
- `script.js` - Core functionality
- `booking.js` - Booking system logic (NEW)
- `blog.js` - Blog functionality (NEW)
- `progress-tracker.js` - Progress tracking (NEW)
- `advanced-features.js` - Security, notifications, performance (NEW)

## 🔑 Key Features to Test

### 1. Booking System (`booking.html`)
**Test Flow:**
1. Click "Group Classes" or "Personal Trainer" tab
2. Select a date from the calendar
3. Browse available classes/trainers
4. Click "Book Now" and fill the form
5. View booking in "My Upcoming Bookings"
6. Try canceling a booking

**Data Storage:** localStorage (`pulsefitBookings`)

### 2. Blog Section (`blog.html`)
**Test Flow:**
1. Search for articles using the search bar
2. Filter by category (Workout, Nutrition, Tips, etc.)
3. Sort by newest/oldest/popular
4. Click on an article to read full content
5. Try social sharing buttons
6. Subscribe to newsletter

**Data Storage:** JavaScript objects (CMS-ready)

### 3. Progress Tracker (`progress-tracker.html`)
**Test Flow:**
1. View pre-loaded sample data
2. Click "Log Workout" to add new workout
3. Navigate through different sections (Overview, Workouts, Weight, etc.)
4. Observe Chart.js visualizations
5. Check goals progress

**Data Storage:** localStorage (`pulsefitWorkouts`, `pulsefitWeight`)

### 4. Push Notifications
**Enable:**
1. Open any page in Chrome/Firefox
2. Allow notification permission when prompted
3. Notifications will appear for:
   - Class reminders
   - New blog posts
   - Fitness tips

**Configure:** Dashboard → Settings → Notification Preferences

### 5. Security Features
**Test:**
- Forms have validation
- Email format checking
- CAPTCHA on contact form
- Rate limiting (try submitting form 5+ times rapidly)
- XSS protection (all inputs sanitized)

## ⚙️ Configuration

### Enable Google Analytics
1. Get GA4 Measurement ID from Google Analytics
2. Open `advanced-features.js`
3. Find line: `// AnalyticsManager.initGA('G-XXXXXXXXXX');`
4. Uncomment and replace with your ID

### Enable Google Maps
1. Get API key from Google Cloud Console
2. Open `contact.html`
3. Replace `YOUR_API_KEY` in Maps embed URL

### Customize Content

#### Add Blog Post
Edit `blog.js`:
```javascript
const blogPosts = [
    {
        id: 11, // Unique ID
        title: 'Your Article Title',
        slug: 'your-article-slug',
        excerpt: 'Brief description...',
        content: '<p>Full article HTML...</p>',
        category: 'workout', // workout, nutrition, tips, news, motivation
        author: {
            name: 'Author Name',
            avatar: 'image-url.jpg'
        },
        date: '2024-10-25',
        readTime: 5,
        views: 0,
        likes: 0,
        image: 'featured-image.jpg',
        tags: ['Tag1', 'Tag2'],
        featured: false
    },
    // ... existing posts
];
```

#### Add Class to Booking System
Edit `booking.js`:
```javascript
const classesData = [
    {
        id: 6, // Unique ID
        name: 'New Class Name',
        type: 'cardio', // yoga, hiit, strength, cardio, spin
        time: '10:00 AM',
        duration: 45,
        trainer: 'Trainer Name',
        location: 'Studio B',
        capacity: 20,
        booked: 0,
        dates: ['2024-10-25', '2024-10-27'] // Available dates
    },
    // ... existing classes
];
```

#### Customize Colors
Edit `styles.css` (at the top):
```css
:root {
    --primary-red: #dc143c;    /* Change to your brand color */
    --dark-red: #a00;
    --black: #0a0a0a;
    --accent-gold: #ffd700;
}
```

## 🔧 Troubleshooting

### Charts Not Showing
**Problem:** Progress tracker charts are blank
**Solution:** 
- Check browser console for errors
- Verify Chart.js CDN is loading
- Clear localStorage: `localStorage.clear()`

### Push Notifications Not Working
**Problem:** No notification permission popup
**Solution:**
- Use HTTPS or localhost (not file://)
- Check browser settings → Site settings → Notifications
- Try different browser (Chrome/Firefox recommended)

### Booking Calendar Not Updating
**Problem:** Selected dates not highlighting
**Solution:**
- Ensure JavaScript is enabled
- Check browser console for errors
- Clear browser cache

### Images Not Loading
**Problem:** Broken image placeholders
**Solution:**
- Check internet connection (images from Unsplash CDN)
- Verify no ad blocker is blocking external resources

### Forms Not Submitting
**Problem:** Form validation errors
**Solution:**
- Fill all required fields (marked with *)
- Check email format
- Complete CAPTCHA if present
- Check rate limiting (wait 1 minute if too many attempts)

## 📱 Browser Compatibility

### Fully Supported
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Partially Supported
- ⚠️ IE 11 (Some features may not work)

### Required Browser Features
- JavaScript enabled
- Cookies/LocalStorage enabled
- Notifications API (optional)
- IntersectionObserver (for animations)

## 🎯 Next Steps

### For Development
1. **Backend Integration**
   - Choose stack: Node.js + Express or Python + Django
   - Setup database: MongoDB or PostgreSQL
   - Implement REST API endpoints

2. **Authentication**
   - Add user registration/login
   - Implement JWT or session-based auth
   - Secure routes and data

3. **Payment Processing**
   - Integrate Stripe or PayPal
   - Create checkout flow
   - Handle subscriptions

### For Production
1. **Deployment**
   - Choose platform: Netlify, Vercel, AWS, or traditional hosting
   - Setup custom domain
   - Enable SSL certificate

2. **Analytics**
   - Setup Google Analytics
   - Configure conversion tracking
   - Monitor user behavior

3. **SEO**
   - Submit sitemap to Google Search Console
   - Optimize meta descriptions
   - Add structured data

## 📚 Resources

### Documentation
- Main README: `README.md`
- Setup Guide: `SETUP.md` (this file)

### Code Comments
All JavaScript files have detailed comments explaining:
- Function purposes
- Parameter descriptions
- Return values
- Usage examples

### External Links
- Chart.js Docs: https://www.chartjs.org/docs/
- Font Awesome Icons: https://fontawesome.com/icons
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

## 🆘 Getting Help

### Check Console
Open browser DevTools (F12) → Console tab:
- Look for error messages
- Check network requests
- Verify JavaScript loading

### Clear Data
If experiencing issues:
```javascript
// In browser console:
localStorage.clear();      // Clear all saved data
sessionStorage.clear();    // Clear session data
location.reload();         // Reload page
```

### Test Features
```javascript
// In browser console:

// Check advanced features loaded
console.log(NotificationManager);

// Test notification permission
Notification.requestPermission();

// View bookings
console.log(JSON.parse(localStorage.getItem('pulsefitBookings')));

// Test security validation
SecurityManager.validateEmail('test@example.com');
```

## ✅ Pre-Launch Checklist

Before deploying to production:

### Content
- [ ] Replace sample content with real data
- [ ] Update contact information
- [ ] Add real trainer profiles
- [ ] Upload actual class schedule
- [ ] Write genuine blog posts

### Branding
- [ ] Update logo and favicon
- [ ] Customize color scheme
- [ ] Replace placeholder images
- [ ] Update footer links

### Technical
- [ ] Add Google Analytics ID
- [ ] Configure Google Maps API key
- [ ] Test all forms
- [ ] Verify links work
- [ ] Check mobile responsiveness

### Legal
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] GDPR compliance (if EU users)
- [ ] Cookie consent banner

### Performance
- [ ] Run Lighthouse audit (90+ scores)
- [ ] Optimize images
- [ ] Test page load speed
- [ ] Verify on multiple devices

---

**Ready to go? Open `index.html` and start exploring!** 🎉

For detailed feature documentation, see `README.md`
