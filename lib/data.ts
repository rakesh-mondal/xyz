// Type definitions for security groups and public IPs
export interface SecurityGroup {
  id: string
  name: string
  description: string
  rules: number
  attachedTo: string[]
  createdOn: string
  ingressRules: Array<{
    protocol: string
    port: string
    source: string
  }>
  egressRules: Array<{
    protocol: string
    port: string
    destination: string
  }>
}

export interface PublicIP {
  id: string
  address: string
  type: "reserved" | "random"
  status: "available" | "attached"
  attachedTo: string | null
  region: string
  createdOn: string
}

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
    id: "vpc-16",
    name: "microservices-vpc",
    status: "creating",
    type: "Paid",
    region: "us-east-1",
    createdOn: "2024-12-19T10:15:00Z",
    description: "VPC for microservices architecture - currently provisioning",
    networkName: "microservices-network",
    resources: [],
    estimatedCompletionTime: "5 minutes",
    creationProgress: 65,
  },
  {
    id: "vpc-17",
    name: "ai-workload-vpc",
    status: "creating",
    type: "Paid",
    region: "us-west-2",
    createdOn: "2024-12-19T10:20:00Z",
    description: "VPC for AI workloads - setting up network components",
    networkName: "ai-workload-network",
    resources: [],
    estimatedCompletionTime: "8 minutes",
    creationProgress: 30,
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
    status: "creating",
    type: "Free",
    region: "eu-central-1",
    createdOn: "2023-08-20T15:55:00Z",
    description: "Research and experimental projects - applying configuration changes",
    networkName: "research-network",
    resources: [],
    updateStartedOn: "2024-12-19T10:25:00Z",
    estimatedCompletionTime: "3 minutes",
    updateProgress: 40,
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
    status: "deleting",
    type: "Free",
    region: "ap-northeast-1",
    createdOn: "2023-12-01T17:15:00Z",
    description: "IoT devices and sensor data collection",
    networkName: "iot-network",
    resources: [],
    deletionStartedOn: "2024-12-19T10:30:00Z",
    estimatedDeletionTime: 15, // minutes
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
  {
    id: "sg-3",
    name: "microservices-sg",
    vpcName: "microservices-vpc",
    createdOn: "2024-12-19T10:16:00Z",
    status: "creating",
    description: "Security group for microservices - configuring rules",
    inboundRules: [],
    outboundRules: [],
    estimatedCompletionTime: "2 minutes",
    creationProgress: 75,
  },
  {
    id: "sg-4",
    name: "api-gateway-sg",
    vpcName: "production-vpc",
    createdOn: "2024-12-19T10:18:00Z",
    status: "creating",
    description: "Security group for API gateway - applying firewall rules",
    inboundRules: [
      { id: "in-4", protocol: "tcp", portRange: "80", remoteIpPrefix: "0.0.0.0/0", description: "Allow HTTP" },
    ],
    outboundRules: [],
    estimatedCompletionTime: "1 minute",
    creationProgress: 90,
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
    status: "creating",
    cidr: "10.3.1.0/24",
    gatewayIp: "10.3.1.1",
    createdOn: "2023-04-10T16:45:00Z",
    availabilityZone: "us-central-1a",
    description: "Testing public subnet for QA - bringing online",
    activationStartedOn: "2024-12-19T10:23:00Z",
    estimatedCompletionTime: "2 minutes",
    activationProgress: 55,
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
    name: "microservices-subnet-public",
    vpcName: "microservices-vpc",
    type: "Public",
    status: "creating",
    cidr: "10.13.1.0/24",
    gatewayIp: "10.13.1.1",
    createdOn: "2024-12-19T10:16:30Z",
    availabilityZone: "us-east-1a",
    description: "Public subnet for microservices - configuring network",
    estimatedCompletionTime: "3 minutes",
    creationProgress: 60,
  },
  {
    id: "subnet-19",
    name: "ai-workload-subnet-private",
    vpcName: "ai-workload-vpc",
    type: "Private",
    status: "creating",
    cidr: "10.14.1.0/24",
    gatewayIp: "10.14.1.1",
    createdOn: "2024-12-19T10:21:00Z",
    availabilityZone: "us-west-2a",
    description: "Private subnet for AI workloads - setting up routing",
    estimatedCompletionTime: "4 minutes",
    creationProgress: 45,
  },
  {
    id: "subnet-20",
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
    subnetName: "production-subnet-public",
    vpcName: "production-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: "web-server-01",
    createdOn: "2023-01-10",
    status: "active",
    description: "Static IP for production web server",
    associatedResource: "web-server-01",
  },
  {
    id: "ip-2",
    name: "development-api-ip",
    ipAddress: "203.0.113.50",
    subnetName: "development-subnet-public",
    vpcName: "development-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: "api-server-dev",
    createdOn: "2023-02-25",
    status: "active",
    description: "Static IP for development API server",
    associatedResource: "api-server-dev",
  },
  {
    id: "ip-3",
    name: "staging-lb-ip",
    ipAddress: "203.0.113.100",
    subnetName: "staging-subnet-public",
    vpcName: "staging-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: "staging-lb",
    createdOn: "2023-03-25",
    status: "active",
    description: "Static IP for staging load balancer",
    associatedResource: "staging-lb",
  },
  {
    id: "ip-4",
    name: "ml-training-ip",
    ipAddress: "203.0.113.150",
    subnetName: "ml-subnet-public",
    vpcName: "ml-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: "ml-training-server",
    createdOn: "2023-10-10",
    status: "active",
    description: "Static IP for ML training workloads",
    associatedResource: "ml-training-server",
  },
  {
    id: "ip-5",
    name: "cdn-edge-ip",
    ipAddress: "203.0.113.200",
    subnetName: "cdn-subnet-public",
    vpcName: "cdn-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: null,
    createdOn: "2023-11-15",
    status: "available",
    description: "Reserved IP for CDN edge server",
    associatedResource: null,
  },
  {
    id: "ip-6",
    name: "gaming-server-ip",
    ipAddress: "203.0.113.250",
    subnetName: "gaming-subnet-public",
    vpcName: "gaming-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: "game-server-01",
    createdOn: "2024-01-20",
    status: "active",
    description: "Static IP for gaming server infrastructure",
    associatedResource: "game-server-01",
  },
  {
    id: "ip-7",
    name: "analytics-ipv6",
    ipAddress: "2001:db8::1",
    subnetName: "analytics-subnet-private",
    vpcName: "analytics-vpc",
    type: "IPv6",
    accessType: "Private",
    assignedVMName: "analytics-processor",
    createdOn: "2023-06-20",
    status: "active",
    description: "IPv6 address for analytics processing",
    associatedResource: "analytics-processor",
  },
  {
    id: "ip-8",
    name: "backup-private-ip",
    ipAddress: "10.4.1.100",
    subnetName: "backup-subnet-private",
    vpcName: "backup-vpc",
    type: "IPv4",
    accessType: "Private",
    assignedVMName: "backup-server",
    createdOn: "2023-05-10",
    status: "active",
    description: "Private IP for backup infrastructure",
    associatedResource: "backup-server",
  },
  {
    id: "ip-9",
    name: "reserved-ip-1",
    ipAddress: "203.0.113.75",
    subnetName: "development-subnet-public",
    vpcName: "development-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: null,
    createdOn: "2023-12-01",
    status: "available",
    description: "Reserved IP for future use",
    associatedResource: null,
  },
  {
    id: "ip-10",
    name: "reserved-ip-2",
    ipAddress: "203.0.113.125",
    subnetName: "staging-subnet-public",
    vpcName: "staging-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: null,
    createdOn: "2023-12-15",
    status: "available",
    description: "Reserved IP for testing purposes",
    associatedResource: null,
  },
  {
    id: "ip-11",
    name: "microservices-api-ip",
    ipAddress: "203.0.113.175",
    subnetName: "microservices-subnet-public",
    vpcName: "microservices-vpc",
    type: "IPv4",
    accessType: "Public",
    assignedVMName: null,
    createdOn: "2024-12-19T10:17:00Z",
    status: "creating",
    description: "Static IP for microservices API - allocating address",
    associatedResource: null,
    estimatedCompletionTime: "2 minutes",
    allocationProgress: 70,
  },
  {
    id: "ip-12",
    name: "ai-inference-ip",
    ipAddress: "203.0.113.220",
    subnetName: "ai-workload-subnet-private",
    vpcName: "ai-workload-vpc",
    type: "IPv4",
    accessType: "Private",
    assignedVMName: "ai-inference-server",
    createdOn: "2024-12-19T10:22:00Z",
    status: "creating",
    description: "Static IP for AI inference server - assigning to resource",
    associatedResource: "ai-inference-server",
    estimatedCompletionTime: "1 minute",
    allocationProgress: 85,
  },
]

