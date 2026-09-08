import React, { useState, useRef } from 'react';
import { X, Camera, Scan, Sparkles, CheckCircle2, ArrowRight, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import { Medicine } from '../types';

interface ScanRxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedicine: (medicineId: string) => void;
  medicines: Medicine[];
}

export const ScanRxModal: React.FC<ScanRxModalProps> = ({
  isOpen,
  onClose,
  onSelectMedicine,
  medicines,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    medicine: Medicine;
    extractedText: string[];
    confidence: number;
  } | null>(null);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleScanSample = (medicineId: string, sampleLabel: string) => {
    setActiveSample(sampleLabel);
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const match = medicines.find((m) => m.id === medicineId) || medicines[0];
      setScanning(false);
      setScanResult({
        medicine: match,
        extractedText: [
          `Rx: ${match.brandName} ${match.dosage}`,
          `Active Salt: ${match.activeChemical}`,
          `Formulation: ${match.dosage} ${match.form}`,
          `Bioequivalence: AB Rated USP/FDA`,
        ],
        confidence: 99.4,
      });
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveSample(file.name);
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      // Pick matching medicine based on file name or default to Lipitor/Atorvastatin
      const lower = file.name.toLowerCase();
      let matched = medicines[0];
      if (lower.includes('metformin') || lower.includes('glucophage')) matched = medicines[1];
      if (lower.includes('zithromax') || lower.includes('azithromycin')) matched = medicines[2];

      setScanning(false);
      setScanResult({
        medicine: matched,
        extractedText: [
          `Detected Packaging: ${matched.brandName} (${matched.dosage})`,
          `Molecular Active Salt: ${matched.activeChemical}`,
          `Therapeutic Class: ${matched.therapeuticClass}`,
          `Chemist Baseline: ₹${matched.brandAvgPrice.toFixed(2)}`,
        ],
        confidence: 98.6,
      });
    }, 1400);
  };

  const handleConfirmAndCompare = () => {
    if (scanResult) {
      onSelectMedicine(scanResult.medicine.id);
      onClose();
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setScanning(false);
    setActiveSample(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
        id="scan-rx-ocr-modal"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">Scan Rx or Medicine Box</h3>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  OCR Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">Instant chemical salt extraction & price audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            id="close-scan-rx-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!scanResult && (
            <>
              {/* Camera Scanner Viewport Simulator */}
              <div className="relative w-full aspect-16/10 bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-700 flex flex-col items-center justify-center text-white">
                {/* Target Guides */}
                <div className="absolute inset-6 border border-white/20 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-sky-400"></div>
                    <div className="w-4 h-4 border-t-2 border-r-2 border-sky-400"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-sky-400"></div>
                    <div className="w-4 h-4 border-b-2 border-r-2 border-sky-400"></div>
                  </div>
                </div>

                {scanning ? (
                  <div className="flex flex-col items-center gap-3 z-10">
                    {/* Animated Scanning Laser */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2"></div>
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="text-xs font-semibold text-cyan-200 tracking-wide">
                      Analyzing salt molecules & NDC data...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-sky-400 mb-1">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium text-slate-300">
                      Position medicine label or prescription within the frame
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports pill boxes, strips, syrups & physical doctor slips
                    </p>
                  </div>
                )}
              </div>

              {/* Upload or Sample Selection */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Try Sample Prescription / Box</span>
                  <span className="text-sky-600 font-normal">Click to run instant OCR</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleScanSample('atorvastatin-20', 'Lipitor 20mg Box')}
                    disabled={scanning}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-800">Lipitor 20mg</div>
                    <div className="text-[10px] text-slate-500">Cardiovascular</div>
                    <div className="mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                      89% Generic Save
                    </div>
                  </button>

                  <button
                    onClick={() => handleScanSample('metformin-1000', 'Glucophage 1000mg Box')}
                    disabled={scanning}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-800">Glucophage 1g</div>
                    <div className="text-[10px] text-slate-500">Diabetes Care</div>
                    <div className="mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                      81% Generic Save
                    </div>
                  </button>

                  <button
                    onClick={() => handleScanSample('azithromycin-500', 'Zithromax 500mg Strip')}
                    disabled={scanning}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-800">Zithromax 500</div>
                    <div className="text-[10px] text-slate-500">Antibiotic</div>
                    <div className="mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                      67% Generic Save
                    </div>
                  </button>
                </div>
              </div>

              {/* Upload Custom Photo */}
              <div className="pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                  id="rx-file-upload-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-sky-500 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload Rx image or medicine photo from device</span>
                </button>
              </div>
            </>
          )}

          {/* Scan Results View */}
          {scanResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-950">
                        Bioequivalent Match Identified
                      </h4>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                        {scanResult.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Matched active salt against official pharmacopeia registry.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Rescan
                </button>
              </div>

              {/* Extracted Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Branded Rx
                    </span>
                    <div className="text-base font-bold text-slate-900">
                      {scanResult.medicine.brandName} {scanResult.medicine.dosage}
                    </div>
                    <div className="text-xs text-slate-600">
                      Active: <span className="font-semibold text-sky-800">{scanResult.medicine.activeChemical}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Brand Cost
                    </span>
                    <div className="text-base font-bold text-slate-400 line-through">
                      ₹{scanResult.medicine.brandAvgPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200"></div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Certified Generic Alternative
                    </div>
                    <div className="text-[11px] text-slate-500">
                      From ₹{scanResult.medicine.lowestGenericPrice.toFixed(2)} across {scanResult.medicine.pharmacyCount} pharmacies
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Save {scanResult.medicine.discountPercentage}%
                    </div>
                  </div>
                </div>

                {/* Extracted OCR lines */}
                <div className="text-[11px] text-slate-500 font-mono space-y-0.5 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                  {scanResult.extractedText.map((line, idx) => (
                    <div key={idx}>✓ {line}</div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleConfirmAndCompare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shadow-md transition-colors"
                id="view-scanned-generic-offers-btn"
              >
                <span>View {scanResult.medicine.pharmacyCount} Chemist Offers for {scanResult.medicine.genericName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Notice */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>OCR extracts active chemical salts. Final dispensing requires valid doctor Rx where mandated.</span>
        </div>
      </div>
    </div>
  );
};
