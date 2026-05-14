import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { FileText, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Link } from 'react-router';
import type { Request } from '../../types/main';

export const MyRequestsPage: React.FC = () => {
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
      const response = await mockApi.get(`/requests/student/${user.id}`);

      if ((response as any).success) {
        setRequests((response as any).data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: any; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      assigned: { className: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Assigned' },
      'in-progress': { className: 'bg-purple-100 text-purple-800', icon: FileText, label: 'In Progress' },
      completed: { className: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      cancelled: { className: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' },
    };

    const config = variants[status] || variants.pending;
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Requests</h2>
            <p className="text-slate-600 mt-1">Track all your submitted requests</p>
          </div>
          <Link to="/dashboard/submit-request">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Requests Yet</h3>
              <p className="text-slate-600 mb-4">You haven't submitted any requests yet</p>
              <Link to="/dashboard/submit-request">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                  Submit Your First Request
                </Button>
              </Link>
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
                      <p className="text-sm text-slate-500">Submitted</p>
                      <p className="font-medium">{formatDate(request.createdAt)}</p>
                    </div>
                    {request.tutorName && (
                      <div>
                        <p className="text-sm text-slate-500">Assigned Tutor</p>
                        <p className="font-medium">{request.tutorName}</p>
                      </div>
                    )}
                  </div>

                  {request.attachments && request.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">Your Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {request.attachments.map((file, index) => (
                          <div key={index} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded text-sm">
                            {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.workAttachments && request.workAttachments.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700 font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Completed Work
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {request.workAttachments.map((file, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {file}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};