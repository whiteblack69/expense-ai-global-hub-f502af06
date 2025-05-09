
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react";
import { ActionType, RuleAction as RuleActionType, actionTypes } from './types';
import ActionField from './ActionField';

interface RuleActionProps {
  action: RuleActionType;
  isActive: boolean;
  onToggleActive: (actionId: string) => void;
  onUpdateAction: (actionId: string, updates: Partial<RuleActionType>) => void;
  onRemoveAction: (actionId: string) => void;
  onAddField: (actionId: string) => void;
  onUpdateField: (actionId: string, fieldId: string, updates: Partial<any>) => void;
  onRemoveField: (actionId: string, fieldId: string) => void;
}

const RuleAction = ({
  action,
  isActive,
  onToggleActive,
  onUpdateAction,
  onRemoveAction,
  onAddField,
  onUpdateField,
  onRemoveField
}: RuleActionProps) => {
  const actionType = actionTypes.find(at => at.value === action.type);
  
  return (
    <div className="border rounded-md mb-4">
      <div 
        className={`flex justify-between items-center p-3 cursor-pointer ${isActive ? 'bg-muted' : ''}`}
        onClick={() => onToggleActive(action.id)}
      >
        <div className="flex items-center gap-2">
          <Badge>{actionType?.label || action.type}</Badge>
          <span className="text-sm">{action.message && action.message.length > 30 ? `${action.message.substring(0, 30)}...` : action.message}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveAction(action.id);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
          {isActive ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </div>
      </div>
      
      {isActive && (
        <div className="p-3 border-t">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Action Type
              </label>
              <Select
                value={action.type}
                onValueChange={(value) => onUpdateAction(action.id, { 
                  type: value as ActionType
                })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(at => (
                    <SelectItem key={at.value} value={at.value}>
                      {at.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium pt-2">
                Message
              </label>
              <Textarea
                value={action.message || ""}
                onChange={(e) => onUpdateAction(action.id, { 
                  message: e.target.value
                })}
                placeholder="Enter message to display to user"
                className="col-span-3"
                rows={2}
              />
            </div>
            
            {action.type === "requireAdditionalInfo" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium pt-2">
                  Fields
                </label>
                <div className="col-span-3 space-y-4">
                  {(action.fields || []).map(field => (
                    <ActionField 
                      key={field.id} 
                      field={field} 
                      actionId={action.id}
                      onUpdateField={onUpdateField}
                      onRemoveField={onRemoveField}
                    />
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => onAddField(action.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleAction;
