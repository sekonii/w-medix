import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";

interface Drug {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  expiryDate: string;
  supplier: string;
  status: 'active' | 'inactive' | 'expired';
}

interface DrugSearchProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const mockDrugs: Drug[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    unitPrice: 2.50,
    stockQuantity: 150,
    reorderLevel: 20,
    expiryDate: '2025-06-15',
    supplier: 'MedSupply Ghana Ltd',
    status: 'active'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    unitPrice: 15.00,
    stockQuantity: 5,
    reorderLevel: 10,
    expiryDate: '2024-12-30',
    supplier: 'West Africa Pharmaceuticals',
    status: 'active'
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    category: 'Analgesics',
    unitPrice: 3.25,
    stockQuantity: 200,
    reorderLevel: 25,
    expiryDate: '2025-03-20',
    supplier: 'Global Health Supplies',
    status: 'active'
  },
  {
    id: '4',
    name: 'Vitamin C 1000mg',
    category: 'Vitamins & Supplements',
    unitPrice: 5.00,
    stockQuantity: 300,
    reorderLevel: 50,
    expiryDate: '2025-01-10',
    supplier: 'MedSupply Ghana Ltd',
    status: 'active'
  },
  {
    id: '5',
    name: 'Expired Cough Syrup',
    category: 'Respiratory',
    unitPrice: 8.50,
    stockQuantity: 0,
    reorderLevel: 15,
    expiryDate: '2023-12-01',
    supplier: 'Local Pharmacy Wholesale',
    status: 'expired'
  },
];

const categories = [
  'All Categories',
  'Analgesics',
  'Antibiotics',
  'Antihistamines',
  'Cardiovascular',
  'Dermatological',
  'Gastrointestinal',
  'Respiratory',
  'Vitamins & Supplements',
  'Other'
];

const suppliers = [
  'All Suppliers',
  'MedSupply Ghana Ltd',
  'West Africa Pharmaceuticals',
  'Global Health Supplies',
  'African Medical Distributors',
  'Local Pharmacy Wholesale'
];

const DrugSearch = ({ userRole }: DrugSearchProps) => {
  const [drugs] = useState<Drug[]>(mockDrugs);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const canEditDrugs = userRole === 'admin' || userRole === 'pharmacist';

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "All Categories" || drug.category === categoryFilter;
    const matchesSupplier = supplierFilter === "All Suppliers" || drug.supplier === supplierFilter;
    const matchesStatus = statusFilter === "all" || drug.status === statusFilter;
    
    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = drug.stockQuantity <= drug.reorderLevel;
    } else if (stockFilter === "out") {
      matchesStock = drug.stockQuantity === 0;
    } else if (stockFilter === "available") {
      matchesStock = drug.stockQuantity > 0;
    }

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus && matchesStock;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (drug: Drug) => {
    if (drug.stockQuantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (drug.stockQuantity <= drug.reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setSupplierFilter("All Suppliers");
    setStatusFilter("all");
    setStockFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Drug Search</h1>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Search & Filter Drugs</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Search */}
          <div>
            <Label htmlFor="search">Search Drugs</Label>
            <Input
              id="search"
              placeholder="Search by name, category, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stock">Stock Level</Label>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="available">In Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Filter Summary and Clear */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDrugs.length} of {drugs.length} drugs
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDrugs.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No drugs found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    {canEditDrugs && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrugs.map((drug) => {
                    const stockStatus = getStockStatus(drug);
                    return (
                      <TableRow key={drug.id}>
                        <TableCell className="font-medium">{drug.name}</TableCell>
                        <TableCell>{drug.category}</TableCell>
                        <TableCell>${drug.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>{drug.stockQuantity}</TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{drug.expiryDate}</TableCell>
                        <TableCell>{drug.supplier}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(drug.status)}>
                            {drug.status.charAt(0).toUpperCase() + drug.status.slice(1)}
                          </Badge>
                        </TableCell>
                        {canEditDrugs && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrugSearch;