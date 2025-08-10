import { useState } from "react";
import Home from "./Home";
import LoginForm from "@/components/auth/LoginForm";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Dashboard from "@/components/dashboard/Dashboard";
import DrugInventory from "@/components/inventory/DrugInventory";
import HomePage from "@/components/home/HomePage";
import PointOfSale from "@/components/pos/PointOfSale";
import Reports from "@/components/reports/Reports";
import UserManagement from "@/components/users/UserManagement";
import Procurement from "@/components/procurement/Procurement";
import RequestManagement from "@/components/requests/RequestManagement";
import Settings from "@/components/settings/Settings";
import AddDrug from "@/components/drug-management/AddDrug";
import DrugSearch from "@/components/drug-management/DrugSearch";

interface User {
  name: string;
  role: 'admin' | 'pharmacist' | 'staff';
  initials: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "login" | "dashboard">("home");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      setCurrentView("dashboard");
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error - you might want to show a toast or error message
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView("home");
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'home':
      case 'dashboard':
        return <Dashboard userRole={user.role} />;
      case 'inventory':
        return <DrugInventory userRole={user.role} />;
      case 'sales':
        return <PointOfSale userRole={user.role} />;
      case 'reports':
        return <Reports userRole={user.role} />;
      case 'users':
        return <UserManagement userRole={user.role} />;
      case 'procurement':
        return <Procurement userRole={user.role} />;
      case 'requests':
        return <RequestManagement userRole={user.role} />;
      case 'settings':
        return <Settings userRole={user.role} />;
      case 'add-drug':
        return <AddDrug userRole={user.role} />;
      case 'search':
        return <DrugSearch userRole={user.role} />;
      default:
        return <Dashboard userRole={user.role} />;
    }
  };

  if (currentView === "home") {
    return <Home onNavigateToLogin={() => setCurrentView("login")} />;
  }

  if (currentView === "login" || !isAuthenticated || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user.role}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onLogout={handleLogout}
          notifications={Math.floor(Math.random() * 10)}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;