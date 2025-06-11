---
description: Enforce consistent status badge usage across the application
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: true
---

# Status Badge Design System Rule

## ✅ **Use StatusBadge Component**

- **ALWAYS** use the centralized `StatusBadge` component from `@/components/status-badge`
- **DO NOT** create custom status indicators or badges
- **DO NOT** use inline spans with custom colors for status display

### ✅ **Correct Usage:**
```tsx
import { StatusBadge } from "@/components/status-badge"

// In table columns
{
  key: "status",
  label: "Status", 
  render: (value: string) => <StatusBadge status={value} />,
}

// In cards or lists
<StatusBadge status="available" />
<StatusBadge status="active" />
<StatusBadge status="pending" />
```

### ❌ **Incorrect Usage:**
```tsx
// Don't do this
<span className="inline-flex items-center gap-1 text-green-600">
  <span className="h-2 w-2 rounded-full bg-green-500"></span>
  Active
</span>

// Don't do this
<Badge variant="outline" className="bg-green-50 text-green-700">
  Available
</Badge>

// Don't do this
<div className="text-green-600">Active</div>
```

## 🎨 **Supported Status Values**

The StatusBadge component automatically handles these status values:

### **Active/Positive States:**
- `active`, `running`, `available`, `public`, `tcp` → Green badge
- `completed`, `success`, `operational` → Green badge

### **Pending/Warning States:**  
- `pending`, `provisioning`, `updating` → Yellow badge
- `degraded`, `warning` → Yellow badge

### **Inactive/Error States:**
- `inactive`, `stopped`, `error` → Red badge  
- `failed`, `terminated` → Red badge

### **Neutral States:**
- `private` → Blue badge
- `udp` → Purple badge  
- `icmp` → Orange badge

## 🔧 **Design Specifications**

The StatusBadge component provides:
- **Consistent Shape:** `rounded-full` pills
- **Consistent Size:** `text-xs` with `px-2.5 py-0.5` padding
- **Consistent Colors:** Predefined color scheme for each status type
- **Accessibility:** Proper contrast ratios and semantic markup

## 📋 **Implementation Checklist**

When adding status displays:
- [ ] Import StatusBadge component
- [ ] Use appropriate status string values
- [ ] Remove any custom status styling
- [ ] Test with different status values
- [ ] Ensure consistent appearance across the app

## 🚨 **Migration from Custom Badges**

If you find custom status implementations:
1. **Replace** custom spans/badges with `<StatusBadge status={value} />`
2. **Remove** custom CSS classes and styling
3. **Update** imports to include StatusBadge
4. **Test** that status values map correctly

This ensures visual consistency and reduces maintenance overhead across the entire application. 