
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRuleState } from "./hooks/useRuleState";
import RuleList from "./RuleList";
import RuleEditor from "./RuleEditor";
import { Plus } from "lucide-react";

const RuleBuilder = () => {
  const {
    rules,
    dialogOpen,
    setDialogOpen,
    isEditing,
    newRule,
    expandedRules,
    activeActionId,
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
  } = useRuleState();
  
  const onDeleteRuleWithToast = (ruleId: string) => {
    handleDeleteRule(ruleId);
    toast.success("Rule deleted successfully");
  };
  
  const onSaveRuleWithToast = () => {
    handleSaveRule();
    toast.success(`Rule "${newRule.name}" ${isEditing ? "updated" : "added"} successfully`);
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
          <RuleList 
            rules={rules}
            expandedRules={expandedRules}
            onToggleRuleExpansion={toggleRuleExpansion}
            onEditRule={handleEditRule}
            onDeleteRule={onDeleteRuleWithToast}
          />
        </CardContent>
      </Card>
      
      {/* Rule Editor Dialog */}
      <RuleEditor 
        rule={newRule}
        isOpen={dialogOpen}
        isEditing={isEditing}
        onClose={() => setDialogOpen(false)}
        onSave={onSaveRuleWithToast}
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
