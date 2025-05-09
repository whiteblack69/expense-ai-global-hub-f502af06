
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Globe, LogOut, Settings, User } from "lucide-react";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail") || "user@example.com";
    setUserRole(storedRole || "employee");
    setUserEmail(storedEmail);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };
  
  const handleNotifications = () => {
    navigate("/notifications");
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "employee": return "Employee";
      case "approver": return "Approver";
      case "admin": return "Finance Admin";
      default: return "User";
    }
  };

  return (
    <header className="bg-white border-b border-border shadow-sm py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">ExpenseAI</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative" 
            onClick={handleNotifications}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userEmail}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {getRoleDisplay(userRole)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
