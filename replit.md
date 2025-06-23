# Jay Giriraj Hotel & Restaurant Website

## Overview

This is a static website for Jay Giriraj Hotel & Restaurant, built using pure HTML, CSS, and JavaScript. The website serves as the digital presence for the restaurant, providing information about their vegetarian cuisine, services, and allowing customers to get in touch or provide feedback.

## System Architecture

### Frontend Architecture
- **Static Site**: Pure HTML/CSS/JavaScript implementation without a backend framework
- **Multi-page Structure**: Traditional multi-page website with separate HTML files for different sections
- **Responsive Design**: Mobile-first approach using CSS media queries
- **Typography**: Google Fonts integration (Playfair Display for headings, Inter for body text)
- **Icons**: Font Awesome for consistent iconography

### File Structure
```
/
├── index.html              # Homepage
├── pages/                  # Individual page files
│   ├── about.html
│   ├── contact.html
│   ├── feedback.html
│   ├── menu.html
│   └── services.html
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   └── js/
│       └── script.js       # Client-side functionality
└── .replit                 # Replit configuration
```

## Key Components

### Navigation System
- Consistent navigation across all pages
- Mobile-responsive hamburger menu
- Active page highlighting
- Logo/brand identity integration

### Page Structure
1. **Homepage** - Main landing page with hero section
2. **Services** - Restaurant services and offerings
3. **Menu** - Food and beverage listings
4. **About** - Restaurant story and information
5. **Contact** - Location and contact information
6. **Feedback** - Customer feedback collection

### JavaScript Functionality
- Form validation utilities (email, phone)
- Message display system
- Debounce utility for performance
- Menu filtering capabilities
- Responsive navigation handling

### CSS Architecture
- Reset and base styles for consistency
- Typography system with font hierarchy
- Utility classes for common patterns
- Component-based styling approach
- Fade-in animations and transitions

## Data Flow

### Client-Side Only
- No server-side processing
- Form submissions likely handled via JavaScript
- Static content delivery
- No database integration (currently)

### User Interactions
1. Navigation between pages
2. Form submissions (contact, feedback)
3. Menu browsing and filtering
4. Responsive mobile interactions

## External Dependencies

### CDN Resources
- **Google Fonts**: Playfair Display and Inter font families
- **Font Awesome 6.4.0**: Icon library for UI elements

### Development Environment
- **Python HTTP Server**: Simple static file serving for development
- **Replit Environment**: Node.js 20 and Python 3.11 modules available

## Deployment Strategy

### Current Setup
- **Development**: Python HTTP server on port 5000
- **Production**: Static file deployment compatible
- **Hosting**: Can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

### Build Process
- No build process required (pure static files)
- Direct file serving from root directory
- Assets organized in conventional structure

### Scaling Considerations
- Easy to add backend functionality later
- Database integration possible for dynamic content
- Form handling can be enhanced with server-side processing
- CDN integration recommended for production

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 23, 2025. Initial setup