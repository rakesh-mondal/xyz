# Cluster Details Page (View Cluster)

## Overview

The Cluster Details Page provides a comprehensive view of a Kubernetes cluster with detailed information about its configuration, health, and management capabilities. This page is accessible at `/kubernetes/clusters/[id]` where `[id]` is the cluster identifier.

## Features

### 1. Cluster Overview
- **Cluster Name & Status**: Displays current cluster status with visual indicators
- **Kubernetes Version**: Shows current version with upgrade availability indicator
- **Region Information**: Displays cluster location (Bangalore/Hyderabad)
- **API Endpoint**: Shows cluster API endpoint with access type
- **Creation Date**: Timestamp of when the cluster was created
- **Network Configuration**: VPC, subnets, and security groups information

### 2. Node Pools Management
- **View Mode**: Displays all node pools with instance details, node counts, and status
- **Edit Mode**: Allows modification of node counts (desired, min, max) for each pool
- **Default Pool Protection**: Default pools cannot be deleted but can be resized
- **Advanced Details**: Expandable sections for taints, labels, and tags
- **Real-time Updates**: Changes are reflected immediately in the UI

### 3. Add-ons Configuration
- **Krutrim Default Add-ons**: CNI, CSI, CoreDNS, Kube-proxy, DNS-proxy
- **Toggle Functionality**: Enable/disable add-ons with edit mode
- **Conflict Detection**: Warns about potential conflicts when disabling defaults
- **Category Organization**: Grouped by monitoring, networking, security, storage, development
- **Version Information**: Shows current add-on versions and status

### 4. Cost Estimation
- **Real-time Calculation**: Control plane + node pool costs
- **Hourly & Monthly**: Both hourly and monthly cost breakdowns
- **Instance-specific Pricing**: Detailed costs per node pool and instance type
- **Optimization Tips**: Suggestions for cost reduction
- **Usage Trends**: Current node count and pool information

### 5. Cluster Actions
- **Version Upgrade**: Upgrade Kubernetes version with supported path information
- **Edit Cluster**: Navigate to edit mode for comprehensive changes
- **Delete Cluster**: Safe deletion with dependency checks and confirmation
- **Quick Actions**: Direct access to logs, settings, and other functions

### 6. Health & Monitoring
- **Overall Status**: Visual health indicators for the entire cluster
- **Component Health**: Individual health status for control plane, node pools, networking, storage
- **Resource Metrics**: CPU, memory, and disk usage with progress bars
- **Recent Events**: Timeline of cluster events and status changes
- **Performance Metrics**: Uptime, pod count, response times, and service counts

## Usage

### Accessing the Page
1. Navigate to `/kubernetes` to see the list of clusters
2. Click on any cluster name to view its details
3. The URL will be `/kubernetes/clusters/[cluster-id]`

### Editing Node Pools
1. Click "Edit Node Pools" button in the Node Pools tab
2. Modify node counts using inline inputs or detailed dialogs
3. Click "Save Changes" to apply modifications
4. Use "Cancel" to discard changes

### Managing Add-ons
1. Click "Edit Add-ons" button in the Add-ons tab
2. Toggle switches to enable/disable add-ons
3. Review warnings about disabled defaults
4. Click "Save Config" to apply changes

### Upgrading Cluster Version
1. Click "Upgrade Cluster" button (only visible when upgrade is available)
2. Review the upgrade path and estimated time
3. Confirm the upgrade process

### Deleting a Cluster
1. Click "Delete Cluster" button
2. Review warnings about data loss and dependencies
3. Type the cluster name to confirm deletion
4. Confirm the action

## Data Structure

The page uses mock data from `lib/mks-data.ts` including:
- `MKSCluster`: Main cluster information
- `MKSNodePool`: Node pool configurations
- `MKSAddOn`: Add-on definitions and status
- Pricing information for cost calculations
- Health metrics and monitoring data

## Components

### Main Components
- `ClusterDetailsPage`: Main page component with routing and state management
- `ClusterOverview`: Displays cluster metadata and status
- `NodePoolsSection`: Manages node pool display and editing
- `AddOnsSection`: Handles add-on configuration and toggles
- `CostEstimation`: Shows cost breakdowns and estimates
- `ClusterHealth`: Displays health metrics and monitoring

### UI Components Used
- Cards, Tables, and Forms from the design system
- Progress bars for resource usage visualization
- Badges for status and category indicators
- Modals for confirmations and detailed editing
- Tabs for organizing different sections

## Responsive Design

The page is fully responsive with:
- Grid layouts that adapt to different screen sizes
- Mobile-friendly navigation and controls
- Optimized spacing and typography for various devices
- Collapsible sections for better mobile experience

## Future Enhancements

Potential improvements for production use:
- Real-time data updates via WebSocket connections
- Integration with actual Kubernetes APIs
- Advanced monitoring and alerting capabilities
- Backup and restore functionality
- Multi-cluster management features
- Advanced networking configuration options

## Technical Notes

- Built with Next.js 15 and React 18
- Uses TypeScript for type safety
- Follows the established design system patterns
- Implements proper state management for edit modes
- Includes comprehensive error handling and validation
- Follows accessibility best practices
