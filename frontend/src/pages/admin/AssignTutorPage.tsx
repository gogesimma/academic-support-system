import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { mockApi } from '../../services/mockApi';
import { toast } from 'sonner';
import { UserPlus, FileText } from 'lucide-react';
import type { Request, Tutor } from '../../types/main';

export const AssignTutorPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsRes, tutorsRes] = await Promise.all([
        mockApi.get('/requests'),
        mockApi.get('/users/tutors'),
      ]);

      if ((requestsRes as any).success) {
        const pendingRequests = ((requestsRes as any).data as Request[]).filter(
          (r) => r.status === 'pending'
        );
        setRequests(pendingRequests);
      }

      if ((tutorsRes as any).success) {
        setTutors((tutorsRes as any).data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequestId || !selectedTutorId) {
      toast.error('Please select both a request and a tutor');
      return;
    }

    try {
      setIsAssigning(true);
      await mockApi.patch(`/requests/${selectedRequestId}/assign`, {
        tutorId: selectedTutorId,
      });

      toast.success('Tutor assigned successfully!');
      navigate('/dashboard/view-requests');
    } catch (error) {
      toast.error('Failed to assign tutor');
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600 to-yellow-600 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Assign Tutor to Request
                </CardTitle>
                <CardDescription>Match student requests with available tutors</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssign} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="request">Select Request</Label>
                <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a pending request" />
                  </SelectTrigger>
                  <SelectContent>
                    {requests.map((request) => (
                      <SelectItem key={request.id} value={request.id}>
                        {request.title} - {request.studentName} ({request.serviceType} | {request.module})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRequestId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Request Details
                  </p>
                  {requests
                    .filter((r) => r.id === selectedRequestId)
                    .map((request) => (
                      <div key={request.id} className="text-sm text-blue-600">
                        <p className="mb-1">
                          <span className="font-medium">Title:</span> {request.title}
                        </p>
                        <p className="mb-1">
                          <span className="font-medium">Service Type:</span> {request.serviceType}
                        </p>
                        <p className="mb-1">
                          <span className="font-medium">Module:</span> {request.module}
                        </p>
                        <p className="mb-1">
                          <span className="font-medium">Student:</span> {request.studentName}
                        </p>
                        <p>
                          <span className="font-medium">Description:</span> {request.description}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tutor">Select Tutor</Label>
                <Select value={selectedTutorId} onValueChange={setSelectedTutorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.firstName} {tutor.lastName} - {tutor.subjects?.join(', ')} (Rating:{' '}
                        {tutor.rating?.toFixed(1)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTutorId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-700 font-medium mb-2">Tutor Profile</p>
                  {tutors
                    .filter((t) => t.id === selectedTutorId)
                    .map((tutor) => (
                      <div key={tutor.id} className="text-sm text-purple-600">
                        <p className="mb-1">
                          <span className="font-medium">Name:</span> {tutor.firstName} {tutor.lastName}
                        </p>
                        {tutor.subjects && (
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium">Subjects:</span>
                            <div className="flex flex-wrap gap-1">
                              {tutor.subjects.map((subject, index) => (
                                <Badge key={index} variant="outline" className="border-purple-300 text-purple-700 text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {tutor.bio && (
                          <p className="mb-1">
                            <span className="font-medium">Bio:</span> {tutor.bio}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Rating:</span> {tutor.rating?.toFixed(1)} ⭐ |{' '}
                          <span className="font-medium">Completed:</span> {tutor.completedRequests || 0}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isAssigning || !selectedRequestId || !selectedTutorId}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
                >
                  {isAssigning ? 'Assigning...' : 'Assign Tutor'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/view-requests')}
                  className="border-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};