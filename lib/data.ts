export const vpcs = [
  {
    id: "vpc-1",
    name: "production-vpc",
    status: "active",
    type: "Paid",
    region: "us-east-1",
    createdOn: "2023-01-01T10:30:00Z",
    description: "Main production VPC with enterprise features",
    networkName: "production-network",
    resources: [
      { type: "VM", name: "web-server-01", count: 1 },
      { type: "VM", name: "db-server-01", count: 1 },
      { type: "Storage", name: "app-storage", count: 2 },
      { type: "Load Balancer", name: "prod-lb", count: 1 },
    ],
  },
  {
    id: "vpc-2",
    name: "development-vpc",
    status: "active",
    type: "Free",
    region: "us-west-2",
    createdOn: "2023-02-15T14:20:00Z",
    description: "Development environment for testing new features",
    networkName: "development-network",
    resources: [
      { type: "VM", name: "dev-server", count: 1 },
      { type: "Storage", name: "dev-storage", count: 1 },
    ],
  },
  {
    id: "vpc-3",
    name: "staging-vpc",
    status: "active",
    type: "Paid",
    region: "eu-west-1",
    createdOn: "2023-03-20T09:15:00Z",
    description: "Staging environment for pre-production testing",
    networkName: "staging-network",
    resources: [
      { type: "VM", name: "staging-app", count: 2 },
      { type: "VM", name: "staging-db", count: 1 },
      { type: "Storage", name: "staging-storage", count: 1 },
    ],
  },
  {
    id: "vpc-4",
    name: "testing-vpc",
    status: "active",
    type: "Free",
    region: "us-central-1",
    createdOn: "2023-04-10T16:45:00Z",
    description: "Testing environment for quality assurance",
    networkName: "testing-network",
    resources: [],
  },
  {
    id: "vpc-5",
    name: "backup-vpc",
    status: "active",
    type: "Paid",
    region: "eu-north-1",
    createdOn: "2023-05-05T11:30:00Z",
    description: "Backup and disaster recovery infrastructure",
    networkName: "backup-network",
    resources: [
      { type: "Storage", name: "backup-storage-1", count: 5 },
      { type: "Storage", name: "backup-storage-2", count: 3 },
    ],
  },
  {
    id: "vpc-6",
    name: "analytics-vpc",
    status: "active",
    type: "Paid",
    region: "ap-south-1",
    createdOn: "2023-06-12T13:25:00Z",
    description: "Analytics and data processing workloads",
    networkName: "analytics-network",
    resources: [
      { type: "VM", name: "analytics-cluster", count: 3 },
      { type: "Storage", name: "data-lake", count: 1 },
    ],
  },
  {
    id: "vpc-7",
    name: "security-vpc",
    status: "active",
    type: "Paid",
    region: "us-east-2",
    createdOn: "2023-07-08T08:40:00Z",
    description: "Security monitoring and compliance tools",
    networkName: "security-network",
    resources: [
      { type: "VM", name: "security-monitor", count: 1 },
      { type: "Storage", name: "logs-storage", count: 2 },
    ],
  },
  {
    id: "vpc-8",
    name: "research-vpc",
    status: "active",
    type: "Free",
    region: "eu-central-1",
    createdOn: "2023-08-20T15:55:00Z",
    description: "Research and experimental projects",
    networkName: "research-network",
    resources: [],
  },
  {
    id: "vpc-9",
    name: "integration-vpc",
    status: "active",
    type: "Paid",
    region: "ap-southeast-1",
    createdOn: "2023-09-15T12:10:00Z",
    description: "Integration testing and API validation",
    networkName: "integration-network",
    resources: [
      { type: "VM", name: "api-gateway", count: 1 },
    ],
  },
  {
    id: "vpc-10",
    name: "legacy-vpc",
    status: "active",
    type: "Paid",
    region: "us-west-1",
    createdOn: "2022-12-01T07:20:00Z",
    description: "Legacy applications and systems",
    networkName: "legacy-network",
    resources: [
      { type: "VM", name: "legacy-app-1", count: 1 },
      { type: "VM", name: "legacy-app-2", count: 1 },
      { type: "Storage", name: "legacy-storage", count: 3 },
    ],
  },
  {
    id: "vpc-11",
    name: "ml-vpc",
    status: "active",
    type: "Paid",
    region: "us-east-1",
    createdOn: "2023-10-05T14:35:00Z",
    description: "Machine learning training and inference",
    networkName: "ml-network",
    resources: [
      { type: "VM", name: "ml-training", count: 4 },
      { type: "GPU", name: "ml-gpu-cluster", count: 2 },
      { type: "Storage", name: "ml-datasets", count: 2 },
    ],
  },
  {
    id: "vpc-12",
    name: "cdn-vpc",
    status: "active",
    type: "Paid",
    region: "eu-west-2",
    createdOn: "2023-11-10T10:50:00Z",
    description: "CDN and content delivery infrastructure",
    networkName: "cdn-network",
    resources: [
      { type: "VM", name: "cdn-edge", count: 5 },
      { type: "Storage", name: "cdn-cache", count: 2 },
      { type: "Load Balancer", name: "cdn-lb", count: 2 },
    ],
  },
  {
    id: "vpc-13",
    name: "iot-vpc",
    status: "active",
    type: "Free",
    region: "ap-northeast-1",
    createdOn: "2023-12-01T17:15:00Z",
    description: "IoT devices and sensor data collection",
    networkName: "iot-network",
    resources: [],
  },
  {
    id: "vpc-14",
    name: "gaming-vpc",
    status: "active",
    type: "Paid",
    region: "us-central-1",
    createdOn: "2024-01-15T09:25:00Z",
    description: "Gaming infrastructure and real-time services",
    networkName: "gaming-network",
    resources: [
      { type: "VM", name: "game-server", count: 8 },
      { type: "Storage", name: "game-assets", count: 1 },
      { type: "Load Balancer", name: "game-lb", count: 1 },
    ],
  },
  {
    id: "vpc-15",
    name: "blockchain-vpc",
    status: "active",
    type: "Free",
    region: "eu-south-1",
    createdOn: "2024-02-20T13:40:00Z",
    description: "Blockchain development and cryptocurrency testing",
    networkName: "blockchain-network",
    resources: [],
  },
]

