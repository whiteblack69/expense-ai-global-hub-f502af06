
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Filter,
  Flag,
  Trash,
  Save,
  Edit,
  Plus,
  Link,
  Unlink,
  Brackets,
  MessageSquare,
  CircleCheck,
  FilePlus,
  Calendar,
  Search,
  Percent,
  Equal,
  EqualNot,
  GreaterThan,
  LessThan,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

// Type definitions for our rule system
type Operator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "doesNotContain" | "startsWith" | "endsWith" | "between" | "in" | "notIn";
type LogicalOperator = "AND" | "OR";
type ConditionType = "amount" | "date" | "keyword" | "country" | "category" | "merchant" | "alcoholMention" | "custom";
type ActionType = "requireApproval" | "requireDocument" | "flagForReview" | "showMessage" | "requireAdditionalInfo" | "preventSubmission" | "autoApprove";
type InputFieldType = "text" | "number" | "date" | "select" | "multiselect" | "checkbox" | "attachment";

interface SimpleCondition {
  id: string;
  type: ConditionType;
  field: string;
  operator: Operator;
  value: string | string[];
  valueSecondary?: string; // For range conditions like "between"
  isNested?: false;
}

interface GroupCondition {
  id: string;
  isNested: true;
  logicalOperator: LogicalOperator;
  conditions: (SimpleCondition | GroupCondition)[];
}

interface ActionField {
  id: string;
  name: string;
  label: string;
  fieldType: InputFieldType;
  required: boolean;
  options?: string[]; // For select and multiselect fields
}

interface RuleAction {
  id: string;
  type: ActionType;
  message?: string;
  fields?: ActionField[];
  documentTypes?: string[];
  approvalRoles?: string[];
}

interface Rule {
  id: string;
  name: string;
  description: string;
  countries: string[]; // Which countries this rule applies to
  rootCondition: GroupCondition;
  actions: RuleAction[];
  isActive: boolean;
}

// Mock data with our new structure
const mockRules: Rule[] = [
  {
    id: "1",
    name: "International Travel Approval",
    description: "Requires manager approval for international travel expenses",
    countries: ["All"],
    rootCondition: {
      id: "root-1",
      isNested: true,
      logicalOperator: "AND",
      conditions: [
        {
          id: "c1",
          type: "country",
          field: "country",
          operator: "!=",
          value: "United States",
          isNested: false
        },
        {
          id: "c2",
          type: "amount",
          field: "amount",
          operator: ">",
          value: "500",
          isNested: false
        }
      ]
    },
    actions: [
      {
        id: "a1",
        type: "requireApproval",
        approvalRoles: ["manager"],
        message: "High value international expense requires manager approval"
      }
    ],
    isActive: true
  },
  {
    id: "2",
    name: "Receipt Required",
    description: "Require receipt upload for expenses over $75",
    countries: ["United States", "Canada", "Mexico"],
    rootCondition: {
      id: "root-2",
      isNested: true,
      logicalOperator: "AND",
      conditions: [
        {
          id: "c3",
          type: "amount",
          field: "amount",
          operator: ">",
          value: "75",
          isNested: false
        }
      ]
    },
    actions: [
      {
        id: "a2",
        type: "requireDocument",
        documentTypes: ["receipt"],
        message: "Please upload a receipt for expenses over $75"
      }
    ],
    isActive: true
  },
  {
    id: "3",
    name: "Alcohol Expense Policy",
    description: "Special handling for expenses containing alcohol",
    countries: ["United Kingdom", "France", "Germany"],
    rootCondition: {
      id: "root-3",
      isNested: true,
      logicalOperator: "OR",
      conditions: [
        {
          id: "c4",
          type: "alcoholMention",
          field: "description",
          operator: "contains",
          value: "true",
          isNested: false
        },
        {
          id: "c5-group",
          isNested: true,
          logicalOperator: "AND",
          conditions: [
            {
              id: "c5-1",
              type: "category",
              field: "category",
              operator: "=",
              value: "Meals",
              isNested: false
            },
            {
              id: "c5-2",
              type: "keyword",
              field: "description",
              operator: "contains",
              value: "bar",
              isNested: false
            }
          ]
        }
      ]
    },
    actions: [
      {
        id: "a3",
        type: "requireAdditionalInfo",
        message: "Please provide details about the business purpose for expenses containing alcohol",
        fields: [
          {
            id: "f1",
            name: "businessPurpose",
            label: "Business Purpose",
            fieldType: "text",
            required: true
          },
          {
            id: "f2",
            name: "attendees",
            label: "Attendees",
            fieldType: "text",
            required: true
          }
        ]
      }
    ],
    isActive: true
  }
];

