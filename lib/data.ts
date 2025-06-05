export const vpcs = [
  {
    id: "vpc-1",
    name: "production-vpc",
    status: "active",
    region: "us-east-1",
    createdOn: "2023-01-01",
    description: "Main production VPC",
    networkName: "production-network",
  },
  {
    id: "vpc-2",
    name: "development-vpc",
    status: "active",
    region: "us-west-2",
    createdOn: "2023-02-15",
    description: "Development VPC",
    networkName: "development-network",
  },
  {
    id: "vpc-3",
    name: "staging-vpc",
    status: "inactive",
    region: "eu-west-1",
    createdOn: "2023-03-20",
    description: "Staging VPC",
    networkName: "staging-network",
  },
  {
    id: "vpc-4",
    name: "testing-vpc",
    status: "active",
    region: "us-central-1",
    createdOn: "2023-04-10",
    description: "Testing environment VPC",
    networkName: "testing-network",
  },
  {
    id: "vpc-5",
    name: "backup-vpc",
    status: "active",
    region: "eu-north-1",
    createdOn: "2023-05-05",
    description: "Backup and disaster recovery VPC",
    networkName: "backup-network",
  },
  {
    id: "vpc-6",
    name: "analytics-vpc",
    status: "active",
    region: "ap-south-1",
    createdOn: "2023-06-12",
    description: "Analytics and data processing VPC",
    networkName: "analytics-network",
  },
  {
    id: "vpc-7",
    name: "security-vpc",
    status: "active",
    region: "us-east-2",
    createdOn: "2023-07-08",
    description: "Security and monitoring VPC",
    networkName: "security-network",
  },
  {
    id: "vpc-8",
    name: "research-vpc",
    status: "inactive",
    region: "eu-central-1",
    createdOn: "2023-08-20",
    description: "Research and development VPC",
    networkName: "research-network",
  },
  {
    id: "vpc-9",
    name: "integration-vpc",
    status: "active",
    region: "ap-southeast-1",
    createdOn: "2023-09-15",
    description: "Integration testing VPC",
    networkName: "integration-network",
  },
  {
    id: "vpc-10",
    name: "legacy-vpc",
    status: "inactive",
    region: "us-west-1",
    createdOn: "2022-12-01",
    description: "Legacy applications VPC",
    networkName: "legacy-network",
  },
  {
    id: "vpc-11",
    name: "ml-vpc",
    status: "active",
    region: "us-east-1",
    createdOn: "2023-10-05",
    description: "Machine learning workloads VPC",
    networkName: "ml-network",
  },
  {
    id: "vpc-12",
    name: "cdn-vpc",
    status: "active",
    region: "eu-west-2",
    createdOn: "2023-11-10",
    description: "CDN and edge computing VPC",
    networkName: "cdn-network",
  },
  {
    id: "vpc-13",
    name: "iot-vpc",
    status: "active",
    region: "ap-northeast-1",
    createdOn: "2023-12-01",
    description: "IoT devices and sensors VPC",
    networkName: "iot-network",
  },
  {
    id: "vpc-14",
    name: "gaming-vpc",
    status: "active",
    region: "us-central-1",
    createdOn: "2024-01-15",
    description: "Gaming infrastructure VPC",
    networkName: "gaming-network",
  },
  {
    id: "vpc-15",
    name: "blockchain-vpc",
    status: "inactive",
    region: "eu-south-1",
    createdOn: "2024-02-20",
    description: "Blockchain and crypto VPC",
    networkName: "blockchain-network",
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
    status: "active",
    cidr: "192.168.1.0/24",
    gatewayIp: "192.168.1.1",
    createdOn: "2023-01-10",
  },
  {
    id: "subnet-2",
    name: "development-subnet-private",
    vpcName: "development-vpc",
    type: "Private",
    status: "active",
    cidr: "10.0.1.0/24",
    gatewayIp: "10.0.1.1",
    createdOn: "2023-02-25",
  },
]

export const staticIPs = [
  {
    id: "ip-1",
    address: "203.0.113.1",
    subnetName: "production-subnet-public",
    type: "IPv4",
    accessType: "Public",
    assignedVM: "web-server-1",
  },
  {
    id: "ip-2",
    address: "203.0.113.2",
    subnetName: "production-subnet-public",
    type: "IPv4",
    accessType: "Public",
    assignedVM: null,
  },
]

export const getVPC = (id: string) => {
  return vpcs.find((vpc) => vpc.id === id)
}

export const getSecurityGroup = (id: string) => {
  return securityGroups.find((sg) => sg.id === id)
}