export const securityGroups = [
  {
    id: "sg-1",
    name: "production-sg",
    vpcName: "production-vpc",
    createdOn: "2023-01-05",
    status: "active",
    description: "Security group for production servers",
    inboundRules: [
      { id: "in-1", protocol: "tcp", portRange: "80", remoteIpPrefix: "0.0.0.0/0", description: "Allow HTTP" },
      { id: "in-2", protocol: "tcp", portRange: "443", remoteIpPrefix: "0.0.0.0/0", description: "Allow HTTPS" },
    ],
    outboundRules: [
      {
        id: "out-1",
        protocol: "all",
        portRange: "All",
        remoteIpPrefix: "0.0.0.0/0",
        description: "Allow all outbound traffic",
      },
    ],
  },
  {
    id: "sg-2",
    name: "development-sg",
    vpcName: "development-vpc",
    createdOn: "2023-02-20",
    status: "active",
    description: "Security group for development servers",
    inboundRules: [
      { id: "in-3", protocol: "tcp", portRange: "22", remoteIpPrefix: "0.0.0.0/0", description: "Allow SSH" },
    ],
    outboundRules: [
      {
        id: "out-2",
        protocol: "all",
        portRange: "All",
        remoteIpPrefix: "0.0.0.0/0",
        description: "Allow all outbound traffic",
      },
    ],
  },
]

