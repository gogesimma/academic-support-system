import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Video, FileText } from 'lucide-react';
import type { Booking } from '../../types/main';

export const SessionsPage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      try {
        const data = user.role === 'student'
          ? await bookingService.getStudentBookings(user.id)
          : await bookingService.getTutorBookings(user.id);

        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.scheduledDate);
    const now = new Date();

    if (filter === 'upcoming') {
      return sessionDate > now && session.status !== 'cancelled';
    } else if (filter === 'past') {
      return sessionDate <= now || session.status === 'completed';
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
          <div>
            <h1 className="text-4xl font-bold">My Sessions</h1>
            <p className="text-white/90 mt-2 text-lg">View and manage your tutoring sessions</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' : 'border-purple-200 hover:bg-purple-50'}
              >
                All Sessions
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
                className={filter === 'upcoming' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg' : 'border-blue-200 hover:bg-blue-50'}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'past' ? 'default' : 'outline'}
                onClick={() => setFilter('past')}
                className={filter === 'past' ? 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 shadow-lg' : 'border-orange-200 hover:bg-orange-50'}
              >
                Past
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-purple-600" />
                </div>
                <p className="text-gray-600 text-lg">No sessions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredSessions.map((session, index) => (
              <Card key={session.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {user?.role === 'student' ? 'Session with Tutor' : 'Session with Student'}
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </CardTitle>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(session.scheduledDate).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 ml-4" />
                          <span>{new Date(session.scheduledDate).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{session.duration} minutes</span>
                          <span className="ml-4 font-medium text-blue-600">
                            ${session.price.toFixed(2)}
                          </span>
                        </div>
                        {session.notes && (
                          <div className="flex items-start gap-2 text-gray-600 mt-2">
                            <FileText className="w-4 h-4 mt-0.5" />
                            <span className="text-sm">{session.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {session.meetingLink && session.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => window.open(session.meetingLink, '_blank')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Meeting
                        </Button>
                      )}
                      {session.status === 'pending' && user?.role === 'tutor' && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await bookingService.confirmBooking(session.id);
                              setSessions(prev =>
                                prev.map(s =>
                                  s.id === session.id ? { ...s, status: 'confirmed' } : s
                                )
                              );
                            } catch (error) {
                              console.error('Error confirming booking:', error);
                            }
                          }}
                        >
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};