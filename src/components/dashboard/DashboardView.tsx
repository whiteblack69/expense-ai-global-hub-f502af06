
import { useState, useEffect } from "react";
import { BarChart3, Download, FileText, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusCard from "./StatusCard";
import RecentExpenses from "./RecentExpenses";

const AdminDashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Finance Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Expenses"
          value="$24,638.55"
          description="Current month"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatusCard
          title="Pending Approval"
          value="14"
          description="Expenses awaiting review"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatusCard
          title="Flagged Items"
          value="3"
          description="Expenses with rule violations"
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
        />
        <StatusCard
          title="Receipt Missing"
          value="7"
          description="Expenses without receipts"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <div className="grid gap-4 grid-cols-1">
            <RecentExpenses userRole="admin" />
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reports</CardTitle>
              <CardDescription>Download monthly expense reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["January", "February", "March", "April"].map(month => (
                  <Card key={month}>
                    <CardContent className="pt-6 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">{month} 2023</p>
                        <p className="text-xs text-muted-foreground">Report</p>
                      </div>
                      <Download className="h-5 w-5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI Generated Insights</CardTitle>
              <CardDescription>Trends and patterns in expense data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Expense Anomalies</h3>
                  <p className="text-sm text-muted-foreground">
                    AI has detected a 30% increase in travel expenses in the Marketing department compared to previous quarter.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Tax Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Potential VAT recovery opportunity identified for $2,145 in international expenses from Q1.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Policy Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on current expense patterns, AI suggests updating meal allowances for international travel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ApproverDashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Approver Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          title="Pending Approval"
          value="8"
          description="Expenses awaiting your review"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatusCard
          title="Approved This Week"
          value="23"
          description="Expenses you've approved"
          icon={<FileText className="h-4 w-4 text-green-500" />}
        />
        <StatusCard
          title="Flagged by AI"
          value="2"
          description="Expenses with potential issues"
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <RecentExpenses userRole="approver" />
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Expenses Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          title="Pending Approval"
          value="3"
          description="Your expenses awaiting approval"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatusCard
          title="This Month"
          value="$754.50"
          description="Your expenses this month"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <StatusCard
          title="Needs Attention"
          value="1"
          description="Expenses needing clarification"
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <RecentExpenses userRole="employee" />
      </div>
    </div>
  );
};

const DashboardView = () => {
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "employee");
  }, []);
  
  return (
    <div>
      {userRole === "admin" && <AdminDashboard />}
      {userRole === "approver" && <ApproverDashboard />}
      {userRole === "employee" && <EmployeeDashboard />}
    </div>
  );
};

export default DashboardView;
