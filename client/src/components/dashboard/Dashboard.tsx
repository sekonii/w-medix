import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { useQuery } from "@tanstack/react-query";
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText,
  Calendar
} from "lucide-react";

interface DashboardProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const Dashboard = ({ userRole }: DashboardProps) => {
  // Fetch real dashboard stats from API
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(res => res.json())
  });

  const stats = {
    admin: [
      { title: "Total Drugs", value: statsData?.totalDrugs?.toString() || "0", icon: Package, variant: "primary" as const },
      { title: "Total Sales", value: statsData?.totalSales?.toString() || "0", icon: ShoppingCart, variant: "success" as const },
      { title: "Low Stock Items", value: statsData?.lowStockCount?.toString() || "0", icon: AlertTriangle, variant: "warning" as const },
      { title: "Total Revenue", value: `₦${statsData?.totalRevenue?.toFixed(2) || "0.00"}`, icon: DollarSign, variant: "default" as const },
    ],
    pharmacist: [
      { title: "Inventory Items", value: statsData?.totalDrugs?.toString() || "0", icon: Package, variant: "primary" as const },
      { title: "Pending Requests", value: statsData?.pendingRequests?.toString() || "0", icon: FileText, variant: "warning" as const },
      { title: "Low Stock Alerts", value: statsData?.lowStockCount?.toString() || "0", icon: AlertTriangle, variant: "warning" as const },
      { title: "Total Revenue", value: `₦${statsData?.totalRevenue?.toFixed(2) || "0.00"}`, icon: TrendingUp, variant: "success" as const },
    ],
    staff: [
      { title: "Available Drugs", value: statsData?.totalDrugs?.toString() || "0", icon: Package, variant: "primary" as const },
      { title: "Total Sales", value: statsData?.totalSales?.toString() || "0", icon: ShoppingCart, variant: "success" as const },
      { title: "Pending Requests", value: statsData?.pendingRequests?.toString() || "0", icon: FileText, variant: "warning" as const },
      { title: "Low Stock Items", value: statsData?.lowStockCount?.toString() || "0", icon: AlertTriangle, variant: "warning" as const },
    ]
  };

  const recentActivities = [
    { action: "New drug added", item: "Paracetamol 500mg", time: "2 hours ago", type: "add" },
    { action: "Stock updated", item: "Amoxicillin 250mg", time: "4 hours ago", type: "update" },
    { action: "Sale completed", item: "Ibuprofen 400mg", time: "6 hours ago", type: "sale" },
    { action: "Low stock alert", item: "Aspirin 75mg", time: "8 hours ago", type: "alert" },
  ];

  const lowStockItems = [
    { name: "Aspirin 75mg", current: 15, minimum: 50, category: "Pain Relief" },
    { name: "Insulin 100IU", current: 8, minimum: 25, category: "Diabetes" },
    { name: "Ventolin Inhaler", current: 12, minimum: 30, category: "Respiratory" },
    { name: "Paracetamol 500mg", current: 22, minimum: 100, category: "Pain Relief" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {userRole === 'admin' ? 'Administrator' : userRole === 'pharmacist' ? 'Pharmacist' : 'Staff Member'}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your drug management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats[userRole].map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
            trend={{ value: Math.floor(Math.random() * 20), isPositive: Math.random() > 0.5 }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'add' ? 'bg-medical-green' :
                    activity.type === 'update' ? 'bg-primary' :
                    activity.type === 'sale' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="p-3 border border-warning/20 rounded-lg bg-warning/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <span className="text-xs font-medium text-warning">
                      {item.current} / {item.minimum}
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full transition-all" 
                      style={{ width: `${(item.current / item.minimum) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === 'admin' && (
              <>
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <Package className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-sm">Add New Drug</p>
                </div>
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-sm">Manage Users</p>
                </div>
              </>
            )}
            {(userRole === 'admin' || userRole === 'pharmacist') && (
              <>
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-sm">Generate Report</p>
                </div>
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <ShoppingCart className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-sm">New Sale</p>
                </div>
              </>
            )}
            {userRole === 'staff' && (
              <>
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <ShoppingCart className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-sm">Point of Sale</p>
                </div>
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-sm">Request Drugs</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;