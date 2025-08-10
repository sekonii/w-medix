import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Users, 
  Settings, 
  PlusCircle,
  BarChart3,
  Bell,
  Search,
  ChevronLeft,
  Stethoscope
} from "lucide-react";

interface SidebarProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ userRole, currentPage, onPageChange, isCollapsed, onToggle }: SidebarProps) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'inventory', label: 'Drug Inventory', icon: Package },
      { id: 'sales', label: 'Point of Sale', icon: ShoppingCart },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'procurement', label: 'Procurement', icon: FileText },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ],
      pharmacist: [
        { id: 'procurement', label: 'Procurement', icon: FileText },
        { id: 'requests', label: 'Staff Requests', icon: Bell },
        { id: 'add-drug', label: 'Add New Drug', icon: PlusCircle },
      ],
      staff: [
        { id: 'requests', label: 'My Requests', icon: Bell },
        { id: 'search', label: 'Drug Search', icon: Search },
      ]
    };

    return [...baseItems, ...roleSpecificItems[userRole]];
  };

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-medical-blue rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-foreground">WAUU Clinic</h2>
              <p className="text-xs text-muted-foreground">Drug Management</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto h-8 w-8 p-0"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 h-10",
                  isCollapsed && "justify-center px-2",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Role Badge */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-secondary/50 rounded-lg p-2 text-center">
            <p className="text-xs font-medium text-secondary-foreground capitalize">
              {userRole} Access
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;