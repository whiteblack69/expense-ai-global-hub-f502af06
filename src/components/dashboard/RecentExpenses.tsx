
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type ExpenseType = {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected" | "review";
  currency: string;
};

const mockExpenses: ExpenseType[] = [
  {
    id: "exp-001",
    merchant: "Starbucks",
    date: "2023-05-01",
    amount: 4.95,
    category: "Meals",
    status: "approved",
    currency: "USD"
  },
  {
    id: "exp-002",
    merchant: "Uber",
    date: "2023-05-03",
    amount: 24.50,
    category: "Transportation",
    status: "pending",
    currency: "USD"
  },
  {
    id: "exp-003",
    merchant: "Hotel Novotel",
    date: "2023-05-05",
    amount: 195.00,
    category: "Accommodation",
    status: "review",
    currency: "EUR"
  },
  {
    id: "exp-004",
    merchant: "Office Supplies Inc",
    date: "2023-05-06",
    amount: 45.20,
    category: "Office Supplies",
    status: "rejected",
    currency: "USD"
  },
  {
    id: "exp-005",
    merchant: "Digital Conference",
    date: "2023-05-08",
    amount: 299.99,
    category: "Conferences",
    status: "pending",
    currency: "USD"
  }
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

const getStatusBadge = (status: ExpenseType["status"]) => {
  const statusClasses = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
    review: "status-review"
  };

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    review: "In Review"
  };

  return <span className={statusClasses[status]}>{statusLabels[status]}</span>;
};

const RecentExpenses = ({ userRole }: { userRole: string }) => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  
  useEffect(() => {
    // Simulate loading expenses
    setTimeout(() => {
      setExpenses(mockExpenses);
    }, 500);
  }, []);
  
  const title = userRole === "approver" ? "Pending Approvals" : "Recent Expenses";

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {userRole === "approver" 
            ? "Expenses requiring your approval" 
            : "Your recently submitted expenses"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-xs font-medium text-muted-foreground text-left pb-3">Merchant</th>
                <th className="text-xs font-medium text-muted-foreground text-left pb-3">Date</th>
                <th className="text-xs font-medium text-muted-foreground text-left pb-3">Category</th>
                <th className="text-xs font-medium text-muted-foreground text-left pb-3">Amount</th>
                <th className="text-xs font-medium text-muted-foreground text-left pb-3">Status</th>
                <th className="text-xs font-medium text-muted-foreground text-left pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-muted/50">
                  <td className="py-3 text-sm font-medium">{expense.merchant}</td>
                  <td className="py-3 text-sm">{formatDate(expense.date)}</td>
                  <td className="py-3 text-sm">{expense.category}</td>
                  <td className="py-3 text-sm">{formatCurrency(expense.amount, expense.currency)}</td>
                  <td className="py-3 text-sm">{getStatusBadge(expense.status)}</td>
                  <td className="py-3">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