// Mock snapshot data for block storage
export const snapshots = [
  {
    id: "snap-001",
    name: "web-server-backup-primary",
    type: "Primary",
    size: "50 GB",
    volumeVM: "web-server-root",
    status: "available",
    createdOn: "2024-12-19T08:30:00Z",
    description: "Primary snapshot of web server root volume",
    policy: {
      enabled: true,
      cronExpression: "30 8 * * *",
      scheduleDescription: "Daily at 8:30 AM",
      nextExecution: "2024-12-20T08:30:00Z",
      maxSnapshots: 7,
      policyType: "automated"
    }
  },
  {
    id: "snap-002", 
    name: "db-storage-daily",
    type: "Delta",
    size: "25 GB",
    volumeVM: "database-storage",
    status: "available",
    createdOn: "2024-12-19T02:00:00Z",
    description: "Daily delta snapshot of database storage",
    policy: {
      enabled: true,
      cronExpression: "0 2 * * *",
      scheduleDescription: "Daily at 2:00 AM",
      nextExecution: "2024-12-20T02:00:00Z",
      maxSnapshots: 10,
      policyType: "automated"
    }
  },
  {
    id: "snap-003",
    name: "app-server-primary",
    type: "Primary",
    size: "120 GB",
    volumeVM: "app-server-data",
    status: "creating",
    createdOn: "2024-12-19T10:15:00Z",
    description: "Primary snapshot of application server data volume",
    policy: {
      enabled: true,
      cronExpression: "15 10 * * 1",
      scheduleDescription: "Weekly on Monday at 10:15 AM",
      nextExecution: "2024-12-23T10:15:00Z",
      maxSnapshots: 4,
      policyType: "automated"
    }
  },
  {
    id: "snap-004",
    name: "backup-vol-delta",
    type: "Delta",
    size: "75 GB",
    volumeVM: "backup-volume",
    status: "available",
    createdOn: "2024-12-18T20:45:00Z",
    description: "Delta snapshot of backup volume",
    policy: {
      enabled: true,
      cronExpression: "45 20 * * *",
      scheduleDescription: "Daily at 8:45 PM",
      nextExecution: "2024-12-19T20:45:00Z",
      maxSnapshots: 14,
      policyType: "automated"
    }
  },
  {
    id: "snap-005",
    name: "staging-vm-snapshot",
    type: "Primary", 
    size: "40 GB",
    volumeVM: "staging-server-01",
    status: "available",
    createdOn: "2024-12-18T16:30:00Z",
    description: "VM snapshot of staging server",
    policy: {
      enabled: false,
      cronExpression: "30 16 * * 5",
      scheduleDescription: "Weekly on Friday at 4:30 PM",
      nextExecution: null,
      maxSnapshots: 3,
      policyType: "manual"
    }
  },
  {
    id: "snap-006",
    name: "temp-processing-delta",
    type: "Delta",
    size: "15 GB",
    volumeVM: "temp-processing",
    status: "available",
    createdOn: "2024-12-19T06:20:00Z",
    description: "Delta snapshot of temporary processing volume",
    policy: {
      enabled: true,
      cronExpression: "20 6 * * *",
      scheduleDescription: "Daily at 6:20 AM",
      nextExecution: "2024-12-20T06:20:00Z",
      maxSnapshots: 5,
      policyType: "automated"
    }
  },
  {
    id: "snap-007",
    name: "logs-storage-primary",
    type: "Primary",
    size: "65 GB",
    volumeVM: "logs-storage",
    status: "deleting",
    createdOn: "2024-12-17T14:10:00Z",
    description: "Primary snapshot of logs storage volume - scheduled for deletion",
    policy: {
      enabled: false,
      cronExpression: "10 14 * * *",
      scheduleDescription: "Daily at 2:10 PM",
      nextExecution: null,
      maxSnapshots: 7,
      policyType: "automated"
    }
  },
  {
    id: "snap-008",
    name: "cache-vol-delta",
    type: "Delta",
    size: "30 GB", 
    volumeVM: "cache-volume",
    status: "available",
    createdOn: "2024-12-19T04:15:00Z",
    description: "Delta snapshot of cache volume",
    policy: {
      enabled: true,
      cronExpression: "15 4 * * *",
      scheduleDescription: "Daily at 4:15 AM",
      nextExecution: "2024-12-20T04:15:00Z",
      maxSnapshots: 3,
      policyType: "automated"
    }
  },
  {
    id: "snap-009",
    name: "analytics-storage-primary",
    type: "Primary",
    size: "280 GB",
    volumeVM: "analytics-storage",
    status: "available",
    createdOn: "2024-12-18T12:00:00Z",
    description: "Primary snapshot of analytics storage volume",
    policy: {
      enabled: true,
      cronExpression: "0 12 1 * *",
      scheduleDescription: "Monthly on 1st at 12:00 PM",
      nextExecution: "2025-01-01T12:00:00Z",
      maxSnapshots: 12,
      policyType: "automated"
    }
  },
  {
    id: "snap-010",
    name: "test-env-snapshot",
    type: "Primary",
    size: "55 GB",
    volumeVM: "test-environment",
    status: "creating",
    createdOn: "2024-12-19T09:45:00Z",
    description: "VM snapshot of test environment",
    policy: {
      enabled: true,
      cronExpression: "45 9 * * 1-5",
      scheduleDescription: "Weekdays at 9:45 AM",
      nextExecution: "2024-12-20T09:45:00Z",
      maxSnapshots: 5,
      policyType: "automated"
    }
  },
  {
    id: "snap-011",
    name: "media-storage-delta",
    type: "Delta",
    size: "150 GB",
    volumeVM: "media-storage",
    status: "available",
    createdOn: "2024-12-18T23:30:00Z",
    description: "Delta snapshot of media storage volume",
    policy: {
      enabled: true,
      cronExpression: "30 23 * * 0",
      scheduleDescription: "Weekly on Sunday at 11:30 PM",
      nextExecution: "2024-12-22T23:30:00Z",
      maxSnapshots: 8,
      policyType: "automated"
    }
  },
  {
    id: "snap-012",
    name: "ml-training-primary",
    type: "Primary",
    size: "1.8 TB",
    volumeVM: "ml-training-data",
    status: "available",
    createdOn: "2024-12-18T08:00:00Z",
    description: "Primary snapshot of ML training data volume",
    policy: {
      enabled: true,
      cronExpression: "0 8 */7 * *",
      scheduleDescription: "Every 7 days at 8:00 AM",
      nextExecution: "2024-12-25T08:00:00Z",
      maxSnapshots: 4,
      policyType: "automated"
    }
  },
  {
    id: "snap-013",
    name: "dev-workspace-delta",
    type: "Delta",
    size: "35 GB",
    volumeVM: "dev-workspace",
    status: "available", 
    createdOn: "2024-12-19T07:30:00Z",
    description: "Delta snapshot of development workspace",
    policy: {
      enabled: true,
      cronExpression: "30 7 * * 1-5",
      scheduleDescription: "Weekdays at 7:30 AM",
      nextExecution: "2024-12-20T07:30:00Z",
      maxSnapshots: 10,
      policyType: "automated"
    }
  },
  {
    id: "snap-014",
    name: "monitoring-logs-primary",
    type: "Primary",
    size: "80 GB",
    volumeVM: "monitoring-logs",
    status: "available",
    createdOn: "2024-12-18T18:20:00Z",
    description: "Primary snapshot of monitoring logs volume",
    policy: {
      enabled: true,
      cronExpression: "20 18 * * *",
      scheduleDescription: "Daily at 6:20 PM",
      nextExecution: "2024-12-19T18:20:00Z",
      maxSnapshots: 30,
      policyType: "automated"
    }
  },
  {
    id: "snap-015",
    name: "backup-secondary-delta",
    type: "Delta",
    size: "200 GB",
    volumeVM: "backup-secondary",
    status: "failed",
    createdOn: "2024-12-19T03:45:00Z",
    description: "Delta snapshot of secondary backup volume - creation failed",
    policy: {
      enabled: false,
      cronExpression: "45 3 * * *",
      scheduleDescription: "Daily at 3:45 AM",
      nextExecution: null,
      maxSnapshots: 7,
      policyType: "automated"
    }
  }
]

