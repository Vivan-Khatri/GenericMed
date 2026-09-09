import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuditLogEntry } from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

function rowToAuditLog(row: Record<string, unknown>): AuditLogEntry {
  const createdAt = new Date(row.created_at as string);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - createdAt.getTime()) / 60000);

  let timestamp: string;
  if (diffMins < 1) timestamp = 'Just now';
  else if (diffMins < 60) timestamp = `${diffMins} minutes ago`;
  else if (diffMins < 1440) timestamp = `${Math.floor(diffMins / 60)} hours ago`;
  else timestamp = createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return {
    id:            (row.id as string),
    timestamp,
    actor:         row.actor as string,
    actorRole:     row.actor_role as AuditLogEntry['actorRole'],
    action:        row.action as string,
    targetObject:  row.target_object as string,
    changeSummary: row.change_summary as string,
    severity:      row.severity as AuditLogEntry['severity'],
  };
}

export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  if (!isSupabaseConfigured()) return INITIAL_AUDIT_LOGS;

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[auditLogs] fetchAuditLogs error:', error.message);
    return INITIAL_AUDIT_LOGS;
  }

  return (data ?? []).map(rowToAuditLog);
}

export async function appendAuditLog(
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase.from('audit_logs').insert({
    actor:          entry.actor,
    actor_role:     entry.actorRole,
    action:         entry.action,
    target_object:  entry.targetObject,
    change_summary: entry.changeSummary,
    severity:       entry.severity,
  });

  if (error) {
    console.error('[auditLogs] appendAuditLog error:', error.message);
  }
}
