# Stunning UI/UX Components Documentation

This document provides comprehensive information about the stunning UI/UX components created for your agriculture-related cab booking portal with dark theme, glassmorphism effects, and green color scheme.

## 🎨 Design Philosophy

- **Dark Theme**: Professional dark slate background with elegant gradients
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Green Accent**: Agriculture-themed green color palette
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📱 Components Overview

### 1. BookingCard

A stunning card component for displaying equipment/cab booking information with glassmorphism effects.

#### Props:
```javascript
{
  title: string,              // Equipment title
  image: string,              // Equipment image URL
  price: number,              // Price per day
  rating: number,             // Rating (1-5)
  location: string,           // Location info
  availability: string,       // 'available', 'busy', 'offline'
  features: string[],         // List of features
  onBook: function,           // Booking callback
  variant: string,            // 'default', 'featured', 'premium'
  className: string           // Additional CSS classes
}
```

#### Usage:
```javascript
import { BookingCard } from '../components/common';

<BookingCard
  title="John Deere 8370R Tractor"
  price={350}
  rating={4.8}
  location="Fresno County, CA"
  availability="available"
  features={["GPS Guidance", "Air Conditioning", "4WD"]}
  variant="featured"
  onBook={() => handleBooking()}
/>
```

#### Variants:
- `default`: Standard glassmorphism card
- `featured`: Enhanced with green gradient and "Featured" badge
- `premium`: Golden gradient with "Premium" badge

### 2. StatusBadge

Beautiful status indicators with glassmorphism effects for showing various states.

#### Props:
```javascript
{
  status: string,             // Status key (e.g., 'available', 'pending')
  label: string,              // Custom label (optional)
  variant: string,            // 'success', 'warning', 'error', 'info', 'primary'
  size: string,               // 'xs', 'sm', 'md', 'lg', 'xl'
  animate: boolean,           // Enable entrance animation
  pulse: boolean,             // Enable pulsing animation
  icon: string,               // Custom icon (optional)
  className: string           // Additional CSS classes
}
```

#### Usage:
```javascript
import { StatusBadge } from '../components/common';

<StatusBadge 
  status="available" 
  variant="success" 
  size="md" 
  animate={true} 
/>

<StatusBadge 
  status="pending" 
  variant="warning" 
  pulse={true} 
/>
```

#### Pre-defined Status Icons:
- `pending`: ⏳
- `approved`: ✅
- `rejected`: ❌
- `in_progress`: 🔄
- `completed`: 🎉
- `cancelled`: 🚫
- `available`: 🟢
- `busy`: 🟡
- `offline`: 🔴
- `verified`: ✅
- `premium`: ⭐

### 3. FeatureCard

Highlight agriculture-specific features with beautiful hover effects and glassmorphism.

#### Props:
```javascript
{
  icon: string|component,     // Feature icon
  title: string,              // Feature title
  description: string,        // Feature description
  variant: string,            // 'default', 'primary', 'secondary', 'accent'
  size: string,               // 'sm', 'md', 'lg'
  animate: boolean,           // Enable animations
  onClick: function,          // Click handler (optional)
  className: string           // Additional CSS classes
}
```

#### Usage:
```javascript
import { FeatureCard } from '../components/common';

<FeatureCard
  icon="🌾"
  title="Crop Management"
  description="Advanced equipment for precision agriculture"
  variant="primary"
  size="md"
  onClick={() => handleFeatureClick()}
/>
```

#### Variants:
- `default`: Standard glassmorphism
- `primary`: Green gradient accent
- `secondary`: Slate gradient
- `accent`: Emerald gradient

### 4. NavigationPills

Smooth navigation tabs with glassmorphism and animated active states.

#### Props:
```javascript
{
  items: array,               // Navigation items
  activeItem: string,         // Active item ID
  onItemChange: function,     // Change handler
  variant: string,            // 'default', 'glass', 'solid'
  size: string,               // 'sm', 'md', 'lg'
  orientation: string,        // 'horizontal', 'vertical'
  className: string           // Additional CSS classes
}
```

#### Item Structure:
```javascript
{
  id: string,                 // Unique identifier
  label: string,              // Display text
  icon: string,               // Icon (optional)
  badge: string,              // Badge text (optional)
  value: string               // Alternative to id
}
```

#### Usage:
```javascript
import { NavigationPills } from '../components/common';

const items = [
  { id: 'equipment', label: 'Equipment', icon: '🚜' },
  { id: 'bookings', label: 'Bookings', icon: '📅', badge: '3' },
  { id: 'profile', label: 'Profile', icon: '👤' }
];

<NavigationPills
  items={items}
  activeItem="equipment"
  onItemChange={(item) => setActive(item.id)}
  variant="glass"
  size="md"
/>
```