export const subnets = [
  {
    id: "subnet-1",
    name: "production-subnet-public",
    vpcName: "production-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.0.1.0/24",
    gatewayIp: "10.0.1.1",
    createdOn: "2023-01-05T10:30:00Z",
    availabilityZone: "us-east-1a",
    description: "Production public subnet for web servers",
  },
  {
    id: "subnet-2",
    name: "production-subnet-private",
    vpcName: "production-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.0.2.0/24",
    gatewayIp: "10.0.2.1",
    createdOn: "2023-01-05T10:45:00Z",
    availabilityZone: "us-east-1b",
    description: "Production private subnet for database servers",
  },
  {
    id: "subnet-3",
    name: "development-subnet-public",
    vpcName: "development-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.1.1.0/24",
    gatewayIp: "10.1.1.1",
    createdOn: "2023-02-20T14:20:00Z",
    availabilityZone: "us-west-2a",
    description: "Development public subnet for testing",
  },
  {
    id: "subnet-4",
    name: "staging-subnet-public",
    vpcName: "staging-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.2.1.0/24",
    gatewayIp: "10.2.1.1",
    createdOn: "2023-03-20T09:15:00Z",
    availabilityZone: "eu-west-1a",
    description: "Staging public subnet for pre-production testing",
  },
  {
    id: "subnet-5",
    name: "staging-subnet-private",
    vpcName: "staging-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.2.2.0/24",
    gatewayIp: "10.2.2.1",
    createdOn: "2023-03-20T09:30:00Z",
    availabilityZone: "eu-west-1b",
    description: "Staging private subnet for backend services",
  },
  {
    id: "subnet-6",
    name: "testing-subnet-public",
    vpcName: "testing-vpc",
    type: "Public",
    status: "Inactive",
    cidr: "10.3.1.0/24",
    gatewayIp: "10.3.1.1",
    createdOn: "2023-04-10T16:45:00Z",
    availabilityZone: "us-central-1a",
    description: "Testing public subnet for QA",
  },
  {
    id: "subnet-7",
    name: "backup-subnet-private",
    vpcName: "backup-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.4.1.0/24",
    gatewayIp: "10.4.1.1",
    createdOn: "2023-05-05T11:30:00Z",
    availabilityZone: "eu-north-1a",
    description: "Backup private subnet for disaster recovery",
  },
  {
    id: "subnet-8",
    name: "analytics-subnet-private",
    vpcName: "analytics-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.5.1.0/24",
    gatewayIp: "10.5.1.1",
    createdOn: "2023-06-12T13:25:00Z",
    availabilityZone: "ap-south-1a",
    description: "Analytics private subnet for data processing",
  },
  {
    id: "subnet-9",
    name: "security-subnet-public",
    vpcName: "security-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.6.1.0/24",
    gatewayIp: "10.6.1.1",
    createdOn: "2023-07-08T08:40:00Z",
    availabilityZone: "us-east-2a",
    description: "Security public subnet for monitoring tools",
  },
  {
    id: "subnet-10",
    name: "ml-subnet-private",
    vpcName: "ml-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.7.1.0/24",
    gatewayIp: "10.7.1.1",
    createdOn: "2023-10-05T14:35:00Z",
    availabilityZone: "us-east-1a",
    description: "ML private subnet for training and inference",
  },
  {
    id: "subnet-11",
    name: "cdn-subnet-public",
    vpcName: "cdn-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.8.1.0/24",
    gatewayIp: "10.8.1.1",
    createdOn: "2023-11-10T10:50:00Z",
    availabilityZone: "eu-west-2a",
    description: "CDN public subnet for edge servers",
  },
  {
    id: "subnet-12",
    name: "iot-subnet-private",
    vpcName: "iot-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.9.1.0/24",
    gatewayIp: "10.9.1.1",
    createdOn: "2023-12-01T17:15:00Z",
    availabilityZone: "ap-northeast-1a",
    description: "IoT private subnet for device connectivity",
  },
  {
    id: "subnet-13",
    name: "gaming-subnet-public",
    vpcName: "gaming-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.10.1.0/24",
    gatewayIp: "10.10.1.1",
    createdOn: "2024-01-15T09:25:00Z",
    availabilityZone: "us-central-1a",
    description: "Gaming public subnet for game servers",
  },

  {
    id: "subnet-15",
    name: "research-subnet-public",
    vpcName: "research-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.12.1.0/24",
    gatewayIp: "10.12.1.1",
    createdOn: "2023-08-20T15:55:00Z",
    availabilityZone: "eu-central-1a",
    description: "Research public subnet for experimental projects",
  },
  // Additional subnets for production VPC to show multiple subnets
  {
    id: "subnet-16",
    name: "production-subnet-dmz",
    vpcName: "production-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.0.3.0/24",
    gatewayIp: "10.0.3.1",
    createdOn: "2023-01-10T11:00:00Z",
    availabilityZone: "us-east-1c",
    description: "Production DMZ subnet for load balancers",
  },
  {
    id: "subnet-17",
    name: "production-subnet-db",
    vpcName: "production-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.0.4.0/24",
    gatewayIp: "10.0.4.1",
    createdOn: "2023-01-10T11:15:00Z",
    availabilityZone: "us-east-1d",
    description: "Production database cluster subnet",
  },
  // Additional subnets for ML VPC
  {
    id: "subnet-18",
    name: "ml-subnet-public",
    vpcName: "ml-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.7.2.0/24",
    gatewayIp: "10.7.2.1",
    createdOn: "2023-10-06T09:20:00Z",
    availabilityZone: "us-east-1b",
    description: "ML public subnet for model serving",
  },
  {
    id: "subnet-19",
    name: "ml-subnet-gpu",
    vpcName: "ml-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.7.3.0/24",
    gatewayIp: "10.7.3.1",
    createdOn: "2023-10-06T09:35:00Z",
    availabilityZone: "us-east-1c",
    description: "ML GPU cluster subnet for intensive training",
  },
  // Additional subnet for gaming VPC
  {
    id: "subnet-20",
    name: "gaming-subnet-private",
    vpcName: "gaming-vpc",
    type: "Private",
    status: "Active",
    cidr: "10.10.2.0/24",
    gatewayIp: "10.10.2.1",
    createdOn: "2024-01-15T10:00:00Z",
    availabilityZone: "us-central-1b",
    description: "Gaming private subnet for backend services",
  },
  // Additional subnet for integration VPC (was empty before)
  {
    id: "subnet-21",
    name: "integration-subnet-public",
    vpcName: "integration-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.13.1.0/24",
    gatewayIp: "10.13.1.1",
    createdOn: "2023-09-16T08:30:00Z",
    availabilityZone: "ap-southeast-1a",
    description: "Integration testing public subnet",
  },
  // Additional subnet for legacy VPC
  {
    id: "subnet-22",
    name: "legacy-subnet-public",
    vpcName: "legacy-vpc",
    type: "Public",
    status: "Active",
    cidr: "10.14.1.0/24",
    gatewayIp: "10.14.1.1",
    createdOn: "2022-12-05T10:45:00Z",
    availabilityZone: "us-west-1a",
    description: "Legacy applications public subnet",
  },
  {
    id: "subnet-23",
    name: "legacy-subnet-private",
    vpcName: "legacy-vpc",
    type: "Private",
    status: "Inactive",
    cidr: "10.14.2.0/24",
    gatewayIp: "10.14.2.1",
    createdOn: "2022-12-05T11:00:00Z",
    availabilityZone: "us-west-1b",
    description: "Legacy applications private subnet (deprecated)",
  },
]

