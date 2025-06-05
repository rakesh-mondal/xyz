# Progressive Stepper Updates

## Overview
Updated the progressive stepper to support the new 5-step signup flow with two-phase navigation (signup → profile completion) and integrated access control system. The stepper maintains existing visual design while adding context switching and breadcrumb navigation.

## Key Changes

### 1. Two-Phase Stepper Configuration
**Function**: `getStepperConfig(phase: 'signup' | 'profile')`

```typescript
const getStepperConfig = (phase: 'signup' | 'profile') => {
  if (phase === 'signup') {
    return [
      { name: "Signup", status: "current" },
      { name: "Verify", status: "upcoming" },
      { name: "Account Type", status: "upcoming" },
      { name: "Address", status: "upcoming" },
      { name: "Complete", status: "upcoming" }
    ]
  }
  
  return [
    { name: "Basic Info", status: "current" },
    { name: "Identity", status: "upcoming" },
    { name: "Payment", status: "upcoming" }
  ]
}
```

#### Features:
- **Dynamic Step Generation**: Different steps for signup vs profile phases
- **Phase-Specific Labels**: "Complete" for signup, "Payment" for profile
- **Status Management**: Consistent status tracking across phases
- **Context Switching**: Seamless transition between phase configurations

### 2. Enhanced Navigation Logic
**Function**: `goToNextStep()` with access control integration

#### Key Navigation Points:
```typescript
// Step 4 (Complete) - End of signup phase
if (currentStep === 4 && flowPhase === "signup") {
  setAccessLevel('limited')
  sessionStorage.setItem("newSignup", "true")
  router.push("/dashboard")
  return
}

// Step 7 (Payment) - End of profile phase  
if (currentStep === 7 && flowPhase === "profile") {
  setAccessLevel('full')
  router.push("/dashboard")
  return
}
```

#### Access Control Integration:
- **Limited Access**: Set after signup completion (step 4)
- **Full Access**: Set after profile completion (step 7)
- **Profile Completion Tracking**: localStorage flags for pending completion
- **Session Management**: newSignup flag for dashboard behavior

### 3. Visual Design Enhancements
**Maintained Elements**:
- Existing stepper component structure (`Stepper`, `StepperItem`, etc.)
- Current color coding and status indicators
- Responsive behavior and accessibility features
- Animation patterns and transitions

**Enhanced Elements**:
```typescript
// Enhanced step indicator with status-based styling
<StepperIndicator 
  className={`
    transition-all duration-200 ease-in-out
    ${step.status === "complete" ? "bg-green-600 border-green-600" : ""}
    ${step.status === "current" ? "bg-primary border-primary" : ""}
    ${step.status === "upcoming" ? "bg-gray-200 border-gray-300" : ""}
  `}
/>

// Enhanced step title with color transitions
<StepperTitle className={`
  transition-colors duration-200
  ${step.status === "complete" ? "text-green-600" : ""}
  ${step.status === "current" ? "text-primary font-semibold" : ""}
  ${step.status === "upcoming" ? "text-gray-500" : ""}
`}>
```

### 4. Breadcrumb Navigation System
**Phase Indicator with Context**:
```typescript
const getPhaseInfo = () => {
  if (flowPhase === "signup") {
    return {
      title: "Account Setup",
      description: "Create your Krutrim Cloud account",
      color: "bg-blue-100 text-blue-800"
    }
  } else {
    return {
      title: "Profile Completion", 
      description: "Complete your profile for full access",
      color: "bg-green-100 text-green-800"
    }
  }
}
```

#### Features:
- **Phase-Specific Colors**: Blue for signup, green for profile
- **Contextual Descriptions**: Clear user guidance
- **Dynamic Breadcrumb**: Shows current phase and next steps

### 5. Context Switching Indicators
**Profile Completion Status**:
```typescript
{flowPhase === "profile" && (
  <div className="text-center mb-4">
    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
      <span>Account created successfully</span>
      <span>•</span>
      <span>Complete your profile for full access</span>
    </div>
  </div>
)}
```

#### Visual Elements:
- **Success Indicator**: Green dot showing completed signup
- **Progress Context**: Clear messaging about current phase
- **User Guidance**: Instructions for profile completion benefits

## Flow Configuration

### Updated Flow Structure
```typescript
const flowConfig = {
  signup: [
    { step: 0, name: "Signup", component: "SignUpForm" },
    { step: 1, name: "Verify", component: "OTPVerificationForm" },
    { step: 2, name: "Account Type", component: "AccountTypeSelection" },
    { step: 3, name: "Address", component: "AddressCollection" },
    { step: 4, name: "Complete", component: "SignupSuccess" }
  ],
  profile: [
    { step: 5, name: "Basic Info", component: "BasicInfoCompletion" },
    { step: 6, name: "Identity", component: "IdentityVerification" },
    { step: 7, name: "Payment", component: "PaymentSetup" },
    { step: 8, name: "Payment Success", component: "PaymentSetupSuccess" }
  ]
}
```

