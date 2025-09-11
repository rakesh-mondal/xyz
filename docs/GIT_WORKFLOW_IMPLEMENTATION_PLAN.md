# Git Workflow Implementation Plan
## Load Balancer & Certificate Manager Module Deployment

This document provides step-by-step git commands and workflow for pushing the Load Balancer and Certificate Manager modules to the main branch and creating separate PRs for each module.

## 🎯 Objectives

1. **Push only specific modules** to main branch (not entire product branch)
2. **Create separate PRs** for each module
3. **Include navigation updates** related to both modules
4. **Maintain clean git history** and proper documentation

## 📋 Prerequisites

### Before Starting
- [ ] Ensure you're currently on the product branch with all changes
- [ ] Verify all Load Balancer and Certificate Manager files are complete
- [ ] Confirm navigation updates are included
- [ ] Back up current work (optional but recommended)

### Required Information
- **Current branch**: `product` (or your current working branch)
- **Target branch**: `main`
- **New feature branches**: `feature/load-balancer-module` and `feature/certificate-manager-module`

## 🗂️ File Inventory

### Load Balancer Module Files (25+ files)
```bash
# Main pages and components
app/networking/load-balancing/page.tsx
app/networking/load-balancing/balancer/page.tsx
app/networking/load-balancing/balancer/[id]/page.tsx
app/networking/load-balancing/balancer/[id]/edit/page.tsx
app/networking/load-balancing/balancer/create/page.tsx
app/networking/load-balancing/balancer/create/summary/page.tsx
app/networking/load-balancing/target-groups/page.tsx
app/networking/load-balancing/target-groups/[id]/page.tsx
app/networking/load-balancing/target-groups/[id]/edit/page.tsx
app/networking/load-balancing/target-groups/create/page.tsx
app/networking/load-balancing/target-groups/create/page-backup.tsx

# Components
app/networking/load-balancing/components/load-balancer-section.tsx
app/networking/load-balancing/components/target-groups-section.tsx

# Creation flow components
app/networking/load-balancing/balancer/create/components/alb-create-form.tsx
app/networking/load-balancing/balancer/create/components/nlb-create-form.tsx
app/networking/load-balancing/balancer/create/components/alb-progress-modal.tsx
app/networking/load-balancing/balancer/create/components/nlb-progress-modal.tsx
app/networking/load-balancing/balancer/create/components/load-balancer-configuration-modal.tsx

# Form sections
app/networking/load-balancing/balancer/create/components/sections/basic-section.tsx
app/networking/load-balancing/balancer/create/components/sections/listeners-section.tsx
app/networking/load-balancing/balancer/create/components/sections/policy-rules-section.tsx
app/networking/load-balancing/balancer/create/components/sections/pool-section.tsx
app/networking/load-balancing/balancer/create/components/sections/summary-section.tsx
```

### Certificate Manager Module Files (5 files)
```bash
# Main pages
app/administration/certificates/page.tsx
app/administration/certificates/[id]/page.tsx
app/administration/certificates/import/page.tsx

# Modal components
components/modals/delete-certificate-modal.tsx
components/modals/update-certificate-modal.tsx
```

### Shared/Navigation Files (3 files)
```bash
# Navigation updates
components/navigation/left-navigation.tsx
components/navigation/sidebar.tsx
lib/navigation-data.ts

# Data updates (if modified)
lib/data.ts
```

## 🚀 Step-by-Step Git Workflow

### Step 1: Prepare Working Environment

```bash
# 1. Ensure you're on the correct branch with all changes
git status
git branch

# 2. Ensure all changes are committed
git add .
git commit -m "Complete Load Balancer and Certificate Manager modules implementation"

# 3. Fetch latest from remote
git fetch origin

# 4. Create backup branch (optional but recommended)
git checkout -b backup/product-$(date +%Y%m%d)
git checkout product  # or your working branch name
```

### Step 2: Create Feature Branch for Load Balancer Module

```bash
# 1. Create and checkout new branch for Load Balancer module
git checkout main
git pull origin main
git checkout -b feature/load-balancer-module

# 2. Cherry-pick or copy Load Balancer files from product branch
# Method A: Cherry-pick specific commits (if commits are separated by module)
# git cherry-pick <commit-hash-for-load-balancer-changes>

# Method B: Copy specific files (recommended for selective file copying)
git checkout product -- app/networking/load-balancing/
git checkout product -- components/navigation/left-navigation.tsx
git checkout product -- components/navigation/sidebar.tsx

# 3. If lib/data.ts has Load Balancer specific changes, merge them carefully
# You may need to manually edit lib/data.ts to include only Load Balancer related data

# 4. Stage and commit Load Balancer module files
git add app/networking/load-balancing/
git add components/navigation/left-navigation.tsx
git add components/navigation/sidebar.tsx
# git add lib/data.ts  # Only if it contains Load Balancer data

git commit -m "feat: Add comprehensive Load Balancer module

- Add Load Balancer and Target Group management
- Support for ALB and NLB creation and configuration
- Multi-step creation flow with progress tracking
- Health monitoring and metrics display
- VPC integration and security group management
- Responsive design with mobile support
- Integration with navigation system

Files added:
- Complete Load Balancer module in app/networking/load-balancing/
- Navigation updates for Load Balancer access
- Supporting components and modals"

# 5. Push Load Balancer feature branch
git push origin feature/load-balancer-module
```

### Step 3: Create Feature Branch for Certificate Manager Module

