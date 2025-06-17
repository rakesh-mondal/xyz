import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, MemoryStick, HardDrive, Server, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface GpuPricingCardProps {
  name: string;
  price: number;
  vcpus: number;
  memory: number;
  gpus: number;
  gpuMemory: number;
  availability: "Low" | "Medium" | "High";
  gpuType: string;
}

const gpuConfigs: GpuPricingCardProps[] = [
  {
    name: "A100-40GB-NVLINK-1x",
    price: 105,
    vcpus: 24,
    memory: 96,
    gpus: 1,
    gpuMemory: 40,
    availability: "Low",
    gpuType: "NVIDIA - A100"
  },
  {
    name: "A100-80GB-NVLINK-1x", 
    price: 160,
    vcpus: 24,
    memory: 96,
    gpus: 1,
    gpuMemory: 80,
    availability: "Low",
    gpuType: "NVIDIA - A100"
  },
  {
    name: "A100-40GB-NVLINK-2x",
    price: 210,
    vcpus: 48,
    memory: 192,
    gpus: 2,
    gpuMemory: 80,
    availability: "Low",
    gpuType: "NVIDIA - A100"
  },
  {
    name: "H100-80GB-NVLINK-1x",
    price: 280,
    vcpus: 32,
    memory: 128,
    gpus: 1,
    gpuMemory: 80,
    availability: "Low",
    gpuType: "NVIDIA - H100"
  },
  {
    name: "H100-80GB-NVLINK-2x",
    price: 560,
    vcpus: 64,
    memory: 256,
    gpus: 2,
    gpuMemory: 160,
    availability: "Low",
    gpuType: "NVIDIA - H100"
  },
  {
    name: "A6000-48GB-1x",
    price: 80,
    vcpus: 16,
    memory: 64,
    gpus: 1,
    gpuMemory: 48,
    availability: "Medium",
    gpuType: "NVIDIA - A6000"
  }
];

function getAvailabilityColor(availability: string) {
  switch (availability) {
    case "High": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Low": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800";
  }
}

function GpuPricingCard({ name, price, vcpus, memory, gpus, gpuMemory, availability, gpuType }: GpuPricingCardProps) {
  return (
    <Card className="relative w-full transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Zap className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-base font-medium text-foreground">
            {gpuType}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-foreground">{name}</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-medium">₹{price}</span>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Specs */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wide">Type</span>
            <span className="font-medium">GPU</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wide">vCPUs</span>
            <span className="font-medium">{vcpus}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wide">RAM</span>
            <span className="font-medium">{memory} GB</span>
          </div>
        </div>

        {/* GPU Specs */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wide">GPUs</span>
            <span className="font-medium">{gpus}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wide">GPU Memory</span>
            <span className="font-medium">{gpuMemory}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wide">Availability</span>
            <Badge className={`${getAvailabilityColor(availability)} text-xs px-2 py-0.5`}>
              {availability}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full text-sm font-semibold transition-all duration-200"
          size="sm"
          variant="outline"
        >
          Notify Me
        </Button>
      </CardFooter>
    </Card>
  );
}

export function GpuPricingCards() {
  const [search, setSearch] = useState("");
  
  const filteredConfigs = gpuConfigs.filter(config => {
    const searchLower = search.toLowerCase();
    return (
      config.name.toLowerCase().includes(searchLower) ||
      config.gpuType.toLowerCase().includes(searchLower) ||
      config.vcpus.toString().includes(searchLower) ||
      config.memory.toString().includes(searchLower) ||
      config.gpus.toString().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-xs mb-2">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Flavour..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConfigs.map((config, index) => (
          <GpuPricingCard key={index} {...config} />
        ))}
      </div>
    </div>
  );
} 