export const staticIPs = [
  {
    id: "ip-1",
    name: "production-web-ip",
    ipAddress: "203.0.113.1",
    vpcName: "production-vpc",
    createdOn: "2023-01-10",
    status: "active",
    description: "Static IP for production web server",
    associatedResource: "web-server-01",
  },
  {
    id: "ip-2",
    name: "development-api-ip",
    ipAddress: "203.0.113.50",
    vpcName: "development-vpc",
    createdOn: "2023-02-25",
    status: "active",
    description: "Static IP for development API server",
    associatedResource: "api-server-dev",
  },
  {
    id: "ip-3",
    name: "staging-lb-ip",
    ipAddress: "203.0.113.100",
    vpcName: "staging-vpc",
    createdOn: "2023-03-25",
    status: "active",
    description: "Static IP for staging load balancer",
    associatedResource: "staging-lb",
  },
]

export const getVPC = (id: string) => {
  return vpcs.find((vpc) => vpc.id === id)
}

export const getSecurityGroup = (id: string) => {
  return securityGroups.find((sg) => sg.id === id)
}

export const getSubnet = (id: string) => {
  return subnets.find((subnet) => subnet.id === id)
}

// Mock VM attachments to subnets for demo purposes
export const subnetVMAttachments = [
  {
    subnetId: "subnet-1",
    vmName: "web-server-01"
  },
  {
    subnetId: "subnet-2", 
    vmName: "db-server-01"
  },
  // subnet-3 and others are not attached to any VM
]

