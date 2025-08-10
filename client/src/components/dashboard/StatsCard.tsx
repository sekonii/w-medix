import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          card: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
          icon: 'bg-primary text-primary-foreground',
          value: 'text-primary'
        };
      case 'success':
        return {
          card: 'bg-gradient-to-br from-medical-green/10 to-medical-green/5 border-medical-green/20',
          icon: 'bg-medical-green text-white',
          value: 'text-medical-green'
        };
      case 'warning':
        return {
          card: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
          icon: 'bg-warning text-white',
          value: 'text-warning'
        };
      default:
        return {
          card: 'bg-card border-border',
          icon: 'bg-muted text-muted-foreground',
          value: 'text-foreground'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow", styles.card)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold", styles.value)}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-medical-green" : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            styles.icon
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;