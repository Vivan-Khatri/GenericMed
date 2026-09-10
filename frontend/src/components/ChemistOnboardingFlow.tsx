import React, { useState } from 'react';
import { Store, ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2, RefreshCw, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitOnboardingRequest, fetchOnboardingStatus } from '../api/onboarding';
import { ChemistOnboardingStatus } from '../types';

interface Props {
  onStatusChange: (status: ChemistOnboardingStatus) => void;
  currentStatus?: ChemistOnboardingStatus;
}

export const ChemistOnboardingFlow: React.FC<Props> = ({ onStatusChange, currentStatus }) => {
  const { user, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [deaNumber, setDeaNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');

  // Auto-advance if already pending/suspended
  if (currentStatus === 'pending') {
    return <PendingState onCheckStatus={async () => {
      if (user) {
        setIsLoading(true);
        const status = await fetchOnboardingStatus(user.id);
        setIsLoading(false);
        if (status) onStatusChange(status);
      }
    }} isLoading={isLoading} onLogout={logout} />;
  }

  if (currentStatus === 'suspended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Account Suspended</h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6">
          Your chemist partner account has been suspended by administration. Please contact support for more information.
        </p>
        <button onClick={logout} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors">
          Sign Out
        </button>
      </div>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    const { error: submitErr } = await submitOnboardingRequest({
      userId: user.id,
      storeName,
      address,
      phone,
      licenseNumber,
      deaNumber,
      ownerName,
      email: user.email ?? '',
    });

    setIsLoading(false);

    if (submitErr) {
      setError(submitErr);
    } else {
      onStatusChange('pending');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Partner Onboarding</h1>
        <p className="text-sm text-slate-500">Complete your profile to start accepting reservations.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
        
        {[
          { num: 1, label: 'Store Details', icon: Store },
          { num: 2, label: 'Compliance', icon: ShieldCheck },
          { num: 3, label: 'Review', icon: FileText }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
              step > s.num ? 'bg-emerald-500 border-emerald-500 text-white' : 
              step === s.num ? 'bg-white border-emerald-500 text-emerald-600' : 
              'bg-white border-slate-200 text-slate-400'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-xs font-semibold ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Store Information</h2>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name *</label>
                <input required type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Apollo Pharmacy Metro Hub" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Address *</label>
                <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="123 Main St, New York, NY 10001" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Licensing & Compliance</h2>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State Pharmacy License Number *</label>
                <input required type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="e.g. PH-1234567" />
                <p className="text-[10px] text-slate-500 mt-1">Required for verification.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DEA Registration Number (Optional)</label>
                <input type="text" value={deaNumber} onChange={(e) => setDeaNumber(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="e.g. AB1234567" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Primary Pharmacist Name *</label>
                <input required type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Jane Doe" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-bold text-slate-900">Review & Submit</h2>
              
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Store Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500">Name:</span> <span className="font-semibold">{storeName}</span></div>
                    <div><span className="text-slate-500">Phone:</span> <span className="font-semibold">{phone}</span></div>
                    <div className="col-span-2"><span className="text-slate-500">Address:</span> <span className="font-semibold">{address}</span></div>
                  </div>
                </div>
                
                <div className="h-px bg-slate-200" />
                
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Compliance</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500">License:</span> <span className="font-semibold">{licenseNumber}</span></div>
                    <div><span className="text-slate-500">DEA:</span> <span className="font-semibold">{deaNumber || 'N/A'}</span></div>
                    <div className="col-span-2"><span className="text-slate-500">Owner:</span> <span className="font-semibold">{ownerName}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                <p>
                  By submitting this application, you confirm that all provided information is accurate and that your pharmacy holds a valid state license. Approvals typically take 1-2 business days.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button type="button" onClick={handleBack} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {step === 3 ? 'Submit Application' : 'Continue'}
              {step < 3 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Pending State Component ───────────────────────────────────────────────────

function PendingState({ onCheckStatus, isLoading, onLogout }: { onCheckStatus: () => void; isLoading: boolean; onLogout: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-sm border border-amber-200">
        <Clock className="w-10 h-10 text-amber-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Under Review</h2>
      
      <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
        We've received your registration request. Our compliance team is currently verifying your license details. 
        You will receive an email once your partner dashboard is unlocked.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button 
          onClick={onCheckStatus} 
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Check Status
        </button>
        <button 
          onClick={onLogout}
          className="px-6 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
