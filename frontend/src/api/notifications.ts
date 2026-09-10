import { NotificationEvent } from '../types';

const MOCK_NOTIFICATION: NotificationEvent = {
  id: 'notif-mock-1',
  chemistId: '',
  type: 'new_reservation',
  title: 'New Reservation',
  message: 'Customer reserved Atorlip 20 (Code: GM-4821-NY)',
  reservationCode: 'GM-4821-NY',
  isRead: false,
  createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
};

export async function fetchUnreadNotifications(chemistId: string): Promise<NotificationEvent[]> {
  try {
    const res = await fetch(`/api/notifications/${chemistId}/unread`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (err) {
    // Return a mock unread notification in offline mode
    return [{ ...MOCK_NOTIFICATION, chemistId }];
  }
}

export async function fetchAllNotifications(chemistId: string): Promise<NotificationEvent[]> {
  try {
    const res = await fetch(`/api/notifications/${chemistId}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function markNotificationsRead(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  try {
    await fetch('/api/notifications/mark-read', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
  } catch (err) {
    console.warn('[notifications] Backend unavailable. Notifications marked read locally only.');
  }
}
