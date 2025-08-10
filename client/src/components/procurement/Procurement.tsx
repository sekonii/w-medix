import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Eye, CheckCircle, XCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcurementOrder {
  id: string;
  supplier: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  requestedBy: string;
  requestedDate: string;
  approvedDate?: string;
  receivedDate?: string;
  items: OrderItem[];
}

interface OrderItem {
  drugName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ProcurementProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const mockOrders: ProcurementOrder[] = [
  {
    id: 'PO-001',
    supplier: 'MedSupply Ghana Ltd',
    totalAmount: 12500.00,
    status: 'pending',
    requestedBy: 'Sarah PharmD',
    requestedDate: '2024-01-15',
    items: [
      { drugName: 'Paracetamol 500mg', quantity: 1000, unitPrice: 2.50, totalPrice: 2500 },
      { drugName: 'Amoxicillin 250mg', quantity: 500, unitPrice: 15.00, totalPrice: 7500 },
      { drugName: 'Ibuprofen 400mg', quantity: 750, unitPrice: 3.25, totalPrice: 2437.50 },
    ]
  },
  {
    id: 'PO-002',
    supplier: 'West Africa Pharmaceuticals',
    totalAmount: 8750.00,
    status: 'approved',
    requestedBy: 'Dr. John Admin',
    requestedDate: '2024-01-12',
    approvedDate: '2024-01-13',
    items: [
      { drugName: 'Vitamin C 1000mg', quantity: 500, unitPrice: 5.00, totalPrice: 2500 },
      { drugName: 'Multivitamin Complex', quantity: 300, unitPrice: 8.00, totalPrice: 2400 },
      { drugName: 'Iron Tablets', quantity: 400, unitPrice: 3.50, totalPrice: 1400 },
    ]
  },
];

const suppliers = [
  'MedSupply Ghana Ltd',
  'West Africa Pharmaceuticals',
  'Global Health Supplies',
  'African Medical Distributors',
];

const Procurement = ({ userRole }: ProcurementProps) => {
  const [orders, setOrders] = useState<ProcurementOrder[]>(mockOrders);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<ProcurementOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const canCreateOrders = userRole === 'admin' || userRole === 'pharmacist';
  const canApproveOrders = userRole === 'admin';

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrder = (orderData: Partial<ProcurementOrder>) => {
    const newOrder: ProcurementOrder = {
      id: `PO-${String(orders.length + 1).padStart(3, '0')}`,
      supplier: orderData.supplier || '',
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      requestedBy: 'Current User', // Would be actual user
      requestedDate: new Date().toISOString().split('T')[0],
      items: orderData.items || [],
    };

    setOrders([newOrder, ...orders]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Purchase Order Created",
      description: `Order ${newOrder.id} has been submitted for approval.`,
    });
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] }
        : order
    ));
    
    toast({
      title: "Order Approved",
      description: "Purchase order has been approved successfully.",
    });
  };

  const handleReceiveOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'received', receivedDate: new Date().toISOString().split('T')[0] }
        : order
    ));
    
    toast({
      title: "Order Received",
      description: "Order has been marked as received and inventory updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Procurement Management</h1>
        </div>
        
        {canCreateOrders && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
              </DialogHeader>
              <OrderForm onSubmit={handleCreateOrder} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Purchase Orders</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.requestedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canApproveOrders && order.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveOrder(order.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {canCreateOrders && order.status === 'approved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReceiveOrder(order.id)}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details - {viewingOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewingOrder && <OrderDetails order={viewingOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OrderForm = ({ onSubmit }: { onSubmit: (data: Partial<ProcurementOrder>) => void }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    items: [{ drugName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }] as OrderItem[],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { drugName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    });
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, totalAmount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="supplier">Supplier</Label>
        <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
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
        <div className="flex justify-between items-center mb-2">
          <Label>Order Items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-end">
              <div>
                <Input
                  placeholder="Drug name"
                  value={item.drugName}
                  onChange={(e) => updateItem(index, 'drugName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Unit price"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Input
                  value={`$${item.totalPrice.toFixed(2)}`}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                disabled={formData.items.length === 1}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total Amount:</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>

      <Button type="submit" className="w-full">
        Create Purchase Order
      </Button>
    </form>
  );
};

const OrderDetails = ({ order }: { order: ProcurementOrder }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold">Order Information</h4>
        <p>Order ID: {order.id}</p>
        <p>Supplier: {order.supplier}</p>
        <p>Status: <Badge className={`ml-2`}>{order.status}</Badge></p>
      </div>
      <div>
        <h4 className="font-semibold">Dates</h4>
        <p>Requested: {order.requestedDate}</p>
        {order.approvedDate && <p>Approved: {order.approvedDate}</p>}
        {order.receivedDate && <p>Received: {order.receivedDate}</p>}
      </div>
    </div>

    <div>
      <h4 className="font-semibold mb-2">Order Items</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Drug Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.drugName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
      <span>Total Amount:</span>
      <span>${order.totalAmount.toFixed(2)}</span>
    </div>
  </div>
);

export default Procurement;