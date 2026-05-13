import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { bookingService } from '../../services/bookingService';
import { serviceService } from '../../services/serviceService';
import { toast } from 'sonner';
import type { Tutor, Service, BookingFormData, BookingType } from '../../types/main';

export const BookSessionPage: React.FC = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    tutorId: tutorId || '',
    serviceId: '',
    type: 'one-time',
    scheduledDate: '',
    duration: 60,
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!tutorId) return;

      try {
        const [tutorData, servicesData] = await Promise.all([
          userService.getUserById(tutorId),
          serviceService.getAllServices({ tutorId }),
        ]);

        setTutor(tutorData as Tutor);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load tutor information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tutorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to book a session');
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await bookingService.createBooking(formData);
      toast.success('Booking created successfully!');

      // Redirect to payment page
      navigate(`/dashboard/payment/${booking.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  if (!tutor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Tutor not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold">Book a Session</h1>
          <p className="text-white/90 mt-2 text-lg">
            Schedule a tutoring session with {tutor.firstName} {tutor.lastName}
          </p>
        </div>

        {/* Tutor Info */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {tutor.firstName[0]}{tutor.lastName[0]}
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {tutor.firstName} {tutor.lastName}
                </CardTitle>
                <CardDescription className="text-base mt-1">{tutor.bio}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Booking Form */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Session Details</CardTitle>
            <CardDescription>Fill in the information below to book your session</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceId">Service Type</Label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price ? `$${service.price}` : 'Custom pricing'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Booking Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="one-time">One-time Session</option>
                  <option value="recurring">Recurring Sessions</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                <input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              {formData.type === 'recurring' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                    <select
                      id="recurrencePattern"
                      name="recurrencePattern"
                      value={formData.recurrencePattern || ''}
                      onChange={handleChange}
                      required={formData.type === 'recurring'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select pattern</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurrenceEndDate">End Date</Label>
                    <input
                      id="recurrenceEndDate"
                      name="recurrenceEndDate"
                      type="date"
                      value={formData.recurrenceEndDate || ''}
                      onChange={handleChange}
                      required={formData.type === 'recurring'}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any specific topics you'd like to cover or questions you have..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/browse-tutors')}
                  className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                >
                  {isSubmitting ? 'Creating Booking...' : 'Continue to Payment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};