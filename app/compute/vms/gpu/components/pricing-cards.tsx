import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, MemoryStick, HardDrive, Server, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// NVIDIA Logo Component
function NvidiaLogo({ className }: { className?: string }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_96_9)">
        <path d="M8.948 18.121V16.874C4.108 16.269 2.456 10.891 2.456 10.891C2.456 10.891 4.62 7.66903 8.956 7.33003V6.15503C4.153 6.54703 0 10.642 0 10.642C0 10.642 2.35 17.498 8.948 18.121Z" fill="#77B900"/>
        <path d="M4.27539 11.053C4.27539 11.053 5.29139 14.889 8.94839 15.548V14.408C6.89039 13.704 6.21039 11.274 6.21039 11.274C6.21039 11.274 7.41239 9.83199 8.94039 10.019H8.94839V8.77299C9.16639 8.74899 9.38639 8.73499 9.61039 8.73499L9.74339 8.73699C12.2514 8.73699 13.7434 10.704 13.7434 10.704L11.7034 12.431C10.7934 10.891 10.4844 10.214 8.95639 10.027V14.407C9.32739 14.531 9.71639 14.593 10.1144 14.593C13.0904 14.593 15.8644 10.712 15.8644 10.712C15.8644 10.712 13.2934 7.18599 9.37139 7.31099H9.36839C9.21939 7.31299 9.07239 7.31899 8.94839 7.32899V8.76899L8.92139 8.77399L8.94439 8.77299C6.03139 9.09499 4.27539 11.053 4.27539 11.053Z" fill="#77B900"/>
        <path d="M24.0002 4H8.94824V6.155L9.37224 6.128C14.8222 5.942 18.3822 10.633 18.3822 10.633C18.3822 10.633 14.3022 15.637 10.0522 15.637C9.68224 15.637 9.32024 15.602 8.95724 15.539V16.874C9.25724 16.909 9.56724 16.937 9.86724 16.937C13.8242 16.937 16.6872 14.898 19.4592 12.494C19.9182 12.868 21.7992 13.767 22.1882 14.16C19.5552 16.385 13.4172 18.175 9.93624 18.175C9.60024 18.175 9.28324 18.157 8.96524 18.122V20H24.0002V4Z" fill="#77B900"/>
        <path d="M0.051 10.593H0V10.642C0 10.642 0.017 10.625 0.051 10.593ZM13.652 10.593H10.423C10.874 10.98 11.195 11.571 11.704 12.432L13.744 10.705C13.744 10.705 13.713 10.664 13.652 10.593Z" fill="#DEDEDE"/>
        <path d="M2.683 10.593H0.051C0.017 10.625 0 10.642 0 10.642C0 10.642 2.35 17.498 8.948 18.121V16.874C4.108 16.269 2.456 10.891 2.456 10.891C2.456 10.891 2.532 10.779 2.683 10.593Z" fill="#68A100"/>
        <path d="M6.97839 10.593H4.76639C4.44539 10.863 4.27539 11.052 4.27539 11.052C4.27539 11.052 5.29139 14.888 8.94839 15.547V14.407C6.89039 13.704 6.21039 11.274 6.21039 11.274C6.21039 11.274 6.50139 10.926 6.97839 10.593ZM15.7724 10.593H13.6524C13.7134 10.663 13.7444 10.704 13.7444 10.704L11.7044 12.431C11.1954 11.57 10.8744 10.979 10.4234 10.592H8.95739V14.407C9.32839 14.531 9.71739 14.593 10.1154 14.593C13.0914 14.593 15.8654 10.712 15.8654 10.712C15.8654 10.712 15.8344 10.67 15.7724 10.593Z" fill="#68A100"/>
        <path d="M24 10.593H18.351C18.372 10.619 18.382 10.633 18.382 10.633C18.382 10.633 14.302 15.637 10.052 15.637C9.68203 15.637 9.32003 15.602 8.95703 15.539V16.874C9.25703 16.909 9.56703 16.937 9.86703 16.937C13.824 16.937 16.687 14.898 19.459 12.494C19.918 12.868 21.799 13.767 22.188 14.16C19.555 16.385 13.417 18.175 9.93603 18.175C9.60003 18.175 9.28303 18.157 8.96503 18.122V20H24V10.593Z" fill="#68A100"/>
      </g>
      <defs>
        <clipPath id="clip0_96_9">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

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
  const { toast } = useToast();

  const handleNotifyMe = () => {
    toast({
      title: "Notification Set",
      description: "You will be notified over email once this GPU is available.",
    });
  };

  return (
    <Card className="relative w-full transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <NvidiaLogo className="h-5 w-5" />
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
          onClick={handleNotifyMe}
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