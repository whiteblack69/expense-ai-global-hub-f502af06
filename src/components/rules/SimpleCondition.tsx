
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { 
  SimpleCondition as SimpleConditionType,
  ConditionType, 
  Operator, 
  conditionTypes, 
  operatorsByType 
} from "./types";

interface SimpleConditionProps {
  condition: SimpleConditionType;
  onUpdate: (conditionId: string, updates: Partial<SimpleConditionType>) => void;
  onRemove: (conditionId: string) => void;
}

const SimpleCondition = ({ condition, onUpdate, onRemove }: SimpleConditionProps) => {
  const conditionType = conditionTypes.find(ct => ct.value === condition.type);
  const operators = operatorsByType[condition.type as keyof typeof operatorsByType] || [];
  const selectedOperator = operators.find(op => op.value === condition.operator);

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
      <div className="flex-1 grid grid-cols-4 gap-2">
        <Select 
          value={condition.type}
          onValueChange={(value) => onUpdate(condition.id, { 
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
          onValueChange={(value) => onUpdate(condition.id, { 
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
              onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
            />
            <Input
              placeholder="Max Value"
              value={condition.valueSecondary || ''}
              onChange={(e) => onUpdate(condition.id, { valueSecondary: e.target.value })}
            />
          </>
        ) : (
          <Input
            className="col-span-2"
            placeholder="Value"
            value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
            onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
          />
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onRemove(condition.id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SimpleCondition;