// Available condition types
const conditionTypes = [
  { value: "amount", label: "Amount" },
  { value: "date", label: "Date" },
  { value: "keyword", label: "Keyword" },
  { value: "country", label: "Country" },
  { value: "category", label: "Category" },
  { value: "merchant", label: "Merchant" },
  { value: "alcoholMention", label: "Alcohol Mention" },
  { value: "custom", label: "Custom Field" }
];

// Available operators based on condition type
const operatorsByType = {
  amount: [
    { value: "=", label: "Equals" },
    { value: "!=", label: "Not Equals" },
    { value: ">", label: "Greater Than" },
    { value: "<", label: "Less Than" },
    { value: ">=", label: "Greater Than or Equal" },
    { value: "<=", label: "Less Than or Equal" },
    { value: "between", label: "Between" }
  ],
  date: [
    { value: "=", label: "On Date" },
    { value: "!=", label: "Not On Date" },
    { value: ">", label: "After" },
    { value: "<", label: "Before" },
    { value: "between", label: "Between" }
  ],
  keyword: [
    { value: "contains", label: "Contains" },
    { value: "doesNotContain", label: "Does Not Contain" },
    { value: "startsWith", label: "Starts With" },
    { value: "endsWith", label: "Ends With" }
  ],
  country: [
    { value: "=", label: "Is" },
    { value: "!=", label: "Is Not" },
    { value: "in", label: "In List" },
    { value: "notIn", label: "Not In List" }
  ],
  category: [
    { value: "=", label: "Is" },
    { value: "!=", label: "Is Not" },
    { value: "in", label: "In List" },
    { value: "notIn", label: "Not In List" }
  ],
  merchant: [
    { value: "=", label: "Is" },
    { value: "!=", label: "Is Not" },
    { value: "contains", label: "Contains" },
    { value: "doesNotContain", label: "Does Not Contain" }
  ],
  alcoholMention: [
    { value: "=", label: "Is Detected" }
  ],
  custom: [
    { value: "=", label: "Equals" },
    { value: "!=", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "doesNotContain", label: "Does Not Contain" }
  ]
};

// Available action types
const actionTypes = [
  { value: "requireApproval", label: "Require Approval" },
  { value: "requireDocument", label: "Require Document" },
  { value: "flagForReview", label: "Flag for Review" },
  { value: "showMessage", label: "Show Message" },
  { value: "requireAdditionalInfo", label: "Require Additional Info" },
  { value: "preventSubmission", label: "Prevent Submission" },
  { value: "autoApprove", label: "Auto Approve" }
];

// Form field types for the "requireAdditionalInfo" action
const formFieldTypes = [
  { value: "text", label: "Text Field" },
  { value: "number", label: "Number Field" },
  { value: "date", label: "Date Field" },
  { value: "select", label: "Dropdown Select" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "attachment", label: "File Attachment" }
];

// Mock countries for our dropdown
const countries = [
  { value: "All", label: "All Countries" },
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "Mexico", label: "Mexico" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "France", label: "France" },
  { value: "Germany", label: "Germany" },
  { value: "Japan", label: "Japan" },
  { value: "China", label: "China" },
  { value: "Australia", label: "Australia" }
];

// Utility to generate unique IDs
const generateId = () => `id-${Math.random().toString(36).substring(2, 9)}`;

