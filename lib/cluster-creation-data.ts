// Mock data for cluster creation flow

export interface ClusterCreationRegion {
  id: string
  name: string
  displayName: string
  isAvailable: boolean
}

export interface ClusterCreationVPC {
  id: string
  name: string
  region: string
  status: 'active' | 'creating' | 'error'
  cidr: string
  description: string
}

export interface ClusterCreationSubnet {
  id: string
  name: string
  vpcId: string
  type: 'Public' | 'Private'
  status: 'Active' | 'creating' | 'error'
  cidr: string
  availabilityZone: string
  description: string
}

export interface KubernetesVersion {
  version: string
  eolDate: string
  isRecommended: boolean
  isLatest: boolean
}

export interface APIServerEndpoint {
  type: 'public' | 'private' | 'whitelisted'
  whitelistedIPs?: string[]
}

export interface ClusterConfiguration {
  region: string
  vpcId: string
  subnetIds: string[]
  kubernetesVersion: string
  autoUpgrade: boolean
  apiServerEndpoint: APIServerEndpoint
}

export interface CostBreakdown {
  cluster: {
    hourly: number
    monthly: number
  }
  nodePool: {
    hourly: number
    monthly: number
  }
  total: {
    hourly: number
    monthly: number
  }
}

// Available regions for cluster creation (only Bangalore and Hyderabad)
export const availableRegions: ClusterCreationRegion[] = [
  {
    id: 'ap-south-1',
    name: 'ap-south-1',
    displayName: 'Bangalore',
    isAvailable: true
  },
  {
    id: 'ap-southeast-1',
    name: 'ap-southeast-1',
    displayName: 'Hyderabad',
    isAvailable: true
  }
]

// Mock VPCs data
export const mockVPCs: ClusterCreationVPC[] = [
  {
    id: 'vpc-bangalore-1',
    name: 'production-vpc-bangalore',
    region: 'ap-south-1',
    status: 'active',
    cidr: '10.0.0.0/16',
    description: 'Production VPC in Bangalore region'
  },
  {
    id: 'vpc-bangalore-2',
    name: 'development-vpc-bangalore',
    region: 'ap-south-1',
    status: 'active',
    cidr: '10.1.0.0/16',
    description: 'Development VPC in Bangalore region'
  },
  {
    id: 'vpc-hyderabad-1',
    name: 'production-vpc-hyderabad',
    region: 'ap-southeast-1',
    status: 'active',
    cidr: '10.2.0.0/16',
    description: 'Production VPC in Hyderabad region'
  },
  {
    id: 'vpc-hyderabad-2',
    name: 'staging-vpc-hyderabad',
    region: 'ap-southeast-1',
    status: 'active',
    cidr: '10.3.0.0/16',
    description: 'Staging VPC in Hyderabad region'
  }
]

// Mock subnets data
export const mockSubnets: ClusterCreationSubnet[] = [
  // Bangalore VPC 1 subnets
  {
    id: 'subnet-bangalore-1a-public',
    name: 'bangalore-1a-public',
    vpcId: 'vpc-bangalore-1',
    type: 'Public',
    status: 'Active',
    cidr: '10.0.1.0/24',
    availabilityZone: 'ap-south-1a',
    description: 'Public subnet in Bangalore 1a'
  },
  {
    id: 'subnet-bangalore-1b-private',
    name: 'bangalore-1b-private',
    vpcId: 'vpc-bangalore-1',
    type: 'Private',
    status: 'Active',
    cidr: '10.0.2.0/24',
    availabilityZone: 'ap-south-1b',
    description: 'Private subnet in Bangalore 1b'
  },
  {
    id: 'subnet-bangalore-1c-public',
    name: 'bangalore-1c-public',
    vpcId: 'vpc-bangalore-1',
    type: 'Public',
    status: 'Active',
    cidr: '10.0.3.0/24',
    availabilityZone: 'ap-south-1c',
    description: 'Public subnet in Bangalore 1c'
  },
  // Bangalore VPC 2 subnets
  {
    id: 'subnet-bangalore-dev-1a',
    name: 'bangalore-dev-1a',
    vpcId: 'vpc-bangalore-2',
    type: 'Public',
    status: 'Active',
    cidr: '10.1.1.0/24',
    availabilityZone: 'ap-south-1a',
    description: 'Development public subnet in Bangalore 1a'
  },
  // Hyderabad VPC 1 subnets
  {
    id: 'subnet-hyderabad-1a-public',
    name: 'hyderabad-1a-public',
    vpcId: 'vpc-hyderabad-1',
    type: 'Public',
    status: 'Active',
    cidr: '10.2.1.0/24',
    availabilityZone: 'ap-southeast-1a',
    description: 'Public subnet in Hyderabad 1a'
  },
  {
    id: 'subnet-hyderabad-1b-private',
    name: 'hyderabad-1b-private',
    vpcId: 'vpc-hyderabad-1',
    type: 'Private',
    status: 'Active',
    cidr: '10.2.2.0/24',
    availabilityZone: 'ap-southeast-1b',
    description: 'Private subnet in Hyderabad 1b'
  },
  // Hyderabad VPC 2 subnets
  {
    id: 'subnet-hyderabad-staging-1a',
    name: 'hyderabad-staging-1a',
    vpcId: 'vpc-hyderabad-2',
    type: 'Public',
    status: 'Active',
    cidr: '10.3.1.0/24',
    availabilityZone: 'ap-southeast-1a',
    description: 'Staging public subnet in Hyderabad 1a'
  }
]

