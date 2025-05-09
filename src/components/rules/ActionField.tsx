
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import { ActionField as ActionFieldType, InputFieldType, formFieldTypes } from './types';

interface ActionFieldProps {
  field: ActionFieldType;
  actionId: string;
  onUpdateField: (actionId: string, fieldId: string, updates: Partial<ActionFieldType>) => void;
  onRemoveField: (actionId: string, fieldId: string) => void;
}

const ActionField = ({
  field,
  actionId,
  onUpdateField,
  onRemoveField
}: ActionFieldProps) => {
  return (
    <div className="border p-3 rounded-md">
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-2">
          <label className="text-sm font-medium">Label</label>
          <Input
            value={field.label}
            onChange={(e) => onUpdateField(actionId, field.id, { label: e.target.value })}
            className="col-span-2"
          />
        </div>
        
        <div className="grid grid-cols-3 items-center gap-2">
          <label className="text-sm font-medium">Field Name</label>
          <Input
            value={field.name}
            onChange={(e) => onUpdateField(actionId, field.id, { name: e.target.value })}
            className="col-span-2"
          />
        </div>
        
        <div className="grid grid-cols-3 items-center gap-2">
          <label className="text-sm font-medium">Field Type</label>
          <Select
            value={field.fieldType}
            onValueChange={(value) => onUpdateField(actionId, field.id, { 
              fieldType: value as InputFieldType 
            })}
          >
            <SelectTrigger className="col-span-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formFieldTypes.map(ft => (
                <SelectItem key={ft.value} value={ft.value}>
                  {ft.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox
            id={`required-${field.id}`}
            checked={field.required}
            onCheckedChange={(checked) => onUpdateField(actionId, field.id, { 
              required: !!checked 
            })}
          />
          <label
            htmlFor={`required-${field.id}`}
            className="text-sm font-medium leading-none"
          >
            Required Field
          </label>
          
          <div className="flex-1"></div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveField(actionId, field.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionField;
