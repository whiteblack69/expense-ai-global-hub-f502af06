
import { useState, useEffect } from "react";
import { Bell, FileText, Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type NotificationType = {
  id: string;
  type: "approval" | "rejection" | "request" | "system";
  title: string;
  message: string;
  expenseId?: string;
  date: string;
  read: boolean;
};

// Mock data
const mockNotifications: NotificationType[] = [
  {
    id: "1",
    type: "approval",
    title: "Expense Approved",
    message: "Your expense for Starbucks ($4.95) has been approved.",
    expenseId: "exp-001",
    date: "2023-05-08T14:30:00Z",
    read: false
  },
  {
    id: "2",
    type: "request",
    title: "Additional Information Required",
    message: "Please provide the business purpose for your dinner at Le Bistro ($125.30).",
    expenseId: "exp-006",
    date: "2023-05-07T10:15:00Z",
    read: false
  },
  {
    id: "3",
    type: "rejection",
    title: "Expense Rejected",
    message: "Your expense for Office Supplies Inc ($45.20) has been rejected. Reason: Missing receipt.",
    expenseId: "exp-004",
    date: "2023-05-06T16:45:00Z",
    read: true
  },
  {
    id: "4",
    type: "system",
    title: "New Expense Policy",
    message: "The company expense policy has been updated. Please review the changes.",
    date: "2023-05-05T09:00:00Z",
    read: true
  },
  {
    id: "5",
    type: "request",
    title: "Expense Needs Clarification",
    message: "Finance team has requested additional details for your international travel expenses.",
    expenseId: "exp-003",
    date: "2023-05-04T11:20:00Z",
    read: false
  }
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      
      // Update notification badge count in header
      // In a real app, this would be handled by a global state management system
      localStorage.setItem("notificationCount", mockNotifications.filter(n => !n.read).length.toString());
    }, 500);
  }, []);
  
  const filteredNotifications = activeTab === "all" 
    ? notifications
    : activeTab === "unread"
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marked as read");
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
    localStorage.setItem("notificationCount", "0");
  };
  
  const getNotificationIcon = (type: NotificationType["type"]) => {
    switch (type) {
      case "approval":
        return <Check className="h-5 w-5 text-green-500" />;
      case "rejection":
        return <X className="h-5 w-5 text-red-500" />;
      case "request":
        return <MessageSquare className="h-5 w-5 text-amber-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approval">Approvals</TabsTrigger>
          <TabsTrigger value="request">Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications to display.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={!notification.read ? "border-l-4 border-l-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {formatDate(notification.date)}
                          </CardDescription>
                        </div>
                      </div>
                      {!notification.read && (
                        <Badge variant="default" className="bg-primary text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{notification.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {notification.expenseId && (
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Expense
                      </Button>
                    )}
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsList;
