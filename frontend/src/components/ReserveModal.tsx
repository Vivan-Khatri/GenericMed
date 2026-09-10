import React, { useState } from 'react';
import { X, CheckCircle2, MapPin, Clock, ArrowRight, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ChemistOffer, Medicine, Reservation } from '../types';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: ChemistOffer | null;
  medicine: Medicine | null;
  onConfirmReservation: (reservation: Reservation) => void;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  onClose,
  offer,
  medicine,
  onConfirmReservation,
}) => {
  const [copied, setCopied] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!isOpen || !offer || !medicine) return null;

  const reservationCode = `GM-${Math.floor(1000 + Math.random() * 9000)}-NY`;

  const handleConfirm = () => {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationCode,
      medicineName: offer.productBrandName,
      genericName: medicine.genericName,
      pharmacyName: offer.pharmacyName,
      pharmacyAddress: offer.pharmacyAddress,
      phone: offer.phone,
      price: offer.price,
      originalPrice: offer.originalPrice,
      savings: offer.originalPrice - offer.price,
      packCount: offer.packCount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: '24 Hours from now',
      status: 'Active',
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
    };

    setReserved(true);
    onConfirmReservation(newReservation);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(reservationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95"
        id="reserve-medicine-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {reserved ? 'Reservation Confirmed' : 'Reserve at Chemist'}
              </h3>
              <p className="text-xs text-slate-500">24-hour guaranteed price lock at dispensary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {!reserved ? (
            <>
              {/* Product & Store Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      {offer.bioequivalenceRating}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {offer.productBrandName} ({medicine.dosage})
                    </h4>
                    <p className="text-xs text-slate-500">
                      {medicine.activeChemical} • {offer.packCount} Tablets
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold text-slate-900">
                      ₹{offer.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                      ₹{offer.originalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Your Savings:</span>
                  <span className="text-emerald-700 font-bold">
                    Save ₹{(offer.originalPrice - offer.price).toFixed(2)} ({offer.discountPercent}% OFF)
                  </span>
                </div>
              </div>

              {/* Chemist Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">{offer.pharmacyName}</div>
                    <div className="text-slate-500 mt-0.5">{offer.pharmacyAddress}</div>
                    <div className="text-slate-500 mt-0.5">{offer.openHours}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-emerald-50/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-emerald-950">Ready Time</div>
                      <div className="text-emerald-800 text-[11px]">{offer.readyTime} for walk-in pickup</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    In Stock (42 units)
                  </span>
                </div>
              </div>

              {/* Delivery / Pickup Toggle */}
              {offer.hasHomeDelivery && (
                <div className="space-y-3 p-3 border border-sky-200 bg-sky-50/50 rounded-xl">
                  <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
                        deliveryType === 'pickup' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Store Pickup
                    </button>
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
                        deliveryType === 'delivery' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Home Delivery
                    </button>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                      <div className="text-[11px] text-sky-800 font-medium flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="font-bold">45-60 mins</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter full delivery address..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleConfirm}
                className="w-full py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                id="confirm-reservation-btn"
              >
                <span>Lock Price & Generate Pickup Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Reservation Pass State */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Price Locked at ₹{offer.price.toFixed(2)}
                </h4>
                <p className="text-xs text-emerald-800">
                  {deliveryType === 'delivery' 
                    ? `Delivery requested from ${offer.pharmacyName}.` 
                    : `Hold active for 24 hours at ${offer.pharmacyName}.`}
                </p>

                {/* Digital Token Code */}
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-extrabold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 tracking-wider">
                    {reservationCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-slate-700 transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-3">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scan at Pharmacy Counter</div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={`${reservationCode}|${offer.pharmacyId}|${offer.productBrandName}`}
                    size={140}
                    level="M"
                    includeMargin={false}
                    fgColor="#0f172a"
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  REF: {offer.pharmacyId.toUpperCase()}-{reservationCode}
                </span>
              </div>

              {/* Pickup/Delivery Guide */}
              <div className="text-xs text-slate-600 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {deliveryType === 'delivery' ? (
                  <>
                    <div className="font-bold text-slate-900">Delivery Instructions:</div>
                    <div>1. Chemist will review and dispatch your order.</div>
                    <div>2. Pay ₹{offer.price.toFixed(2)} (+ delivery fee) upon arrival.</div>
                    <div>3. Show this token or Rx if required by state law.</div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-slate-900">Pickup Instructions:</div>
                    <div>1. Show this token or code at the chemist dispensing counter.</div>
                    <div>2. Present valid doctor prescription if required by state law.</div>
                    <div>3. Pay ₹{offer.price.toFixed(2)} directly to chemist upon verification.</div>
                  </>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Done & View Saved
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