// Available Kubernetes versions with EOL dates
export const availableKubernetesVersions: KubernetesVersion[] = [
  {
    version: '1.34.0',
    eolDate: '31/12/2026',
    isRecommended: true,
    isLatest: true
  },
  {
    version: '1.33.0',
    eolDate: '30/06/2026',
    isRecommended: false,
    isLatest: false
  },
  {
    version: '1.32.0',
    eolDate: '31/12/2025',
    isRecommended: false,
    isLatest: false
  },
  {
    version: '1.31.0',
    eolDate: '30/06/2025',
    isRecommended: false,
    isLatest: false
  },
  {
    version: '1.30.0',
    eolDate: '31/12/2024',
    isRecommended: false,
    isLatest: false
  }
]

// Helper functions
export const getVPCsByRegion = (regionId: string): ClusterCreationVPC[] => {
  return mockVPCs.filter(vpc => vpc.region === regionId)
}

export const getSubnetsByVPC = (vpcId: string): ClusterCreationSubnet[] => {
  return mockSubnets.filter(subnet => subnet.vpcId === vpcId)
}

export const calculateCosts = (configuration: Partial<ClusterConfiguration>): CostBreakdown => {
  // Base costs (placeholder values)
  const baseClusterCost = 0.50 // $0.50 per hour
  const baseNodePoolCost = 0.25 // $0.25 per hour per node (placeholder)
  
  // Calculate costs based on configuration
  let clusterCost = baseClusterCost
  let nodePoolCost = baseNodePoolCost * 3 // Default 3 nodes
  
  // Region-specific pricing (placeholder)
  if (configuration.region === 'ap-south-1') { // Bangalore
    clusterCost *= 1.0 // Standard pricing
  } else if (configuration.region === 'ap-southeast-1') { // Hyderabad
    clusterCost *= 1.1 // Slightly higher pricing
  }
  
  // Version-specific pricing (placeholder)
  if (configuration.kubernetesVersion && configuration.kubernetesVersion.startsWith('1.3')) {
    clusterCost *= 1.05 // Newer versions cost slightly more
  }
  
  // API endpoint pricing (placeholder)
  if (configuration.apiServerEndpoint?.type === 'whitelisted') {
    clusterCost += 0.10 // Additional security features
  }
  
  const hourlyTotal = clusterCost + nodePoolCost
  const monthlyTotal = hourlyTotal * 24 * 30
  
  return {
    cluster: {
      hourly: clusterCost,
      monthly: clusterCost * 24 * 30
    },
    nodePool: {
      hourly: nodePoolCost,
      monthly: nodePoolCost * 24 * 30
    },
    total: {
      hourly: hourlyTotal,
      monthly: monthlyTotal
    }
  }
}

// Generate ClusterSpec YAML
export const generateClusterSpecYAML = (configuration: ClusterConfiguration): string => {
  const vpc = mockVPCs.find(v => v.id === configuration.vpcId)
  const subnets = mockSubnets.filter(s => configuration.subnetIds.includes(s.id))
  
  return `apiVersion: v1
kind: ClusterSpec
metadata:
  name: kubernetes-cluster
  labels:
    region: ${configuration.region}
    environment: production
spec:
  region: ${configuration.region}
  vpc:
    id: ${configuration.vpcId}
    name: ${vpc?.name || 'unknown'}
    cidr: ${vpc?.cidr || 'unknown'}
  networking:
    subnets:
${subnets.map(subnet => `      - id: ${subnet.id}
        name: ${subnet.name}
        type: ${subnet.type}
        cidr: ${subnet.cidr}
        availabilityZone: ${subnet.availabilityZone}`).join('\n')}
  kubernetes:
    version: ${configuration.kubernetesVersion}
    autoUpgrade: ${configuration.autoUpgrade}
  apiServer:
    endpointType: ${configuration.apiServerEndpoint.type}
${configuration.apiServerEndpoint.type === 'whitelisted' && configuration.apiServerEndpoint.whitelistedIPs ? `    whitelistedIPs:
${configuration.apiServerEndpoint.whitelistedIPs.map(ip => `      - ${ip}`).join('\n')}` : ''}
  nodePools:
    - name: default-pool
      flavor: t3.medium
      desiredCount: 3
      minCount: 1
      maxCount: 10
      diskSize: 100
      labels:
        environment: production
        workload: general`
}

