
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brackets, Plus, Trash } from "lucide-react";
import { GroupCondition, LogicalOperator, SimpleCondition } from './types';
import SimpleConditionComponent from './SimpleCondition';

interface ConditionGroupProps {
  group: GroupCondition;
  level?: number;
  onAddCondition: (groupId: string) => void;
  onAddGroup: (parentGroupId: string, logicalOp: LogicalOperator) => void;
  onUpdateCondition: (conditionId: string, updates: Partial<SimpleCondition>) => void;
  onUpdateGroup: (groupId: string, updates: Partial<GroupCondition>) => void;
  onRemoveCondition: (id: string) => void;
}

const ConditionGroup = ({
  group,
  level = 0,
  onAddCondition,
  onAddGroup,
  onUpdateCondition,
  onUpdateGroup,
  onRemoveCondition
}: ConditionGroupProps) => {
  return (
    <div 
      key={group.id} 
      className={`border ${level > 0 ? 'border-muted-foreground/30' : 'border-none'} rounded-md p-3 mt-2`}
      style={{ marginLeft: level > 0 ? '1rem' : 0 }}
    >
      {level > 0 && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Brackets className="h-4 w-4" />
            <Select
              value={group.logicalOperator}
              onValueChange={(value) => onUpdateGroup(group.id, { 
                logicalOperator: value as LogicalOperator 
              })}
            >
              <SelectTrigger className="w-20">
                <SelectValue>{group.logicalOperator}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">Group</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemoveCondition(group.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {group.conditions.length > 0 ? (
        <div className="space-y-2">
          {group.conditions.map((condition, index) => (
            <div key={condition.id}>
              {condition.isNested ? (
                <ConditionGroup
                  group={condition as GroupCondition}
                  level={level + 1}
                  onAddCondition={onAddCondition}
                  onAddGroup={onAddGroup}
                  onUpdateCondition={onUpdateCondition}
                  onUpdateGroup={onUpdateGroup}
                  onRemoveCondition={onRemoveCondition}
                />
              ) : (
                <SimpleConditionComponent 
                  condition={condition as SimpleCondition}
                  onUpdate={onUpdateCondition}
                  onRemove={onRemoveCondition}
                />
              )}
              {index < group.conditions.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <Badge variant="outline" className="text-xs">
                    {group.logicalOperator}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground p-4 border border-dashed border-muted-foreground/30 rounded-md">
          Add conditions or groups using the buttons below
        </div>
      )}
      
      <div className="flex justify-center gap-2 mt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddCondition(group.id)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddGroup(group.id, "AND")}
        >
          <Brackets className="h-4 w-4 mr-1" />
          Add Group
        </Button>
      </div>
    </div>
  );
};

export default ConditionGroup;
