import { api } from '../services/api';
import type { Meeting, MeetingPlatform, ApiResponse } from '../types/main';

/**
 * Meeting Service
 *
 * Your Node.js backend should implement these endpoints:
 * POST /meetings - Create meeting (integrates with Zoom/Teams API)
 * GET /meetings/:id - Get meeting by ID
 * GET /meetings/booking/:bookingId - Get meeting for booking
 * DELETE /meetings/:id - Delete meeting
 *
 * For Zoom integration, your backend needs:
 * - Zoom API credentials (Client ID, Client Secret)
 * - OAuth flow to get access token
 * - POST to https://api.zoom.us/v2/users/me/meetings
 *
 * For Microsoft Teams integration, your backend needs:
 * - Microsoft Graph API credentials
 * - OAuth flow to get access token
 * - POST to https://graph.microsoft.com/v1.0/me/onlineMeetings
 */

export const meetingService = {
  /**
   * Create meeting for a booking
   * Backend endpoint: POST /meetings
   * Expected request body: { bookingId: string, platform: 'zoom' | 'teams', scheduledStart: string, duration: number }
   * Expected response: { success: true, data: Meeting }
   *
   * Example Zoom API call from your backend:
   * const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
   *   method: 'POST',
   *   headers: {
   *     'Authorization': `Bearer ${zoomAccessToken}`,
   *     'Content-Type': 'application/json'
   *   },
   *   body: JSON.stringify({
   *     topic: 'Tutoring Session',
   *     type: 2,
   *     start_time: scheduledStart,
   *     duration: duration,
   *     settings: {
   *       join_before_host: true,
   *       waiting_room: false
   *     }
   *   })
   * });
   */
  createMeeting: async (
    bookingId: string,
    platform: MeetingPlatform,
    scheduledStart: string,
    duration: number
  ): Promise<Meeting> => {
    const response = await api.post<ApiResponse<Meeting>>('/meetings', {
      bookingId,
      platform,
      scheduledStart,
      duration,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create meeting');
  },

  /**
   * Get meeting by ID
   * Backend endpoint: GET /meetings/:id
   * Expected response: { success: true, data: Meeting }
   */
  getMeetingById: async (id: string): Promise<Meeting> => {
    const response = await api.get<ApiResponse<Meeting>>(`/meetings/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch meeting');
  },

  /**
   * Get meeting for a booking
   * Backend endpoint: GET /meetings/booking/:bookingId
   * Expected response: { success: true, data: Meeting }
   */
  getMeetingForBooking: async (bookingId: string): Promise<Meeting> => {
    const response = await api.get<ApiResponse<Meeting>>(`/meetings/booking/${bookingId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch meeting for booking');
  },

  /**
   * Delete meeting
   * Backend endpoint: DELETE /meetings/:id
   * Expected response: { success: true }
   *
   * Your backend should also call the Zoom/Teams API to cancel the meeting:
   * For Zoom: DELETE https://api.zoom.us/v2/meetings/{meetingId}
   * For Teams: DELETE https://graph.microsoft.com/v1.0/me/onlineMeetings/{meetingId}
   */
  deleteMeeting: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/meetings/${id}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete meeting');
    }
  },

  /**
   * Update meeting
   * Backend endpoint: PATCH /meetings/:id
   * Expected request body: Partial<Meeting>
   * Expected response: { success: true, data: Meeting }
   */
  updateMeeting: async (id: string, updates: Partial<Meeting>): Promise<Meeting> => {
    const response = await api.patch<ApiResponse<Meeting>>(`/meetings/${id}`, updates);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update meeting');
  },
};
