
import {
  SimpleCondition,
  GroupCondition,
  Rule
} from './types';

// Helper function to create a default empty rule
export const createEmptyRule = (): Rule => ({
  id: generateId(),
  name: "",
  description: "",
  countries: ["All"],
  rootCondition: {
    id: generateId(),
    isNested: true,
    logicalOperator: "AND",
    conditions: []
  },
  actions: [],
  isActive: true
});

// Utility to generate unique IDs
export const generateId = () => `id-${Math.random().toString(36).substring(2, 9)}`;

// Add a simple condition to a group
export const addCondition = (groupId: string, rootCondition: GroupCondition, condition?: SimpleCondition): GroupCondition => {
  const newCondition: SimpleCondition = condition || {
    id: generateId(),
    type: "amount",
    field: "amount",
    operator: ">",
    value: "",
    isNested: false
  };
  
  const addToGroup = (group: GroupCondition): GroupCondition => {
    if (group.id === groupId) {
      return {
        ...group,
        conditions: [...group.conditions, newCondition]
      };
    }
    
    return {
      ...group,
      conditions: group.conditions.map(cond => 
        (cond as any).isNested ? addToGroup(cond as GroupCondition) : cond
      )
    };
  };
  
  return addToGroup(rootCondition);
};

// Add a nested condition group
export const addGroup = (
  parentGroupId: string, 
  logicalOp: "AND" | "OR", 
  rootCondition: GroupCondition
): GroupCondition => {
  const newGroup: GroupCondition = {
    id: generateId(),
    isNested: true,
    logicalOperator: logicalOp,
    conditions: []
  };
  
  const addToGroup = (group: GroupCondition): GroupCondition => {
    if (group.id === parentGroupId) {
      return {
        ...group,
        conditions: [...group.conditions, newGroup]
      };
    }
    
    return {
      ...group,
      conditions: group.conditions.map(cond => 
        (cond as any).isNested ? addToGroup(cond as GroupCondition) : cond
      )
    };
  };
  
  return addToGroup(rootCondition);
};

// Update a simple condition
export const updateCondition = (
  conditionId: string, 
  updates: Partial<SimpleCondition>, 
  rootCondition: GroupCondition
): GroupCondition => {
  const updateInGroup = (group: GroupCondition): GroupCondition => {
    return {
      ...group,
      conditions: group.conditions.map(cond => {
        if (!(cond as any).isNested && cond.id === conditionId) {
          return { ...cond, ...updates };
        }
        if ((cond as any).isNested) {
          return updateInGroup(cond as GroupCondition);
        }
        return cond;
      })
    };
  };
  
  return updateInGroup(rootCondition);
};

// Update a group's logical operator (AND/OR)
export const updateGroup = (
  groupId: string, 
  updates: Partial<GroupCondition>, 
  rootCondition: GroupCondition
): GroupCondition => {
  const updateGroups = (group: GroupCondition): GroupCondition => {
    if (group.id === groupId) {
      return { ...group, ...updates };
    }
    
    return {
      ...group,
      conditions: group.conditions.map(cond => 
        (cond as any).isNested ? updateGroups(cond as GroupCondition) : cond
      )
    };
  };
  
  return updateGroups(rootCondition);
};

// Remove a condition or group from the rule
export const removeCondition = (id: string, rootCondition: GroupCondition): GroupCondition => {
  const removeFromGroup = (group: GroupCondition): GroupCondition => {
    return {
      ...group,
      conditions: group.conditions
        .filter(cond => cond.id !== id)
        .map(cond => (cond as any).isNested ? removeFromGroup(cond as GroupCondition) : cond)
    };
  };
  
  return removeFromGroup(rootCondition);
};
