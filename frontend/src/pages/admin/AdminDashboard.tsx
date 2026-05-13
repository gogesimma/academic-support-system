import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockApi } from '../../services/mockApi';
import { Users, FileText, UserPlus, Activity, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import type { AdminStats, Request } from '../../types/main';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, requestsRes] = await Promise.all([
        mockApi.get('/users/stats/admin'),
        mockApi.get('/requests'),
      ]);

      if ((statsRes as any).success) {
        setStats((statsRes as any).data);
      }

      if ((requestsRes as any).success) {
        const allRequests = (requestsRes as any).data;
        setPendingRequests(allRequests.filter((r: Request) => r.status === 'pending').slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      assigned: { className: 'bg-blue-100 text-blue-800', label: 'Assigned' },
      'in-progress': { className: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      completed: { className: 'bg-green-100 text-green-800', label: 'Completed' },
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Total Users</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-white/80 mt-1">
                {stats?.totalStudents || 0} students, {stats?.totalTutors || 0} tutors
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Total Requests</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.totalRequests || 0}</div>
              <p className="text-xs text-white/80 mt-1">All time requests</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Pending Requests</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.pendingRequests || 0}</div>
              <p className="text-xs text-white/80 mt-1">Awaiting assignment</p>
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
              <p className="text-xs text-white/80 mt-1">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link to="/dashboard/view-requests">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                <FileText className="w-4 h-4 mr-2" />
                View All Requests
              </Button>
            </Link>
            <Link to="/dashboard/create-tutor">
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Tutor
              </Button>
            </Link>
            <Link to="/dashboard/manage-students">
              <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </Button>
            </Link>
            <Link to="/dashboard/manage-tutors">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                <Users className="w-4 h-4 mr-2" />
                Manage Tutors
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Pending Requests
                </CardTitle>
                <CardDescription>Student requests awaiting tutor assignment</CardDescription>
              </div>
              <Link to="/dashboard/view-requests">
                <Button variant="outline" className="border-orange-300 hover:bg-orange-50">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50/50 transition-colors"
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
                      <span>Submitted: {formatDate(request.createdAt)}</span>
                      <Link to="/dashboard/assign-tutor">
                        <Button size="sm" className="bg-gradient-to-r from-orange-600 to-yellow-600">
                          Assign Tutor
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Activity */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Platform Activity</CardTitle>
            <CardDescription>Recent platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Students</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {stats?.totalStudents || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Tutors</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats?.totalTutors || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Active Requests</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {(stats?.totalRequests || 0) - (stats?.completedRequests || 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};