import { AuditLogEntry } from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const res = await fetch('/api/audit');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[audit API] Backend unavailable, using mock data.');
    return INITIAL_AUDIT_LOGS;
  }
}

export async function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to append log');
  } catch (err) {
    console.warn('[audit API] Backend unavailable. Log appended locally only.');
  }
}
