# Local Testing Guide - Fusion Cars

## 🚀 Development Server is Running!

**Server Status:** ✅ Active and Ready
**URL:** `http://localhost:3001`
**Port:** 3001 (Port 3000 was in use, so it switched to 3001)
**Started:** Just now
**Ready in:** 5.8 seconds

---

## 📱 How to Access the Site

### Option 1: Open in Browser
Click or navigate to: **http://localhost:3001**

### Option 2: Direct URLs
- **Home Page:** http://localhost:3001
- **Inventory:** http://localhost:3001/inventory
- **About:** http://localhost:3001/about
- **Contact:** http://localhost:3001/contact

---

## 🎨 Testing the Dark/Light Theme Feature

### Step 1: Open the Site
Navigate to **http://localhost:3001** in your browser

### Step 2: Find the Theme Toggle
Look in the **top right of the navbar** for a:
- ☀️ **Sun icon** (Light mode is active)
- 🌙 **Moon icon** (Dark mode is active)

### Step 3: Test Theme Switching
1. **Click the sun/moon icon** to toggle between light and dark themes
2. **Observe the changes:**
   - Background color changes (white ↔ black)
   - Text color changes (dark ↔ light)
   - Accent colors adjust for contrast
3. **Refresh the page** - Your theme preference is saved!

### Step 4: Verify Both Themes Work
Test on all pages:
- ✅ Home page
- ✅ Inventory page
- ✅ About page
- ✅ Contact page

---

## 🔍 What to Test

### Light Theme (Default)
- ✅ White background
- ✅ Dark gray text
- ✅ Good contrast
- ✅ Orange accents
- ✅ Clear visibility

### Dark Theme
- ✅ Near-black background
- ✅ Light gray text
- ✅ Good contrast
- ✅ Orange accents
- ✅ Easy on the eyes

### Functionality to Test
- ✅ Theme toggle button works
- ✅ Smooth transitions between themes
- ✅ Theme persists on page refresh
- ✅ Theme applies to all pages
- ✅ All components respond to theme
- ✅ Icons animate smoothly
- ✅ Hover states visible in both themes

---

## 🧪 Testing Pages

### Home Page (/)
**Elements to Check:**
- Navbar with theme toggle
- Hero section
- Car cards
- Testimonials section
- Footer

**Theme Test:**
- Click theme toggle → All colors change smoothly
- Check navbar → Logo changes color
- Check cards → Background changes
- Check text → Readable in both themes

### Inventory Page (/inventory)
**Elements to Check:**
- Page header with title
- Filter sidebar
- Car listing grid
- Sorting dropdown
- Search functionality

**Theme Test:**
- Header background changes
- Filter panel background changes
- Car cards look good in both themes
- Buttons are readable

### About Page (/about)
**Elements to Check:**
- Hero section
- Story section
- Mission & Vision cards
- Core Values grid
- Statistics section
- Team section
- CTA button

**Theme Test:**
- All sections respond to theme
- Text contrast is good
- Card backgrounds change appropriately

### Contact Page (/contact)
**Elements to Check:**
- Hero section
- Contact methods grid
- Contact form
- Form input fields
- Map placeholder
- Info section

**Theme Test:**
- Form inputs are visible in both themes
- Labels are readable
- Buttons show theme colors
- Form looks professional

---

## 💾 localStorage Testing

### Check Saved Theme
Open browser console (F12) and type:
```javascript
localStorage.getItem('theme')
```

**Expected Output:**
- `"light"` (if light theme is active)
- `"dark"` (if dark theme is active)

### Clear Theme Preference
```javascript
localStorage.removeItem('theme')
```
Then refresh the page - it will default to system preference or light theme.

### Check All localStorage
```javascript
localStorage
```
Shows all saved data including theme preference.

---

## 🎯 Quick Test Checklist

### Basic Functionality
- [ ] Site loads on http://localhost:3001
- [ ] Navbar appears on all pages
- [ ] Theme toggle button is visible
- [ ] All pages are accessible via navbar links

### Theme Toggle
- [ ] Light theme works
- [ ] Dark theme works
- [ ] Smooth transitions between themes
- [ ] Theme applies to entire page
- [ ] All text is readable in both themes

