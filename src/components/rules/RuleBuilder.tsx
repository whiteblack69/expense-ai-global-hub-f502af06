
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Rule,
  SimpleCondition,
  GroupCondition,
  RuleAction,
  ActionField,
  mockRules
} from "./types";
import { 
  createEmptyRule, 
  generateId, 
  addCondition, 
  addGroup, 
  updateCondition, 
  updateGroup, 
  removeCondition 
} from "./utils";

import RuleList from "./RuleList";
import RuleEditor from "./RuleEditor";

const RuleBuilder = () => {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRuleId, setCurrentRuleId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<Rule>(createEmptyRule());
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  
  // Handler functions for rule management
  
  // Add or edit a simple condition within a group
  const handleAddCondition = (groupId: string, condition?: SimpleCondition) => {
    setNewRule({
      ...newRule,
      rootCondition: addCondition(groupId, newRule.rootCondition, condition)
    });
  };
  
  // Add a new nested condition group
  const handleAddGroup = (parentGroupId: string, logicalOp: "AND" | "OR") => {
    setNewRule({
      ...newRule,
      rootCondition: addGroup(parentGroupId, logicalOp, newRule.rootCondition)
    });
  };

  // Update a simple condition
  const handleUpdateCondition = (conditionId: string, updates: Partial<SimpleCondition>) => {
    setNewRule({
      ...newRule,
      rootCondition: updateCondition(conditionId, updates, newRule.rootCondition)
    });
  };
  
  // Update a group's logical operator (AND/OR)
  const handleUpdateGroup = (groupId: string, updates: Partial<GroupCondition>) => {
    setNewRule({
      ...newRule,
      rootCondition: updateGroup(groupId, updates, newRule.rootCondition)
    });
  };
  
  // Remove a condition or group from the rule
  const handleRemoveCondition = (id: string) => {
    setNewRule({
      ...newRule,
      rootCondition: removeCondition(id, newRule.rootCondition)
    });
  };
  
  // Add a new action to the rule
  const handleAddAction = () => {
    const newAction: RuleAction = {
      id: generateId(),
      type: "showMessage",
      message: ""
    };
    
    setNewRule({
      ...newRule,
      actions: [...newRule.actions, newAction]
    });
    
    setActiveActionId(newAction.id);
  };
  
  // Update an existing action
  const handleUpdateAction = (actionId: string, updates: Partial<RuleAction>) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.map(action => 
        action.id === actionId ? { ...action, ...updates } : action
      )
    });
  };
  
  // Remove an action from the rule
  const handleRemoveAction = (actionId: string) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.filter(action => action.id !== actionId)
    });
    
    if (activeActionId === actionId) {
      setActiveActionId(null);
    }
  };
  
  // Add a field to the "requireAdditionalInfo" action
  const handleAddField = (actionId: string) => {
    const newField: ActionField = {
      id: generateId(),
      name: `field_${Date.now()}`,
      label: "New Field",
      fieldType: "text",
      required: false
    };
    
    setNewRule({
      ...newRule,
      actions: newRule.actions.map(action => {
        if (action.id === actionId) {
          return {
            ...action,
            fields: action.fields ? [...action.fields, newField] : [newField]
          };
        }
        return action;
      })
    });
  };
  
  // Update a field in the "requireAdditionalInfo" action
  const handleUpdateField = (actionId: string, fieldId: string, updates: Partial<ActionField>) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.map(action => {
        if (action.id === actionId && action.fields) {
          return {
            ...action,
            fields: action.fields.map(field => 
              field.id === fieldId ? { ...field, ...updates } : field
            )
          };
        }
        return action;
      })
    });
  };
  
  // Remove a field from the "requireAdditionalInfo" action
  const handleRemoveField = (actionId: string, fieldId: string) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.map(action => {
        if (action.id === actionId && action.fields) {
          return {
            ...action,
            fields: action.fields.filter(field => field.id !== fieldId)
          };
        }
        return action;
      })
    });
  };
  
  // Handle creating or updating a rule
  const handleAddRule = () => {
    setIsEditing(false);
    setCurrentRuleId(null);
    setNewRule(createEmptyRule());
    setActiveActionId(null);
    setDialogOpen(true);
  };
  
  // Handle opening the edit dialog for a rule
  const handleEditRule = (rule: Rule) => {
    setIsEditing(true);
    setCurrentRuleId(rule.id);
    setNewRule({ ...rule });
    setActiveActionId(rule.actions.length > 0 ? rule.actions[0].id : null);
    setDialogOpen(true);
  };
  
  // Handle toggling rule expansion in the list view
  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };
  
  // Delete a rule
  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success("Rule deleted successfully");
  };
  
  // Save a rule
  const handleSaveRule = () => {
    if (isEditing && currentRuleId) {
      setRules(rules.map(rule => 
        rule.id === currentRuleId ? { ...newRule } : rule
      ));
      toast.success(`Rule "${newRule.name}" updated successfully`);
    } else {
      setRules([...rules, newRule]);
      toast.success(`Rule "${newRule.name}" added successfully`);
    }
    setDialogOpen(false);
  };
  
  const handleUpdateRule = (updates: Partial<Rule>) => {
    setNewRule({ ...newRule, ...updates });
  };
  
  const handleSetActiveActionId = (id: string | null) => {
    setActiveActionId(id === activeActionId ? null : id);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rules Engine</h1>
        <Button onClick={handleAddRule}>
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
          Add Rule
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Validation Rules</CardTitle>
          <CardDescription>
            Define custom rules to validate and process expenses based on countries and conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RuleList 
            rules={rules}
            expandedRules={expandedRules}
            onToggleRuleExpansion={toggleRuleExpansion}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
          />
        </CardContent>
      </Card>
      
      {/* Rule Editor Dialog */}
      <RuleEditor 
        rule={newRule}
        isOpen={dialogOpen}
        isEditing={isEditing}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveRule}
        onUpdateRule={handleUpdateRule}
        onAddCondition={handleAddCondition}
        onAddGroup={handleAddGroup}
        onUpdateCondition={handleUpdateCondition}
        onUpdateGroup={handleUpdateGroup}
        onRemoveCondition={handleRemoveCondition}
        onAddAction={handleAddAction}
        onUpdateAction={handleUpdateAction}
        onRemoveAction={handleRemoveAction}
        onAddField={handleAddField}
        onUpdateField={handleUpdateField}
        onRemoveField={handleRemoveField}
        activeActionId={activeActionId}
        onSetActiveActionId={handleSetActiveActionId}
      />
    </div>
  );
};

export default RuleBuilder;
