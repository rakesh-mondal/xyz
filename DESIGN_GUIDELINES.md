# Krutrim Cloud Comprehensive UI Style Guide

This document provides a complete reference for the Krutrim Cloud application's design system, visual language, and UI/UX standards. It is intended for designers and developers to ensure consistency and quality across all user interfaces.

---

## 1. Design System & Frameworks
- **Tailwind CSS** for utility-first styling and theming.
- **Open Sauce One** as the primary font family.
- **shadcn/ui** and **lucide** for UI components and icons.

---

## 2. Color Palette

### Light Theme
- `--background`: `#fff` (white)
- `--foreground`: dark gray (`hsl(222.2, 84%, 4.9%)`)
- `--primary`: black (`#000`)
- `--primary-foreground`: `hsl(210, 40%, 98%)`
- `--secondary`: `hsl(210, 40%, 96.1%)`
- `--secondary-foreground`: `hsl(222.2, 47.4%, 11.2%)`
- `--muted`: `hsl(210, 40%, 96.1%)`
- `--muted-foreground`: `hsl(215.4, 16.3%, 46.9%)`
- `--accent`: `hsl(210, 40%, 96.1%)`
- `--accent-foreground`: `hsl(222.2, 47.4%, 11.2%)`
- `--destructive`: `hsl(0, 84.2%, 60.2%)`
- `--destructive-foreground`: `hsl(210, 40%, 98%)`
- `--border`: `hsl(214.3, 31.8%, 91.4%)`
- `--input`: `hsl(214.3, 31.8%, 91.4%)`
- `--ring`: `hsl(222.2, 84%, 4.9%)`
- `--radius`: `0.5rem`
- `--link`: krutrim.green (`#4CAF50`)

### Dark Theme
- `--background`: `hsl(222.2, 84%, 4.9%)`
- `--foreground`: `hsl(210, 40%, 98%)`
- `--primary`: black (`#000`)
- `--primary-foreground`: `hsl(210, 40%, 98%)`
- `--secondary`: `hsl(217.2, 32.6%, 17.5%)`
- `--secondary-foreground`: `hsl(210, 40%, 98%)`
- `--muted`: `hsl(217.2, 32.6%, 17.5%)`
- `--muted-foreground`: `hsl(215, 20.2%, 65.1%)`
- `--accent`: `hsl(217.2, 32.6%, 17.5%)`
- `--accent-foreground`: `hsl(210, 40%, 98%)`
- `--destructive`: `hsl(0, 62.8%, 30.6%)`
- `--destructive-foreground`: `hsl(210, 40%, 98%)`
- `--border`: `hsl(217.2, 32.6%, 17.5%)`
- `--input`: `hsl(217.2, 32.6%, 17.5%)`
- `--ring`: `hsl(212.7, 26.8%, 83.9%)`
- `--link`: krutrim.green (`#4CAF50`)

### Brand Colors
- `krutrim.green`: `#4CAF50` (also used for links)
- `krutrim.dark`: `#212121`
- `krutrim.light`: `#F5F5F5`
- `krutrim.gray`: `#757575`

### Background Colors

| Name                | Variable                | Example Class         | Usage Example                |
|---------------------|------------------------|-----------------------|------------------------------|
| Main Background     | `--background`         | `bg-background`       | App/page background          |
| Card Background     | `--card`               | `bg-card`             | Cards, panels                |
| Popover Background  | `--popover`            | `bg-popover`          | Popovers, dropdowns          |
| Muted Background    | `--muted`              | `bg-muted`            | Muted/secondary sections     |
| Accent Background   | `--accent`             | `bg-accent`           | Highlighted/active elements  |
| Destructive         | `--destructive`        | `bg-destructive`      | Error/alert backgrounds      |
| Brand Green         | `krutrim.green`        | `bg-krutrim-green`    | Brand highlights             |
| Brand Dark          | `krutrim.dark`         | `bg-krutrim-dark`     | Brand, dark sections         |
| Brand Light         | `krutrim.light`        | `bg-krutrim-light`    | Brand, light sections        |
| Brand Gray          | `krutrim.gray`         | `bg-krutrim-gray`     | Neutral/brand backgrounds    |

