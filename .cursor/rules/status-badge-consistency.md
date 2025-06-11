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

## 🎨 **Supported Status Values & Color Codes**

The StatusBadge component automatically handles these status values with their corresponding colors:

### **🟢 Active/Success States - Green**
**Color Codes:** Background `#dcfce7` Text `#166534` (bg-green-100/text-green-800)
- `active`, `running`, `available`, `completed`, `success`, `operational`, `attached`, `public`, `tcp`

### **🟡 Progress/Warning States - Yellow**  
**Color Codes:** Background `#fef3c7` Text `#92400e` (bg-yellow-100/text-yellow-800)
- `pending`, `provisioning`, `updating`, `in-progress`, `processing`, `deploying`, `warning`, `degraded`

### **🔴 Error/Failed States - Red**
**Color Codes:** Background `#fecaca` Text `#991b1b` (bg-red-100/text-red-800)
- `inactive`, `stopped`, `error`, `failed`, `terminated`, `incomplete`, `incompleted`, `rejected`, `cancelled`

### **🔵 Info/Neutral States - Blue**
**Color Codes:** Background `#dbeafe` Text `#1e40af` (bg-blue-100/text-blue-800)
- `private`, `draft`, `scheduled`, `queued`, `created`, `full`

### **🟣 Special/Protocol States - Purple**
**Color Codes:** Background `#e9d5ff` Text `#6b21a8` (bg-purple-100/text-purple-800)
- `udp`, `incremental`, `partial`, `limited`

### **🟠 Maintenance/Paused States - Orange**
**Color Codes:** Background `#fed7aa` Text `#c2410c` (bg-orange-100/text-orange-800)
- `icmp`, `maintenance`, `paused`, `suspended`

### **⚫ Default/Unknown States - Gray**
**Color Codes:** Background `#f1f5f9` Text `#475569` (bg-secondary/text-secondary-foreground)
- `all`, `unknown`, `unassigned`, `disabled`

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