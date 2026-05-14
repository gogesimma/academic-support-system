import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { bookingService } from '../../services/bookingService';
import { Calendar, BookOpen, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router';
import type { StudentStats, Booking } from '../../types/main';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [statsData, bookingsData] = await Promise.all([
          userService.getStudentStats(user.id),
          bookingService.getStudentBookings(user.id),
        ]);

        setStats(statsData);

        // Filter upcoming sessions
        const upcoming = bookingsData.filter(
          (booking) => new Date(booking.scheduledDate) > new Date() && booking.status === 'confirmed'
        );
        setUpcomingSessions(upcoming.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <CardTitle className="text-sm font-medium text-white/90">Total Sessions</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.totalSessions || 0}</div>
              <p className="text-xs text-white/80 mt-1">All time learning</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Upcoming Sessions</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.upcomingSessions || 0}</div>
              <p className="text-xs text-white/80 mt-1">Scheduled this week</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Completed Sessions</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">{stats?.completedSessions || 0}</div>
              <p className="text-xs text-white/80 mt-1">Successfully finished</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Total Spent</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold">${stats?.totalSpent?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-white/80 mt-1">Investment in learning</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link to="/dashboard/browse-tutors">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                Browse Tutors
              </Button>
            </Link>
            <Link to="/dashboard/sessions">
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                View My Sessions
              </Button>
            </Link>
            <Link to="/dashboard/payments">
              <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                Payment History
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming sessions</p>
                <Link to="/dashboard/browse-tutors">
                  <Button className="mt-4" variant="outline">
                    Book a Session
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Session with Tutor</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.scheduledDate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{session.duration} minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${session.price}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          session.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {session.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Subjects */}
        {stats?.favoriteSubjects && stats.favoriteSubjects.length > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Favorite Subjects</CardTitle>
              <CardDescription>Based on your session history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {stats.favoriteSubjects.map((subject, index) => (
                  <span
                    key={subject}
                    className={`px-4 py-2 rounded-xl text-sm font-medium shadow-md ${
                      index % 3 === 0
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    }`}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};