**Example:**
```html
<div class="bg-card p-4 rounded-lg">Card content</div>
<div class="bg-accent p-2">Accent background</div>
<div class="bg-krutrim-green p-2">Brand green background</div>
```

### Link Color
- Use `krutrim.green` (`#4CAF50`) for all links and interactive text elements.

**Example:**
```html
<a class="text-krutrim-green underline hover:text-krutrim-green/80">Link text</a>
```

---

## 3. Typography

### Font Family
- Headings and body: `Open Sauce One`, fallback: `sans-serif`
- Reference: Use the official font files from [Krutrim AI Labs](https://ai-labs.olakrutrim.com/).
- **Font File Examples:**  
  - 300: `https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Light.woff2`
  - 400: `https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Regular.woff2`
  - 500: `https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Medium.woff2`
  - 600: `https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-SemiBold.woff2`
  - 700: `https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Bold.woff2`
  - 800: `https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-ExtraBold.woff2`
- **@font-face Example (all weights):**
  ```css
  @font-face {
    font-family: 'Open Sauce One';
    src: url('https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Light.woff2') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Open Sauce One';
    src: url('https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Open Sauce One';
    src: url('https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Open Sauce One';
    src: url('https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Open Sauce One';
    src: url('https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Open Sauce One';
    src: url('https://cdn.jsdelivr.net/gh/marcologous/Open-Sauce-Fonts@master/fonts/OpenSauceOne/OpenSauceOne-ExtraBold.woff2') format('woff2');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }
  ```

### Font Weight
- Headings: `600`
- Body: `400`

### Font Features
- `rlig` and `calt` enabled for body text

### Typography Scale
| Style     | Size    | Weight | Line Height | Usage Example         |
|-----------|---------|--------|-------------|----------------------|
| H1        | 2.25rem | 600    | 2.5rem      | Page titles          |
| H2        | 1.875rem| 600    | 2.25rem     | Section headings     |
| H3        | 1.5rem  | 600    | 2rem        | Subsection headings  |
| H4        | 1.25rem | 600    | 1.75rem     | Card titles          |
| Body      | 1rem    | 400    | 1.5rem      | Main content         |
| Small     | 0.875rem| 400    | 1.25rem     | Captions, meta       |
| Caption   | 0.75rem | 400    | 1rem        | Helper text, labels  |

**Example:**
```html
<h1 class="text-4xl font-semibold">Heading 1</h1>
<p class="text-base">Body text example</p>
```

---

## 4. Iconography
- Use [Lucide](https://lucide.dev/) icons for all UI elements.
- **Size:** 20–24px for most UI, 16px for inline text icons.
- **Color:** Use `currentColor` to inherit text color.
- **Placement:** Align with text baseline or center in buttons.
- **Do:**
  - Use consistent icon style and size.
  - Use icons to clarify actions, not as decoration.
- **Don't:**
  - Use multiple icon styles together.
  - Use icons without clear meaning.

**Example:**
```jsx
import { Check } from "lucide-react";
<Check className="w-5 h-5 text-primary" />
```

---

## 5. Button Styles

| Variant     | Example Class Names                | Usage                |
|-------------|------------------------------------|----------------------|
| Primary     | `bg-primary text-primary-foreground` | Main actions         |
| Secondary   | `bg-secondary text-secondary-foreground` | Secondary actions   |
| Destructive | `bg-destructive text-destructive-foreground` | Dangerous actions  |
| Ghost       | `bg-transparent hover:bg-muted`    | Minimal, subtle      |
| Disabled    | `opacity-50 cursor-not-allowed`    | Disabled state       |

**States:** Default, Hover, Active, Focus, Disabled

**Example:**
```html
<button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">Primary</button>
```

---

## 6. Form Elements
- **Inputs:** Use `rounded-md`, `border`, `px-3 py-2`, `focus:ring`.
- **Labels:** `block text-sm font-medium mb-1`
- **Validation:**
  - Error: `border-destructive`, `text-destructive`
  - Success: `border-green-500`, `text-green-600`
- **Helper Text:** `text-xs text-muted-foreground mt-1`

**Example:**
```html
<label class="block text-sm font-medium mb-1">Email</label>
<input class="border rounded-md px-3 py-2 w-full focus:ring focus:ring-primary" type="email" />
<span class="text-xs text-destructive">Invalid email address</span>
```

---

## 7. Component Library
- Use [shadcn/ui](https://ui.shadcn.com/) for base components.
- **Common Components:**
  - Button, Input, Select, Checkbox, Radio, Switch, Card, Modal, Alert, Table, Tabs, Tooltip, Avatar, Badge, Progress, Skeleton, Toast, etc.
- **Documentation:**
  - Each component must have JSDoc-style comments (see below).
  - Include usage, props, and examples.

---

## 8. Grid & Layout System
- **Container:** Centered, `2rem` padding, max width `1400px`.
- **Grid:** Use Tailwind's grid utilities (`grid`, `grid-cols-2`, etc.).
- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px
- **Spacing:** Use Tailwind spacing scale (`gap-4`, `p-6`, etc.).

**Example:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

---

## 9. Elevation & Shadows
- **Box Shadow:** Minimal: `shadow-sm` (`0 1px 2px 0 rgba(0,0,0,0.05)`)
- **Elevation Levels:**
  - `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`
- Use higher elevation for modals, dropdowns, tooltips.

---

## 10. Motion & Animation
- Use Tailwind's transition utilities (`transition`, `duration-200`, `ease-in-out`).
- **Micro-interactions:**
  - Button hover: `hover:scale-105`
  - Modal open/close: fade and scale
- **Timing:** 150–300ms for most UI transitions.

---

## 11. Accessibility
- **Color Contrast:** Meet WCAG AA for text and UI elements.
- **Keyboard Navigation:** All interactive elements must be focusable and usable via keyboard.
- **ARIA:** Use appropriate ARIA attributes for custom components.
- **Focus Styles:** Always visible, e.g., `focus:ring-2 focus:ring-primary`.

---

## 12. Branding
- **Logo:** Use only approved Krutrim Cloud logos.
- **Clear Space:** At least 1x logo height on all sides.
- **Minimum Size:** 32px height for digital use.
- **Colors:** Use brand colors only.
- **Voice & Tone:** Friendly, clear, and professional in all UI text.

---

## 13. Do's and Don'ts

### Do
- Use consistent spacing and color.
- Write clear, concise UI text.
- Use icons to clarify actions.
- Ensure all components are accessible.

### Don't
- Use unapproved colors or fonts.
- Overuse shadows or gradients.
- Add icons without meaning.
- Hide important actions behind icons only.

---

## 14. Component Documentation Standards
- Use JSDoc-style comments for all components.
- Include:
  - `@component` name
  - `@description` of purpose and details
  - `@status` (Active, Planned, Deprecated)
  - `@plannedFor` (if not yet implemented)
  - `@example` usage
  - `@see` related components
  - `@todo` for future tasks
- See `docs/component-documentation-guide.md` for full details.

---

## 15. UI/UX Principles
- **Consistent use of color and spacing** via Tailwind and CSS variables
- **Dark mode** supported via `.dark` class
- **Accessible font sizes and contrast**
- **Component-driven architecture**
- **Icons** from Lucide for clarity and consistency
- **Responsive design** for all layouts

---

## 16. Utilities & Custom Classes
- `.text-balance` for balanced text wrapping
- Utility classes for border, background, and text color

---

## 17. References
- Tailwind config: `tailwind.config.ts`
- Global styles: `app/globals.css`, `styles/globals.css`
- Component documentation: `docs/component-documentation-guide.md`, `docs/components.md`
- Icon library: [Lucide](https://lucide.dev/)
- UI library: [shadcn/ui](https://ui.shadcn.com/) 

<div class="bg-card p-4 rounded-lg">Card content</div>
<div class="bg-accent p-2">Accent background</div> 