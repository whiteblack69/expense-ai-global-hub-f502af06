
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { Rule, GroupCondition, SimpleCondition, actionTypes, conditionTypes, operatorsByType } from './types';

interface RuleListProps {
  rules: Rule[];
  expandedRules: Record<string, boolean>;
  onToggleRuleExpansion: (ruleId: string) => void;
  onEditRule: (rule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
}

const RuleList = ({ 
  rules, 
  expandedRules, 
  onToggleRuleExpansion, 
  onEditRule, 
  onDeleteRule 
}: RuleListProps) => {
  
  // Format conditions as readable text for display in the table
  const formatCondition = (condition: SimpleCondition | GroupCondition): string => {
    if ('isNested' in condition && condition.isNested) {
      const childConditions = condition.conditions.map(cond => formatCondition(cond as (SimpleCondition | GroupCondition)));
      return `(${childConditions.join(` ${condition.logicalOperator} `)})`;
    } else {
      const simpleCondition = condition as SimpleCondition;
      const operatorLabel = operatorsByType[simpleCondition.type]?.find(op => op.value === simpleCondition.operator)?.label || simpleCondition.operator;
      const fieldLabel = conditionTypes.find(ct => ct.value === simpleCondition.type)?.label || simpleCondition.field;
      
      if (simpleCondition.operator === 'between') {
        return `${fieldLabel} ${operatorLabel} ${simpleCondition.value} and ${simpleCondition.valueSecondary}`;
      }
      
      return `${fieldLabel} ${operatorLabel} ${Array.isArray(simpleCondition.value) ? simpleCondition.value.join(', ') : simpleCondition.value}`;
    }
  };
  
  return (
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
            <TableRow className="cursor-pointer" onClick={() => onToggleRuleExpansion(rule.id)}>
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
                      onEditRule(rule);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRule(rule.id);
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
  );
};

export default RuleList;
