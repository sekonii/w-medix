import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { FileText, Download, TrendingUp, DollarSign, Package, Users } from "lucide-react";
import { useState } from "react";

interface ReportsProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const salesData = [
  { month: 'Jan', sales: 15000, transactions: 120 },
  { month: 'Feb', sales: 18000, transactions: 145 },
  { month: 'Mar', sales: 22000, transactions: 160 },
  { month: 'Apr', sales: 19000, transactions: 155 },
  { month: 'May', sales: 25000, transactions: 180 },
  { month: 'Jun', sales: 28000, transactions: 200 },
];

const categoryData = [
  { name: 'Antibiotics', value: 35, color: '#3b82f6' },
  { name: 'Pain Relief', value: 25, color: '#10b981' },
  { name: 'Vitamins', value: 20, color: '#f59e0b' },
  { name: 'Supplements', value: 15, color: '#ef4444' },
  { name: 'Others', value: 5, color: '#8b5cf6' },
];

const topDrugs = [
  { name: 'Paracetamol 500mg', sales: 1250, revenue: 3125 },
  { name: 'Amoxicillin 250mg', sales: 890, revenue: 13350 },
  { name: 'Ibuprofen 400mg', sales: 750, revenue: 2437.50 },
  { name: 'Vitamin C 1000mg', sales: 680, revenue: 3400 },
  { name: 'Multivitamin', sales: 520, revenue: 2080 },
];

const Reports = ({ userRole }: ReportsProps) => {
  const [dateRange, setDateRange] = useState("last_month");
  const [reportType, setReportType] = useState("sales");

  const canViewFinancials = userRole === 'admin' || userRole === 'pharmacist';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        </div>
        
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_quarter">Last Quarter</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {canViewFinancials && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$28,450</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,456</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">+6% from last month</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        {canViewFinancials && (
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Sales ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Drug Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Drugs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Drugs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Units Sold</TableHead>
                  {canViewFinancials && <TableHead>Revenue</TableHead>}
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDrugs.map((drug, index) => (
                  <TableRow key={drug.name}>
                    <TableCell className="font-medium">{drug.name}</TableCell>
                    <TableCell>{drug.sales}</TableCell>
                    {canViewFinancials && (
                      <TableCell>${drug.revenue.toFixed(2)}</TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +{Math.floor(Math.random() * 20) + 5}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;