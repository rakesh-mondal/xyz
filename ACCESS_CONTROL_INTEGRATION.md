# Access Control System Integration Guide

## ✅ **Implementation Complete**

The access control system has been successfully implemented and integrated with your existing authentication architecture. This document provides usage examples and integration patterns.

## 📁 **Files Created/Updated**

### **Core Access Control**
- `lib/access-control.ts` - Type definitions and access logic
- `components/auth/auth-provider.tsx` - Extended with access level state
- `components/access-control/access-banner.tsx` - User notification component  
- `components/access-control/feature-restriction.tsx` - Feature gating component
- `middleware.ts` - Route protection middleware
- `app/auth/profile-completion/page.tsx` - Profile completion flow

### **Dashboard Integration**
- `app/dashboard/page.tsx` - Updated with access control components

## 🚀 **Usage Examples**

### **1. Using AccessBanner**

```typescript
import { AccessBanner } from "@/components/access-control/access-banner"

// Full banner with progress and steps
export default function MyPage() {
  return (
    <div>
      <AccessBanner />
      {/* Your page content */}
    </div>
  )
}

// Compact banner for smaller spaces
import { AccessBannerCompact } from "@/components/access-control/access-banner"

export default function SidebarComponent() {
  return (
    <div>
      <AccessBannerCompact />
    </div>
  )
}
```

### **2. Using FeatureRestriction**

```typescript
import { FeatureRestriction } from "@/components/access-control/feature-restriction"

// Wrap any component to restrict access
export default function ComputePage() {
  return (
    <FeatureRestriction feature="compute">
      <ComputeManagementPanel />
    </FeatureRestriction>
  )
}

// With custom overlay
<FeatureRestriction feature="storage" showOverlay={true}>
  <StorageCard />
</FeatureRestriction>

// Without overlay (for list items)
<FeatureRestriction feature="billing" showOverlay={false}>
  <BillingActivity />
</FeatureRestriction>

// With custom fallback
<FeatureRestriction 
  feature="advanced-ai" 
  fallback={<div>AI features coming soon</div>}
>
  <AIModelTraining />
</FeatureRestriction>
```

### **3. Using Access Control Hooks**

```typescript
import { useFeatureAccess } from "@/components/access-control/feature-restriction"
import { useAuth } from "@/components/auth/auth-provider"

export default function ConditionalComponent() {
  const { hasAccess, isRestricted } = useFeatureAccess('compute')
  const { accessLevel } = useAuth()

  if (isRestricted) {
    return <div>Complete profile to access compute features</div>
  }

  return <ComputeManagement />
}
```

### **4. Higher-Order Component Pattern**

```typescript
import { withFeatureRestriction } from "@/components/access-control/feature-restriction"

// Wrap existing components
const RestrictedBillingPage = withFeatureRestriction(
  BillingPage, 
  'billing',
  { showOverlay: true }
)

export default RestrictedBillingPage
```

## 🔐 **Access Level Configuration**

### **Current Access Levels**

```typescript
// none: Only auth pages
allowedRoutes: ['/auth', '/auth/signin', '/auth/signup']

// limited: Documentation and basic tools
allowedRoutes: [
  '/dashboard',     // Dashboard with restrictions
  '/docs',          // Documentation
  '/cost-estimator', // Cost tools
  '/ai-studio',     // Limited AI access
  '/support'        // Support pages
]
restrictedFeatures: [
  'compute', 'storage', 'billing', 'api-keys', 
  'ssh-keys', 'kubernetes', 'networking'
]

// full: Everything unlocked
allowedRoutes: ['*']
restrictedFeatures: []
```

### **Adding New Features**

```typescript
// In lib/access-control.ts
export const accessConfigs: Record<AccessLevel, AccessConfig> = {
  limited: {
    // ... existing config
    restrictedFeatures: [
      // ... existing features
      'new-feature',      // Add your new feature
      'another-feature'
    ]
  }
}

// In your component
<FeatureRestriction feature="new-feature">
  <NewFeatureComponent />
</FeatureRestriction>
```

## 🔄 **Profile Status Integration**

### **Updating Profile Status**

```typescript
import { useAuth } from "@/components/auth/auth-provider"

export default function IdentityVerification() {
  const { updateProfileStatus } = useAuth()

  const handleVerificationComplete = () => {
    updateProfileStatus({ identityVerified: true })
    // Access level automatically recalculated
  }

  return <VerificationForm onComplete={handleVerificationComplete} />
}
```

### **Profile Completion Dashboard Integration**

The profile completion dashboard automatically updates access levels:

```typescript
// In profile-sections/identity-verification-section.tsx
const handleComplete = () => {
  updateProfileStatus({ identityVerified: true })
  onComplete() // Triggers parent to recalculate access
}

// In profile-sections/payment-setup-section.tsx  
const handleComplete = () => {
  updateProfileStatus({ paymentSetupComplete: true })
  onComplete() // User now has full access
}
```

