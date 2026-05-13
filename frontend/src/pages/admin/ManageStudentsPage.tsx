import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { mockApi } from '../../services/mockApi';
import { Users, Search, Mail, Phone } from 'lucide-react';
import type { User } from '../../types/main';

export const ManageStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.get('/users/students');
      if ((response as any).success) {
        setStudents((response as any).data);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.email}`
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
            <h2 className="text-3xl font-bold text-slate-900">Manage Students</h2>
            <p className="text-slate-600 mt-1">View and manage all registered students</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Students ({filteredStudents.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search students..."
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
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>No students found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {student.firstName} {student.lastName}
                        </h4>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {student.email}
                          </p>
                          {student.phoneNumber && (
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {student.phoneNumber}
                            </p>
                          )}
                          <p className="text-xs text-slate-500">
                            Joined: {formatDate(student.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Link to={`/dashboard/students/${student.id}`}>
                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
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
