import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Shield, Activity, Users, Package, BarChart3 } from "lucide-react";

interface HomeProps {
  onNavigateToLogin: () => void;
}

const Home = ({ onNavigateToLogin }: HomeProps) => {
  const features = [
    {
      icon: Package,
      title: "Drug Inventory Management",
      description: "Complete drug inventory tracking with expiry dates, stock levels, and automated alerts."
    },
    {
      icon: Activity,
      title: "Point of Sale System",
      description: "Fast and efficient sales processing with receipt generation and payment tracking."
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Comprehensive reporting on sales, inventory, and financial performance."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Role-based access control for administrators, pharmacists, and staff members."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Built with pharmacy regulations in mind, ensuring data security and compliance."
    },
    {
      icon: Stethoscope,
      title: "Clinical Integration",
      description: "Seamless integration with clinical workflows and prescription management."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-medical-blue rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">W-Medix Pharmacy</h1>
              <p className="text-sm text-muted-foreground">Management System</p>
            </div>
          </div>
          <Button onClick={onNavigateToLogin} className="bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground">
              Comprehensive Pharmacy
              <span className="text-primary block">Management System</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your pharmacy operations with our integrated drug management, 
              inventory tracking, and point-of-sale system designed for healthcare excellence.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onNavigateToLogin}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Manage Your Pharmacy
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive solution covers all aspects of pharmacy management, 
            from inventory control to sales reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-background/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Ready to Transform Your Pharmacy Operations?
            </h3>
            <p className="text-lg text-muted-foreground">
              Join healthcare professionals who trust our system for their daily operations.
            </p>
            <Button 
              size="lg" 
              onClick={onNavigateToLogin}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Access System
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 W-Medix Pharmacy Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;