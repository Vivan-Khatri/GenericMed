import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Search, 
  ArrowLeft, 
  Filter, 
  Check, 
  X, 
  Eye, 
  Activity, 
  Layers,
  Sparkles
} from 'lucide-react';
import { AuditLogEntry, ChemistStore, Medicine } from '../types';

interface AdminModerationPortalProps {
  auditLogs: AuditLogEntry[];
  chemists: ChemistStore[];
  medicines: Medicine[];
  onBackToCustomer: () => void;
  onApproveAuditAction: (logId: string) => void;
}

export const AdminModerationPortal: React.FC<AdminModerationPortalProps> = ({
  auditLogs,
  chemists,
  medicines,
  onBackToCustomer,
  onApproveAuditAction,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'anomalies' | 'audit' | 'partners'>('anomalies');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const pendingAnomalies = [
    {
      id: 'anom-1',
      title: 'Price Divergence Flagged (+38% vs district mean)',
      store: 'Downtown Discount Chemists #881',
      product: 'Atorvastatin 20mg (Tablet, 90 Count)',
      submittedPrice: 185.00,
      districtMean: 51.00,
      riskLevel: 'HIGH',
      reason: 'Automated scraping detected price surge exceeding regulatory standard margin.',
      timestamp: '14 minutes ago',
    },
    {
      id: 'anom-2',
      title: 'Unverified Bioequivalence Manufacturer Code',
      store: 'East River Community Drugs',
      product: 'Metformin HCl 1000mg',
      submittedPrice: 62.00,
      districtMean: 65.00,
      riskLevel: 'MEDIUM',
      reason: 'Batch certificate #MX-9988 pending FDA Orange Book cross-check.',
      timestamp: '1 hour ago',
    },
  ];

  return (
    <div className="pb-28 space-y-4 px-4 pt-3 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Clinical Ops Precision
            </span>
            <span className="text-slate-400 text-xs">• Platform Super-Admin Console</span>
          </div>
          <button
            onClick={onBackToCustomer}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Regulatory Audit & Moderation Engine
            </h2>
            <p className="text-xs text-slate-300">
              PRD FR-ADM-01 - FR-ADM-05: Real-time price anomaly detection, partner licensing, and immutable audit logs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/80 p-2.5 rounded-xl text-center border border-slate-700">
              <div className="text-[10px] text-slate-400">Search Rate</div>
              <div className="text-sm font-extrabold text-emerald-400">99.4%</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl text-center border border-slate-700">
              <div className="text-[10px] text-slate-400">Avg Savings</div>
              <div className="text-sm font-extrabold text-sky-400">84.2%</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl text-center border border-slate-700">
              <div className="text-[10px] text-slate-400">Freshness</div>
              <div className="text-sm font-extrabold text-amber-400">&lt;15 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setSelectedSubTab('anomalies')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            selectedSubTab === 'anomalies' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Price Anomaly Queue ({pendingAnomalies.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('audit')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            selectedSubTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Immutable Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('partners')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            selectedSubTab === 'partners' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Verified Network Chemists ({chemists.length})</span>
        </button>
      </div>

      {/* View: Price Anomaly Queue */}
      {selectedSubTab === 'anomalies' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500">
            Automated guardrail detecting fraudulent price gouging, unverified salts, and stale wholesaler inventories.
          </div>

          <div className="space-y-3">
            {pendingAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{anom.title}</span>
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {anom.riskLevel} RISK
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {anom.store} • {anom.product}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">{anom.timestamp}</span>
                </div>

                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-slate-700 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-900">Flag Reason: </span>
                    {anom.reason}
                  </div>
                  <div className="flex items-center gap-4 pt-1 text-[11px]">
                    <div>
                      Reported Price: <span className="font-bold text-rose-700">₹{anom.submittedPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      District Baseline Mean: <span className="font-bold text-emerald-700">₹{anom.districtMean.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => alert(`Suspended listing from ${anom.store} for investigation.`)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold"
                  >
                    Reject & Suspend Listing
                  </button>
                  <button
                    onClick={() => alert(`Listing verified with partner wholesaler invoice.`)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                  >
                    Authorize & Mark Verified
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Immutable Audit Logs */}
      {selectedSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                FR-ADM-05 Regulatory Audit Trail
              </h3>
              <p className="text-[11px] text-slate-500">
                Tamper-evident logs of pricing updates, partner actions, and FDA index updates
              </p>
            </div>
            <span className="font-mono text-[11px] text-slate-400">HASH: sha256:d8a9...99c2</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
                  <th className="py-2 px-2">Timestamp</th>
                  <th className="py-2 px-2">Actor & Role</th>
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Target Entity</th>
                  <th className="py-2 px-2">Change Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-2 font-sans font-semibold text-slate-800">
                      {log.actor}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-sans text-slate-700 whitespace-nowrap">
                      {log.targetObject}
                    </td>
                    <td className="py-2.5 px-2 font-sans text-slate-600 max-w-xs truncate">
                      {log.changeSummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Verified Network Chemists */}
      {selectedSubTab === 'partners' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chemists.map((chem) => (
              <div
                key={chem.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{chem.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Licensed
                  </span>
                </div>
                <p className="text-xs text-slate-500">{chem.address}</p>
                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Phone: {chem.phone}</span>
                  <span className="font-semibold text-emerald-700">Freshness: {chem.priceFreshnessMinutes}m ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
