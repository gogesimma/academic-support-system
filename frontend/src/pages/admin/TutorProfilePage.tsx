import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { mockApi } from '../../services/mockApi';
import { toast } from 'sonner';
import { User, Mail, Phone, Trash2, Save, Star } from 'lucide-react';
import type { Tutor } from '../../types/main';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

export const TutorProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    subjects: '',
  });

  useEffect(() => {
    loadTutor();
  }, [id]);

  const loadTutor = async () => {
    try {
      setIsLoading(true);
      const response = await mockApi.get('/users/tutors');
      if ((response as any).success) {
        const tutors = (response as any).data;
        const foundTutor = tutors.find((t: Tutor) => t.id === id);
        if (foundTutor) {
          setTutor(foundTutor);
          setFormData({
            firstName: foundTutor.firstName,
            lastName: foundTutor.lastName,
            email: foundTutor.email,
            phoneNumber: foundTutor.phoneNumber || '',
            bio: foundTutor.bio || '',
            subjects: foundTutor.subjects?.join(', ') || '',
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load tutor');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Simulate API call to update tutor
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Tutor updated successfully!');
      setIsEditing(false);
      loadTutor();
    } catch (error) {
      toast.error('Failed to update tutor');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await mockApi.delete(`/users/${id}`);
      toast.success('Tutor deleted successfully!');
      navigate('/dashboard/manage-tutors');
    } catch (error) {
      toast.error('Failed to delete tutor');
      console.error(error);
    }
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

  if (!tutor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Tutor not found</p>
          <Button onClick={() => navigate('/dashboard/manage-tutors')} className="mt-4">
            Back to Tutors
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Tutor Profile</h2>
            <p className="text-slate-600 mt-1">View and manage tutor information</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/manage-tutors')}>
            Back to Tutors
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Tutor details and account information</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input
                id="subjects"
                placeholder="e.g., Economics, Finance, Accounting"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Brief description of experience and expertise..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                disabled={!isEditing}
              />
            </div>

            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Edit Profile
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Tutor
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the tutor account and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Performance Statistics</CardTitle>
            <CardDescription>Tutor performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Rating</span>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{tutor.rating?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Assigned Requests</span>
              <span className="font-medium">{tutor.assignedRequests || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Completed Requests</span>
              <span className="font-medium">{tutor.completedRequests || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Total Earnings</span>
              <span className="font-medium">R {tutor.totalEarnings?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Member Since</span>
              <span className="font-medium">
                {new Date(tutor.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
