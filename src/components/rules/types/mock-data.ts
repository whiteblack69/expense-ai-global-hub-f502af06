
import { Rule } from './core';
import { generateId } from './core';

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
