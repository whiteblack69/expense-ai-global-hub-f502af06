import { useState } from "react";
import { 
  Rule, 
  SimpleCondition, 
  GroupCondition, 
  RuleAction, 
  ActionField,
  mockRules,
  generateId
} from '../types';
import {
  createEmptyRule,
  addCondition,
  addGroup,
  updateCondition,
  updateGroup,
  removeCondition
} from '../utils';

export const useRuleState = () => {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRuleId, setCurrentRuleId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<Rule>(createEmptyRule());
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  
  // Handler functions for rule management
  const handleAddCondition = (groupId: string, condition?: SimpleCondition) => {
    setNewRule({
      ...newRule,
      rootCondition: addCondition(groupId, newRule.rootCondition, condition)
    });
  };
  
  const handleAddGroup = (parentGroupId: string, logicalOp: "AND" | "OR") => {
    setNewRule({
      ...newRule,
      rootCondition: addGroup(parentGroupId, logicalOp, newRule.rootCondition)
    });
  };

  const handleUpdateCondition = (conditionId: string, updates: Partial<SimpleCondition>) => {
    setNewRule({
      ...newRule,
      rootCondition: updateCondition(conditionId, updates, newRule.rootCondition)
    });
  };
  
  const handleUpdateGroup = (groupId: string, updates: Partial<GroupCondition>) => {
    setNewRule({
      ...newRule,
      rootCondition: updateGroup(groupId, updates, newRule.rootCondition)
    });
  };
  
  const handleRemoveCondition = (id: string) => {
    setNewRule({
      ...newRule,
      rootCondition: removeCondition(id, newRule.rootCondition)
    });
  };
  
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
  
  const handleUpdateAction = (actionId: string, updates: Partial<RuleAction>) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.map(action => 
        action.id === actionId ? { ...action, ...updates } : action
      )
    });
  };
  
  const handleRemoveAction = (actionId: string) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions.filter(action => action.id !== actionId)
    });
    
    if (activeActionId === actionId) {
      setActiveActionId(null);
    }
  };
  
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
  
  const handleAddRule = () => {
    setIsEditing(false);
    setCurrentRuleId(null);
    setNewRule(createEmptyRule());
    setActiveActionId(null);
    setDialogOpen(true);
  };
  
  const handleEditRule = (rule: Rule) => {
    setIsEditing(true);
    setCurrentRuleId(rule.id);
    setNewRule({ ...rule });
    setActiveActionId(rule.actions.length > 0 ? rule.actions[0].id : null);
    setDialogOpen(true);
  };
  
  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };
  
  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };
  
  const handleSaveRule = () => {
    if (isEditing && currentRuleId) {
      setRules(rules.map(rule => 
        rule.id === currentRuleId ? { ...newRule } : rule
      ));
    } else {
      setRules([...rules, newRule]);
    }
    setDialogOpen(false);
  };
  
  const handleUpdateRule = (updates: Partial<Rule>) => {
    setNewRule({ ...newRule, ...updates });
  };
  
  const handleSetActiveActionId = (id: string | null) => {
    setActiveActionId(id === activeActionId ? null : id);
  };
  
  return {
    rules,
    dialogOpen,
    setDialogOpen,
    isEditing,
    currentRuleId,
    newRule,
    activeActionId,
    expandedRules,
    handleAddCondition,
    handleAddGroup,
    handleUpdateCondition,
    handleUpdateGroup,
    handleRemoveCondition,
    handleAddAction,
    handleUpdateAction,
    handleRemoveAction,
    handleAddField,
    handleUpdateField,
    handleRemoveField,
    handleAddRule,
    handleEditRule,
    toggleRuleExpansion,
    handleDeleteRule,
    handleSaveRule,
    handleUpdateRule,
    handleSetActiveActionId
  };
};
