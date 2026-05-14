import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockApi } from '../../services/mockApi';
import { FileText, Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router';
import type { Request } from '../../types/main';

export const ViewAllRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.get('/requests');
      if ((response as any).success) {
        setRequests((response as any).data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = `${request.title} ${request.studentName} ${request.serviceType} ${request.module}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      assigned: { className: 'bg-blue-100 text-blue-800', label: 'Assigned' },
      'in-progress': { className: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      completed: { className: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { className: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">All Requests</h2>
            <p className="text-slate-600 mt-1">View and manage all student requests</p>
          </div>
          <Link to="/dashboard/assign-tutor">
            <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Tutor
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                All Requests ({filteredRequests.length})
              </CardTitle>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>No requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{request.title}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded">{request.serviceType}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{request.module}</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">{request.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span>Student: {request.studentName}</span>
                          {request.tutorName && <span>Tutor: {request.tutorName}</span>}
                          <span>Submitted: {formatDate(request.createdAt)}</span>
                          {request.assignedAt && <span>Assigned: {formatDate(request.assignedAt)}</span>}
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <Link to="/dashboard/assign-tutor">
                          <Button size="sm" className="bg-gradient-to-r from-orange-600 to-yellow-600">
                            Assign Tutor
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};