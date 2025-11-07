# Dark & Light Theme - Usage Examples

## Quick Start

### Using the Theme Toggle
1. **Click the sun/moon icon** in the navbar (top right)
2. **Theme switches instantly** between light and dark
3. **Preference is saved** automatically to localStorage
4. **Returns on next visit** with the same theme

---

## Using useTheme Hook in Components

### Basic Usage
```javascript
import { useTheme } from '../contexts/ThemeContext';

export default function MyComponent() {
  const { theme, toggleTheme, isDark, isLight } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {isDark && <p>Dark mode is enabled!</p>}
    </div>
  );
}
```

### Conditional Rendering
```javascript
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeAwareComponent() {
  const { isDark } = useTheme();

  return (
    <div>
      {isDark ? (
        <img src="/logo-dark.png" alt="Logo" />
      ) : (
        <img src="/logo-light.png" alt="Logo" />
      )}
    </div>
  );
}
```

### Storing Theme Preference
```javascript
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function UserSettings() {
  const { theme } = useTheme();
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    // Load user settings (could include theme preference)
    const settings = {
      theme,
      language: 'en',
      notifications: true,
    };
    setUserSettings(settings);
  }, [theme]);

  return <div>Theme: {theme}</div>;
}
```

---

## Tailwind Dark Mode in Templates

### Simple Dark Mode Support
```javascript
export default function Card() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2>Card Title</h2>
      <p>Card content</p>
    </div>
  );
}
```

### Complex Components with Transitions
```javascript
export default function Button() {
  return (
    <button className="
      px-4 py-2
      bg-blue-500 dark:bg-blue-700
      text-white
      border border-blue-600 dark:border-blue-800
      hover:bg-blue-600 dark:hover:bg-blue-800
      focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600
      transition-colors duration-300
      rounded-lg
    ">
      Click me
    </button>
  );
}
```

### Navbar Example (Updated)
```javascript
export default function Navbar() {
  return (
    <nav className="
      sticky top-0 z-50
      bg-white dark:bg-primary-black
      text-gray-900 dark:text-white
      shadow-xl
      transition-colors duration-300
    ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="
          w-10 h-10
          bg-accent-orange dark:bg-accent-silver
          rounded-lg
          flex items-center justify-center
          transition-colors duration-300
        ">
          <span className="
            text-white dark:text-primary-black
            font-bold
            transition-colors duration-300
          ">
            FC
          </span>
        </div>

        {/* Navigation Links */}
        <a href="/" className="
          text-gray-900 dark:text-white
          hover:text-accent-orange dark:hover:text-accent-silver
          transition-colors duration-300
        ">
          Home
        </a>
      </div>
    </nav>
  );
}
```

---

## CSS Variables for Custom Styling

### Accessing Theme Colors in CSS
```css
/* Using CSS variables */
.card {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-color: var(--color-border);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Automatically switches with theme */
/* Light: white background, dark text */
/* Dark: black background, light text */
```

### All Available CSS Variables
```css
/* Primary Colors */
--color-primary-navy: #0b132b;
--color-primary-charcoal: #1c1c1e;

/* Accent Colors */
--color-accent-blue: #007bff;
--color-accent-orange: #ff6700;

/* Neutral Colors (light theme) */
--color-neutral-light: #f5f5f5;
--color-white: #ffffff;

/* Background & Text (theme-aware) */
--color-bg-primary: #ffffff (light) / #0a0a0a (dark)
--color-bg-secondary: #f3f4f6 (light) / #1a1a1a (dark)
--color-text-primary: #1f2937 (light) / #f3f4f6 (dark)
--color-text-secondary: #6b7280 (light) / #d1d5db (dark)
--color-border: #e5e7eb (light) / #374151 (dark)
```

---

## Real-World Examples

### Form Input with Dark Mode
```javascript
export default function FormInput({ label, placeholder }) {
  return (
    <div className="mb-4">
      <label className="
        block
        text-sm font-semibold
        text-gray-700 dark:text-gray-300
        mb-2
      ">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full
          px-4 py-2
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          border border-gray-300 dark:border-gray-600
          rounded-lg
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-blue-500 dark:focus:border-blue-400
          placeholder-gray-500 dark:placeholder-gray-400
          transition-colors duration-300
        "
      />
    </div>
  );
}
```

