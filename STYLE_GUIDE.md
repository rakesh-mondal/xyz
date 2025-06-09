# Project Style Guide

## Table of Contents
- [Code Style](#code-style)
- [Component Architecture](#component-architecture)
- [File Structure](#file-structure)
- [Naming Conventions](#naming-conventions)
- [State Management](#state-management)
- [Error Handling](#error-handling)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Typography](#typography)
- [Spacing](#spacing)

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define explicit types for all function parameters and return values
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object shapes and types for unions/primitives
- Enable strict mode in `tsconfig.json`

### React Components
- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use proper prop typing with TypeScript
- Implement proper error boundaries
- Follow the React hooks rules

### CSS/Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use CSS variables for theming
- Maintain consistent spacing using the design system
- Use semantic class names

## Component Architecture

### Component Structure
```typescript
// Example component structure
import { FC } from 'react'
import { useCustomHook } from '@/hooks'
import { ComponentProps } from './types'

export const Component: FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const { data } = useCustomHook()

  // Handlers
  const handleClick = () => {
    // Implementation
  }

  // Render
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

### File Organization
- One component per file
- Co-locate related files (styles, tests, types)
- Use index files for clean exports
- Group related components in feature folders

## File Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Shared components
│   ├── ui/             # Basic UI components
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── styles/             # Global styles and Tailwind config
└── types/              # TypeScript type definitions
```

## Naming Conventions

### Files and Directories
- Use kebab-case for file and directory names
- Use PascalCase for component files
- Use camelCase for utility files

### Components
- Use PascalCase for component names
- Use descriptive, purpose-indicating names
- Prefix shared components with appropriate category

### Variables and Functions
- Use camelCase for variables and functions
- Use descriptive names that indicate purpose
- Prefix boolean variables with is/has/should
- Use verbs for function names

## State Management

### Local State
- Use `useState` for simple state
- Use `useReducer` for complex state logic
- Keep state as local as possible

### Global State
- Use React Context for theme/auth state
- Consider using a state management library for complex apps
- Keep global state minimal

## Error Handling

### Error Boundaries
- Implement error boundaries at strategic points
- Provide meaningful error messages
- Log errors appropriately

### API Calls
- Use try-catch blocks for async operations
- Handle loading and error states
- Provide user feedback for errors

## Accessibility

### General Guidelines
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Maintain sufficient color contrast
- Provide alt text for images

### Forms
- Use proper form labels
- Implement error messages
- Ensure proper focus management
- Validate input appropriately

## Performance

### Code Splitting
- Use dynamic imports for large components
- Implement proper code splitting
- Lazy load routes and components

### Optimization
- Memoize expensive calculations
- Use proper dependency arrays in hooks
- Implement virtualization for long lists
- Optimize images and assets

## Testing

### Unit Tests
- Write tests for utility functions
- Test component rendering
- Test user interactions
- Use meaningful test descriptions

### Integration Tests
- Test component integration
- Test user flows
- Test error scenarios

## Documentation

### Code Comments
- Document complex logic
- Use JSDoc for functions
- Keep comments up to date
- Remove commented-out code

### README
- Keep README up to date
- Document setup instructions
- Include contribution guidelines
- Document environment variables

## Git Workflow

### Branching
- Use feature branches
- Follow semantic versioning
- Write meaningful commit messages
- Keep PRs focused and small

### Commits
- Use conventional commits
- Write clear commit messages
- Reference issues in commits
- Keep commits atomic

## Security

### Best Practices
- Sanitize user input
- Implement proper authentication
- Use environment variables
- Follow security guidelines
- Regular security audits

## Deployment

### Process
- Use CI/CD pipelines
- Implement proper staging
- Monitor performance
- Regular backups
- Version control

## Typography

### Font Family
```typescript
// Font configuration in tailwind.config.ts
{
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  }
}
```

### Type Scale
```typescript
// Font sizes in rem units
const typeScale = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
}
```

### Font Weights
```typescript
const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}
```

### Line Heights
```typescript
const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
}
```

### Usage Guidelines

#### Headings
- Use semantic heading tags (`h1` through `h6`)
- Maintain proper heading hierarchy
- Follow consistent spacing between headings and content

```typescript
// Heading styles
const headingStyles = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
}
```

#### Body Text
- Use appropriate line height for readability
- Maintain consistent paragraph spacing
- Use proper text colors for different contexts

```typescript
// Body text styles
const bodyStyles = {
  base: 'text-base leading-relaxed',
  small: 'text-sm leading-relaxed',
  large: 'text-lg leading-relaxed',
}
```

#### Special Text Elements
```typescript
// Special text styles
const specialTextStyles = {
  caption: 'text-sm text-gray-500',
  label: 'text-sm font-medium',
  link: 'text-primary-600 hover:text-primary-700',
  code: 'font-mono text-sm bg-gray-100 px-1 rounded',
}
```

### Responsive Typography
```typescript
// Responsive text classes
const responsiveText = {
  base: 'text-base md:text-lg lg:text-xl',
  heading: 'text-2xl md:text-3xl lg:text-4xl',
}
```

### Best Practices

#### Spacing
- Maintain consistent vertical rhythm
- Use appropriate line height for different text sizes
- Consider mobile readability

#### Color
- Ensure sufficient contrast ratio (WCAG 2.1 AA compliant)
- Use semantic color tokens for different text types
- Consider dark mode compatibility

#### Accessibility
- Use relative units (rem) for font sizes
- Implement proper text scaling
- Maintain readable line lengths (50-75 characters)
- Use proper text contrast ratios

### Implementation Example
```typescript
// Example component using typography styles
const TypographyExample = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">
        Main Heading
      </h1>
      <h2 className="text-2xl font-semibold">
        Section Heading
      </h2>
      <p className="text-base leading-relaxed">
        Body text with proper line height and spacing.
      </p>
      <p className="text-sm text-gray-500">
        Caption text for additional information.
      </p>
    </div>
  )
}
```

### Tailwind Configuration
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontSize: {
        // Custom font sizes if needed
      },
      lineHeight: {
        // Custom line heights if needed
      },
      letterSpacing: {
        // Custom letter spacing if needed
      },
    },
  },
}
```

### Common Patterns

#### Text Alignment
- Use left alignment for body text
- Center alignment for headings in certain contexts
- Right alignment for numbers and dates

#### Text Truncation
```typescript
const truncationStyles = {
  single: 'truncate',
  multi: 'line-clamp-2', // or line-clamp-3
}
```

#### Text Selection
```typescript
const selectionStyles = {
  base: 'selection:bg-primary-100 selection:text-primary-900',
}
```

### Dark Mode Considerations
```typescript
const darkModeTextStyles = {
  base: 'text-gray-900 dark:text-gray-100',
  muted: 'text-gray-600 dark:text-gray-400',
}
```

## Spacing

### Base Spacing Scale
```typescript
// Spacing scale in rem units (1rem = 16px)
const spacingScale = {
  0: '0',           // 0px
  px: '1px',        // 1px
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
}
```

### Usage Guidelines

#### Component Spacing
```typescript
// Common component spacing patterns
const componentSpacing = {
  // Card spacing
  card: {
    padding: 'p-4 md:p-6',
    gap: 'gap-4',
    margin: 'm-4',
  },
  // Form spacing
  form: {
    group: 'space-y-4',
    field: 'mb-4',
    label: 'mb-2',
  },
  // List spacing
  list: {
    item: 'py-2',
    group: 'space-y-2',
  },
  // Modal spacing
  modal: {
    padding: 'p-6',
    gap: 'gap-4',
  },
}
```

#### Layout Spacing
```typescript
// Layout spacing patterns
const layoutSpacing = {
  // Page layout
  page: {
    padding: 'px-4 py-6 md:px-6 md:py-8',
    maxWidth: 'max-w-7xl mx-auto',
  },
  // Section spacing
  section: {
    margin: 'my-8 md:my-12',
    padding: 'px-4 md:px-6',
  },
  // Grid spacing
  grid: {
    gap: 'gap-4 md:gap-6',
    padding: 'p-4 md:p-6',
  },
}
```

### Spacing Utilities

#### Margin and Padding
```typescript
// Common margin and padding utilities
const spacingUtilities = {
  // Margin
  margin: {
    auto: 'm-auto',
    responsive: 'm-4 md:m-6 lg:m-8',
    stack: 'space-y-4',
  },
  // Padding
  padding: {
    base: 'p-4',
    responsive: 'p-4 md:p-6 lg:p-8',
    section: 'px-4 py-8 md:px-6 md:py-12',
  },
}
```

#### Gap and Space Between
```typescript
// Gap and space between utilities
const gapUtilities = {
  // Flex and Grid gaps
  gap: {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    responsive: 'gap-4 md:gap-6 lg:gap-8',
  },
  // Space between
  space: {
    small: 'space-y-2',
    medium: 'space-y-4',
    large: 'space-y-6',
    responsive: 'space-y-4 md:space-y-6 lg:space-y-8',
  },
}
```

### Responsive Spacing
```typescript
// Responsive spacing patterns
const responsiveSpacing = {
  // Container padding
  container: 'px-4 md:px-6 lg:px-8',
  // Section margins
  section: 'my-6 md:my-8 lg:my-12',
  // Component spacing
  component: 'p-4 md:p-6 lg:p-8',
}
```

### Common Patterns

#### Card Layout
```typescript
const cardSpacing = {
  base: 'p-4',
  withHeader: 'p-4 space-y-4',
  withFooter: 'p-4 space-y-4',
  nested: 'p-4 space-y-4',
}
```

#### Form Layout
```typescript
const formSpacing = {
  group: 'space-y-4',
  field: 'mb-4',
  label: 'mb-2',
  help: 'mt-1',
  error: 'mt-1',
}
```

#### List Layout
```typescript
const listSpacing = {
  item: 'py-2',
  group: 'space-y-2',
  nested: 'pl-4',
}
```

### Best Practices

#### Vertical Rhythm
- Maintain consistent vertical spacing between elements
- Use multiples of the base spacing unit (4px)
- Consider line height when calculating vertical spacing

#### Component Hierarchy
- Use larger spacing for top-level sections
- Decrease spacing for nested components
- Maintain visual hierarchy through spacing

#### Responsive Considerations
- Increase spacing on larger screens
- Maintain touch targets on mobile (minimum 44px)
- Use relative units for responsive spacing

### Implementation Example
```typescript
// Example component using spacing patterns
const SpacingExample = () => {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <section className="space-y-2">
        <h2 className="mb-4">Section Title</h2>
        <div className="grid gap-4 md:gap-6">
          <div className="p-4 space-y-2">
            <h3 className="mb-2">Card Title</h3>
            <p className="mb-4">Card content</p>
            <div className="flex gap-2">
              <button>Action 1</button>
              <button>Action 2</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

### Tailwind Configuration
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      spacing: {
        // Custom spacing values if needed
      },
    },
  },
}
```

---

Remember to:
- Use consistent spacing throughout the application
- Consider mobile-first responsive design
- Maintain proper visual hierarchy
- Test spacing at different viewport sizes
- Ensure touch targets are properly sized
- Consider accessibility guidelines for spacing

---

This style guide is a living document and should be updated as the project evolves. All team members are encouraged to contribute to its improvement. 