import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (policy: any) => void;
  mode: "add" | "edit";
  type: "snapshot" | "backup";
  initialPolicy?: any;
}

const maxOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AddPolicyModal({ open, onClose, onSave, mode, type, initialPolicy }: AddPolicyModalProps) {
  const [suffix, setSuffix] = useState("");
  const [maxAllowed, setMaxAllowed] = useState("5");
  const [incremental, setIncremental] = useState(false);
  const [scheduleType, setScheduleType] = useState("day");
  const [weekday, setWeekday] = useState(weekdays[0]);
  const [enabled, setEnabled] = useState("true");

  useEffect(() => {
    if (mode === "edit" && initialPolicy) {
      setSuffix(initialPolicy.suffix || "");
      setMaxAllowed((initialPolicy.maxSnapshots || initialPolicy.retention || 5).toString());
      setIncremental(initialPolicy.incremental || false);
      if (/week/i.test(initialPolicy.scheduleDescription || "")) {
        setScheduleType("week");
        // Try to parse weekday
        const found = weekdays.find(w => (initialPolicy.scheduleDescription || "").toLowerCase().includes(w.toLowerCase()));
        setWeekday(found || weekdays[0]);
      } else {
        setScheduleType("day");
      }
      setEnabled(initialPolicy.enabled ? "true" : "false");
    } else if (mode === "add") {
      setSuffix("");
      setMaxAllowed("5");
      setIncremental(false);
      setScheduleType("day");
      setWeekday(weekdays[0]);
      setEnabled("true");
    }
  }, [open, mode, initialPolicy]);

  const handleSave = () => {
    if (!maxAllowed) return;
    let scheduleString = scheduleType === "day" ? "Once every day" : `Once every week on ${weekday}`;
    onSave({
      suffix,
      maxSnapshots: Number(maxAllowed),
      retention: Number(maxAllowed),
      incremental: type === "backup" ? incremental : undefined,
      scheduleDescription: scheduleString,
      schedule: scheduleString,
      enabled: enabled === "true",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? `Add ${type === "snapshot" ? "Snapshot" : "Backup"} Policy` : `Edit ${type === "snapshot" ? "Snapshot" : "Backup"} Policy`}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? `Configure a new ${type} policy for this volume.`
              : `Update the ${type} policy settings.`}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-50 border rounded-lg p-6">
          <div className="space-y-6 mb-6">
            <div className="space-y-2">
              <Label>{type === "snapshot" ? "Snapshot name (suffix)" : "Backup name (suffix)"}</Label>
              <Input
                value={suffix}
                onChange={e => setSuffix(e.target.value)}
                placeholder="Enter suffix"
              />
            </div>
            <div className="space-y-2">
              <Label>{type === "snapshot" ? "Maximum snapshots allowed" : "Max Backups Allowed"}</Label>
              <Select value={maxAllowed} onValueChange={setMaxAllowed}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {maxOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {type === "backup" && (
            <div className="flex items-center gap-2 mb-6">
              <button
                type="button"
                className={`w-12 h-7 rounded-full border transition-colors duration-200 ${incremental ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'}`}
                onClick={() => setIncremental(v => !v)}
                aria-pressed={incremental}
              >
                <span className={`block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-200 ${incremental ? 'translate-x-6' : ''}`}></span>
              </button>
              <span className="text-base font-medium">Incremental</span>
            </div>
          )}
          <div className="space-y-2">
            <Label>Scheduler</Label>
            <div className="text-sm font-normal text-gray-700">Once every</div>
            <div className="flex gap-2 mt-1 w-full md:w-1/2">
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
              {scheduleType === "week" && (
                <Select value={weekday} onValueChange={setWeekday}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!maxAllowed}>
            {mode === "add" ? "Add Policy" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 