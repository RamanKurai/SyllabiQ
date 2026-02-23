import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../ui/utils";

interface SubjectSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  /** Use Drawer (bottom sheet) instead of Select — for mobile sidebar to avoid overlay issues */
  useDrawer?: boolean;
}

export function SubjectSelector({
  value,
  onValueChange,
  options,
  placeholder = "Select Subject",
  disabled = false,
  id = "subject-selector",
  useDrawer = false,
}: SubjectSelectorProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerSelect = (opt: string) => {
    onValueChange(opt === "__none__" ? "" : opt);
    setDrawerOpen(false);
  };

  if (useDrawer) {
    return (
      <div className="w-full min-w-0">
        <Label htmlFor={id} className="sr-only">
          Select subject
        </Label>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-label="Select your subject"
              disabled={disabled}
              className="w-full justify-between font-normal h-9 min-h-9"
            >
              <span className={cn("truncate", !value && "text-muted-foreground")}>
                {value || placeholder}
              </span>
              <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[70vh]">
            <DrawerHeader>
              <DrawerTitle>{placeholder}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-6">
              <ul className="flex flex-col gap-1" role="listbox">
                <li>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      role="option"
                      aria-selected={!value}
                      onClick={() => handleDrawerSelect("__none__")}
                      className="w-full rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {placeholder}
                    </button>
                  </DrawerClose>
                </li>
                {options.map((opt) => (
                  <li key={opt}>
                    <DrawerClose asChild>
                      <button
                        type="button"
                        role="option"
                        aria-selected={value === opt}
                        onClick={() => handleDrawerSelect(opt)}
                        className="w-full rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {opt}
                      </button>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 sm:min-w-[200px] sm:max-w-[220px]">
      <Label htmlFor={id} className="sr-only">
        Select subject
      </Label>
      <Select
        value={value || "__none__"}
        onValueChange={(v) => onValueChange(v === "__none__" ? "" : v)}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-label="Select your subject" className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">{placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
