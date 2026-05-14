import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { meetingService } from '../../services/meetingService';
import { toast } from 'sonner';
import { CreditCard, Lock } from 'lucide-react';
import type { Booking, MeetingPlatform } from '../../types/main';

export const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>('zoom');

  // Mock payment form
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;

      try {
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent (integrates with Stripe on backend)
      const { clientSecret, paymentIntentId } = await paymentService.createPaymentIntent(
        booking.id,
        booking.price
      );

      // Step 2: In a real app, you would use Stripe.js here to confirm the payment
      // For now, we'll simulate a successful payment
      console.log('Payment Intent Created:', { clientSecret, paymentIntentId });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Confirm payment on backend
      await paymentService.confirmPayment(paymentIntentId, booking.id);

      // Step 4: Create meeting link
      const meeting = await meetingService.createMeeting(
        booking.id,
        meetingPlatform,
        booking.scheduledDate,
        booking.duration
      );

      toast.success('Payment successful! Your session has been booked.');

      // Redirect to sessions page
      navigate('/dashboard/sessions');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Booking not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Securely pay for your tutoring session</p>
        </div>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">
                {new Date(booking.scheduledDate).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{booking.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium capitalize">{booking.type}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-blue-600">${booking.price.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Platform Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Platform</CardTitle>
            <CardDescription>Choose your preferred video conferencing platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMeetingPlatform('zoom')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  meetingPlatform === 'zoom'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium">Zoom</p>
              </button>
              <button
                type="button"
                onClick={() => setMeetingPlatform('teams')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  meetingPlatform === 'teams'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium">Microsoft Teams</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              <Lock className="w-4 h-4 inline mr-1" />
              Your payment information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentForm.cardNumber}
                  onChange={handleInputChange}
                  required
                  maxLength={19}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <input
                  id="cardName"
                  name="cardName"
                  type="text"
                  placeholder="John Doe"
                  value={paymentForm.cardName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={paymentForm.expiryDate}
                    onChange={handleInputChange}
                    required
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    placeholder="123"
                    value={paymentForm.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is a demo payment form. In production, this would integrate
                  with Stripe Payment Elements for secure payment processing. Your backend should use
                  Stripe's API with your secret key to process payments.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/sessions')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="flex-1">
                  {isProcessing ? 'Processing...' : `Pay $${booking.price.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