### 5. ProgressIndicator

Show booking process steps with beautiful animations and glassmorphism.

#### Props:
```javascript
{
  steps: array,               // Array of steps
  currentStep: number,        // Current step index (0-based)
  variant: string,            // 'default', 'glass', 'minimal'
  orientation: string,        // 'horizontal', 'vertical'
  showLabels: boolean,        // Show step labels
  showStepNumbers: boolean,   // Show step numbers
  className: string           // Additional CSS classes
}
```

#### Step Structure:
```javascript
{
  id: string|number,          // Step identifier
  label: string,              // Step title
  description: string,        // Step description (optional)
  icon: string                // Custom icon (optional)
}
```

#### Usage:
```javascript
import { ProgressIndicator } from '../components/common';

const steps = [
  { id: 1, label: "Select Equipment", description: "Choose your machinery" },
  { id: 2, label: "Schedule Date", description: "Pick your time" },
  { id: 3, label: "Payment", description: "Secure checkout" }
];

<ProgressIndicator
  steps={steps}
  currentStep={1}
  variant="glass"
  orientation="horizontal"
  showLabels={true}
/>
```

### 6. HeroSection

Stunning landing section with animated background elements and agriculture theming.

#### Props:
```javascript
{
  title: string,              // Main headline
  subtitle: string,           // Supporting text
  backgroundImage: string,    // Background image URL (optional)
  primaryAction: object,      // Primary button config
  secondaryAction: object,    // Secondary button config
  features: array,            // Feature highlights
  stats: array,               // Statistics display
  className: string           // Additional CSS classes
}
```

#### Action Structure:
```javascript
{
  label: string,              // Button text
  onClick: function           // Click handler
}
```

#### Feature Structure:
```javascript
{
  icon: string,               // Feature icon
  text: string                // Feature text
}
```

#### Stats Structure:
```javascript
{
  value: string,              // Statistic value
  label: string               // Statistic label
}
```

#### Usage:
```javascript
import { HeroSection } from '../components/common';

<HeroSection
  title="Book Agricultural Equipment"
  subtitle="Connect with verified operators in your area"
  primaryAction={{ 
    label: "Start Booking", 
    onClick: () => navigate('/booking') 
  }}
  secondaryAction={{ 
    label: "Learn More", 
    onClick: () => navigate('/about') 
  }}
  features={[
    { icon: "🚜", text: "500+ Tractors" },
    { icon: "⚡", text: "Same-Day Booking" }
  ]}
  stats={[
    { value: "10K+", label: "Happy Farmers" },
    { value: "95%", label: "Satisfaction Rate" }
  ]}
/>
```

## 🎯 Usage Tips

### 1. Importing Components
```javascript
// Individual imports
import { BookingCard, StatusBadge } from '../components/common';

// Or import specific component
import BookingCard from '../components/common/BookingCard';
```

### 2. Styling Best Practices
- Use the provided `variant` props for different styles
- Leverage `className` for minor customizations
- Maintain consistent spacing with Tailwind utilities
- Test responsiveness across devices

### 3. Animation Performance
- Components use Framer Motion for smooth animations
- `animate={false}` can disable animations if needed
- Stagger animations for groups of components

### 4. Accessibility
- All components include proper ARIA attributes
- Keyboard navigation is supported
- Color contrast meets WCAG guidelines
- Screen reader friendly

## 🚀 Getting Started

1. **View the Showcase**: Visit `/showcase` route to see all components in action
2. **Copy Examples**: Use the provided code examples as starting points
3. **Customize**: Modify variants and props to match your needs
4. **Integrate**: Add components to your existing pages

## 🎨 Color Palette

The components use the following agriculture-themed colors:

- **Primary Green**: `#22c55e` (500) - Main accent color
- **Dark Background**: `#0f172a` (slate-900) - Primary background
- **Glass Effects**: White with 10-20% opacity
- **Text Colors**: White, slate-300, slate-400 for hierarchy

## 📱 Responsive Design

All components are fully responsive with:
- Mobile-first approach
- Breakpoint-specific styling
- Touch-friendly interactions
- Optimized animations for mobile

## 🔧 Customization

### Adding New Variants
Components support custom variants. Add new ones by extending the `variants` object:

```javascript
const variants = {
  // ... existing variants
  custom: "bg-purple-500/20 border-purple-400/30 text-purple-300"
};
```

### Custom Animations
Leverage Framer Motion for custom animations:

```javascript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <YourComponent />
</motion.div>
```

## 📄 Examples

Check the `ComponentShowcase.jsx` file for comprehensive examples of all components in action with agriculture-specific data and interactions.

---

Created for agriculture cab booking portal with ❤️ using React, Tailwind CSS, and Framer Motion.