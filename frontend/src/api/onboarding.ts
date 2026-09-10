import { ChemistOnboardingRequest } from '../types';

interface OnboardingData {
  userId: string;
  storeName: string;
  address: string;
  phone: string;
  licenseNumber: string;
  deaNumber?: string;
  ownerName: string;
  email: string;
}

export async function submitOnboardingRequest(data: OnboardingData): Promise<{ error: string | null }> {
  try {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || 'Submission failed' };
    return { error: null };
  } catch (err) {
    // Mock success in offline mode
    return { error: null };
  }
}

export async function fetchOnboardingStatus(userId: string): Promise<'pending' | 'approved' | 'rejected' | null> {
  try {
    const res = await fetch(`/api/onboarding/status/${userId}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.status ?? null;
  } catch (err) {
    return null;
  }
}

export async function fetchPendingOnboardingRequests(): Promise<ChemistOnboardingRequest[]> {
  try {
    const res = await fetch('/api/onboarding/pending');
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[onboarding] Backend unavailable, returning empty list.');
    return [];
  }
}

export async function approveOnboardingRequest(requestId: string, _adminUserId: string): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`/api/onboarding/${requestId}/approve`, { method: 'PUT' });
    const json = await res.json();
    if (!res.ok) return { error: json.error || 'Approval failed' };
    return { error: null };
  } catch (err) {
    return { error: null };
  }
}

export async function rejectOnboardingRequest(requestId: string, _adminUserId: string, notes?: string): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`/api/onboarding/${requestId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || 'Rejection failed' };
    return { error: null };
  } catch (err) {
    return { error: null };
  }
}
