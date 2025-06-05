# Riser - Professional Career Matching Website

A modern, responsive website for Riser - the career matching app that connects talent with opportunities through authentic connections.

## 🚀 Features

### Design & UX
- **Modern, Professional Design**: Clean, punchy interface with premium feel
- **Gradient Backgrounds**: Eye-catching purple-to-blue gradients
- **Responsive Layout**: Optimized for all devices (mobile, tablet, desktop)
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Glass Morphism Effects**: Modern blur effects and transparency

### Sections
1. **Hero Section**: Compelling headline with animated stats and app preview
2. **Features Grid**: 6 key benefits with icons and descriptions
3. **How It Works**: 3-step process with visual illustrations
4. **Testimonials**: Social proof from real users
5. **Download CTA**: App store badges and waitlist signup
6. **Footer**: Complete site navigation and contact info

### Interactive Elements
- **Parallax Scrolling**: Floating shapes with depth
- **Scroll Animations**: Elements animate as they enter viewport
- **Typing Effect**: Hero title types out on page load
- **3D Card Tilt**: Feature cards tilt on mouse movement
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Form Validation**: Email signup with real-time feedback

### Performance Optimizations
- **Lazy Loading**: Images load as needed
- **Debounced Scroll**: Optimized scroll event handling
- **Image Preloading**: Critical assets load immediately
- **Modern CSS**: Hardware-accelerated animations

## 🛠 Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks - pure performance
- **Inter Font**: Professional typography from Google Fonts
- **SVG Icons**: Scalable vector graphics for crisp visuals

## 📁 File Structure

```
riser-website/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and animations
├── script.js           # JavaScript functionality
├── README.md           # This documentation
└── assets-inspiration/ # Image assets and resources
    ├── RISERROCKET_WHITE-768x230.png
    ├── Frame-182.png
    ├── appstore.svg
    ├── playstore.svg
    └── [other assets...]
```

## 🎨 Color Palette

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Accent**: `#f59e0b` (Amber)
- **Text**: `#111827` (Dark Gray)
- **Background**: `#ffffff` (White)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## ⚡ Key Animations

### Hero Section
- Slide-in animations for text elements
- 3D perspective effect on phone mockup
- Floating background shapes with rotation
- Bouncing scroll indicator

### Feature Cards
- Hover lift effect with shadow
- 3D tilt on mouse movement
- Staggered fade-in animations

### Navigation
- Smooth background blur on scroll
- Hamburger menu transformation
- Underline hover effects

## 🚀 Deployment

### Static Hosting (Recommended)
1. Upload all files to your web server
2. Ensure `index.html` is in the root directory
3. No build process required - ready to serve!

### Popular Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Free hosting for public repos
- **AWS S3**: Enterprise hosting solution

### Custom Domain
Update the following for your domain:
- Meta tags for SEO
- Analytics tracking code
- Contact email addresses

## 🔧 Customization

### Brand Colors
Update CSS custom properties in `:root`:
```css
:root {
    --primary-color: #your-color;
    --gradient-primary: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

### Content Updates
- **Hero Stats**: Update numbers in `script.js` and HTML
- **Testimonials**: Replace with real customer quotes
- **Features**: Modify text and icons as needed
- **Images**: Replace with your actual app screenshots

### App Store Links
Update download button `href` attributes:
```html
<a href="https://apps.apple.com/your-app" class="download-btn">
<a href="https://play.google.com/store/apps/your-app" class="download-btn">
```

## 📊 Analytics Setup

Add your tracking code before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)...
</script>
```

## 🎯 SEO Optimization

### Meta Tags
- Title and description optimized for search
- Open Graph tags for social sharing
- Structured data for rich snippets

### Performance
- Optimized images (WebP recommended)
- Minified CSS/JS for production
- Gzip compression enabled

## 🧪 Testing

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Mobile Testing
- iOS Safari
- Chrome Mobile
- Samsung Internet

## 🐛 Known Issues & Fixes

### Common Issues
1. **Images not loading**: Check file paths in HTML
2. **Animations not working**: Verify JavaScript console for errors
3. **Mobile menu not closing**: Clear browser cache

### Performance Tips
- Optimize images before upload
- Use WebP format when possible
- Enable compression on your server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support:
- **Email**: contact@riserapp.co
- **Website**: https://riserapp.co

---

**Built with ❤️ for the future of work** 