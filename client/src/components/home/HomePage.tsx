import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Package, TrendingUp, Clock, Shield, Phone, Mail, MapPin } from "lucide-react";

interface HomePageProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const HomePage = ({ userRole }: HomePageProps) => {
  const quickActions = [
    {
      title: "Process Sale",
      description: "Quick access to point of sale system",
      icon: TrendingUp,
      action: "sales",
      roles: ['admin', 'pharmacist', 'staff']
    },
    {
      title: "View Inventory",
      description: "Check current drug stock levels",
      icon: Package,
      action: "inventory",
      roles: ['admin', 'pharmacist', 'staff']
    },
    {
      title: "Submit Request",
      description: "Request drugs from pharmacy",
      icon: Clock,
      action: "requests",
      roles: ['staff']
    },
    {
      title: "Manage Users",
      description: "Add and manage system users",
      icon: Users,
      action: "users",
      roles: ['admin']
    },
    {
      title: "View Reports",
      description: "Access analytics and reports",
      icon: TrendingUp,
      action: "reports",
      roles: ['admin', 'pharmacist']
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Shield,
      action: "settings",
      roles: ['admin']
    }
  ];

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );

  const announcements = [
    {
      title: "System Maintenance Scheduled",
      message: "Routine maintenance will be performed on Sunday, 2:00 AM - 4:00 AM",
      type: "info",
      date: "2024-01-20"
    },
    {
      title: "New Supplier Added",
      message: "Global Health Supplies has been added to our supplier network",
      type: "success", 
      date: "2024-01-18"
    },
    {
      title: "Stock Alert",
      message: "Several medications are running low. Check inventory for details.",
      type: "warning",
      date: "2024-01-15"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Heart className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to WAUU Clinic
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Drug Management System - Providing efficient healthcare solutions for 
          West African Union University Medical Center
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card key={action.action} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Drugs in System</span>
              <span className="font-semibold">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Active Users</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sales This Month</span>
              <span className="font-semibold">$28,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Low Stock Items</span>
              <span className="font-semibold text-amber-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pending Requests</span>
              <span className="font-semibold text-blue-600">5</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="border-l-4 border-primary/20 pl-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {announcement.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* About & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About WAUU Clinic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              West African Union University Medical Center is committed to providing 
              exceptional healthcare services to our university community and the 
              surrounding areas. Our state-of-the-art drug management system ensures 
              efficient inventory control, accurate dispensing, and comprehensive 
              patient care.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Our Mission</h4>
              <p className="text-sm text-muted-foreground">
                To deliver quality healthcare through innovative technology, 
                efficient medication management, and compassionate patient care.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  University of Ghana Campus, Legon<br />
                  Greater Accra Region, Ghana
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+233 123 456 789</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">info@wauu.edu</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Emergency Hours:</strong> 24/7<br />
                <strong>Pharmacy Hours:</strong> 8:00 AM - 6:00 PM (Mon-Fri)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t">
        <p className="text-muted-foreground">
          WAUU Clinic Drug Management System © 2024. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomePage;