
// Type definitions for our rule system
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

// Available condition types
export const conditionTypes = [
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
export const operatorsByType = {
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
export const actionTypes = [
  { value: "requireApproval", label: "Require Approval" },
  { value: "requireDocument", label: "Require Document" },
  { value: "flagForReview", label: "Flag for Review" },
  { value: "showMessage", label: "Show Message" },
  { value: "requireAdditionalInfo", label: "Require Additional Info" },
  { value: "preventSubmission", label: "Prevent Submission" },
  { value: "autoApprove", label: "Auto Approve" }
];

// Form field types for the "requireAdditionalInfo" action
export const formFieldTypes = [
  { value: "text", label: "Text Field" },
  { value: "number", label: "Number Field" },
  { value: "date", label: "Date Field" },
  { value: "select", label: "Dropdown Select" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "attachment", label: "File Attachment" }
];

// Mock countries for our dropdown
export const countries = [
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

// Mock data with our new structure
export const mockRules: Rule[] = [
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

// Utility to generate unique IDs
export const generateId = () => `id-${Math.random().toString(36).substring(2, 9)}`;
