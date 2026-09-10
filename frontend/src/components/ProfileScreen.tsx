import React, { useState } from 'react';
import { User, Bell, MapPin, ShieldCheck, Heart, FileText, ChevronRight, Check, ExternalLink, Edit3, Save, X, Upload, FileSignature, Globe } from 'lucide-react';
import { Prescription } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProfileScreenProps {
  currentLocation: string;
  insuranceProvider: string;
  onOpenLocationModal: () => void;
  onChangeInsurance: (provider: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentLocation,
  insuranceProvider,
  onOpenLocationModal,
  onChangeInsurance,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [profileName, setProfileName] = useState('Aarav Mehta');
  const [profileEmail, setProfileEmail] = useState('aarav.mehta@healthcare-sample.org');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);

  const [priceAlerts, setPriceAlerts] = useState(true);
  const [regulatoryAlerts, setRegulatoryAlerts] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(false);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'rx-1',
      userId: 'u-1',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=150&auto=format&fit=crop&q=80',
      uploadedAt: 'Sep 05, 2026',
      status: 'verified',
      notes: 'Dr. Sharma - Valid for 3 refills',
    },
    {
      id: 'rx-2',
      userId: 'u-1',
      imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=150&auto=format&fit=crop&q=80',
      uploadedAt: 'Today',
      status: 'pending_review',
    }
  ]);

  const handleSimulateRxUpload = () => {
    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      userId: 'u-1',
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=150&auto=format&fit=crop&q=80',
      uploadedAt: 'Just now',
      status: 'pending_review',
    };
    setPrescriptions([newRx, ...prescriptions]);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) setProfileName(tempName.trim());
    if (tempEmail.trim()) setProfileEmail(tempEmail.trim());
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'AM';
  };

  return (
    <div className="pb-28 space-y-4 px-4 pt-3 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Edit Profile Details</span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="e.g. Aarav Mehta"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="e.g. member@healthcare-sample.org"
                required
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempName(profileName);
                  setTempEmail(profileEmail);
                  setIsEditing(false);
                }}
                className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
              {getInitials(profileName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">{profileName}</h2>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{profileEmail}</p>
              <div className="text-[11px] text-slate-400 mt-0.5">Jan Aushadhi Care ID #JA-9421</div>
            </div>
            <button
              onClick={() => {
                setTempName(profileName);
                setTempEmail(profileEmail);
                setIsEditing(true);
              }}
              className="p-2 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors"
              title="Edit Profile"
              id="edit-profile-btn"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Primary Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Preferences & District
        </span>

        <button
          onClick={onOpenLocationModal}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">{t.profile.preferences}</div>
              <div className="text-[11px] text-slate-500">{currentLocation}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Language Selector */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">{t.profile.language}</div>
                <div className="text-[11px] text-slate-500">English / Español</div>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
            </select>
          </div>
        </div>

        {/* Insurance Selector */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Insurance Provider</div>
                <div className="text-[11px] text-slate-500">Check formulary co-pays</div>
              </div>
            </div>
            <select
              value={insuranceProvider}
              onChange={(e) => onChangeInsurance(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="None">None (Cash Price)</option>
              <option value="Medicare Part D">Medicare Part D</option>
              <option value="Aetna">Aetna</option>
              <option value="BlueCross">BlueCross BlueShield</option>
              <option value="Cigna">Cigna</option>
            </select>
          </div>
        </div>

        {/* Notifications toggles */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between py-1.5 text-xs">
            <div>
              <div className="font-semibold text-slate-900">Price Drop Alerts</div>
              <div className="text-[11px] text-slate-500">Notify when saved medicines drop in cost</div>
            </div>
            <input
              type="checkbox"
              checked={priceAlerts}
              onChange={(e) => setPriceAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
          </div>

          <div className="flex items-center justify-between py-1.5 text-xs">
            <div>
              <div className="font-semibold text-slate-900">FDA Bioequivalence Sync</div>
              <div className="text-[11px] text-slate-500">Alerts when new generic formulations receive AB rating</div>
            </div>
            <input
              type="checkbox"
              checked={regulatoryAlerts}
              onChange={(e) => setRegulatoryAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* My Prescriptions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            My Prescriptions
          </span>
          <button 
            onClick={handleSimulateRxUpload}
            className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Upload className="w-3 h-3" /> Upload Rx
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {prescriptions.map(rx => (
            <div key={rx.id} className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center">
              <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                <img src={rx.imageUrl} alt="Prescription snippet" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <FileSignature className="w-3.5 h-3.5 text-slate-400" /> Rx Scan
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    rx.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    rx.status === 'pending_review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {rx.status === 'verified' ? 'Verified' : rx.status === 'pending_review' ? 'In Review' : 'Rejected'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Uploaded {rx.uploadedAt}</div>
                {rx.notes && <div className="text-[10px] text-slate-600 font-medium mt-1 truncate">{rx.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory & Safety Guide */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>About GenericMed Regulatory Standards</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Generic medicines contain the exact same active pharmaceutical ingredient (API), strength, dosage form, and route of administration as brand-name drugs.
        </p>
        <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-900 leading-relaxed">
          <span className="font-bold">FDA Orange Book (AB Rating):</span> Products rated AB meet all bioequivalence guidelines and produce identical therapeutic serum levels in human subjects.
        </div>
      </div>
    </div>
  );
};
