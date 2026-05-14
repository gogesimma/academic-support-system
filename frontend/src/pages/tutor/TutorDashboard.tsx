import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { FileText, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { Link } from 'react-router';
import type { TutorStats, Request } from '../../types/main';

export const TutorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [statsRes, requestsRes] = await Promise.all([
        mockApi.get(`/users/stats/tutor/${user.id}`),
        mockApi.get(`/requests/tutor/${user.id}`),
      ]);

      if ((statsRes as any).success) {
        setStats((statsRes as any).data);
      }

      if ((requestsRes as any).success) {
        setAssignedRequests((requestsRes as any).data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Assigned Requests</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.assignedRequests || 0}</div>
              <p className="text-xs text-white/80 mt-1">Currently assigned</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">In Progress</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.inProgressRequests || 0}</div>
              <p className="text-xs text-white/80 mt-1">Active work</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Completed</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.completedRequests || 0}</div>
              <p className="text-xs text-white/80 mt-1">Total completed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Average Rating</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.averageRating?.toFixed(1) || 'N/A'}</div>
              <p className="text-xs text-white/80 mt-1">Out of 5.0 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* My Assigned Requests */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  My Assigned Requests
                </CardTitle>
                <CardDescription>Requests you are currently working on</CardDescription>
              </div>
              <Link to="/dashboard/assigned-requests">
                <Button variant="outline" className="border-cyan-300 hover:bg-cyan-50">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {assignedRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No assigned requests yet</p>
                <p className="text-sm text-slate-500 mt-2">
                  Admins will assign student requests to you
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-cyan-200 rounded-lg hover:bg-cyan-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{request.title}</h4>
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded">{request.serviceType}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{request.module}</span>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2">{request.description}</p>
                        <p className="text-xs text-slate-500 mt-2">Student: {request.studentName}</p>
                      </div>
                      <div className="ml-4">{getStatusBadge(request.status)}</div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-3">
                      <span>Assigned: {request.assignedAt ? formatDate(request.assignedAt) : 'N/A'}</span>
                      {request.status === 'assigned' && (
                        <Link to="/dashboard/upload-work">
                          <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Work
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