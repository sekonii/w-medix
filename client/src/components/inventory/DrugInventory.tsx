import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Plus, Package, AlertTriangle, Calendar, Edit, Trash2 } from "lucide-react";

interface Drug {
  id: string;
  name: string;
  category: string;
  supplier: string;
  stockLevel: number;
  reorderPoint: number;
  unitPrice: number;
  expiryDate: string;
  batchNumber: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

interface DrugInventoryProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const DrugInventory = ({ userRole }: DrugInventoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data
  const drugs: Drug[] = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      supplier: "PharmaCorp Ltd",
      stockLevel: 250,
      reorderPoint: 100,
      unitPrice: 0.25,
      expiryDate: "2025-12-30",
      batchNumber: "PC2024001",
      status: "in-stock"
    },
    {
      id: "2", 
      name: "Amoxicillin 250mg",
      category: "Antibiotics",
      supplier: "MediSupply Co",
      stockLevel: 15,
      reorderPoint: 50,
      unitPrice: 1.50,
      expiryDate: "2025-06-15",
      batchNumber: "AM2024007",
      status: "low-stock"
    },
    {
      id: "3",
      name: "Insulin 100IU",
      category: "Diabetes",
      supplier: "DiabetesSource",
      stockLevel: 0,
      reorderPoint: 25,
      unitPrice: 12.00,
      expiryDate: "2024-08-20",
      batchNumber: "IN2024003",
      status: "out-of-stock"
    },
    {
      id: "4",
      name: "Aspirin 75mg",
      category: "Cardiovascular",
      supplier: "HeartMeds Inc",
      stockLevel: 8,
      reorderPoint: 30,
      unitPrice: 0.18,
      expiryDate: "2024-03-10",
      batchNumber: "AS2023012",
      status: "expired"
    },
    {
      id: "5",
      name: "Ventolin Inhaler",
      category: "Respiratory",
      supplier: "RespireCare",
      stockLevel: 45,
      reorderPoint: 20,
      unitPrice: 8.50,
      expiryDate: "2026-01-25",
      batchNumber: "VE2024015",
      status: "in-stock"
    }
  ];

  const categories = ["all", "Pain Relief", "Antibiotics", "Diabetes", "Cardiovascular", "Respiratory"];

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || drug.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Drug['status']) => {
    switch (status) {
      case 'in-stock': return 'bg-medical-green';
      case 'low-stock': return 'bg-warning';
      case 'out-of-stock': return 'bg-destructive';
      case 'expired': return 'bg-destructive/80';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: Drug['status']) => {
    switch (status) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Drug Inventory</h1>
          <p className="text-muted-foreground">Manage your pharmaceutical inventory</p>
        </div>
        {(userRole === 'admin' || userRole === 'pharmacist') && (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Drug
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Drugs</p>
                <p className="text-xl font-bold">{drugs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-xl font-bold">{drugs.filter(d => d.status === 'low-stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-xl font-bold">{drugs.filter(d => d.status === 'out-of-stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-xl font-bold">{drugs.filter(d => d.status === 'expired').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search drugs, categories, or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            Showing {filteredDrugs.length} of {drugs.length} drugs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  {(userRole === 'admin' || userRole === 'pharmacist') && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrugs.map((drug) => (
                  <TableRow key={drug.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{drug.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Batch: {drug.batchNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{drug.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{drug.stockLevel}</span>
                        {drug.stockLevel <= drug.reorderPoint && (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${drug.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{drug.expiryDate}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(drug.status)} text-white`}>
                        {getStatusText(drug.status)}
                      </Badge>
                    </TableCell>
                    {(userRole === 'admin' || userRole === 'pharmacist') && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrugInventory;