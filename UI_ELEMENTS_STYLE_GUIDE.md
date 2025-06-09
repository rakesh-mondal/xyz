# UI Elements Style Guide

## Table of Contents
- [Buttons](#buttons)
- [Forms](#forms)
- [Cards](#cards)
- [Navigation](#navigation)
- [Tables](#tables)
- [Modals](#modals)
- [Alerts](#alerts)
- [Badges](#badges)
- [Tooltips](#tooltips)
- [Dropdowns](#dropdowns)
- [Tabs](#tabs)
- [Accordions](#accordions)
- [Progress Indicators](#progress-indicators)
- [Icons](#icons)
- [Loading States](#loading-states)

## Buttons

### Primary Button
```typescript
const PrimaryButton = () => {
  return (
    <button className="
      px-4 py-2
      bg-primary-600
      text-white
      rounded-md
      font-medium
      hover:bg-primary-700
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
    ">
      Primary Button
    </button>
  )
}
```

### Secondary Button
```typescript
const SecondaryButton = () => {
  return (
    <button className="
      px-4 py-2
      bg-white
      text-gray-700
      border border-gray-300
      rounded-md
      font-medium
      hover:bg-gray-50
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
    ">
      Secondary Button
    </button>
  )
}
```

### Icon Button
```typescript
const IconButton = () => {
  return (
    <button className="
      p-2
      text-gray-500
      hover:text-gray-700
      rounded-full
      hover:bg-gray-100
      focus:outline-none focus:ring-2 focus:ring-primary-500
      transition-colors
    ">
      <Icon className="w-5 h-5" />
    </button>
  )
}
```

## Forms

### Text Input
```typescript
const TextInput = () => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Label
      </label>
      <input
        type="text"
        className="
          block w-full
          px-3 py-2
          border border-gray-300
          rounded-md
          shadow-sm
          focus:ring-primary-500 focus:border-primary-500
          disabled:bg-gray-50 disabled:text-gray-500
        "
        placeholder="Placeholder text"
      />
    </div>
  )
}
```

### Select Input
```typescript
const SelectInput = () => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Label
      </label>
      <select className="
        block w-full
        px-3 py-2
        border border-gray-300
        rounded-md
        shadow-sm
        focus:ring-primary-500 focus:border-primary-500
        disabled:bg-gray-50 disabled:text-gray-500
      ">
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    </div>
  )
}
```

### Checkbox
```typescript
const Checkbox = () => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="
          h-4 w-4
          text-primary-600
          border-gray-300
          rounded
          focus:ring-primary-500
        "
      />
      <label className="ml-2 block text-sm text-gray-700">
        Checkbox label
      </label>
    </div>
  )
}
```

## Cards

### Basic Card
```typescript
const BasicCard = () => {
  return (
    <div className="
      bg-white
      rounded-lg
      shadow
      p-6
      border border-gray-200
    ">
      <h3 className="text-lg font-medium text-gray-900">Card Title</h3>
      <p className="mt-2 text-gray-500">Card content goes here</p>
    </div>
  )
}
```

### Interactive Card
```typescript
const InteractiveCard = () => {
  return (
    <div className="
      bg-white
      rounded-lg
      shadow
      p-6
      border border-gray-200
      hover:shadow-lg
      transition-shadow
      cursor-pointer
    ">
      <h3 className="text-lg font-medium text-gray-900">Interactive Card</h3>
      <p className="mt-2 text-gray-500">Hover to see effect</p>
    </div>
  )
}
```

## Navigation

### Navbar
```typescript
const Navbar = () => {
  return (
    <nav className="
      bg-white
      border-b border-gray-200
      px-4 py-3
    ">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo className="h-8 w-auto" />
          <div className="ml-10 flex items-baseline space-x-4">
            <a href="#" className="text-gray-900 hover:text-gray-700">Home</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### Breadcrumbs
```typescript
const Breadcrumbs = () => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
        </li>
        <li>
          <span className="text-gray-400">/</span>
        </li>
        <li>
          <a href="#" className="text-gray-500 hover:text-gray-700">Section</a>
        </li>
        <li>
          <span className="text-gray-400">/</span>
        </li>
        <li>
          <span className="text-gray-900">Current</span>
        </li>
      </ol>
    </nav>
  )
}
```

## Tables

### Basic Table
```typescript
const BasicTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 1
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 2
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Cell 1
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Cell 2
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
```

## Modals

### Basic Modal
```typescript
const BasicModal = () => {
  return (
    <div className="
      fixed inset-0
      bg-gray-500 bg-opacity-75
      flex items-center justify-center
    ">
      <div className="
        bg-white
        rounded-lg
        shadow-xl
        p-6
        max-w-md w-full
        mx-4
      ">
        <h3 className="text-lg font-medium text-gray-900">Modal Title</h3>
        <div className="mt-4">
          <p className="text-gray-500">Modal content goes here</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Alerts

### Success Alert
```typescript
const SuccessAlert = () => {
  return (
    <div className="
      rounded-md
      bg-green-50
      p-4
      border border-green-200
    ">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckIcon className="h-5 w-5 text-green-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Success
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>Operation completed successfully</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Error Alert
```typescript
const ErrorAlert = () => {
  return (
    <div className="
      rounded-md
      bg-red-50
      p-4
      border border-red-200
    ">
      <div className="flex">
        <div className="flex-shrink-0">
          <XIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Something went wrong</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Badges

### Status Badge
```typescript
const StatusBadge = () => {
  return (
    <span className="
      inline-flex
      items-center
      px-2.5 py-0.5
      rounded-full
      text-xs
      font-medium
      bg-green-100
      text-green-800
    ">
      Active
    </span>
  )
}
```

## Tooltips

### Basic Tooltip
```typescript
const BasicTooltip = () => {
  return (
    <div className="relative group">
      <button className="text-gray-500 hover:text-gray-700">
        Hover me
      </button>
      <div className="
        absolute
        bottom-full
        left-1/2
        transform -translate-x-1/2
        mb-2
        px-2 py-1
        bg-gray-900
        text-white
        text-xs
        rounded
        opacity-0
        group-hover:opacity-100
        transition-opacity
      ">
        Tooltip text
      </div>
    </div>
  )
}
```

## Dropdowns

### Basic Dropdown
```typescript
const BasicDropdown = () => {
  return (
    <div className="relative">
      <button className="
        px-4 py-2
        text-gray-700
        bg-white
        border border-gray-300
        rounded-md
        shadow-sm
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-primary-500
      ">
        Dropdown
      </button>
      <div className="
        absolute
        right-0
        mt-2
        w-48
        rounded-md
        shadow-lg
        bg-white
        ring-1 ring-black ring-opacity-5
      ">
        <div className="py-1">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Option 1
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Option 2
          </a>
        </div>
      </div>
    </div>
  )
}
```

## Tabs

### Basic Tabs
```typescript
const BasicTabs = () => {
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <a href="#" className="
            border-primary-500
            text-primary-600
            whitespace-nowrap
            py-4 px-1
            border-b-2
            font-medium text-sm
          ">
            Tab 1
          </a>
          <a href="#" className="
            border-transparent
            text-gray-500
            hover:text-gray-700
            hover:border-gray-300
            whitespace-nowrap
            py-4 px-1
            border-b-2
            font-medium text-sm
          ">
            Tab 2
          </a>
        </nav>
      </div>
    </div>
  )
}
```

## Accordions

### Basic Accordion
```typescript
const BasicAccordion = () => {
  return (
    <div className="border-b border-gray-200">
      <button className="
        w-full
        px-4 py-4
        text-left
        text-gray-700
        hover:bg-gray-50
        focus:outline-none
      ">
        <div className="flex items-center justify-between">
          <span className="font-medium">Accordion Title</span>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </div>
      </button>
      <div className="px-4 py-3 bg-gray-50">
        <p className="text-gray-600">Accordion content</p>
      </div>
    </div>
  )
}
```

## Progress Indicators

### Progress Bar
```typescript
const ProgressBar = () => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-primary-600 h-2.5 rounded-full"
        style={{ width: '45%' }}
      ></div>
    </div>
  )
}
```

### Spinner
```typescript
const Spinner = () => {
  return (
    <div className="flex justify-center">
      <div className="
        animate-spin
        rounded-full
        h-8 w-8
        border-4
        border-primary-600
        border-t-transparent
      "></div>
    </div>
  )
}
```

## Icons

### Icon Guidelines
- Use consistent icon sizes
- Maintain proper spacing around icons
- Use appropriate colors for different states
- Ensure proper alignment with text

```typescript
const IconExample = () => {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-gray-400" />
      <span className="text-gray-700">Icon with text</span>
    </div>
  )
}
```

## Loading States

### Skeleton Loading
```typescript
const SkeletonLoading = () => {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}
```

### Button Loading State
```typescript
const LoadingButton = () => {
  return (
    <button
      disabled
      className="
        px-4 py-2
        bg-primary-600
        text-white
        rounded-md
        opacity-75
        cursor-not-allowed
        flex items-center
        space-x-2
      "
    >
      <Spinner className="h-4 w-4" />
      <span>Loading...</span>
    </button>
  )
}
```

---

## Best Practices

### Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation
- Maintain proper contrast ratios
- Test with screen readers

### Responsive Design
- Use mobile-first approach
- Test on different screen sizes
- Ensure touch targets are properly sized
- Maintain readability across devices

### Performance
- Optimize images and icons
- Use proper loading states
- Implement lazy loading where appropriate
- Minimize layout shifts

### Consistency
- Follow the design system
- Use consistent spacing
- Maintain visual hierarchy
- Keep interactions predictable

### Error Handling
- Provide clear error messages
- Include proper validation
- Show appropriate loading states
- Handle edge cases gracefully

---

Remember to:
- Keep components modular and reusable
- Document component props and usage
- Test components across different scenarios
- Maintain consistent styling
- Follow accessibility guidelines
- Consider internationalization
- Test on different devices and browsers 