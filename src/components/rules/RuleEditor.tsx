
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Flag, Save, Trash } from "lucide-react";
import { 
  Rule, 
  GroupCondition, 
  SimpleCondition, 
  RuleAction, 
  ActionField, 
  countries 
} from './types';
import ConditionGroup from './ConditionGroup';
import RuleActionComponent from './RuleAction';

interface RuleEditorProps {
  rule: Rule;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  onUpdateRule: (updates: Partial<Rule>) => void;
  onAddCondition: (groupId: string) => void;
  onAddGroup: (parentGroupId: string, logicalOp: "AND" | "OR") => void;
  onUpdateCondition: (conditionId: string, updates: Partial<SimpleCondition>) => void;
  onUpdateGroup: (groupId: string, updates: Partial<GroupCondition>) => void;
  onRemoveCondition: (id: string) => void;
  onAddAction: () => void;
  onUpdateAction: (actionId: string, updates: Partial<RuleAction>) => void;
  onRemoveAction: (actionId: string) => void;
  onAddField: (actionId: string) => void;
  onUpdateField: (actionId: string, fieldId: string, updates: Partial<ActionField>) => void;
  onRemoveField: (actionId: string, fieldId: string) => void;
  activeActionId: string | null;
  onSetActiveActionId: (id: string | null) => void;
}

const RuleEditor = ({
  rule,
  isOpen,
  isEditing,
  onClose,
  onSave,
  onUpdateRule,
  onAddCondition,
  onAddGroup,
  onUpdateCondition,
  onUpdateGroup,
  onRemoveCondition,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
  onAddField,
  onUpdateField,
  onRemoveField,
  activeActionId,
  onSetActiveActionId
}: RuleEditorProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Rule" : "Create Rule"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modify your expense validation rule" 
              : "Define conditions and actions for expense validation"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Rule Name
            </label>
            <Input
              id="name"
              value={rule.name}
              onChange={(e) => onUpdateRule({name: e.target.value})}
              className="col-span-3"
              placeholder="Enter rule name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={rule.description}
              onChange={(e) => onUpdateRule({description: e.target.value})}
              className="col-span-3"
              placeholder="Brief description of this rule"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">
              Countries
            </label>
            <div className="col-span-3">
              <Select
                value={rule.countries.includes("All") ? "All" : "specific"}
                onValueChange={(value) => {
                  if (value === "All") {
                    onUpdateRule({countries: ["All"]});
                  } else {
                    onUpdateRule({countries: rule.countries.filter(c => c !== "All")});
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Apply rule to which countries?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Countries</SelectItem>
                  <SelectItem value="specific">Specific Countries</SelectItem>
                </SelectContent>
              </Select>
              
              {!rule.countries.includes("All") && (
                <div className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        Select Countries ({rule.countries.length} selected)
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Select Countries</h4>
                          <p className="text-sm text-muted-foreground">
                            Choose countries to apply this rule to
                          </p>
                        </div>
                        <div className="grid gap-2">
                          {countries.filter(c => c.value !== "All").map((country) => (
                            <div key={country.value} className="flex items-center gap-2">
                              <Checkbox
                                id={`country-${country.value}`}
                                checked={rule.countries.includes(country.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    onUpdateRule({
                                      countries: [...rule.countries, country.value]
                                    });
                                  } else {
                                    onUpdateRule({
                                      countries: rule.countries.filter(c => c !== country.value)
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor={`country-${country.value}`}
                                className="text-sm"
                              >
                                {country.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {rule.countries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rule.countries.map(country => (
                        <Badge key={country} variant="secondary" className="flex items-center gap-1">
                          {country}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => onUpdateRule({
                              countries: rule.countries.filter(c => c !== country)
                            })}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-border my-2"></div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="text-right text-sm font-medium pt-2 flex items-center justify-end gap-2">
              <Filter className="h-4 w-4" />
              <span>Conditions</span>
            </div>
            <div className="col-span-3">
              <ConditionGroup 
                group={rule.rootCondition}
                onAddCondition={onAddCondition}
                onAddGroup={onAddGroup}
                onUpdateCondition={onUpdateCondition}
                onUpdateGroup={onUpdateGroup}
                onRemoveCondition={onRemoveCondition}
              />
            </div>
          </div>
          
          <div className="border-t border-border my-2"></div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="text-right text-sm font-medium pt-2 flex items-center justify-end gap-2">
              <Flag className="h-4 w-4" />
              <span>Actions</span>
            </div>
            <div className="col-span-3">
              {rule.actions.length > 0 ? (
                <div className="space-y-2">
                  {rule.actions.map(action => (
                    <RuleActionComponent
                      key={action.id}
                      action={action}
                      isActive={activeActionId === action.id}
                      onToggleActive={onSetActiveActionId}
                      onUpdateAction={onUpdateAction}
                      onRemoveAction={onRemoveAction}
                      onAddField={onAddField}
                      onUpdateField={onUpdateField}
                      onRemoveField={onRemoveField}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground p-4 border border-dashed border-muted-foreground/30 rounded-md">
                  No actions defined yet. Add an action using the button below.
                </div>
              )}
              <Button
                variant="outline"
                className="mt-3"
                onClick={onAddAction}
              >
                <svg 
                  width="15" 
                  height="15" 
                  viewBox="0 0 15 15" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                >
                  <path 
                    d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" 
                    fill="currentColor" 
                    fillRule="evenodd" 
                    clipRule="evenodd"
                  />
                </svg>
                Add Action
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="isActive" className="text-right text-sm font-medium">
              Status
            </label>
            <Select
              value={rule.isActive ? "active" : "disabled"}
              onValueChange={(value) => onUpdateRule({isActive: value === "active"})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={onSave} 
            disabled={!rule.name || rule.actions.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Rule" : "Create Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RuleEditor;
