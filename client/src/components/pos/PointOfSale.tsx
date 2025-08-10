import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface PointOfSaleProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const mockDrugs = [
  { id: '1', name: 'Paracetamol 500mg', price: 2.50, stock: 150 },
  { id: '2', name: 'Amoxicillin 250mg', price: 15.00, stock: 75 },
  { id: '3', name: 'Ibuprofen 400mg', price: 3.25, stock: 200 },
];

const PointOfSale = ({ userRole }: PointOfSaleProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance'>('cash');
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredDrugs = mockDrugs.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (drug: typeof mockDrugs[0]) => {
    const existingItem = cart.find(item => item.id === drug.id);
    if (existingItem) {
      if (existingItem.quantity < drug.stock) {
        setCart(cart.map(item =>
          item.id === drug.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Insufficient Stock",
          description: `Only ${drug.stock} units available`,
          variant: "destructive"
        });
      }
    } else {
      setCart([...cart, { ...drug, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const processSale = () => {
    if (!patientName.trim()) {
      toast({
        title: "Patient Required",
        description: "Please enter patient name",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart",
        variant: "destructive"
      });
      return;
    }

    // Process sale logic here
    toast({
      title: "Sale Processed",
      description: `Sale of $${total.toFixed(2)} completed successfully`,
    });

    // Clear form
    setCart([]);
    setPatientName("");
    setPatientContact("");
    setPaymentMethod('cash');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Point of Sale</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drug Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Drug Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Search Drugs</Label>
              <Input
                id="search"
                placeholder="Search by drug name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrugs.map((drug) => (
                    <TableRow key={drug.id}>
                      <TableCell>{drug.name}</TableCell>
                      <TableCell>${drug.price.toFixed(2)}</TableCell>
                      <TableCell>{drug.stock}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => addToCart(drug)}
                          disabled={drug.stock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Cart & Checkout */}
        <Card>
          <CardHeader>
            <CardTitle>Cart & Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <Label htmlFor="patientContact">Patient Contact</Label>
                <Input
                  id="patientContact"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  placeholder="Phone or email (optional)"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Cart is empty</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Payment */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button 
                onClick={processSale} 
                className="w-full" 
                size="lg"
                disabled={cart.length === 0 || !patientName.trim()}
              >
                Process Sale
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PointOfSale;