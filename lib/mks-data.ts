// Mock data for MKS (Managed Kubernetes Service) Dashboard

export interface MKSCluster {
  id: string
  name: string
  region: string
  status: 'creating' | 'active' | 'updating' | 'deleting' | 'error'
  k8sVersion: string
  nodeCount: number
  createdAt: string
  tags: string[]
  vpcId: string
  subnetIds: string[]
  securityGroupIds: string[]
  kubeApiEndpoint: string
  nodePools: MKSNodePool[]
  addOns: MKSAddOn[]
  description?: string
  estimatedCompletionTime?: string
  creationProgress?: number
}

export interface MKSNodePool {
  id: string
  name: string
  flavor: string
  desiredCount: number
  minCount: number
  maxCount: number
  diskSize: number
  taints: string[]
  labels: Record<string, string>
  status: 'creating' | 'active' | 'updating' | 'deleting' | 'error'
  createdAt: string
}

export interface MKSAddOn {
  id: string
  name: string
  displayName: string
  description: string
  category: 'monitoring' | 'networking' | 'security' | 'storage' | 'development'
  isEnabled: boolean
  isDefault: boolean
  isEditable: boolean
  version: string
  status: 'active' | 'installing' | 'failed' | 'disabling'
}

export interface MKSRegion {
  id: string
  name: string
  displayName: string
  isAvailable: boolean
}

export interface MKSPersistentVolume {
  id: string
  name: string
  size: number
  status: 'available' | 'bound' | 'released' | 'failed'
  storageClass: string
  clusterId: string
  createdAt: string
}

// Default Krutrim add-ons
export const defaultKrutrimAddOns: MKSAddOn[] = [
  {
    id: 'addon-monitoring',
    name: 'kube-prometheus-stack',
    displayName: 'Kubernetes Monitoring Stack',
    description: 'Comprehensive monitoring solution with Prometheus, Grafana, and AlertManager',
    category: 'monitoring',
    isEnabled: true,
    isDefault: true,
    isEditable: false,
    version: 'v0.68.0',
    status: 'active'
  },
  {
    id: 'addon-networking',
    name: 'calico',
    displayName: 'Calico Network Policy',
    description: 'Advanced network policy and security for Kubernetes clusters',
    category: 'networking',
    isEnabled: true,
    isDefault: true,
    isEditable: false,
    version: 'v3.26.1',
    status: 'active'
  },
  {
    id: 'addon-security',
    name: 'cert-manager',
    displayName: 'Certificate Manager',
    description: 'Automated certificate management for Kubernetes workloads',
    category: 'security',
    isEnabled: true,
    isDefault: true,
    isEditable: false,
    version: 'v1.13.3',
    status: 'active'
  },
  {
    id: 'addon-storage',
    name: 'aws-ebs-csi-driver',
    displayName: 'AWS EBS CSI Driver',
    description: 'Container Storage Interface driver for Amazon EBS volumes',
    category: 'storage',
    isEnabled: true,
    isDefault: true,
    isEditable: false,
    version: 'v2.20.0',
    status: 'active'
  },
  {
    id: 'addon-development',
    name: 'helm-controller',
    displayName: 'Helm Controller',
    description: 'GitOps-based Helm chart deployment and management',
    category: 'development',
    isEnabled: false,
    isDefault: true,
    isEditable: false,
    version: 'v0.35.0',
    status: 'active'
  }
]

// Available regions
export const availableRegions: MKSRegion[] = [
  { id: 'us-east-1', name: 'us-east-1', displayName: 'US East (N. Virginia)', isAvailable: true },
  { id: 'us-west-2', name: 'us-west-2', displayName: 'US West (Oregon)', isAvailable: true },
  { id: 'eu-west-1', name: 'eu-west-1', displayName: 'Europe (Ireland)', isAvailable: true },
  { id: 'ap-south-1', name: 'ap-south-1', displayName: 'Asia Pacific (Mumbai)', isAvailable: true },
  { id: 'ap-southeast-1', name: 'ap-southeast-1', displayName: 'Asia Pacific (Singapore)', isAvailable: true }
]

// Available node flavors
export const availableNodeFlavors = [
  { id: 't3.medium', name: 't3.medium', vcpus: 2, memory: 4, category: 'General Purpose' },
  { id: 't3.large', name: 't3.large', vcpus: 2, memory: 8, category: 'General Purpose' },
  { id: 'm5.large', name: 'm5.large', vcpus: 2, memory: 8, category: 'General Purpose' },
  { id: 'm5.xlarge', name: 'm5.xlarge', vcpus: 4, memory: 16, category: 'General Purpose' },
  { id: 'c5.large', name: 'c5.large', vcpus: 2, memory: 4, category: 'Compute Optimized' },
  { id: 'c5.xlarge', name: 'c5.xlarge', vcpus: 4, memory: 8, category: 'Compute Optimized' },
  { id: 'r5.large', name: 'r5.large', vcpus: 2, memory: 16, category: 'Memory Optimized' },
  { id: 'r5.xlarge', name: 'r5.xlarge', vcpus: 4, memory: 32, category: 'Memory Optimized' }
]

// Mock clusters data
export const mockMKSClusters: MKSCluster[] = [
  {
    id: 'cluster-1',
    name: 'production-cluster',
    region: 'us-east-1',
    status: 'active',
    k8sVersion: '1.28.0',
    nodeCount: 12,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['production', 'web-apps', 'critical'],
    vpcId: 'vpc-prod-001',
    subnetIds: ['subnet-prod-1a', 'subnet-prod-1b'],
    securityGroupIds: ['sg-prod-cluster'],
    kubeApiEndpoint: 'https://api.production-cluster.k8s.local',
    nodePools: [
      {
        id: 'np-prod-1',
        name: 'prod-workers',
        flavor: 'm5.xlarge',
        desiredCount: 8,
        minCount: 6,
        maxCount: 12,
        diskSize: 100,
        taints: [],
        labels: { environment: 'production', workload: 'web' },
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'np-prod-2',
        name: 'prod-database',
        flavor: 'r5.xlarge',
        desiredCount: 4,
        minCount: 2,
        maxCount: 6,
        diskSize: 200,
        taints: ['dedicated=database:NoSchedule'],
        labels: { environment: 'production', workload: 'database' },
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z'
      }
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({ ...addon, isEnabled: addon.id !== 'addon-development' }))
  },
  {
    id: 'cluster-2',
    name: 'staging-cluster',
    region: 'us-west-2',
    status: 'active',
    k8sVersion: '1.28.0',
    nodeCount: 6,
    createdAt: '2024-02-20T14:15:00Z',
    tags: ['staging', 'testing'],
    vpcId: 'vpc-staging-001',
    subnetIds: ['subnet-staging-1a'],
    securityGroupIds: ['sg-staging-cluster'],
    kubeApiEndpoint: 'https://api.staging-cluster.k8s.local',
    nodePools: [
      {
        id: 'np-staging-1',
        name: 'staging-workers',
        flavor: 't3.large',
        desiredCount: 4,
        minCount: 2,
        maxCount: 8,
        diskSize: 80,
        taints: [],
        labels: { environment: 'staging', workload: 'testing' },
        status: 'active',
        createdAt: '2024-02-20T14:15:00Z'
      },
      {
        id: 'np-staging-2',
        name: 'staging-db',
        flavor: 'm5.large',
        desiredCount: 2,
        minCount: 1,
        maxCount: 3,
        diskSize: 100,
        taints: ['dedicated=database:NoSchedule'],
        labels: { environment: 'staging', workload: 'database' },
        status: 'active',
        createdAt: '2024-02-20T14:15:00Z'
      }
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({ ...addon, isEnabled: addon.id !== 'addon-development' }))
  },
  {
    id: 'cluster-3',
    name: 'development-cluster',
    region: 'eu-west-1',
    status: 'creating',
    k8sVersion: '1.28.0',
    nodeCount: 0,
    createdAt: '2024-12-19T09:00:00Z',
    tags: ['development', 'experimental'],
    vpcId: 'vpc-dev-001',
    subnetIds: ['subnet-dev-1a'],
    securityGroupIds: ['sg-dev-cluster'],
    kubeApiEndpoint: '',
    estimatedCompletionTime: '3 minutes',
    creationProgress: 75,
    nodePools: [
      {
        id: 'np-dev-1',
        name: 'dev-workers',
        flavor: 't3.medium',
        desiredCount: 3,
        minCount: 1,
        maxCount: 5,
        diskSize: 50,
        taints: [],
        labels: { environment: 'development', workload: 'experimental' },
        status: 'creating',
        createdAt: '2024-12-19T09:00:00Z'
      }
    ],
    addOns: defaultKrutrimAddOns.map(addon => ({ ...addon, isEnabled: addon.id === 'addon-monitoring' }))
  }
]

// Mock persistent volumes
export const mockPersistentVolumes: MKSPersistentVolume[] = [
  {
    id: 'pv-1',
    name: 'app-storage-001',
    size: 100,
    status: 'bound',
    storageClass: 'gp3',
    clusterId: 'cluster-1',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'pv-2',
    name: 'db-storage-001',
    size: 200,
    status: 'bound',
    storageClass: 'io2',
    clusterId: 'cluster-1',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'pv-3',
    name: 'staging-storage-001',
    size: 80,
    status: 'bound',
    storageClass: 'gp3',
    clusterId: 'cluster-2',
    createdAt: '2024-02-20T14:15:00Z'
  }
]

// Helper functions
export const getClusterById = (id: string): MKSCluster | undefined => {
  return mockMKSClusters.find(cluster => cluster.id === id)
}

export const getClustersByRegion = (region: string): MKSCluster[] => {
  return mockMKSClusters.filter(cluster => cluster.region === region)
}

export const getClustersByStatus = (status: MKSCluster['status']): MKSCluster[] => {
  return mockMKSClusters.filter(cluster => cluster.status === status)
}

export const getPersistentVolumesByCluster = (clusterId: string): MKSPersistentVolume[] => {
  return mockPersistentVolumes.filter(pv => pv.clusterId === clusterId)
}