export const getVMAttachedToSubnet = (subnetId: string) => {
  const attachment = subnetVMAttachments.find(att => att.subnetId === subnetId)
  return attachment?.vmName || null
}

// Subnet to Subnet connections
export const subnetConnections = [
  {
    subnetId: "subnet-1", // production-subnet-public
    connectedSubnets: ["subnet-2"] // connected to production-subnet-private
  },
  {
    subnetId: "subnet-2", // production-subnet-private  
    connectedSubnets: ["subnet-1"] // connected to production-subnet-public
  },
  {
    subnetId: "subnet-3", // development-subnet-public
    connectedSubnets: ["subnet-6"] // connected to analytics-subnet-public
  },
  {
    subnetId: "subnet-4", // staging-subnet-public
    connectedSubnets: ["subnet-5"] // connected to staging-subnet-private
  },
  {
    subnetId: "subnet-5", // staging-subnet-private
    connectedSubnets: ["subnet-4"] // connected to staging-subnet-public
  },
  {
    subnetId: "subnet-6", // analytics-subnet-public
    connectedSubnets: ["subnet-3", "subnet-7"] // connected to development-subnet-public and security-subnet-private
  },
  {
    subnetId: "subnet-7", // security-subnet-private
    connectedSubnets: ["subnet-6", "subnet-8"] // connected to analytics-subnet-public and ml-subnet-public
  },
  {
    subnetId: "subnet-8", // ml-subnet-public
    connectedSubnets: ["subnet-7", "subnet-9"] // connected to security-subnet-private and backup-subnet-private
  },
  {
    subnetId: "subnet-9", // backup-subnet-private
    connectedSubnets: ["subnet-8"] // connected to ml-subnet-public
  },
  {
    subnetId: "subnet-11", // cdn-subnet-public
    connectedSubnets: ["subnet-12", "subnet-13"] // connected to iot-subnet-private and gaming-subnet-public
  },
  {
    subnetId: "subnet-12", // iot-subnet-private
    connectedSubnets: ["subnet-11"] // connected to cdn-subnet-public
  },
  {
    subnetId: "subnet-13", // gaming-subnet-public
    connectedSubnets: ["subnet-11", "subnet-14"] // connected to cdn-subnet-public and blockchain-subnet-private
  },
  {
    subnetId: "subnet-14", // blockchain-subnet-private
    connectedSubnets: ["subnet-13"] // connected to gaming-subnet-public
  }
  // subnet-10 (testing-subnet-public) and subnet-15 (research-subnet-public) have no connections
]

export const getConnectedSubnets = (subnetId: string) => {
  const connection = subnetConnections.find(conn => conn.subnetId === subnetId)
  return connection?.connectedSubnets || []
}

export const addSubnetConnection = (subnetId: string, targetSubnetId: string) => {
  // Add connection both ways
  let sourceConnection = subnetConnections.find(conn => conn.subnetId === subnetId)
  if (!sourceConnection) {
    sourceConnection = { subnetId, connectedSubnets: [] }
    subnetConnections.push(sourceConnection)
  }
  if (!sourceConnection.connectedSubnets.includes(targetSubnetId)) {
    sourceConnection.connectedSubnets.push(targetSubnetId)
  }

  let targetConnection = subnetConnections.find(conn => conn.subnetId === targetSubnetId)
  if (!targetConnection) {
    targetConnection = { subnetId: targetSubnetId, connectedSubnets: [] }
    subnetConnections.push(targetConnection)
  }
  if (!targetConnection.connectedSubnets.includes(subnetId)) {
    targetConnection.connectedSubnets.push(subnetId)
  }
}

export const removeSubnetConnection = (subnetId: string, targetSubnetId: string) => {
  // Remove connection both ways
  const sourceConnection = subnetConnections.find(conn => conn.subnetId === subnetId)
  if (sourceConnection) {
    sourceConnection.connectedSubnets = sourceConnection.connectedSubnets.filter(id => id !== targetSubnetId)
  }

  const targetConnection = subnetConnections.find(conn => conn.subnetId === targetSubnetId)
  if (targetConnection) {
    targetConnection.connectedSubnets = targetConnection.connectedSubnets.filter(id => id !== subnetId)
  }
}
