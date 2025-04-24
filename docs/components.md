# Krutrim Cloud Components Documentation

This document provides information about components in the Krutrim Cloud project, including those that are currently unused but planned for future implementation.

## Authentication Components

### GitHubAuthScreen

**Location:** `components/auth/github-auth-screen.tsx`

**Purpose:** Provides a GitHub-styled authentication interface for users signing in with GitHub.

**Usage Example:**
\`\`\`tsx
import { GitHubAuthScreen } from "@/components/auth/github-auth-screen";

// In a page component:
export default function GitHubAuthPage() {
  return <GitHubAuthScreen />;
}
\`\`\`

**Implementation Timeline:** Planned for Q2 2023 as part of the authentication system upgrade.

### GoogleAuthScreen

**Location:** `components/auth/google-auth-screen.tsx`

**Purpose:** Provides a Google-styled account selection interface for users signing in with Google.

**Usage Example:**
\`\`\`tsx
import { GoogleAuthScreen } from "@/components/auth/google-auth-screen";

// In a page component:
export default function GoogleAuthPage() {
  return <GoogleAuthScreen />;
}
\`\`\`

**Implementation Timeline:** Planned for Q2 2023 as part of the authentication system upgrade.

## Billing Components

### CreditsDisplay

**Location:** `components/billing/credits-display.tsx`

**Purpose:** Displays the user's available credits in the Krutrim Cloud platform.

**Usage Example:**
\`\`\`tsx
import { CreditsDisplay } from "@/components/billing/credits-display";

// In a header or billing component:
export function BillingHeader() {
  return (
    <div className="flex justify-between items-center">
      <h2>Billing Dashboard</h2>
      <CreditsDisplay />
    </div>
  );
}
\`\`\`

**Implementation Timeline:** Planned for Q3 2023 when the billing system is integrated.

## Icon Components

### TranslateIcon

**Location:** `components/icons/translate-icon.tsx`

**Purpose:** Icon for internationalization features in the platform.

**Usage Example:**
\`\`\`tsx
import { TranslateIcon } from "@/components/icons/translate-icon";

// In a language selector component:
export function LanguageSelector() {
  return (
    <Button variant="ghost" size="sm">
      <TranslateIcon className="h-4 w-4 mr-2" />
      Change Language
    </Button>
  );
}
\`\`\`

**Implementation Timeline:** Planned for Q3 2023 when the i18n system is implemented.