### Card Component with Hover Effect
```javascript
export default function ProductCard({ product }) {
  return (
    <div className="
      bg-white dark:bg-gray-800
      rounded-lg
      shadow-md hover:shadow-lg
      dark:shadow-gray-900 dark:hover:shadow-gray-700
      p-6
      transition-shadow duration-300
      border border-gray-200 dark:border-gray-700
    ">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="
        text-xl font-bold
        text-gray-900 dark:text-white
        mb-2
      ">
        {product.name}
      </h3>
      <p className="
        text-gray-600 dark:text-gray-400
        mb-4
      ">
        {product.description}
      </p>
      <button className="
        w-full
        bg-blue-500 dark:bg-blue-700
        hover:bg-blue-600 dark:hover:bg-blue-800
        text-white
        font-semibold
        py-2 px-4
        rounded-lg
        transition-colors duration-300
      ">
        View Details
      </button>
    </div>
  );
}
```

---

## Best Practices

### ✅ DO

1. **Use Tailwind's dark: prefix**
   ```javascript
   className="bg-white dark:bg-black"  // Good
   ```

2. **Add transition duration**
   ```javascript
   className="... transition-colors duration-300"  // Smooth switch
   ```

3. **Test both themes**
   - Open browser DevTools
   - Toggle dark mode on and off
   - Verify readability in both themes

4. **Use semantic color variables**
   ```javascript
   className="text-gray-900 dark:text-white"  // Good
   ```

5. **Group related dark mode classes**
   ```javascript
   className="
     bg-white dark:bg-black
     text-gray-900 dark:text-white
     border-gray-300 dark:border-gray-600
   "
   ```

### ❌ DON'T

1. **Don't hardcode colors**
   ```javascript
   className="bg-[#ffffff]"  // Bad - won't respect theme
   ```

2. **Don't forget hover/focus states**
   ```javascript
   className="hover:bg-gray-100 dark:hover:bg-gray-800"  // Good
   ```

3. **Don't use colors that don't contrast**
   - Light text on light background is unreadable
   - Always verify contrast in both themes

4. **Don't skip testing**
   - Test your component in both light and dark modes
   - Use browser's accessibility checker

---

## Theme Detection in JavaScript

### Check Current Theme
```javascript
import { useTheme } from '../contexts/ThemeContext';

export default function MyComponent() {
  const { isDark, isLight, theme } = useTheme();

  if (isDark) {
    // Do something in dark mode
  }

  if (isLight) {
    // Do something in light mode
  }

  console.log(`Current theme: ${theme}`);
}
```

### Check System Preference (No Hook)
```javascript
// Check if user prefers dark mode in their OS settings
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) {
  console.log('User prefers dark mode in their OS');
}
```

---

## Debugging Theme Issues

### Check Current Theme Class
```javascript
// In browser console
document.documentElement.classList.contains('dark')
// Returns true if dark mode is active

// Check HTML element
console.log(document.documentElement.className)
// Should show "dark" in dark mode
```

### Verify CSS Variables
```javascript
// In browser console
const style = window.getComputedStyle(document.documentElement);
console.log(style.getPropertyValue('--color-bg-primary').trim());
// Shows the current theme's background color
```

### Check localStorage
```javascript
// In browser console
console.log(localStorage.getItem('theme'));
// Returns 'light', 'dark', or null
```

---

## Performance Tips

1. **Debounce theme changes** if doing heavy operations
2. **Cache theme preference** to avoid localStorage reads
3. **Use CSS variables** instead of JavaScript for style changes
4. **Minimize re-renders** in theme-dependent components
5. **Preload theme colors** to avoid FOUC (Flash of Unstyled Content)

---

## Accessibility Notes

✅ **Good practice**
- Theme toggle has clear ARIA labels
- Icons have aria-hidden="true"
- Keyboard navigable
- Sufficient contrast in both themes
- Focus states visible

✅ **Follow WCAG guidelines**
- Minimum 4.5:1 contrast for text
- 3:1 contrast for graphics
- Test with accessibility tools

---

**Last Updated:** November 2025
**Status:** Ready for production