const RuleBuilder = () => {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRuleId, setCurrentRuleId] = useState<string | null>(null);
  
  // Create a default empty rule for new rule creation
  const createEmptyRule = (): Rule => ({
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
  
  const [newRule, setNewRule] = useState<Rule>(createEmptyRule());
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  
  // Add or edit a simple condition within a group
  const handleAddCondition = (groupId: string, condition?: SimpleCondition) => {
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
          cond.isNested ? addToGroup(cond) : cond
        )
      };
    };
    
    setNewRule({
      ...newRule,
      rootCondition: addToGroup(newRule.rootCondition)
    });
  };
  
  // Add a new nested condition group
  const handleAddGroup = (parentGroupId: string, logicalOp: LogicalOperator) => {
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
          cond.isNested ? addToGroup(cond) : cond
        )
      };
    };
    
    setNewRule({
      ...newRule,
      rootCondition: addToGroup(newRule.rootCondition)
    });
  };

  // Update a simple condition
  const handleUpdateCondition = (conditionId: string, updates: Partial<SimpleCondition>) => {
    const updateInGroup = (group: GroupCondition): GroupCondition => {
      return {
        ...group,
        conditions: group.conditions.map(cond => {
          if (!cond.isNested && cond.id === conditionId) {
            return { ...cond, ...updates };
          }
          if (cond.isNested) {
            return updateInGroup(cond);
          }
          return cond;
        })
      };
    };
    
    setNewRule({
      ...newRule,
      rootCondition: updateInGroup(newRule.rootCondition)
    });
  };
  
  // Update a group's logical operator (AND/OR)
  const handleUpdateGroup = (groupId: string, updates: Partial<GroupCondition>) => {
    const updateGroups = (group: GroupCondition): GroupCondition => {
      if (group.id === groupId) {
        return { ...group, ...updates };
      }
      
      return {
        ...group,
        conditions: group.conditions.map(cond => 
          cond.isNested ? updateGroups(cond) : cond
        )
      };
    };
    
    setNewRule({
      ...newRule,
      rootCondition: updateGroups(newRule.rootCondition)
    });
  };
  
  // Remove a condition or group from the rule
  const handleRemoveCondition = (id: string) => {
    const removeFromGroup = (group: GroupCondition): GroupCondition => {
      return {
        ...group,
        conditions: group.conditions
          .filter(cond => cond.id !== id)
          .map(cond => cond.isNested ? removeFromGroup(cond) : cond)
      };
    };
    
    setNewRule({
      ...newRule,
      rootCondition: removeFromGroup(newRule.rootCondition)
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
  
  // Render a simple condition
  const renderSimpleCondition = (condition: SimpleCondition, parentId: string) => {
    const conditionType = conditionTypes.find(ct => ct.value === condition.type);
    const operators = operatorsByType[condition.type as keyof typeof operatorsByType] || [];
    const selectedOperator = operators.find(op => op.value === condition.operator);
    
    return (
      <div key={condition.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
        <div className="flex-1 grid grid-cols-4 gap-2">
          <Select 
            value={condition.type}
            onValueChange={(value) => handleUpdateCondition(condition.id, { 
              type: value as ConditionType,
              operator: operatorsByType[value as keyof typeof operatorsByType][0].value as Operator
            })}
          >
            <SelectTrigger>
              <SelectValue>{conditionType?.label || "Select type"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {conditionTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={condition.operator}
            onValueChange={(value) => handleUpdateCondition(condition.id, { 
              operator: value as Operator
            })}
          >
            <SelectTrigger>
              <SelectValue>{selectedOperator?.label || "Select operator"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {operators.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {condition.operator === 'between' ? (
            <>
              <Input
                placeholder="Min Value"
                value={Array.isArray(condition.value) ? condition.value[0] : condition.value}
                onChange={(e) => handleUpdateCondition(condition.id, { value: e.target.value })}
              />
              <Input
                placeholder="Max Value"
                value={condition.valueSecondary || ''}
                onChange={(e) => handleUpdateCondition(condition.id, { valueSecondary: e.target.value })}
              />
            </>
          ) : (
            <Input
              className="col-span-2"
              placeholder="Value"
              value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
              onChange={(e) => handleUpdateCondition(condition.id, { value: e.target.value })}
            />
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleRemoveCondition(condition.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Recursively render a condition group
  const renderConditionGroup = (group: GroupCondition, level = 0) => {
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
                onValueChange={(value) => handleUpdateGroup(group.id, { 
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
              onClick={() => handleRemoveCondition(group.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {group.conditions.length > 0 ? (
          <div className="space-y-2">
            {group.conditions.map((condition, index) => (
              <div key={condition.id}>
                {condition.isNested ? 
                  renderConditionGroup(condition, level + 1) : 
                  renderSimpleCondition(condition, group.id)
                }
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
            onClick={() => handleAddCondition(group.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Condition
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddGroup(group.id, "AND")}
          >
            <Brackets className="h-4 w-4 mr-1" />
            Add Group
          </Button>
        </div>
      </div>
    );
  };
  
  // Render an action with its configuration
  const renderAction = (action: RuleAction) => {
    const actionType = actionTypes.find(at => at.value === action.type);
    
    return (
      <div key={action.id} className="border rounded-md mb-4">
        <div 
          className={`flex justify-between items-center p-3 cursor-pointer ${activeActionId === action.id ? 'bg-muted' : ''}`}
          onClick={() => setActiveActionId(activeActionId === action.id ? null : action.id)}
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
                handleRemoveAction(action.id);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
            {activeActionId === action.id ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </div>
        </div>
        
        {activeActionId === action.id && (
          <div className="p-3 border-t">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Action Type
                </label>
                <Select
                  value={action.type}
                  onValueChange={(value) => handleUpdateAction(action.id, { 
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
                  onChange={(e) => handleUpdateAction(action.id, { 
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
                      <div key={field.id} className="border p-3 rounded-md">
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-2">
                            <label className="text-sm font-medium">Label</label>
                            <Input
                              value={field.label}
                              onChange={(e) => handleUpdateField(action.id, field.id, { label: e.target.value })}
                              className="col-span-2"
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 items-center gap-2">
                            <label className="text-sm font-medium">Field Name</label>
                            <Input
                              value={field.name}
                              onChange={(e) => handleUpdateField(action.id, field.id, { name: e.target.value })}
                              className="col-span-2"
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 items-center gap-2">
                            <label className="text-sm font-medium">Field Type</label>
                            <Select
                              value={field.fieldType}
                              onValueChange={(value) => handleUpdateField(action.id, field.id, { 
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
                              onCheckedChange={(checked) => handleUpdateField(action.id, field.id, { 
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
                              onClick={() => handleRemoveField(action.id, field.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => handleAddField(action.id)}
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
  
  // Format conditions as readable text for display in the table
  const formatCondition = (condition: SimpleCondition | GroupCondition): string => {
    if (condition.isNested) {
      const childConditions = condition.conditions.map(formatCondition);
      return `(${childConditions.join(` ${condition.logicalOperator} `)})`;
    } else {
      const operatorLabel = operatorsByType[condition.type]?.find(op => op.value === condition.operator)?.label || condition.operator;
      const fieldLabel = conditionTypes.find(ct => ct.value === condition.type)?.label || condition.field;
      
      if (condition.operator === 'between') {
        return `${fieldLabel} ${operatorLabel} ${condition.value} and ${condition.valueSecondary}`;
      }
      
      return `${fieldLabel} ${operatorLabel} ${Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}`;
    }
  };
  
  // Format actions as readable text for display in the table
  const formatActions = (actions: RuleAction[]): string => {
    return actions.map(action => {
      const actionLabel = actionTypes.find(at => at.value === action.type)?.label || action.type;
      return actionLabel;
    }).join(", ");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rules Engine</h1>
        <Button onClick={handleAddRule}>
          <Plus className="h-4 w-4 mr-2" />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Rule Name</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <React.Fragment key={rule.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleRuleExpansion(rule.id)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {expandedRules[rule.id] ? 
                          <ChevronDown className="h-4 w-4 mr-2" /> : 
                          <ChevronUp className="h-4 w-4 mr-2" />
                        }
                        {rule.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {rule.countries.includes("All") ? 
                        "All Countries" : 
                        rule.countries.length > 2 ? 
                          `${rule.countries.slice(0, 2).join(", ")} +${rule.countries.length - 2}` : 
                          rule.countries.join(", ")
                      }
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px] truncate">
                        {formatCondition(rule.rootCondition)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions.map(action => (
                          <Badge key={action.id} variant="outline">
                            {actionTypes.find(at => at.value === action.type)?.label}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.isActive ? "default" : "outline"}>
                        {rule.isActive ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRule(rule);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRule(rule.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRules[rule.id] && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-4 bg-muted/30">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{rule.description || "No description provided"}</p>
                            
                            <h4 className="text-sm font-medium mt-4 mb-2">Countries</h4>
                            <div className="flex flex-wrap gap-1">
                              {rule.countries.map(country => (
                                <Badge key={country} variant="outline">{country}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Actions</h4>
                            <div className="space-y-3">
                              {rule.actions.map(action => {
                                const actionType = actionTypes.find(at => at.value === action.type);
                                return (
                                  <div key={action.id} className="border rounded p-2 bg-background">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge>{actionType?.label}</Badge>
                                    </div>
                                    {action.message && (
                                      <p className="text-sm text-muted-foreground">{action.message}</p>
                                    )}
                                    {action.type === "requireAdditionalInfo" && action.fields && (
                                      <div className="mt-2">
                                        <p className="text-sm font-medium">Required Fields:</p>
                                        <ul className="text-sm text-muted-foreground list-disc ml-4">
                                          {action.fields.map(field => (
                                            <li key={field.id}>{field.label} ({field.fieldType})</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Rule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
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
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
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
                  value={newRule.countries.includes("All") ? "All" : "specific"}
                  onValueChange={(value) => {
                    if (value === "All") {
                      setNewRule({...newRule, countries: ["All"]});
                    } else {
                      setNewRule({...newRule, countries: newRule.countries.filter(c => c !== "All")});
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
                
                {!newRule.countries.includes("All") && (
                  <div className="mt-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          Select Countries ({newRule.countries.length} selected)
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
                                  checked={newRule.countries.includes(country.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewRule({
                                        ...newRule,
                                        countries: [...newRule.countries, country.value]
                                      });
                                    } else {
                                      setNewRule({
                                        ...newRule,
                                        countries: newRule.countries.filter(c => c !== country.value)
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
                    
                    {newRule.countries.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {newRule.countries.map(country => (
                          <Badge key={country} variant="secondary" className="flex items-center gap-1">
                            {country}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => setNewRule({
                                ...newRule,
                                countries: newRule.countries.filter(c => c !== country)
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
                {renderConditionGroup(newRule.rootCondition)}
              </div>
            </div>
            
            <div className="border-t border-border my-2"></div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right text-sm font-medium pt-2 flex items-center justify-end gap-2">
                <Flag className="h-4 w-4" />
                <span>Actions</span>
              </div>
              <div className="col-span-3">
                {newRule.actions.length > 0 ? (
                  <div className="space-y-2">
                    {newRule.actions.map(renderAction)}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground p-4 border border-dashed border-muted-foreground/30 rounded-md">
                    No actions defined yet. Add an action using the button below.
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={handleAddAction}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="isActive" className="text-right text-sm font-medium">
                Status
              </label>
              <Select
                value={newRule.isActive ? "active" : "disabled"}
                onValueChange={(value) => setNewRule({...newRule, isActive: value === "active"})}
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
              onClick={handleSaveRule} 
              disabled={!newRule.name || newRule.actions.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RuleBuilder;