```bash
# 1. Switch back to main and create Certificate Manager branch
git checkout main
git checkout -b feature/certificate-manager-module

# 2. Copy Certificate Manager files from product branch
git checkout product -- app/administration/certificates/
git checkout product -- components/modals/delete-certificate-modal.tsx
git checkout product -- components/modals/update-certificate-modal.tsx
git checkout product -- lib/navigation-data.ts

# 3. If lib/data.ts has Certificate Manager specific changes, merge them carefully
# git checkout product -- lib/data.ts  # Only certificate-related parts

# 4. Stage and commit Certificate Manager module files
git add app/administration/certificates/
git add components/modals/delete-certificate-modal.tsx
git add components/modals/update-certificate-modal.tsx
git add lib/navigation-data.ts
# git add lib/data.ts  # Only if it contains Certificate data

git commit -m "feat: Add comprehensive Certificate Manager module

- Add SSL/TLS certificate import and management
- Certificate expiration monitoring and alerts
- Resource association tracking
- Advanced search and filtering capabilities
- Certificate details and validation
- Responsive design with mobile support
- Integration with administration navigation

Files added:
- Complete Certificate Manager module in app/administration/certificates/
- Certificate management modals
- Navigation updates for Certificate Manager access
- Supporting data models and interfaces"

# 5. Push Certificate Manager feature branch
git push origin feature/certificate-manager-module
```

### Step 4: Merge to Main Branch (if direct push is allowed)

```bash
# Option A: Direct merge to main (if you have permissions)
git checkout main
git merge feature/load-balancer-module --no-ff -m "Merge Load Balancer module to main"
git merge feature/certificate-manager-module --no-ff -m "Merge Certificate Manager module to main"
git push origin main
```

### Step 5: Create Pull Requests

```bash
# If using GitHub CLI (gh)
# 1. Create PR for Load Balancer module
gh pr create \
  --base main \
  --head feature/load-balancer-module \
  --title "feat: Add Load Balancer Module" \
  --body-file docs/LOAD_BALANCER_PR_TEMPLATE.md \
  --reviewer <team-members> \
  --label "feature,load-balancer,networking"

# 2. Create PR for Certificate Manager module
gh pr create \
  --base main \
  --head feature/certificate-manager-module \
  --title "feat: Add Certificate Manager Module" \
  --body-file docs/CERTIFICATE_MANAGER_PR_TEMPLATE.md \
  --reviewer <team-members> \
  --label "feature,certificate-manager,administration"
```

### Alternative: Manual PR Creation

If you don't have GitHub CLI, create PRs manually:

1. **Load Balancer Module PR**:
   - Go to GitHub repository
   - Click "New Pull Request"
   - Base: `main`, Compare: `feature/load-balancer-module`
   - Title: "feat: Add Load Balancer Module"
   - Copy content from `docs/LOAD_BALANCER_PR_TEMPLATE.md`

2. **Certificate Manager Module PR**:
   - Go to GitHub repository
   - Click "New Pull Request"
   - Base: `main`, Compare: `feature/certificate-manager-module`
   - Title: "feat: Add Certificate Manager Module"
   - Copy content from `docs/CERTIFICATE_MANAGER_PR_TEMPLATE.md`

## 🔍 Verification Steps

### After Creating Branches
```bash
# Verify Load Balancer branch contains correct files
git checkout feature/load-balancer-module
find app/networking/load-balancing -type f | wc -l  # Should show ~25 files
git log --oneline -5  # Check recent commits

# Verify Certificate Manager branch contains correct files
git checkout feature/certificate-manager-module
find app/administration/certificates -type f | wc -l  # Should show ~3 files
ls components/modals/*certificate*  # Should show 2 modal files
git log --oneline -5  # Check recent commits
```

### After Merging to Main
```bash
# Verify main branch has both modules
git checkout main
ls -la app/networking/load-balancing/
ls -la app/administration/certificates/
git log --oneline -10  # Check recent merge commits
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Issue 1: Merge Conflicts in lib/data.ts
```bash
# If there are conflicts in shared files
git checkout main
git checkout -b fix/data-merge-conflicts
# Manually edit lib/data.ts to include both modules' data
git add lib/data.ts
git commit -m "fix: Resolve data.ts conflicts for both modules"
git checkout feature/load-balancer-module
git merge fix/data-merge-conflicts
git checkout feature/certificate-manager-module
git merge fix/data-merge-conflicts
```

#### Issue 2: Navigation Conflicts
```bash
# If navigation files have conflicts
# Manually merge navigation changes to include both modules
# Ensure both Load Balancer and Certificate Manager entries exist
```

#### Issue 3: Missing Files
```bash
# If some files are missing from a branch
git checkout feature/load-balancer-module
git checkout product -- path/to/missing/file
git add path/to/missing/file
git commit -m "Add missing file to Load Balancer module"
```

## 📋 Post-Deployment Checklist

### After PRs are Merged
- [ ] Verify both modules work in production
- [ ] Check navigation integration
- [ ] Test creation flows end-to-end
- [ ] Monitor for any errors or issues
- [ ] Update team on successful deployment

### Clean Up
```bash
# After successful deployment, clean up feature branches
git branch -d feature/load-balancer-module
git branch -d feature/certificate-manager-module
git push origin --delete feature/load-balancer-module
git push origin --delete feature/certificate-manager-module

# Optional: Clean up backup branch
git branch -d backup/product-$(date +%Y%m%d)
```

## 📞 Support

If you encounter issues during this process:
1. **Check git status** and current branch
2. **Review recent commits** with `git log --oneline -10`
3. **Verify file presence** with `ls` and `find` commands
4. **Create backup branches** before major operations
5. **Test locally** before pushing to remote

## 🎉 Success Criteria

✅ **Load Balancer module** successfully deployed with separate PR  
✅ **Certificate Manager module** successfully deployed with separate PR  
✅ **Navigation integration** working for both modules  
✅ **No breaking changes** to existing functionality  
✅ **Clean git history** with proper commit messages  
✅ **Documentation** complete for both modules