export const getVPC = (id: string) => {
  return vpcs.find((vpc) => vpc.id === id)
}

export const getSnapshot = (id: string) => {
  return snapshots.find((snapshot) => snapshot.id === id)
}

export const canDeletePrimarySnapshot = (snapshotId: string) => {
  const snapshot = getSnapshot(snapshotId)
  if (!snapshot) return false
  
  // If it's not a Primary snapshot, it can always be deleted
  if (snapshot.type !== "Primary") return true
  
  // Check if there are other Primary snapshots for the same volume/VM
  const otherPrimarySnapshots = snapshots.filter(s => 
    s.id !== snapshotId && 
    s.type === "Primary" && 
    s.volumeVM === snapshot.volumeVM &&
    s.status !== "deleting" &&
    s.status !== "failed"
  )
  
  return otherPrimarySnapshots.length > 0
}

export const getPrimarySnapshotsForResource = (volumeVM: string) => {
  return snapshots.filter(s => 
    s.type === "Primary" && 
    s.volumeVM === volumeVM &&
    s.status !== "deleting" &&
    s.status !== "failed"
  )
}

export const getSecurityGroup = (id: string) => {
  return securityGroups.find((sg) => sg.id === id)
}

export const getTargetGroup = (id: string) => {
  return targetGroups.find((tg) => tg.id === id)
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

// Subnet deletion validation functions
export const getVMsInSubnet = (subnetName: string) => {
  return vmInstances.filter(vm => {
    // Check if VM's subnet matches the subnet name
    return vm.configuration?.subnet?.name === subnetName
  })
}

export const getIPsInSubnet = (subnetName: string) => {
  return staticIPs.filter(ip => ip.subnetName === subnetName)
}

export const canDeleteSubnet = (subnetName: string) => {
  const vmsInSubnet = getVMsInSubnet(subnetName)
  const ipsInSubnet = getIPsInSubnet(subnetName)
  
  return {
    canDelete: vmsInSubnet.length === 0 && ipsInSubnet.length === 0,
    vms: vmsInSubnet,
    ips: ipsInSubnet,
    dependencies: {
      vmCount: vmsInSubnet.length,
      ipCount: ipsInSubnet.length,
      totalDependencies: vmsInSubnet.length + ipsInSubnet.length
    }
  }
}

export const vmInstances = [
  {
    id: "vm-001",
    name: "Web Server 01",
    type: "CPU",
    flavour: "Standard-4",
    vpc: "production-vpc",
    status: "Active",
    fixedIp: "10.0.0.5",
    publicIp: "34.201.10.5",
    createdOn: "2023-12-01T10:00:00Z",
    deleteProtection: true,
    description: "Main production web server handling customer traffic and API requests",
    tags: [
      { key: "Environment", value: "Production" },
      { key: "Team", value: "DevOps" },
      { key: "Cost-Center", value: "Engineering" }
    ],
    // Enhanced configuration details
    configuration: {
      // Basic Configuration
      vmName: "Web Server 01",
      vpcId: "vpc-1",
      vpcName: "production-vpc",
      region: "us-east-1",
      
      // Volume Configuration
      bootableVolume: {
        type: "existing",
        volumeId: "vol-1",
        volumeName: "ubuntu-22.04-boot",
        size: "20 GB",
        image: "Ubuntu 22.04 LTS"
      },
      storageVolumes: [
        {
          id: "vol-s1",
          name: "data-storage-1",
          size: "100 GB",
          type: "ssd"
        }
      ],
      
      // SSH Configuration
      sshKey: {
        id: "ssh-1",
        name: "prod-admin-key"
      },
      
      // Network Configuration
      subnet: {
        id: "subnet-1",
        name: "public-subnet-1",
        type: "Public",
        cidr: "10.0.1.0/24"
      },
      securityGroup: {
        id: "sg-1",
        name: "web-servers",
        description: "Web server security group"
      },
      ipAddressType: "floating",
      reservedIp: null,
      networkSpeed: "100 Mbps",
      
      // Additional Configuration
      startupScript: "#!/bin/bash\n# Install nginx\napt-get update\napt-get install -y nginx\nsystemctl enable nginx\nsystemctl start nginx",
      
      // Pricing Information
      pricing: {
        vm: 12,
        storage: 3,
        ip: 1,
        total: 16
      }
    }
  },
  {
    id: "vm-002",
    name: "AI Training Node",
    type: "GPU",
    flavour: "GPU-8xA100",
    vpc: "ai-workload-vpc",
    status: "Stopped",
    fixedIp: "10.0.1.8",
    publicIp: "52.14.22.8",
    createdOn: "2023-12-05T14:30:00Z",
    deleteProtection: false,
    description: "High-performance GPU instance for machine learning model training and inference",
    tags: [
      { key: "Environment", value: "Development" },
      { key: "Team", value: "ML Engineering" },
      { key: "Purpose", value: "Training" }
    ],
    configuration: {
      vmName: "AI Training Node",
      vpcId: "vpc-17",
      vpcName: "ai-workload-vpc",
      region: "us-west-2",
      
      bootableVolume: {
        type: "new",
        volumeName: "ai-training-boot",
        size: "50 GB",
        image: "Ubuntu 22.04 LTS"
      },
      storageVolumes: [
        {
          id: "vol-s2",
          name: "training-data",
          size: "500 GB",
          type: "ssd"
        },
        {
          id: "vol-s3",
          name: "model-storage",
          size: "200 GB",
          type: "ssd"
        }
      ],
      
      sshKey: {
        id: "ssh-1",
        name: "prod-admin-key"
      },
      
      subnet: {
        id: "subnet-2",
        name: "private-subnet-1",
        type: "Private",
        cidr: "10.0.2.0/24"
      },
      securityGroup: {
        id: "sg-2",
        name: "database",
        description: "Database security group"
      },
      ipAddressType: "reserved",
      reservedIp: {
        id: "ip-1",
        address: "203.0.113.1"
      },
      networkSpeed: "1 Gbps",
      
      startupScript: "#!/bin/bash\n# Install CUDA and ML libraries\napt-get update\napt-get install -y nvidia-cuda-toolkit\npip install torch torchvision",
      
      pricing: {
        vm: 45,
        storage: 15,
        ip: 2,
        total: 62
      }
    }
  },
  {
    id: "vm-003",
    name: "Database Server",
    type: "CPU",
    flavour: "Memory-Optimized-16",
    vpc: "production-vpc",
    status: "Restarting",
    fixedIp: "10.0.0.12",
    publicIp: "34.201.10.12",
    createdOn: "2023-12-10T09:15:00Z",
    deleteProtection: true,
    description: "Primary PostgreSQL database server with automated backups and high availability",
    tags: [
      { key: "Environment", value: "Production" },
      { key: "Team", value: "Database" },
      { key: "Backup", value: "Enabled" }
    ],
    configuration: {
      vmName: "Database Server",
      vpcId: "vpc-1",
      vpcName: "production-vpc",
      region: "us-east-1",
      
      bootableVolume: {
        type: "existing",
        volumeId: "vol-2",
        volumeName: "centos-8-boot",
        size: "25 GB",
        image: "CentOS 8"
      },
      storageVolumes: [
        {
          id: "vol-s4",
          name: "db-data",
          size: "200 GB",
          type: "ssd"
        },
        {
          id: "vol-s5",
          name: "db-backup",
          size: "100 GB",
          type: "hdd"
        }
      ],
      
      sshKey: {
        id: "ssh-3",
        name: "backup-key"
      },
      
      subnet: {
        id: "subnet-1",
        name: "public-subnet-1",
        type: "Public",
        cidr: "10.0.1.0/24"
      },
      securityGroup: {
        id: "sg-1",
        name: "web-servers",
        description: "Web server security group"
      },
      ipAddressType: "floating",
      reservedIp: null,
      networkSpeed: "100 Mbps",
      
      startupScript: "#!/bin/bash\n# Install PostgreSQL\napt-get update\napt-get install -y postgresql postgresql-contrib\nsystemctl enable postgresql\nsystemctl start postgresql",
      
      pricing: {
        vm: 18,
        storage: 9,
        ip: 1,
        total: 28
      }
    }
  },
  {
    id: "vm-004",
    name: "Dev Sandbox",
    type: "CPU",
    flavour: "Standard-2",
    vpc: "development-vpc",
    status: "Active",
    fixedIp: "10.0.2.3",
    publicIp: "18.222.33.3",
    createdOn: "2023-12-12T11:45:00Z",
    deleteProtection: false,
    description: "Development environment for testing new features and bug fixes",
    tags: [
      { key: "Environment", value: "Development" },
      { key: "Team", value: "Frontend" }
    ],
    configuration: {
      vmName: "Dev Sandbox",
      vpcId: "vpc-2",
      vpcName: "development-vpc",
      region: "us-west-2",
      
      bootableVolume: {
        type: "new",
        volumeName: "dev-sandbox-boot",
        size: "20 GB",
        image: "Ubuntu 22.04 LTS"
      },
      storageVolumes: [],
      
      sshKey: {
        id: "ssh-2",
        name: "dev-key"
      },
      
      subnet: {
        id: "subnet-2",
        name: "private-subnet-1",
        type: "Private",
        cidr: "10.0.2.0/24"
      },
      securityGroup: {
        id: "sg-2",
        name: "database",
        description: "Database security group"
      },
      ipAddressType: "floating",
      reservedIp: null,
      networkSpeed: "100 Mbps",
      
      startupScript: "",
      
      pricing: {
        vm: 6,
        storage: 0,
        ip: 1,
        total: 7
      }
    }
  },
  {
    id: "vm-005",
    name: "Microservices API Server",
    type: "CPU",
    flavour: "Standard-4",
    vpc: "microservices-vpc",
    status: "Active",
    fixedIp: "10.13.1.10",
    publicIp: "203.0.113.175",
    createdOn: "2024-12-19T10:18:00Z",
    deleteProtection: false,
    description: "API server for microservices architecture",
    tags: [
      { key: "Environment", value: "Production" },
      { key: "Team", value: "Backend" },
      { key: "Service", value: "API" }
    ],
    configuration: {
      vmName: "Microservices API Server",
      vpcId: "vpc-16",
      vpcName: "microservices-vpc",
      region: "us-east-1",
      
      bootableVolume: {
        type: "existing",
        volumeId: "vol-010",
        volumeName: "ubuntu-22.04-boot",
        size: "20 GB",
        image: "Ubuntu 22.04 LTS"
      },
      storageVolumes: [
        {
          id: "vol-s6",
          name: "api-storage",
          size: "50 GB",
          type: "ssd"
        }
      ],
      
      sshKey: {
        id: "ssh-1",
        name: "prod-admin-key"
      },
      
      subnet: {
        id: "subnet-18",
        name: "microservices-subnet-public",
        type: "Public",
        cidr: "10.13.1.0/24"
      },
      securityGroup: {
        id: "sg-3",
        name: "microservices-sg",
        description: "Security group for microservices"
      },
      ipAddressType: "floating",
      reservedIp: "203.0.113.175",
      networkSpeed: "100 Mbps",
      
      startupScript: "#!/bin/bash\n# Install Node.js and PM2\ncurl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -\napt-get install -y nodejs\nnpm install -g pm2",
      
      pricing: {
        vm: 12,
        storage: 3,
        ip: 1,
        total: 16
      }
    }
  },
];

export const sshKeys = [
  {
    id: "ssh-1",
    name: "prod-admin-key",
    status: "active",
    isActive: true,
    isExpired: false,
    attachedVMs: ["web-server-01", "db-server-01"],
    region: "us-east-1",
    createdOn: "2023-01-10T09:00:00Z",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...prodadmin",
  },
  {
    id: "ssh-2",
    name: "dev-key",
    status: "expired",
    isActive: false,
    isExpired: true,
    attachedVMs: [],
    region: "us-west-2",
    createdOn: "2022-12-01T12:30:00Z",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...devkey",
  },
  {
    id: "ssh-3",
    name: "backup-key",
    status: "active",
    isActive: true,
    isExpired: false,
    attachedVMs: ["backup-server"],
    region: "eu-west-1",
    createdOn: "2023-03-15T15:45:00Z",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...backupkey",
  },
  {
    id: "ssh-4",
    name: "test-key-expired",
    status: "expired",
    isActive: false,
    isExpired: true,
    attachedVMs: ["test-vm-01"],
    region: "ap-south-1",
    createdOn: "2022-10-20T08:20:00Z",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...testkey",
  },
  {
    id: "ssh-5",
    name: "standalone-key",
    status: "active",
    isActive: true,
    isExpired: false,
    attachedVMs: [],
    region: "us-central-1",
    createdOn: "2023-06-01T11:10:00Z",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...standalone",
  },
]

export const machineImages = [
  {
    id: "mi-001",
    name: "Ubuntu 22.04 LTS",
    type: "Linux",
    createdOn: "2024-01-10T09:00:00Z",
    size: "8 GB",
    fileUrl: "/mock-images/ubuntu-22.04.img"
  },
  {
    id: "mi-002",
    name: "Windows Server 2019",
    type: "Windows",
    createdOn: "2024-02-15T14:30:00Z",
    size: "16 GB",
    fileUrl: "/mock-images/windows-server-2019.img"
  },
  {
    id: "mi-003",
    name: "CentOS 7 Minimal",
    type: "Linux",
    createdOn: "2024-03-20T11:45:00Z",
    size: "4 GB",
    fileUrl: "/mock-images/centos-7.img"
  }
];

// Volume data for VM attachment/detachment
export const volumes = [
  {
    id: "vol-001",
    name: "Web Server Boot",
    size: "50 GB",
    type: "bootable" as const,
    status: "attached" as const,
    source: "machine-image",
    attachedTo: "vm-001",
    createdOn: "2023-12-01T10:00:00Z",
  },
  {
    id: "vol-002", 
    name: "AI Training Boot",
    size: "100 GB",
    type: "bootable" as const,
    status: "attached" as const,
    source: "machine-image",
    attachedTo: "vm-002",
    createdOn: "2023-12-05T14:30:00Z",
  },
  {
    id: "vol-003",
    name: "Database Boot",
    size: "80 GB", 
    type: "bootable" as const,
    status: "attached" as const,
    source: "machine-image",
    attachedTo: "vm-003",
    createdOn: "2023-12-10T09:15:00Z",
  },
  {
    id: "vol-004",
    name: "Dev Sandbox Boot",
    size: "30 GB",
    type: "bootable" as const,
    status: "attached" as const,
    source: "machine-image", 
    attachedTo: "vm-004",
    createdOn: "2023-12-12T11:45:00Z",
  },
  {
    id: "vol-005",
    name: "Database Storage",
    size: "500 GB",
    type: "storage" as const,
    status: "attached" as const,
    source: "volume",
    attachedTo: "vm-003",
    createdOn: "2023-12-10T09:30:00Z",
  },
  {
    id: "vol-006",
    name: "Web Storage Volume",
    size: "200 GB",
    type: "storage" as const,
    status: "attached" as const,
    source: "volume",
    attachedTo: "vm-001",
    createdOn: "2023-12-01T10:15:00Z",
  },
  {
    id: "vol-007",
    name: "Backup Boot Volume",
    size: "40 GB",
    type: "bootable" as const,
    status: "available" as const,
    source: "machine-image",
    attachedTo: null,
    createdOn: "2024-01-15T14:20:00Z",
  },
  {
    id: "vol-008",
    name: "Staging Boot Volume",
    size: "60 GB",
    type: "bootable" as const,
    status: "available" as const,
    source: "machine-image",
    attachedTo: null,
    createdOn: "2024-01-20T16:45:00Z",
  },
  {
    id: "vol-009",
    name: "Analytics Storage",
    size: "1 TB",
    type: "storage" as const,
    status: "available" as const,
    source: "snapshot",
    attachedTo: null,
    createdOn: "2024-01-25T11:30:00Z",
  },
  {
    id: "vol-010",
    name: "Temp Storage Volume",
    size: "100 GB",
    type: "storage" as const,
    status: "available" as const,
    source: "volume",
    attachedTo: null,
    createdOn: "2024-02-01T09:00:00Z",
  },
];

// Security Group data for VM attachment/detachment
export const vmSecurityGroups = [
  {
    id: "sg-001",
    name: "web-server-sg",
    description: "Security group for web servers allowing HTTP/HTTPS traffic",
    rules: 4,
    attachedTo: ["vm-001"],
    createdOn: "2023-11-15T10:00:00Z",
    ingressRules: [
      { protocol: "TCP", port: "80", source: "0.0.0.0/0" },
      { protocol: "TCP", port: "443", source: "0.0.0.0/0" },
      { protocol: "TCP", port: "22", source: "10.0.0.0/8" }
    ],
    egressRules: [
      { protocol: "All", port: "All", destination: "0.0.0.0/0" }
    ]
  },
  {
    id: "sg-002", 
    name: "database-sg",
    description: "Security group for database servers with restricted access",
    rules: 3,
    attachedTo: ["vm-003"],
    createdOn: "2023-11-20T14:30:00Z",
    ingressRules: [
      { protocol: "TCP", port: "3306", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "22", source: "10.0.0.0/8" }
    ],
    egressRules: [
      { protocol: "All", port: "All", destination: "0.0.0.0/0" }
    ]
  },
  {
    id: "sg-003",
    name: "ai-training-sg",
    description: "Security group for AI training nodes with GPU access",
    rules: 5,
    attachedTo: ["vm-002"],
    createdOn: "2023-12-01T09:15:00Z",
    ingressRules: [
      { protocol: "TCP", port: "8080", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "22", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "6006", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "8888", source: "10.0.0.0/8" }
    ],
    egressRules: [
      { protocol: "All", port: "All", destination: "0.0.0.0/0" }
    ]
  },
  {
    id: "sg-004",
    name: "development-sg", 
    description: "Security group for development environments",
    rules: 6,
    attachedTo: ["vm-004"],
    createdOn: "2023-12-05T11:45:00Z",
    ingressRules: [
      { protocol: "TCP", port: "80", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "443", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "22", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "3000", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "8000", source: "10.0.0.0/8" }
    ],
    egressRules: [
      { protocol: "All", port: "All", destination: "0.0.0.0/0" }
    ]
  },
  {
    id: "sg-005",
    name: "monitoring-sg",
    description: "Security group for monitoring and logging services",
    rules: 3,
    attachedTo: [],
    createdOn: "2024-01-10T08:20:00Z",
    ingressRules: [
      { protocol: "TCP", port: "9090", source: "10.0.0.0/8" },
      { protocol: "TCP", port: "3000", source: "10.0.0.0/8" }
    ],
    egressRules: [
      { protocol: "All", port: "All", destination: "0.0.0.0/0" }
    ]
  },
  {
    id: "sg-006",
    name: "load-balancer-sg",
    description: "Security group for load balancers",
    rules: 4,
    attachedTo: [],
    createdOn: "2024-01-15T16:30:00Z",
    ingressRules: [
      { protocol: "TCP", port: "80", source: "0.0.0.0/0" },
      { protocol: "TCP", port: "443", source: "0.0.0.0/0" },
      { protocol: "TCP", port: "8080", source: "10.0.0.0/8" }
    ],
    egressRules: [
      { protocol: "All", port: "All", destination: "0.0.0.0/0" }
    ]
  }
];

// Public IP Address data for VM attachment/detachment  
export const publicIPs = [
  {
    id: "ip-001",
    address: "34.201.10.5",
    type: "reserved" as const,
    status: "attached" as const,
    attachedTo: "vm-001",
    region: "us-east-1",
    createdOn: "2023-11-20T10:00:00Z",
  },
  {
    id: "ip-002",
    address: "52.14.22.8", 
    type: "reserved" as const,
    status: "attached" as const,
    attachedTo: "vm-002",
    region: "us-west-2",
    createdOn: "2023-12-01T14:30:00Z",
  },
  {
    id: "ip-003",
    address: "34.201.10.12",
    type: "reserved" as const,
    status: "attached" as const,
    attachedTo: "vm-003",
    region: "us-east-1",
    createdOn: "2023-12-05T09:15:00Z",
  },
  {
    id: "ip-004",
    address: "18.222.33.3",
    type: "random" as const,
    status: "available" as const,
    attachedTo: null,
    region: "us-central-1",
    createdOn: "2023-12-12T11:45:00Z",
  },
  {
    id: "ip-005",
    address: "54.230.123.45",
    type: "reserved" as const,
    status: "available" as const,
    attachedTo: null,
    region: "us-east-1",
    createdOn: "2024-01-15T13:20:00Z",
  },
  {
    id: "ip-006",
    address: "52.88.177.92",
    type: "reserved" as const,
    status: "available" as const,
    attachedTo: null,
    region: "us-west-2",
    createdOn: "2024-01-20T16:45:00Z",
  },
  {
    id: "ip-007",
    address: "13.56.147.203",
    type: "reserved" as const,
    status: "available" as const,
    attachedTo: null,
    region: "us-west-1",
    createdOn: "2024-02-01T09:30:00Z",
  }
];

// Helper functions to get attachment data for VMs
export const getVMVolumes = (vmId: string) => {
  const attachedVolumes = volumes.filter(vol => vol.attachedTo === vmId);
  return {
    bootable: attachedVolumes.filter(vol => vol.type === "bootable"),
    storage: attachedVolumes.filter(vol => vol.type === "storage")
  };
};

export const getAvailableVolumes = () => {
  return volumes.filter(vol => vol.status === "available");
};

export const getVMSecurityGroups = (vmId: string) => {
  return vmSecurityGroups.filter(sg => sg.attachedTo.includes(vmId));
};

export const getAvailableSecurityGroups = (vmId: string) => {
  return vmSecurityGroups.filter(sg => !sg.attachedTo.includes(vmId));
};

export const getVMPublicIPs = (vmId: string) => {
  return publicIPs.filter(ip => ip.attachedTo === vmId);
};

export const getAvailablePublicIPs = () => {
  return publicIPs.filter(ip => ip.status === "available");
};

// Simulate security group attachment
export const attachSecurityGroup = async (vmId: string, securityGroupId: string): Promise<SecurityGroup | null> => {
  const securityGroup = vmSecurityGroups.find(sg => sg.id === securityGroupId);
  if (securityGroup && !securityGroup.attachedTo.includes(vmId)) {
    securityGroup.attachedTo.push(vmId);
    return securityGroup;
  }
  return null;
};

// Simulate security group detachment
export const detachSecurityGroup = async (vmId: string, securityGroupId: string): Promise<SecurityGroup | null> => {
  const securityGroup = vmSecurityGroups.find(sg => sg.id === securityGroupId);
  if (securityGroup && securityGroup.attachedTo.includes(vmId)) {
    securityGroup.attachedTo = securityGroup.attachedTo.filter(id => id !== vmId);
    return securityGroup;
  }
  return null;
};

// Simulate public IP attachment
export const attachReservedIP = async (vmId: string, ipId: string): Promise<PublicIP | null> => {
  const ip = publicIPs.find(p => p.id === ipId);
  if (ip && ip.status === "available") {
    (ip as any).status = "attached";
    (ip as any).attachedTo = vmId;
    return ip as PublicIP;
  }
  return null;
};

// Simulate random IP assignment
export const attachRandomIP = async (vmId: string): Promise<PublicIP | null> => {
  const availableIP = publicIPs.find(p => p.status === "available" && p.type === "random");
  if (availableIP) {
    (availableIP as any).status = "attached";
    (availableIP as any).attachedTo = vmId;
    return availableIP as PublicIP;
  }
  return null;
};

// Simulate public IP detachment
export const detachIP = async (ipId: string): Promise<PublicIP | null> => {
  const ip = publicIPs.find(p => p.id === ipId);
  if (ip && ip.status === "attached") {
    (ip as any).status = "available";
    (ip as any).attachedTo = null;
    return ip as PublicIP;
  }
  return null;
};

// Model Catalog Data
export interface Model {
  id: string
  name: string
  provider: string
  type: "text" | "embedding" | "audio" | "vision"
  description: string
  license: string
  capabilities: string[]
  pricing: {
    inputTokens: number
    outputTokens: number
  }
  performance: {
    tokensPerSec: number
    quality: number
    quantization: string
  }
  contextWindow: string
  createdOn: string
  tags: string[]
  isEnterprise?: boolean
}

export const models: Model[] = [
  // TEXT MODELS
  {
    id: "gpt-oss-120b",
    name: "gpt-oss-120b",
    provider: "Openai",
    type: "text",
    description: "Large-scale GPT model with 120B parameters for high-quality text generation",
    license: "MIT",
    capabilities: ["text-generation", "summarization", "context-rag", "code", "reasoning"],
    pricing: {
      inputTokens: 0.15,
      outputTokens: 0.60
    },
    performance: {
      tokensPerSec: 40,
      quality: 79,
      quantization: "fp4"
    },
    contextWindow: "131K context",
    createdOn: "2024-01-15T09:00:00Z",
    tags: ["code", "math", "reasoning"]
  },
  {
    id: "gpt-oss-20b",
    name: "gpt-oss-20b",
    provider: "Openai",
    type: "text",
    description: "Efficient GPT model with 20B parameters optimized for speed and performance",
    license: "Apache 2.0",
    capabilities: ["text-generation", "summarization", "code", "fast-cost-efficient"],
    pricing: {
      inputTokens: 0.05,
      outputTokens: 0.20
    },
    performance: {
      tokensPerSec: 64,
      quality: 74,
      quantization: "fp4"
    },
    contextWindow: "131K context",
    createdOn: "2024-01-10T14:30:00Z",
    tags: ["code", "reasoning"]
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude-3.5-Sonnet",
    provider: "Anthropic",
    type: "text",
    description: "Anthropic's most capable model for complex reasoning and analysis",
    license: "Commercial",
    capabilities: ["text-generation", "reasoning", "complex-writing-conversations", "function-calling-tools"],
    pricing: {
      inputTokens: 0.30,
      outputTokens: 1.50
    },
    performance: {
      tokensPerSec: 25,
      quality: 88,
      quantization: "fp8"
    },
    contextWindow: "200K context",
    createdOn: "2024-03-20T13:45:00Z",
    tags: ["math", "reasoning"]
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral-8x7B",
    provider: "Mistral AI",
    type: "text",
    description: "Mixture of experts model with excellent efficiency and performance",
    license: "Apache 2.0",
    capabilities: ["text-generation", "code", "fast-cost-efficient"],
    pricing: {
      inputTokens: 0.07,
      outputTokens: 0.25
    },
    performance: {
      tokensPerSec: 50,
      quality: 76,
      quantization: "fp4"
    },
    contextWindow: "32K context",
    createdOn: "2024-01-25T10:15:00Z",
    tags: ["code", "reasoning"]
  },
  {
    id: "llama-3.2-90b",
    name: "Llama-3.2-90B",
    provider: "Meta",
    type: "text",
    description: "Meta's advanced Llama model with enhanced capabilities",
    license: "Llama License",
    capabilities: ["text-generation", "summarization", "code"],
    pricing: {
      inputTokens: 0.12,
      outputTokens: 0.45
    },
    performance: {
      tokensPerSec: 35,
      quality: 82,
      quantization: "fp4"
    },
    contextWindow: "128K context",
    createdOn: "2024-04-01T15:30:00Z",
    tags: ["code", "reasoning"]
  },

  // EMBEDDING MODELS
  {
    id: "text-embedding-3-large",
    name: "text-embedding-3-large",
    provider: "OpenAI",
    type: "embedding",
    description: "Most capable embedding model for semantic search and RAG applications",
    license: "Commercial",
    capabilities: ["context-rag", "summarization"],
    pricing: {
      inputTokens: 0.13,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 150,
      quality: 94,
      quantization: "fp16"
    },
    contextWindow: "8K context",
    createdOn: "2024-01-25T11:30:00Z",
    tags: ["embedding", "search"]
  },
  {
    id: "text-embedding-3-small",
    name: "text-embedding-3-small",
    provider: "OpenAI",
    type: "embedding",
    description: "Efficient embedding model optimized for cost and speed",
    license: "Commercial",
    capabilities: ["context-rag", "fast-cost-efficient"],
    pricing: {
      inputTokens: 0.02,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 300,
      quality: 89,
      quantization: "fp16"
    },
    contextWindow: "8K context",
    createdOn: "2024-01-25T11:15:00Z",
    tags: ["embedding", "fast"]
  },
  {
    id: "bge-large-en-v1.5",
    name: "BGE-Large-EN-v1.5",
    provider: "BAAI",
    type: "embedding",
    description: "High-performance English embedding model for retrieval tasks",
    license: "MIT",
    capabilities: ["context-rag", "summarization"],
    pricing: {
      inputTokens: 0.01,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 200,
      quality: 87,
      quantization: "fp16"
    },
    contextWindow: "512 tokens",
    createdOn: "2024-02-01T14:20:00Z",
    tags: ["embedding", "retrieval"]
  },
  {
    id: "e5-large-v2",
    name: "E5-Large-v2",
    provider: "Microsoft",
    type: "embedding",
    description: "Multilingual embedding model with strong performance across languages",
    license: "MIT",
    capabilities: ["context-rag", "summarization"],
    pricing: {
      inputTokens: 0.008,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 180,
      quality: 85,
      quantization: "fp16"
    },
    contextWindow: "512 tokens",
    createdOn: "2024-02-10T16:45:00Z",
    tags: ["embedding", "multilingual"]
  },

  // AUDIO MODELS
  {
    id: "whisper-large-v3",
    name: "Whisper-Large-v3",
    provider: "OpenAI",
    type: "audio",
    description: "Advanced speech recognition model with multilingual support",
    license: "MIT",
    capabilities: ["audio-transcription", "audio-translation"],
    pricing: {
      inputTokens: 0.006,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 0,
      quality: 92,
      quantization: "fp16"
    },
    contextWindow: "30 seconds",
    createdOn: "2024-01-15T10:00:00Z",
    tags: ["audio", "transcription"]
  },
  {
    id: "musicgen-large",
    name: "MusicGen-Large",
    provider: "Meta",
    type: "audio",
    description: "Text-to-music generation model for creating high-quality audio",
    license: "Research",
    capabilities: ["audio-generation"],
    pricing: {
      inputTokens: 0.15,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 0,
      quality: 88,
      quantization: "fp16"
    },
    contextWindow: "32 seconds",
    createdOn: "2024-02-01T12:30:00Z",
    tags: ["audio", "generation"]
  },
  {
    id: "bark-v0",
    name: "Bark",
    provider: "Suno AI",
    type: "audio",
    description: "Text-to-speech model with natural voice generation capabilities",
    license: "MIT",
    capabilities: ["audio-generation"],
    pricing: {
      inputTokens: 0.08,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 0,
      quality: 86,
      quantization: "fp16"
    },
    contextWindow: "15 seconds",
    createdOn: "2024-01-20T15:15:00Z",
    tags: ["audio", "speech"]
  },
  {
    id: "speecht5-tts",
    name: "SpeechT5-TTS",
    provider: "Microsoft",
    type: "audio",
    description: "Unified speech-text model for text-to-speech synthesis",
    license: "MIT",
    capabilities: ["audio-generation"],
    pricing: {
      inputTokens: 0.05,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 0,
      quality: 84,
      quantization: "fp16"
    },
    contextWindow: "20 seconds",
    createdOn: "2024-02-15T09:45:00Z",
    tags: ["audio", "synthesis"]
  },

  // VISION MODELS
  {
    id: "gpt-4-vision",
    name: "GPT-4-Vision",
    provider: "OpenAI",
    type: "vision",
    description: "Multimodal model capable of understanding and reasoning about images",
    license: "Commercial",
    capabilities: ["vision-understanding", "text-generation", "reasoning"],
    pricing: {
      inputTokens: 1.00,
      outputTokens: 3.00
    },
    performance: {
      tokensPerSec: 15,
      quality: 91,
      quantization: "fp16"
    },
    contextWindow: "128K context",
    createdOn: "2024-01-10T13:20:00Z",
    tags: ["vision", "multimodal"]
  },
  {
    id: "claude-3-opus-vision",
    name: "Claude-3-Opus-Vision",
    provider: "Anthropic",
    type: "vision",
    description: "Advanced vision model with superior image analysis capabilities",
    license: "Commercial",
    capabilities: ["vision-understanding", "reasoning", "complex-writing-conversations"],
    pricing: {
      inputTokens: 1.50,
      outputTokens: 7.50
    },
    performance: {
      tokensPerSec: 12,
      quality: 93,
      quantization: "fp16"
    },
    contextWindow: "200K context",
    createdOn: "2024-02-20T11:10:00Z",
    tags: ["vision", "analysis"]
  },
  {
    id: "llava-v1.6-34b",
    name: "LLaVA-v1.6-34B",
    provider: "LLaVA Team",
    type: "vision",
    description: "Open-source large language and vision assistant model",
    license: "Apache 2.0",
    capabilities: ["vision-understanding", "text-generation"],
    pricing: {
      inputTokens: 0.80,
      outputTokens: 2.40
    },
    performance: {
      tokensPerSec: 20,
      quality: 87,
      quantization: "fp16"
    },
    contextWindow: "4K context",
    createdOn: "2024-03-01T14:30:00Z",
    tags: ["vision", "open-source"]
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    type: "vision",
    description: "Advanced text-to-image generation model with high fidelity output",
    license: "Commercial",
    capabilities: ["image-generation"],
    pricing: {
      inputTokens: 0.040,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 0,
      quality: 95,
      quantization: "fp16"
    },
    contextWindow: "4K context",
    createdOn: "2024-01-25T16:00:00Z",
    tags: ["vision", "generation"]
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    type: "vision",
    description: "High-resolution image generation model with artistic capabilities",
    license: "OpenRAIL",
    capabilities: ["image-generation"],
    pricing: {
      inputTokens: 0.020,
      outputTokens: 0.00
    },
    performance: {
      tokensPerSec: 0,
      quality: 89,
      quantization: "fp16"
    },
    contextWindow: "77 tokens",
    createdOn: "2024-02-05T10:45:00Z",
    tags: ["vision", "artistic"]
  }
]

export const getModel = (id: string) => {
  return models.find((model) => model.id === id)
}

export const getModelsByType = (type: "text" | "embedding" | "audio" | "vision") => {
  return models.filter((model) => model.type === type)
}

export const getAllModels = () => {
  return models
}

// Load Balancer and Target Group interfaces
export interface LoadBalancer {
  id: string
  name: string
  status: "active" | "inactive" | "creating" | "deleting"
  type: "application" | "network"
  scheme: "internet-facing" | "internal"
  vpc: string
  dnsName: string
  targetGroups: number
  createdOn: string
  availability: string
  targets: number
  targetGroupHealth: "healthy" | "unhealthy" | "mixed" | "no-targets"
  ipAddresses: string[]
}

export interface TargetMember {
  id: string
  type: "VM" | "Container" | "IP"
  name: string
  ipAddress: string
  port: number
  status: "healthy" | "unhealthy" | "draining"
}

export interface TargetGroup {
  id: string
  name: string
  type: "instance" | "ip" | "lambda"
  protocol: "HTTP" | "HTTPS" | "TCP" | "UDP"
  port: number
  vpc: string
  healthCheck: {
    path?: string
    protocol: string
    port: number
    interval: number
    timeout: number
    healthyThreshold: number
    unhealthyThreshold: number
  }
  targets: number
  targetMembers: TargetMember[]
  status: "healthy" | "unhealthy" | "unused" | "degraded"
  loadBalancer?: string
  createdOn: string
}

// Load Balancers mock data
export const loadBalancers: LoadBalancer[] = [
  {
    id: "lb-1",
    name: "production-app-lb",
    status: "active",
    type: "application",
    scheme: "internet-facing",
    vpc: "production-vpc",
    dnsName: "production-app-lb-123456789.us-east-1.elb.amazonaws.com",
    targetGroups: 2,
    createdOn: "2023-10-15T09:30:00Z",
    availability: "Multi-AZ",
    targets: 4,
    targetGroupHealth: "healthy",
    ipAddresses: ["54.123.45.67", "54.123.45.68"]
  },
  {
    id: "lb-2", 
    name: "api-gateway-lb",
    status: "active",
    type: "application",
    scheme: "internet-facing",
    vpc: "production-vpc",
    dnsName: "api-gateway-lb-987654321.us-east-1.elb.amazonaws.com",
    targetGroups: 1,
    createdOn: "2023-11-20T14:15:00Z",
    availability: "Multi-AZ",
    targets: 2,
    targetGroupHealth: "healthy",
    ipAddresses: ["54.234.56.78"]
  },
  {
    id: "lb-3",
    name: "internal-services-lb",
    status: "active", 
    type: "network",
    scheme: "internal",
    vpc: "production-vpc",
    dnsName: "internal-services-lb-555666777.us-east-1.elb.amazonaws.com",
    targetGroups: 3,
    createdOn: "2023-12-01T11:45:00Z",
    availability: "Multi-AZ",
    targets: 6,
    targetGroupHealth: "mixed",
    ipAddresses: ["10.0.1.100", "10.0.1.101", "10.0.1.102"]
  },
  {
    id: "lb-4",
    name: "staging-web-lb",
    status: "active",
    type: "application",
    scheme: "internet-facing", 
    vpc: "staging-vpc",
    dnsName: "staging-web-lb-111222333.us-west-2.elb.amazonaws.com",
    targetGroups: 1,
    createdOn: "2024-01-10T16:20:00Z",
    availability: "Multi-AZ",
    targets: 2,
    targetGroupHealth: "unhealthy",
    ipAddresses: ["54.345.67.89"]
  },
  {
    id: "lb-5",
    name: "dev-app-lb",
    status: "creating",
    type: "application",
    scheme: "internet-facing",
    vpc: "development-vpc", 
    dnsName: "dev-app-lb-444555666.us-west-2.elb.amazonaws.com",
    targetGroups: 0,
    createdOn: "2024-12-19T10:30:00Z",
    availability: "Single-AZ",
    targets: 0,
    targetGroupHealth: "no-targets",
    ipAddresses: []
  }
]

// Target Groups mock data
export const targetGroups: TargetGroup[] = [
  {
    id: "tg-1",
    name: "production-web-targets",
    type: "instance",
    protocol: "HTTP",
    port: 80,
    vpc: "production-vpc",
    healthCheck: {
      path: "/health",
      protocol: "HTTP",
      port: 80,
      interval: 30,
      timeout: 5,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 4,
    targetMembers: [
      {
        id: "vm-web-1",
        type: "VM",
        name: "web-server-01",
        ipAddress: "10.0.1.10",
        port: 80,
        status: "healthy"
      },
      {
        id: "vm-web-2", 
        type: "VM",
        name: "web-server-02",
        ipAddress: "10.0.1.11",
        port: 80,
        status: "healthy"
      },
      {
        id: "vm-web-3",
        type: "VM", 
        name: "web-server-03",
        ipAddress: "10.0.1.12",
        port: 80,
        status: "healthy"
      },
      {
        id: "vm-web-4",
        type: "VM",
        name: "web-server-04", 
        ipAddress: "10.0.1.13",
        port: 80,
        status: "healthy"
      }
    ],
    status: "healthy",
    loadBalancer: "production-app-lb",
    createdOn: "2023-10-15T09:35:00Z"
  },
  {
    id: "tg-2",
    name: "production-api-targets", 
    type: "instance",
    protocol: "HTTPS",
    port: 443,
    vpc: "production-vpc",
    healthCheck: {
      path: "/api/health",
      protocol: "HTTPS",
      port: 443,
      interval: 30,
      timeout: 5,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 2,
    targetMembers: [
      {
        id: "vm-api-1",
        type: "VM",
        name: "api-server-01",
        ipAddress: "10.0.2.20",
        port: 443,
        status: "healthy"
      },
      {
        id: "vm-api-2",
        type: "VM", 
        name: "api-server-02",
        ipAddress: "10.0.2.21",
        port: 443,
        status: "healthy"
      }
    ],
    status: "healthy",
    loadBalancer: "production-app-lb",
    createdOn: "2023-10-15T09:40:00Z"
  },
  {
    id: "tg-3",
    name: "api-gateway-targets",
    type: "instance",
    protocol: "HTTP",
    port: 8080,
    vpc: "production-vpc", 
    healthCheck: {
      path: "/gateway/health",
      protocol: "HTTP",
      port: 8080,
      interval: 30,
      timeout: 5,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 2,
    targetMembers: [
      {
        id: "vm-gateway-1",
        type: "VM",
        name: "gateway-server-01",
        ipAddress: "10.0.3.30",
        port: 8080,
        status: "healthy"
      },
      {
        id: "vm-gateway-2",
        type: "VM",
        name: "gateway-server-02",
        ipAddress: "10.0.3.31",
        port: 8080,
        status: "healthy"
      }
    ],
    status: "healthy",
    loadBalancer: "api-gateway-lb",
    createdOn: "2023-11-20T14:20:00Z"
  },
  {
    id: "tg-4",
    name: "database-targets",
    type: "instance",
    protocol: "TCP",
    port: 3306,
    vpc: "production-vpc",
    healthCheck: {
      protocol: "TCP",
      port: 3306,
      interval: 30,
      timeout: 10,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 2,
    targetMembers: [
      {
        id: "vm-db-1",
        type: "VM",
        name: "mysql-primary",
        ipAddress: "10.0.4.40",
        port: 3306,
        status: "healthy"
      },
      {
        id: "vm-db-2",
        type: "VM",
        name: "mysql-secondary",
        ipAddress: "10.0.4.41",
        port: 3306,
        status: "healthy"
      }
    ],
    status: "healthy",
    loadBalancer: "internal-services-lb",
    createdOn: "2023-12-01T11:50:00Z"
  },
  {
    id: "tg-5",
    name: "cache-targets",
    type: "instance",
    protocol: "TCP",
    port: 6379,
    vpc: "production-vpc",
    healthCheck: {
      protocol: "TCP",
      port: 6379,
      interval: 30,
      timeout: 10,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 2,
    targetMembers: [
      {
        id: "vm-cache-1",
        type: "VM",
        name: "redis-primary",
        ipAddress: "10.0.5.50",
        port: 6379,
        status: "healthy"
      },
      {
        id: "vm-cache-2",
        type: "VM",
        name: "redis-replica",
        ipAddress: "10.0.5.51",
        port: 6379,
        status: "healthy"
      }
    ],
    status: "healthy",
    loadBalancer: "internal-services-lb",
    createdOn: "2023-12-01T11:55:00Z"
  },
  {
    id: "tg-6",
    name: "messaging-targets",
    type: "instance",
    protocol: "TCP",
    port: 5672,
    vpc: "production-vpc",
    healthCheck: {
      protocol: "TCP",
      port: 5672,
      interval: 30,
      timeout: 10,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 2,
    targetMembers: [
      {
        id: "vm-mq-1",
        type: "VM",
        name: "rabbitmq-01",
        ipAddress: "10.0.6.60",
        port: 5672,
        status: "healthy"
      },
      {
        id: "vm-mq-2",
        type: "VM",
        name: "rabbitmq-02",
        ipAddress: "10.0.6.61",
        port: 5672,
        status: "healthy"
      }
    ],
    status: "healthy", 
    loadBalancer: "internal-services-lb",
    createdOn: "2023-12-01T12:00:00Z"
  },
  {
    id: "tg-7",
    name: "staging-app-targets",
    type: "instance",
    protocol: "HTTP",
    port: 80,
    vpc: "staging-vpc",
    healthCheck: {
      path: "/health",
      protocol: "HTTP",
      port: 80,
      interval: 30,
      timeout: 5,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    targets: 2,
    targetMembers: [
      {
        id: "vm-staging-1",
        type: "VM",
        name: "staging-app-01",
        ipAddress: "10.1.1.10",
        port: 80,
        status: "healthy"
      },
      {
        id: "vm-staging-2",
        type: "VM",
        name: "staging-app-02",
        ipAddress: "10.1.1.11",
        port: 80,
        status: "draining"
      }
    ],
    status: "degraded",
    loadBalancer: "staging-web-lb",
    createdOn: "2024-01-10T16:25:00Z"
  },
  {
    id: "tg-8",
    name: "analytics-targets",
    type: "instance",
    protocol: "HTTP",
    port: 9090,
    vpc: "production-vpc",
    healthCheck: {
      path: "/metrics",
      protocol: "HTTP",
      port: 9090,
      interval: 60,
      timeout: 10,
      healthyThreshold: 2,
      unhealthyThreshold: 5
    },
    targets: 3,
    targetMembers: [
      {
        id: "container-analytics-1",
        type: "Container",
        name: "prometheus-exporter",
        ipAddress: "10.0.7.70",
        port: 9090,
        status: "unhealthy"
      },
      {
        id: "ip-analytics-1",
        type: "IP",
        name: "grafana-instance",
        ipAddress: "10.0.7.71",
        port: 9090,
        status: "healthy"
      },
      {
        id: "vm-analytics-1",
        type: "VM",
        name: "analytics-vm-01",
        ipAddress: "10.0.7.72",
        port: 9090,
        status: "unhealthy"
      }
    ],
    status: "unhealthy",
    createdOn: "2024-02-01T08:30:00Z"
  }
]

export const getModelsByCapability = (capability: string) => {
  return models.filter((model) => model.capabilities.includes(capability))
}

export const searchModels = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return models.filter((model) => 
    model.name.toLowerCase().includes(lowercaseQuery) ||
    model.provider.toLowerCase().includes(lowercaseQuery) ||
    model.description.toLowerCase().includes(lowercaseQuery) ||
    model.capabilities.some(cap => cap.toLowerCase().includes(lowercaseQuery))
  )
}
