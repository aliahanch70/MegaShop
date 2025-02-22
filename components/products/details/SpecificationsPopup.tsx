'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsPopupProps {
  specifications: Specification[];
  productName: string;
}

export default function SpecificationsPopup({ specifications, productName }: SpecificationsPopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          More Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            {productName} - Full Specifications
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 gap-4">
            {specifications.map((spec, index) => (
              <div 
                key={index}
                className="grid grid-cols-3 gap-4 py-3 border-b border-gray-800"
              >
                <div className="font-medium text-gray-400">{spec.key}</div>
                <div className="col-span-2 text-gray-100">{spec.value}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
