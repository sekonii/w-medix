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
import { FileText, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrugRequest {
  id: string;
  drugName: string;
  quantityRequested: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  reason: string;
}

interface RequestManagementProps {
  userRole: 'admin' | 'pharmacist' | 'staff';
}

const mockRequests: DrugRequest[] = [
  {
    id: 'REQ-001',
    drugName: 'Paracetamol 500mg',
    quantityRequested: 20,
    priority: 'medium',
    status: 'pending',
    requestedBy: 'Mike Clinical',
    createdAt: '2024-01-15',
    reason: 'Patient needs pain relief medication'
  },
  {
    id: 'REQ-002',
    drugName: 'Amoxicillin 250mg',
    quantityRequested: 10,
    priority: 'high',
    status: 'approved',
    requestedBy: 'Jane Nurse',
    approvedBy: 'Sarah PharmD',
    createdAt: '2024-01-14',
    reason: 'Emergency antibiotic treatment'
  },
  {
    id: 'REQ-003',
    drugName: 'Vitamin C 1000mg',
    quantityRequested: 30,
    priority: 'low',
    status: 'fulfilled',
    requestedBy: 'Mike Clinical',
    approvedBy: 'Sarah PharmD',
    createdAt: '2024-01-13',
    reason: 'Routine vitamin supplementation'
  },
];

const availableDrugs = [
  { id: '1', name: 'Paracetamol 500mg', stock: 150 },
  { id: '2', name: 'Amoxicillin 250mg', stock: 75 },
  { id: '3', name: 'Ibuprofen 400mg', stock: 200 },
  { id: '4', name: 'Vitamin C 1000mg', stock: 300 },
  { id: '5', name: 'Multivitamin Complex', stock: 120 },
];

const RequestManagement = ({ userRole }: RequestManagementProps) => {
  const [requests, setRequests] = useState<DrugRequest[]>(mockRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const { toast } = useToast();

  const canCreateRequests = userRole === 'staff';
  const canApproveRequests = userRole === 'pharmacist' || userRole === 'admin';

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    // Staff can only see their own requests
    if (userRole === 'staff') {
      return matchesStatus && matchesPriority && request.requestedBy === 'Mike Clinical'; // Mock current user
    }
    
    return matchesStatus && matchesPriority;
  });

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRequest = (requestData: Partial<DrugRequest>) => {
    const newRequest: DrugRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
      drugName: requestData.drugName || '',
      quantityRequested: requestData.quantityRequested || 0,
      priority: requestData.priority || 'medium',
      status: 'pending',
      requestedBy: 'Mike Clinical', // Current user
      createdAt: new Date().toISOString().split('T')[0],
      reason: requestData.reason || '',
    };

    setRequests([newRequest, ...requests]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Request Submitted",
      description: `Request ${newRequest.id} has been submitted for approval.`,
    });
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: 'approved', approvedBy: 'Sarah PharmD' }
        : request
    ));
    
    toast({
      title: "Request Approved",
      description: "Request has been approved successfully.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: 'rejected', approvedBy: 'Sarah PharmD' }
        : request
    ));
    
    toast({
      title: "Request Rejected",
      description: "Request has been rejected.",
      variant: "destructive"
    });
  };

  const handleFulfillRequest = (requestId: string) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: 'fulfilled' }
        : request
    ));
    
    toast({
      title: "Request Fulfilled",
      description: "Request has been marked as fulfilled.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-3xl font-bold">
            {userRole === 'staff' ? 'My Requests' : 'Staff Requests'}
          </h1>
        </div>
        
        {canCreateRequests && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Drug Request</DialogTitle>
              </DialogHeader>
              <RequestForm onSubmit={handleCreateRequest} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div>
              <Label htmlFor="statusFilter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priorityFilter">Filter by Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Drug Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                {canApproveRequests && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.drugName}</TableCell>
                  <TableCell>{request.quantityRequested}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadgeColor(request.priority)}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{request.createdAt}</TableCell>
                  {canApproveRequests && (
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFulfillRequest(request.id)}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const RequestForm = ({ onSubmit }: { onSubmit: (data: Partial<DrugRequest>) => void }) => {
  const [formData, setFormData] = useState({
    drugName: '',
    quantityRequested: 1,
    priority: 'medium' as const,
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="drugName">Drug Name</Label>
        <Select value={formData.drugName} onValueChange={(value) => setFormData({ ...formData, drugName: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select drug" />
          </SelectTrigger>
          <SelectContent>
            {availableDrugs.map((drug) => (
              <SelectItem key={drug.id} value={drug.name}>
                {drug.name} (Stock: {drug.stock})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="quantityRequested">Quantity Requested</Label>
        <Input
          id="quantityRequested"
          type="number"
          min="1"
          value={formData.quantityRequested}
          onChange={(e) => setFormData({ ...formData, quantityRequested: parseInt(e.target.value) || 1 })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="reason">Reason for Request</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Explain why this drug is needed..."
          required
        />
      </div>
      
      <Button type="submit" className="w-full">
        Submit Request
      </Button>
    </form>
  );
};

export default RequestManagement;