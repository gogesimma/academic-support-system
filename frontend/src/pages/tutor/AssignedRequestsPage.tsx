import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { toast } from 'sonner';
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { Link } from 'react-router';
import type { Request } from '../../types/main';

export const AssignedRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await mockApi.get(`/requests/tutor/${user.id}`);

      if ((response as any).success) {
        setRequests((response as any).data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartWork = async (requestId: string) => {
    try {
      await mockApi.patch(`/requests/${requestId}/status`, { status: 'in-progress' });
      toast.success('Request marked as in progress');
      loadRequests();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleCompleteWork = async (requestId: string) => {
    try {
      await mockApi.patch(`/requests/${requestId}/status`, { status: 'completed' });
      toast.success('Request marked as completed');
      loadRequests();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: any; label: string }> = {
      assigned: { className: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Assigned' },
      'in-progress': { className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'In Progress' },
      completed: { className: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
    };

    const config = variants[status] || variants.assigned;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Assigned Requests</h2>
          <p className="text-slate-600 mt-1">Requests assigned to you by administrators</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Assigned Requests</h3>
              <p className="text-slate-600">You don't have any assigned requests at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full">{request.serviceType}</span>
                        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{request.module}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">{request.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-500">Student</p>
                      <p className="font-medium">{request.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Assigned</p>
                      <p className="font-medium">
                        {request.assignedAt ? formatDate(request.assignedAt) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {request.attachments && request.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">Student Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {request.attachments.map((file, index) => (
                          <div key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    {request.status === 'assigned' && (
                      <>
                        <Button
                          onClick={() => handleStartWork(request.id)}
                          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Start Work
                        </Button>
                        <Link to="/dashboard/upload-work">
                          <Button variant="outline" className="border-cyan-300 text-cyan-600 hover:bg-cyan-50">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Work
                          </Button>
                        </Link>
                      </>
                    )}
                    {request.status === 'in-progress' && (
                      <>
                        <Button
                          onClick={() => handleCompleteWork(request.id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Completed
                        </Button>
                        <Link to="/dashboard/upload-work">
                          <Button variant="outline" className="border-cyan-300 text-cyan-600 hover:bg-cyan-50">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Work
                          </Button>
                        </Link>
                      </>
                    )}
                    {request.status === 'completed' && request.completedAt && (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Completed on {formatDate(request.completedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};