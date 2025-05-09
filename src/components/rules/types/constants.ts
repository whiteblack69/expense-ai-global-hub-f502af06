
import { ConditionType, Operator } from './core';

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
