import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddDrugProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const drugCategories = [
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
  'MedSupply Ghana Ltd',
  'West Africa Pharmaceuticals',
  'Global Health Supplies',
  'African Medical Distributors',
  'Local Pharmacy Wholesale'
];

const AddDrug = ({ userRole }: AddDrugProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    unitPrice: '',
    stockQuantity: '',
    reorderLevel: '',
    expiryDate: null as Date | null,
    supplier: '',
    batchNumber: '',
    dosage: '',
    unit: 'tablets',
    manufacturer: '',
    notes: ''
  });

  const { toast } = useToast();

  const canAddDrugs = userRole === 'admin' || userRole === 'pharmacist';

  if (!canAddDrugs) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">Only administrators and pharmacists can add new drugs.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.category || !formData.unitPrice || !formData.stockQuantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send data to your backend
    console.log('Drug data:', formData);
    
    toast({
      title: "Drug Added Successfully",
      description: `${formData.name} has been added to the inventory.`,
    });

    // Reset form
    setFormData({
      name: '',
      category: '',
      description: '',
      unitPrice: '',
      stockQuantity: '',
      reorderLevel: '',
      expiryDate: null,
      supplier: '',
      batchNumber: '',
      dosage: '',
      unit: 'tablets',
      manufacturer: '',
      notes: ''
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plus className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Add New Drug</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Drug Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Paracetamol 500mg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {drugCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dosage">Dosage/Strength</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="e.g., 500mg, 10ml"
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit Type</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="vials">Vials</SelectItem>
                    <SelectItem value="tubes">Tubes</SelectItem>
                    <SelectItem value="sachets">Sachets</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="Manufacturer name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Drug description, uses, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="unitPrice">Unit Price *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stockQuantity">Initial Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                  placeholder="Minimum stock level"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => handleInputChange('expiryDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={formData.supplier} onValueChange={(value) => handleInputChange('supplier', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                  placeholder="Batch/Lot number"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => {
            setFormData({
              name: '',
              category: '',
              description: '',
              unitPrice: '',
              stockQuantity: '',
              reorderLevel: '',
              expiryDate: null,
              supplier: '',
              batchNumber: '',
              dosage: '',
              unit: 'tablets',
              manufacturer: '',
              notes: ''
            });
          }}>
            Clear Form
          </Button>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Add Drug to Inventory
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDrug;