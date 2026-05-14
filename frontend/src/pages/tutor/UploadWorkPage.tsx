import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import type { Request } from '../../types/main';

export const UploadWorkPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      const response = await mockApi.get(`/requests/tutor/${user.id}`);
      if ((response as any).success) {
        const activeRequests = ((response as any).data as Request[]).filter(
          (r) => r.status === 'assigned' || r.status === 'in-progress'
        );
        setRequests(activeRequests);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequestId) {
      toast.error('Please select a request');
      return;
    }

    try {
      setIsUploading(true);

      await mockApi.patch(`/requests/${selectedRequestId}/status`, {
        status: 'completed',
      });

      toast.success('Work uploaded and request marked as completed!');
      navigate('/dashboard/assigned-requests');
    } catch (error) {
      toast.error('Failed to upload work');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Upload Completed Work
                </CardTitle>
                <CardDescription>Submit your work for assigned requests</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="request">Select Request</Label>
                <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a request to upload work for" />
                  </SelectTrigger>
                  <SelectContent>
                    {requests.map((request) => (
                      <SelectItem key={request.id} value={request.id}>
                        {request.title} - {request.studentName}
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
                          <span className="font-medium">Service Type:</span> {request.serviceType}
                        </p>
                        <p className="mb-1">
                          <span className="font-medium">Module:</span> {request.module}
                        </p>
                        <p className="mb-1">
                          <span className="font-medium">Description:</span> {request.description}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Upload Files</Label>
                <div className="border-2 border-dashed border-cyan-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
                  <p className="text-sm text-slate-600 mb-2">
                    Click to upload or drag and drop files
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, DOC, DOCX, XLS, XLSX, ZIP (Max 25MB)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes for Student (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or instructions for the student..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isUploading || !selectedRequestId}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload & Mark Complete'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/assigned-requests')}
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
  