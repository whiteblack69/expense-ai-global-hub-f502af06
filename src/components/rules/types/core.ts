
// Core type definitions for our rule system
export type Operator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "doesNotContain" | "startsWith" | "endsWith" | "between" | "in" | "notIn";
export type LogicalOperator = "AND" | "OR";
export type ConditionType = "amount" | "date" | "keyword" | "country" | "category" | "merchant" | "alcoholMention" | "custom";
export type ActionType = "requireApproval" | "requireDocument" | "flagForReview" | "showMessage" | "requireAdditionalInfo" | "preventSubmission" | "autoApprove";
export type InputFieldType = "text" | "number" | "date" | "select" | "multiselect" | "checkbox" | "attachment";

export interface SimpleCondition {
  id: string;
  type: ConditionType;
  field: string;
  operator: Operator;
  value: string | string[];
  valueSecondary?: string; // For range conditions like "between"
  isNested?: false;
}

export interface GroupCondition {
  id: string;
  isNested: true;
  logicalOperator: LogicalOperator;
  conditions: (SimpleCondition | GroupCondition)[];
}

export interface ActionField {
  id: string;
  name: string;
  label: string;
  fieldType: InputFieldType;
  required: boolean;
  options?: string[]; // For select and multiselect fields
}

export interface RuleAction {
  id: string;
  type: ActionType;
  message?: string;
  fields?: ActionField[];
  documentTypes?: string[];
  approvalRoles?: string[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  countries: string[]; // Which countries this rule applies to
  rootCondition: GroupCondition;
  actions: RuleAction[];
  isActive: boolean;
}

// Utility to generate unique IDs
export const generateId = () => `id-${Math.random().toString(36).substring(2, 9)}`;
