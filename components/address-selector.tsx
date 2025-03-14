"use client";

import { MapPin } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

interface Location {
  locationId: number;
  description: string;
  isDefault?: boolean;
}

interface AddressSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  locations: Location[];
}

export function AddressSelector({ selectedId, onSelect, locations }: AddressSelectorProps) {
  if (locations.length === 0) {
    return (
      <div className="text-center py-6">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có địa chỉ</h3>
        <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng việc thêm địa chỉ giao hàng của bạn.</p>
      </div>
    );
  }

  return (
    <RadioGroup
      value={selectedId?.toString()}
      onValueChange={(value) => onSelect(Number.parseInt(value))}
      className="space-y-4"
    >
      {locations.map((location) => (
        <div key={location.locationId} className="flex items-start space-x-4 rounded-lg border p-4">
          <RadioGroupItem
            value={location.locationId.toString()}
            id={`location-${location.locationId}`}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor={`location-${location.locationId}`} className="font-medium cursor-pointer">
              {location.description} {location.isDefault && <span className="text-teal-600 text-sm">(Mặc định)</span>}
            </Label>
          </div>
          {/* <Button variant="ghost" size="sm">
            Sửa
          </Button> */}
        </div>
      ))}
    </RadioGroup>
  );
}