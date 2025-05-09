
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  Home, 
  Layers, 
  Settings, 
  Upload, 
  Users, 
  FolderTree, 
  Filter,
  MessageSquare,
  History,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState("employee");
  
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Menu items filtered by role
  const employeeItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Upload Receipt", href: "/upload", icon: Upload },
    { name: "My Expenses", href: "/expenses", icon: FileText },
    { name: "Notifications", href: "/notifications", icon: MessageSquare },
  ];
  
  const approverItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Pending Approvals", href: "/approvals", icon: Layers },
    { name: "History", href: "/history", icon: History },
    { name: "Notifications", href: "/notifications", icon: MessageSquare },
  ];
  
  const adminItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Categories", href: "/categories", icon: FolderTree },
    { name: "Rules Engine", href: "/rules", icon: Filter },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "User Management", href: "/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  
  let menuItems;
  switch (userRole) {
    case "employee":
      menuItems = employeeItems;
      break;
    case "approver":
      menuItems = approverItems;
      break;
    case "admin":
      menuItems = adminItems;
      break;
    default:
      menuItems = employeeItems;
  }

  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-primary text-primary-foreground p-1 rounded">
            AI
          </span>
          <span>ExpenseAI</span>
        </h2>
      </div>
      
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase">
          {userRole === "admin" ? "Admin" : userRole === "approver" ? "Approver" : "General"}
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn("sidebar-link", {
                "active": location.pathname === item.href,
              })}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
