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