### Phase Transition Logic
1. **Signup Phase (0-4)**: Account creation and basic setup
2. **Transition Point**: Step 4 completion offers choice
3. **Profile Phase (5-7)**: Optional completion for full access
4. **Access Control**: Limited vs full access based on completion

## Access Control Integration

### Access Level Management
```typescript
const setAccessLevel = (level: 'limited' | 'full') => {
  localStorage.setItem('accessLevel', level)
  if (level === 'limited') {
    localStorage.setItem("profileCompletionPending", "true")
  } else {
    localStorage.removeItem("profileCompletionPending")
  }
}
```

### Integration Points:
- **Dashboard Behavior**: Different features based on access level
- **Navigation Restrictions**: Guided completion flow
- **Feature Gating**: Limited vs full feature access
- **Progress Tracking**: Profile completion status persistence

## Technical Implementation

### Stepper Value Calculation
```typescript
const getStepperValue = () => {
  if (flowPhase === "signup") {
    return currentStep
  } else {
    return currentStep - 5 // Adjust for profile completion phase
  }
}
```

### Phase Transition Handling
```typescript
// Forward transition to profile phase
if (nextStep === 5 && flowPhase === "signup") {
  setCurrentStep(nextStep)
  setFlowPhase("profile")
  setVisibleSteps(getStepperConfig("profile"))
  return
}

// Backward transition to signup phase
if (prevStep === 4 && flowPhase === "profile") {
  setCurrentStep(prevStep)
  setFlowPhase("signup")
  setVisibleSteps(getStepperConfig("signup"))
  return
}
```

### Step Status Updates
```typescript
// Signup phase progress
if (flowPhase === "signup" && nextStep <= 4) {
  const updatedSteps = visibleSteps.map((step, index) => ({
    ...step,
    status: index < nextStep ? "complete" : index === nextStep ? "current" : "upcoming",
  }))
  setVisibleSteps(updatedSteps)
}

// Profile phase progress  
else if (flowPhase === "profile" && nextStep >= 5 && nextStep <= 7) {
  const profileStepIndex = nextStep - 5
  const updatedSteps = visibleSteps.map((step, index) => ({
    ...step,
    status: index < profileStepIndex ? "complete" : index === profileStepIndex ? "current" : "upcoming",
  }))
  setVisibleSteps(updatedSteps)
}
```

## User Experience Improvements

### Progressive Disclosure
1. **Simple Start**: 5-step signup without overwhelming choices
2. **Natural Progression**: Logical flow from basic to advanced setup
3. **Choice Point**: Clear option to skip or continue at completion
4. **Context Awareness**: Users understand current phase and next steps

### Visual Feedback
- **Smooth Transitions**: 200ms duration for all state changes
- **Color Coding**: Consistent green for complete, blue/primary for current
- **Progress Indicators**: Clear visual feedback on advancement
- **Phase Distinction**: Different styling for signup vs profile phases

### Accessibility Features
- **ARIA Labels**: Proper step descriptions and navigation cues
- **Keyboard Navigation**: Full keyboard accessibility maintained
- **Screen Reader Support**: Clear phase and step announcements
- **Focus Management**: Proper focus handling during transitions

## Performance Optimizations

### Lazy Loading
- All step components lazy loaded for initial performance
- Suspense boundaries with loading indicators
- Component splitting by phase for optimal bundling

### State Management
- Minimal re-renders with targeted state updates
- Efficient step status calculations
- Optimized phase transition handling

## Testing Considerations

### Navigation Testing
1. **Forward Flow**: Complete signup → profile progression
2. **Backward Flow**: Profile → signup transition handling
3. **Skip Scenarios**: Dashboard access with limited permissions
4. **Phase Switching**: Correct stepper updates and state management

### Access Control Testing
1. **Limited Access**: Proper restrictions after signup
2. **Full Access**: Complete feature access after profile
3. **Persistence**: localStorage/sessionStorage handling
4. **Dashboard Integration**: Correct behavior based on access level

### Visual Testing
1. **Stepper Rendering**: Correct steps for each phase
2. **Color Transitions**: Smooth visual feedback
3. **Responsive Behavior**: Mobile and desktop layouts
4. **Phase Indicators**: Proper breadcrumb and context display

## Migration Impact

### Backward Compatibility
- Existing stepper visual design preserved
- Component interfaces maintained where possible
- Color schemes and animations unchanged
- Accessibility features enhanced, not removed

### Integration Requirements
- Access control system integration
- Dashboard component updates for limited/full access handling
- Profile completion tracking in other components
- Navigation guard updates for protected routes

This implementation provides a professional, intuitive progressive stepper that guides users through account creation while offering flexible completion paths and maintaining the high-quality UX standards of the Krutrim Cloud platform. 