### Persistence
- [ ] Theme choice is saved to localStorage
- [ ] Refresh page → theme persists
- [ ] Close browser → theme persists
- [ ] Open in different tab → same theme appears

### Pages
- [ ] Home page looks good in both themes
- [ ] Inventory page looks good in both themes
- [ ] About page looks good in both themes
- [ ] Contact page looks good in both themes

### Responsiveness
- [ ] Works on desktop browser
- [ ] Navbar is responsive
- [ ] Theme toggle works on mobile view
- [ ] Content is readable on mobile

### Accessibility
- [ ] Theme toggle has tooltip
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast is sufficient

---

## 🐛 Known Issues to Test

None known at this time! Report any issues you find.

---

## 📊 Browser Console Checks

### Check if Dark Mode Class is Applied
```javascript
document.documentElement.classList.contains('dark')
```
**Returns:** `true` (dark mode) or `false` (light mode)

### Check CSS Variables
```javascript
const style = window.getComputedStyle(document.documentElement);
console.log(style.getPropertyValue('--color-bg-primary'));
```
**Shows:** Current theme's background color

### Check Theme Context
Open DevTools → React Developer Tools (if installed)
- Find `ThemeProvider` in component tree
- Check its context value
- Should show current theme and toggle function

---

## 🎨 Visual Testing

### Compare Light and Dark Themes

**Light Theme Expected:**
- Background: Pure white (#FFFFFF)
- Text: Dark gray (#1F2937)
- Borders: Light gray (#E5E7EB)
- Cards: White background
- Navbar: White or light background

**Dark Theme Expected:**
- Background: Almost black (#0A0A0A)
- Text: Light gray (#F3F4F6)
- Borders: Dark gray (#374151)
- Cards: Dark backgrounds
- Navbar: Dark background

---

## 📝 Testing Report Template

Copy this to document your testing:

```
Testing Date: _______
Tester: _______
Browser: _______
OS: _______

THEME TOGGLE
- Light theme works: ☐ Yes ☐ No
- Dark theme works: ☐ Yes ☐ No
- Smooth transitions: ☐ Yes ☐ No

PAGES TESTED
- Home: ☐ Pass ☐ Fail
- Inventory: ☐ Pass ☐ Fail
- About: ☐ Pass ☐ Fail
- Contact: ☐ Pass ☐ Fail

READABILITY
- Light theme text readable: ☐ Yes ☐ No
- Dark theme text readable: ☐ Yes ☐ No
- Good contrast in both: ☐ Yes ☐ No

PERSISTENCE
- Theme saved to localStorage: ☐ Yes ☐ No
- Theme persists on refresh: ☐ Yes ☐ No
- Theme persists across pages: ☐ Yes ☐ No

ISSUES FOUND
(List any problems here)
```

---

## 🚨 Troubleshooting

### Server Won't Start
```bash
cd FE_FusionCrs
npm run dev
```

### Port 3001 Already in Use
```bash
# Stop the dev server (Ctrl+C) and try again
npm run dev
```

### Theme Not Toggling
1. Check browser console for errors (F12)
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page
4. Try toggling again

### Theme Doesn't Persist
1. Check if localStorage is enabled
2. Check if the browser allows localStorage
3. Open DevTools → Application → Storage → localStorage
4. Should see `theme` entry

### CSS Not Loading
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Restart the dev server

---

## 💡 Tips for Testing

1. **Use DevTools** - Open DevTools (F12) to watch for errors
2. **Test All Pages** - Theme should work on every page
3. **Test on Mobile** - Use responsive design mode
4. **Test Accessibility** - Use keyboard to navigate
5. **Check Contrast** - Use accessibility tools to verify contrast
6. **Clear Cache** - Clear cache between tests for fresh start
7. **Check Console** - Look for any JavaScript errors
8. **Test Persistence** - Refresh and close/reopen to verify saving

---

## ✅ Ready to Test!

Your development server is running and ready for testing!

**Next Steps:**
1. Open http://localhost:3001 in your browser
2. Click the sun/moon icon to test the theme
3. Navigate through all pages
4. Verify everything works as expected

**If you find any issues:**
1. Note the page and steps to reproduce
2. Check the browser console for errors
3. Take a screenshot if helpful
4. Report the issue

---

**Last Updated:** November 2025
**Server Port:** 3001
**Status:** ✅ Ready for Testing
