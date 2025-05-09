
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="bg-primary text-primary-foreground p-2 rounded-lg text-xl font-bold">AI</span>
          <h1 className="text-3xl font-bold">ExpenseAI</h1>
        </div>
        <p className="text-muted-foreground">Global AI-Driven Expense Management System</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Index;
