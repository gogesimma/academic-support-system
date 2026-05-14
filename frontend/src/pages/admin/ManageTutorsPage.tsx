import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { mockApi } from '../../services/mockApi';
import { Users, Search, Mail, Phone, UserPlus } from 'lucide-react';
import { Link } from 'react-router';
import type { Tutor } from '../../types/main';

export const ManageTutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.get('/users/tutors');
      if ((response as any).success) {
        setTutors((response as any).data);
      }
    } catch (error) {
      console.error('Failed to load tutors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTutors = tutors.filter((tutor) =>
    `${tutor.firstName} ${tutor.lastName} ${tutor.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
            <h2 className="text-3xl font-bold text-slate-900">Manage Tutors</h2>
            <p className="text-slate-600 mt-1">View and manage all tutors</p>
          </div>
          <Link to="/dashboard/create-tutor">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Create New Tutor
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Tutors ({filteredTutors.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search tutors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>No tutors found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {tutor.firstName} {tutor.lastName}
                          </h4>
                          <Badge className="bg-purple-100 text-purple-800">
                            {tutor.rating?.toFixed(1)} ⭐
                          </Badge>
                        </div>
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {tutor.email}
                          </p>
                          {tutor.phoneNumber && (
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {tutor.phoneNumber}
                            </p>
                          )}
                        </div>
                        {tutor.bio && (
                          <p className="text-sm text-slate-700 mb-2">{tutor.bio}</p>
                        )}
                        {tutor.subjects && tutor.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {tutor.subjects.map((subject, index) => (
                              <Badge key={index} variant="outline" className="border-cyan-300 text-cyan-700">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Assigned: {tutor.assignedRequests || 0}</span>
                          <span>Completed: {tutor.completedRequests || 0}</span>
                          <span>Joined: {formatDate(tutor.createdAt)}</span>
                        </div>
                      </div>
                      <Link to={`/dashboard/tutors/${tutor.id}`}>
                        <Button variant="outline" size="sm" className="border-purple-300 text-purple-600">
                          View Profile
                        </Button>
                      </Link>
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
