import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, MemoryStick, HardDrive, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface PricingCardProps {
  vcpus: number;
  memory: number;
  price: number;
  storage: string;
  architecture: string;
}

const pricingConfigs: PricingCardProps[] = [
  {
    vcpus: 2,
    memory: 8,
    price: 6,
    storage: "8 GB+",
    architecture: "AMD EPYC 9554"
  },
  {
    vcpus: 4,
    memory: 16,
    price: 12,
    storage: "16 GB+",
    architecture: "AMD EPYC 9554"
  },
  {
    vcpus: 8,
    memory: 32,
    price: 24,
    storage: "32 GB+",
    architecture: "AMD EPYC 9554"
  },
  {
    vcpus: 16,
    memory: 64,
    price: 48,
    storage: "64 GB+",
    architecture: "AMD EPYC 9554"
  },
  {
    vcpus: 32,
    memory: 128,
    price: 96,
    storage: "128 GB+",
    architecture: "AMD EPYC 9554"
  }
];

function Spec({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="flex flex-col justify-center">
        <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

function PricingCard({ vcpus, memory, price, storage, architecture }: PricingCardProps) {
  return (
    <Card className="relative w-full transition-all duration-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-4 gap-2 sm:gap-0">
        <h3 className="text-lg font-medium text-foreground text-left sm:whitespace-nowrap">
          {`${vcpus} vCPU • ${memory} GB RAM`}
        </h3>
        <div className="flex items-baseline gap-1 sm:justify-end">
          <span className="text-lg font-medium leading-none">₹{price}</span>
          <span className="text-lg text-muted-foreground">/hr</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium justify-start text-left">
          <span><span className="text-foreground">{vcpus}</span> <span className="text-muted-foreground">vCPUs</span></span>
          <span className="text-muted-foreground">•</span>
          <span><span className="text-foreground">{memory}</span> <span className="text-muted-foreground">GB RAM</span></span>
          <span className="text-muted-foreground">•</span>
          <span><span className="text-foreground">{storage}</span> <span className="text-muted-foreground">SSD</span></span>
        </div>
        <div className="text-sm font-medium text-muted-foreground mt-2 break-words text-left">
          ARCHITECTURE: {architecture}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="text-sm font-semibold transition-all duration-200"
          size="sm"
          variant="default"
        >
          Reserve Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CpuPricingCards() {
  const [search, setSearch] = useState("");
  const filteredConfigs = pricingConfigs.filter(config => {
    const searchLower = search.toLowerCase();
    return (
      config.vcpus.toString().includes(searchLower) ||
      config.memory.toString().includes(searchLower) ||
      config.architecture.toLowerCase().includes(searchLower)
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
          <PricingCard key={index} {...config} />
        ))}
      </div>
    </div>
  );
}