## 🛣️ **Route Protection**

### **Middleware Protection**

The middleware automatically:
- Redirects unauthenticated users to signin
- Redirects limited users from restricted routes to profile completion
- Passes through allowed routes based on access level

### **Custom Route Checks**

```typescript
import { checkAccess } from "@/lib/access-control"
import { useAuth } from "@/components/auth/auth-provider"

export default function ProtectedPage() {
  const { accessLevel } = useAuth()
  const hasAccess = checkAccess('/billing', accessLevel)

  if (!hasAccess) {
    return <AccessDeniedPage />
  }

  return <BillingContent />
}
```

## 🎨 **UI Patterns**

### **Dashboard Cards with Restrictions**

```typescript
// Cards that show overlay when restricted
<div className="grid gap-4 md:grid-cols-3">
  <FeatureRestriction feature="compute">
    <Card>
      <CardHeader>
        <CardTitle>VM Instances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12</div>
        <p className="text-xs text-muted-foreground">Active instances</p>
      </CardContent>
    </Card>
  </FeatureRestriction>
  
  <FeatureRestriction feature="storage">
    <Card>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">256 GB</div>
        <p className="text-xs text-muted-foreground">Used space</p>
      </CardContent>
    </Card>
  </FeatureRestriction>
</div>
```

### **Navigation with Access Control**

```typescript
// In navigation components
import { useFeatureAccess } from "@/components/access-control/feature-restriction"

export default function NavigationItem({ feature, href, children }) {
  const { hasAccess } = useFeatureAccess(feature)
  
  return (
    <FeatureRestriction feature={feature} showOverlay={false}>
      <Link 
        href={href}
        className={`nav-item ${!hasAccess ? 'opacity-50' : ''}`}
      >
        {children}
        {!hasAccess && <Lock className="h-4 w-4 ml-2" />}
      </Link>
    </FeatureRestriction>
  )
}
```

## 📊 **Access Level Indicators**

### **User Access Badge**

```typescript
import { useAuth } from "@/components/auth/auth-provider"
import { Badge } from "@/components/ui/badge"

export default function UserAccessBadge() {
  const { accessLevel } = useAuth()
  
  const variants = {
    limited: "bg-amber-100 text-amber-800",
    full: "bg-green-100 text-green-800",
    none: "bg-red-100 text-red-800"
  }
  
  const labels = {
    limited: "Limited Access",
    full: "Full Access", 
    none: "Setup Required"
  }

  return (
    <Badge className={variants[accessLevel]}>
      {labels[accessLevel]}
    </Badge>
  )
}
```

## 🔧 **Customization**

### **Custom Access Messages**

```typescript
// Extend lib/access-control.ts
export const getAccessDeniedMessage = (feature: string, accessLevel: AccessLevel) => {
  const customMessages = {
    'compute': 'Upgrade to access virtual machines and containers',
    'storage': 'Complete verification to use cloud storage',
    'billing': 'Add payment method to view billing details'
  }

  return customMessages[feature] || getAccessDeniedMessage(feature, accessLevel)
}
```

### **Custom Feature Requirements**

```typescript
// Different requirements per feature
export const getFeatureRequirements = (feature: string) => {
  const requirements = {
    'compute': ['identity verification', 'payment setup'],
    'storage': ['identity verification'],
    'billing': ['payment setup']
  }
  
  return requirements[feature] || ['complete profile']
}
```

## 🚦 **Testing Access Control**

### **Simulate Different Access Levels**

```typescript
// For development/testing
export function AccessLevelDebugger() {
  const { updateProfileStatus } = useAuth()
  
  const setLimited = () => {
    updateProfileStatus({
      basicInfoComplete: true,
      identityVerified: false,
      paymentSetupComplete: false
    })
  }
  
  const setFull = () => {
    updateProfileStatus({
      basicInfoComplete: true,
      identityVerified: true,
      paymentSetupComplete: true
    })
  }
  
  return (
    <div className="p-4 border rounded-lg">
      <h3>Access Level Debugger</h3>
      <Button onClick={setLimited}>Set Limited</Button>
      <Button onClick={setFull}>Set Full</Button>
    </div>
  )
}
```

## 🔗 **Integration Checklist**

- ✅ Auth Provider extended with access levels
- ✅ Route protection middleware implemented
- ✅ AccessBanner component created
- ✅ FeatureRestriction component created
- ✅ Dashboard integration completed
- ✅ Profile completion flow connected
- ✅ Access control utilities available
- ✅ TypeScript types defined
- ✅ shadcn/ui design consistency maintained

## 📈 **Next Steps**

1. **Add access control to specific pages** - Wrap components in restricted routes
2. **Update navigation** - Add access indicators to menu items  
3. **Enhance notifications** - Use toast system for access denied events
4. **Analytics integration** - Track feature restriction events
5. **Backend integration** - Connect with real JWT validation and user profiles

---

**The access control system is now fully integrated and ready for use across your Krutrim Cloud platform.** 