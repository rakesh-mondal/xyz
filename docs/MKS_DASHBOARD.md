# MKS (Managed Kubernetes Service) Dashboard

## Overview

The MKS Dashboard is a comprehensive UI prototype for managing Kubernetes clusters with enterprise-grade features. This implementation follows the design mode approach, using mock data to demonstrate the user experience without backend integration.

## Features Implemented

### 1. Landing View: Cluster Management Dashboard

- **Empty State**: When no clusters exist, displays a centered "Create Cluster" CTA with custom Kubernetes icon
- **Populated State**: Shows a comprehensive table of clusters with the following columns:
  - Cluster Name (clickable, navigates to details)
  - Region
  - Status (with color-coded badges and icons)
  - K8s Version
  - Node Count
  - Age (formatted as relative time)
  - Tags (with overflow handling)
  - Actions (3-dot menu for Edit/Delete)

- **Header Actions**: "Create Cluster" button moves to top-right when clusters exist
- **Status Icons**: Visual indicators for different cluster states (creating, active, updating, deleting, error)

### 2. Cluster Details Page (Read View)

- **Overview Section**: Complete cluster metadata display including:
  - Status with visual indicators
  - Region, K8s version, node count
  - Creation date and tags
  - Progress indicator for creating clusters

- **Associated Resources Section**:
  - **Node Pools**: Detailed table showing pool configuration, instance types, node counts, and labels
  - **Persistent Volumes**: List of attached storage volumes with status and details

- **Add-ons Section**: Display of default Krutrim add-ons with:
  - Toggle states (read-only, no editing)
  - Category badges and version information
  - Clear indication that add-ons are frozen after creation

- **Networking Section**: Read-only display of:
  - VPC ID
  - Subnet IDs
  - Security Group IDs
  - KubeAPI endpoint (with external link button)

### 3. Node Pool Management (Edit Flow)

- **Resize Pool**: Modify min/desired/max node counts with validation
  - Ensures: `0 < min ≤ desired ≤ max`
  - Real-time validation feedback
  - Updates cluster total node count

- **Add Pool**: Comprehensive wizard for creating new node pools
  - Instance type selection with specs display
  - Node count configuration
  - Disk size configuration
  - Form validation and error handling

- **Remove Pool**: Delete node pools with confirmation
  - Warning about service disruption
  - Pool details display before deletion
  - Even last remaining pool can be removed

### 4. Cluster Deletion Flow

- **Validation Rules**:
  - Clusters with node pools cannot be deleted
  - Shows error modal directing users to "Edit Cluster"
  - Lists current node pools that must be removed first

- **Deletion Confirmation**:
  - Clear warning about persistent volume deletion
  - Requires typing exact cluster name for confirmation
  - Shows cluster details before deletion
  - No opt-out for PV deletion (automatic)

### 5. Persistent Volumes Warning

- **Clear Warnings**: All deletion flows prominently display PV deletion warnings
- **No Opt-out**: PV deletion is automatic and cannot be disabled
- **Backup Reminder**: Users are reminded to take backups before deletion

## Technical Implementation

### File Structure

```
app/kubernetes/
├── page.tsx                    # Main MKS dashboard
├── clusters/
│   ├── [id]/
│   │   ├── page.tsx           # Cluster details page
│   │   └── edit/
│   │       └── page.tsx       # Edit cluster page
│   └── layout.tsx             # Clusters layout
└── layout.tsx                 # Kubernetes layout

components/mks/
├── cluster-delete-modal.tsx   # Delete confirmation modal
└── node-pool-management.tsx   # Node pool management component

lib/
└── mks-data.ts               # Mock data and interfaces
```

### Key Components

1. **ClusterDeleteModal**: Handles all deletion scenarios with proper validation
2. **NodePoolManagement**: Comprehensive node pool CRUD operations
3. **Mock Data**: Realistic sample data for 3 clusters with different states
4. **Status Management**: Visual indicators and progress tracking for cluster states

### Data Models

- **MKSCluster**: Complete cluster representation with all metadata
- **MKSNodePool**: Node pool configuration and scaling parameters
- **MKSAddOn**: Add-on configuration with frozen state management
- **MKSPersistentVolume**: Storage volume information

### Styling Patterns

- Follows existing codebase design patterns
- Uses shadcn/ui components consistently
- Responsive design with proper mobile support
- Consistent color coding for status indicators
- Proper spacing and typography hierarchy

## Mock Data

The dashboard includes realistic sample data:

- **Production Cluster**: 12 nodes, 2 node pools, all add-ons enabled
- **Staging Cluster**: 6 nodes, 2 node pools, most add-ons enabled
- **Development Cluster**: Creating state, 1 node pool, minimal add-ons

### Default Krutrim Add-ons

1. **Monitoring**: Kubernetes Monitoring Stack (Prometheus, Grafana)
2. **Networking**: Calico Network Policy
3. **Security**: Certificate Manager
4. **Storage**: AWS EBS CSI Driver
5. **Development**: Helm Controller (disabled by default)

## Usage Instructions

### Viewing Clusters

1. Navigate to `/kubernetes` to see the main dashboard
2. Click on any cluster name to view detailed information
3. Use the 3-dot menu for quick actions

### Editing Clusters

1. From cluster details, click "Edit Cluster"
2. Modify node pool configurations
3. Add or remove node pools as needed
4. Save changes or cancel with confirmation

### Deleting Clusters

1. Use delete button from cluster details or dashboard
2. Follow validation rules (remove node pools first)
3. Confirm deletion by typing cluster name
4. Acknowledge persistent volume deletion warning

## Future Enhancements

When moving from design mode to production:

1. **API Integration**: Replace mock data with real backend calls
2. **Real-time Updates**: WebSocket connections for live status updates
3. **Authentication**: IAM and RBAC integration
4. **Error Handling**: Comprehensive error states and retry mechanisms
5. **Audit Logging**: Track all cluster modifications
6. **Backup Management**: Integrate with backup systems
7. **Monitoring**: Real metrics and alerting integration

## Design Decisions

1. **Frozen Add-ons**: Add-ons cannot be modified after creation (CLI-only for custom)
2. **Node Pool Flexibility**: Even last node pool can be removed for maximum flexibility
3. **Clear Warnings**: Persistent volume deletion warnings are prominent and unavoidable
4. **Validation**: Real-time form validation with clear error messages
5. **Progressive Disclosure**: Complex operations are broken into logical steps
6. **Consistent UX**: All forms and interactions follow established patterns

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Accessible UI components following ARIA guidelines
- Keyboard navigation support

