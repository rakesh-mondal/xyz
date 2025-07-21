"use client"

import { useParams } from "next/navigation";
import { vmInstances } from "@/lib/data";
import { Lock, Unlock } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function VMInstanceDetailsPage() {
  const { id } = useParams();
  const vm = vmInstances.find((v) => v.id === id);

  if (!vm) {
    return <div className="p-8 text-center text-gray-500">Instance not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">{vm.name}</h2>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Type</span>
          <span>{vm.type}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Flavour</span>
          <span>{vm.flavour}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">VPC</span>
          <span>{vm.vpc}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Status</span>
          <span>{vm.status}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Fixed IP</span>
          <span className="underline cursor-pointer" onClick={() => navigator.clipboard.writeText(vm.fixedIp)}>{vm.fixedIp}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Public IP</span>
          <span className="underline cursor-pointer" onClick={() => navigator.clipboard.writeText(vm.publicIp)}>{vm.publicIp}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Created On</span>
          <span>{new Date(vm.createdOn).toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b pb-2 items-center">
          <span className="font-medium">Delete Protection</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {vm.deleteProtection ? (
                  <Lock className="inline w-5 h-5 text-gray-700" aria-label="Delete protection enabled" />
                ) : (
                  <Unlock className="inline w-5 h-5 text-gray-400" aria-label="Delete protection disabled" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {vm.deleteProtection ? "Delete protection enabled" : "Delete protection disabled"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
} 