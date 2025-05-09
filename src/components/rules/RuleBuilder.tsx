
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Trash, Save, Edit } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockRules = [
  {
    id: "1",
    name: "International Travel Approval",
    description: "Requires manager approval for international travel expenses",
    conditions: [
      { field: "country", operator: "!=", value: "United States" },
      { field: "amount", operator: ">", value: "500" }
    ],
    action: "require_approval",
    actionDetails: { role: "manager", reason: "High value international expense" },
    isActive: true
  },
  {
    id: "2",
    name: "Receipt Required",
    description: "Require receipt upload for expenses over $75",
    conditions: [
      { field: "amount", operator: ">", value: "75" }
    ],
    action: "require_document",
    actionDetails: { documentType: "receipt", message: "Please upload a receipt for expenses over $75" },
    isActive: true
  },
  {
    id: "3",
    name: "Meal Expense Limit",
    description: "Flag meals over per diem limit",
    conditions: [
      { field: "category", operator: "=", value: "Meals" },
      { field: "amount", operator: ">", value: "100" }
    ],
    action: "flag_for_review",
    actionDetails: { message: "Meal expense exceeds company per diem" },
    isActive: false
  }
];

const RuleBuilder = () => {
  const [rules, setRules] = useState(mockRules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState<any>(null);
  const [newCondition, setNewCondition] = useState({ field: "", operator: "", value: "" });
  
  // Initial state for a new rule
  const emptyRule = {
    name: "",
    description: "",
    conditions: [],
    action: "",
    actionDetails: {},
    isActive: true
  };
  
  const [newRule, setNewRule] = useState<any>(emptyRule);
  
  const fields = [
    { value: "amount", label: "Amount" },
    { value: "category", label: "Category" },
    { value: "country", label: "Country" },
    { value: "date", label: "Date" },
    { value: "merchant", label: "Merchant" }
  ];
  
  const operators = [
    { value: "=", label: "Equals" },
    { value: "!=", label: "Not Equals" },
    { value: ">", label: "Greater Than" },
    { value: "<", label: "Less Than" },
    { value: "contains", label: "Contains" }
  ];
  
  const actions = [
    { value: "require_approval", label: "Require Approval" },
    { value: "require_document", label: "Require Document" },
    { value: "flag_for_review", label: "Flag for Review" },
    { value: "auto_reject", label: "Auto Reject" },
    { value: "auto_approve", label: "Auto Approve" }
  ];
  
  const handleAddRule = () => {
    setIsEditing(false);
    setNewRule(emptyRule);
    setDialogOpen(true);
  };
  
  const handleEditRule = (rule: any) => {
    setIsEditing(true);
    setCurrentRule(rule);
    setNewRule({ ...rule });
    setDialogOpen(true);
  };
  
  const handleDeleteRule = (ruleId: string) => {
    // In a real app, this would delete from the database
    toast.success("Rule deleted successfully");
  };
  
  const handleAddCondition = () => {
    if (newCondition.field && newCondition.operator && newCondition.value) {
      setNewRule({
        ...newRule,
        conditions: [...newRule.conditions, { ...newCondition }]
      });
      setNewCondition({ field: "", operator: "", value: "" });
    }
  };
  
  const handleRemoveCondition = (index: number) => {
    const updatedConditions = [...newRule.conditions];
    updatedConditions.splice(index, 1);
    setNewRule({ ...newRule, conditions: updatedConditions });
  };
  
  const handleSaveRule = () => {
    // In a real app, this would update the database
    if (isEditing) {
      toast.success(`Rule "${newRule.name}" updated successfully`);
    } else {
      toast.success(`Rule "${newRule.name}" added successfully`);
    }
    setDialogOpen(false);
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
            Define custom rules to validate and process expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {rule.conditions.map((condition, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {fields.find(f => f.value === condition.field)?.label || condition.field} 
                          {" "}
                          {operators.find(o => o.value === condition.operator)?.label || condition.operator} 
                          {" "}
                          <span className="font-medium text-foreground">{condition.value}</span>
                          {index < rule.conditions.length - 1 && (
                            <span className="px-1 font-semibold">AND</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>
                      {actions.find(a => a.value === rule.action)?.label || rule.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.isActive ? "default" : "outline"}>
                      {rule.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Rule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
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
              <Input
                id="description"
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                className="col-span-3"
                placeholder="Brief description of this rule"
              />
            </div>
            
            <div className="border-t border-border my-2"></div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right text-sm font-medium pt-2">
                Conditions
              </div>
              <div className="col-span-3 space-y-4">
                {newRule.conditions.length > 0 && (
                  <div className="space-y-2">
                    {newRule.conditions.map((condition: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <div className="flex-1">
                          <span className="text-sm">
                            {fields.find(f => f.value === condition.field)?.label || condition.field} 
                            {" "}
                            {operators.find(o => o.value === condition.operator)?.label || condition.operator} 
                            {" "}
                            <span className="font-medium">{condition.value}</span>
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveCondition(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {newRule.conditions.length > 1 && (
                      <div className="text-center text-sm font-medium text-muted-foreground">
                        All conditions must be met (AND)
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Select 
                      value={newCondition.field} 
                      onValueChange={(value) => setNewCondition({...newCondition, field: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Select 
                      value={newCondition.operator} 
                      onValueChange={(value) => setNewCondition({...newCondition, operator: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Input
                      value={newCondition.value}
                      onChange={(e) => setNewCondition({...newCondition, value: e.target.value})}
                      placeholder="Value"
                    />
                  </div>
                  
                  <Button variant="outline" onClick={handleAddCondition}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border my-2"></div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="action" className="text-right text-sm font-medium">
                Action
              </label>
              <Select
                value={newRule.action}
                onValueChange={(value) => setNewRule({...newRule, action: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select action to take" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" onClick={handleSaveRule} disabled={newRule.conditions.length === 0}>
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
