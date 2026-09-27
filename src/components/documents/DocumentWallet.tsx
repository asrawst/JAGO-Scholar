import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderLock, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  RotateCw, 
  Camera,
  Eye,
  X,
  Lock,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DigiLockerDoc } from '../../types';
import { DigiLockerConsentModal } from './DigiLockerConsentModal';
import { FetchDigiLockerDrawer } from './FetchDigiLockerDrawer';

export const DocumentWallet: React.FC = () => {
  const { 
    digiLockerDocs, 
    profile, 
    language, 
    isDigiLockerModalOpen, 
    setIsDigiLockerModalOpen,
    importDigiLockerDoc,
    isAuthenticated,
    showToast 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<DigiLockerDoc | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFetchingDocs, setIsFetchingDocs] = useState(false);
  const [isFetchDrawerOpen, setIsFetchDrawerOpen] = useState(false);

  const isHi = language === 'hi';
  const isDigiLockerConnected = isAuthenticated || digiLockerDocs.some(d => d.isImported || d.verificationStatus === 'verified') || profile.family.incomeVerificationStatus === 'verified';

  const categories = [
    { id: 'all', label: 'All Docs', labelHi: 'सभी दस्तावेज' },
    { id: 'caste', label: 'ST Caste', labelHi: 'एसटी जाति' },
    { id: 'income', label: 'Income', labelHi: 'आय प्रमाण पत्र' },
    { id: 'academic', label: 'Academic', labelHi: 'शैक्षणिक' },
    { id: 'identity', label: 'Identity', labelHi: 'पहचान' }
  ];

  const filteredDocs = digiLockerDocs.filter(doc => {
    if (activeCategory === 'all') return true;
    return doc.category === activeCategory;
  });

  const handleFetchDocuments = async () => {
    setIsFetchingDocs(true);

    for (const doc of digiLockerDocs) {
      if (doc.verificationStatus !== 'verified') {
        await importDigiLockerDoc(doc.id, true);
      }
    }

    setIsFetchingDocs(false);
    showToast({
      type: 'success',
      title: isHi ? 'दस्तावेज सफलतापूर्वक प्राप्त हुए' : 'Documents Fetched Successfully',
      message: isHi 
        ? 'डिजिलॉकर से सभी प्रमाण पत्र डिजिटल रूप से सत्यापित कर लिए गए हैं।' 
        : 'All 4 digital certificates retrieved and verified via DigiLocker API.'
    });
  };

  const handleRefreshVerification = (doc: DigiLockerDoc) => {
    showToast({
      type: 'success',
      title: 'Digital Signature Re-Validated',
      message: `${doc.name} digital certificate verified against official SHA-256 state repository.`
    });
  };

  return (
    <div className="p-4 space-y-4 pb-32 sm:pb-36 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderLock className="w-5 h-5 text-mota-saffron" />
            <span>{isHi ? 'डिजिटल दस्तावेज वॉलेट' : 'DigiLocker Document Wallet'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {isHi ? 'एक बार सत्यापित कराएं → सभी 5 छात्रवृत्तियों में पुनः उपयोग करें' : 'Verify Once → Reuse Across All 5 MoTA Scholarships'}
          </p>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center space-x-1 text-xs font-bold"
          title="Scan Physical Certificate"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Scan</span>
        </button>
      </div>

      {/* Connect DigiLocker Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 shadow-lg space-y-2.5 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-[10px] font-mono bg-white/10 text-blue-200 px-2.5 py-0.5 rounded-full uppercase font-bold border border-white/10 whitespace-nowrap">
              National Document Depository
            </span>
            {isDigiLockerConnected && (
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 inline-flex items-center space-x-1 whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{isHi ? 'कनेक्टेड' : 'Connected ✓'}</span>
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-base text-white">
            {isHi ? 'डिजिलॉकर सरकारी एकीकरण' : 'DigiLocker Integration'}
          </h3>
          <p className="text-xs text-blue-200 leading-relaxed">
            {isHi 
              ? 'सरकारी जारीकर्ता से सीधे डिजिटल हस्ताक्षर युक्त प्रमाण पत्र प्राप्त करें।' 
              : 'Directly fetch digitally signed certificates with legal validity under IT Act 2000.'}
          </p>
        </div>

        {isDigiLockerConnected ? (
          <button
            onClick={() => setIsFetchDrawerOpen(true)}
            className="w-full bg-gradient-to-r from-amber-400 to-mota-saffron hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
          >
            <FolderLock className="w-4 h-4 text-slate-950" />
            <span>
              {isHi ? 'दस्तावेज़ प्राप्त करें (डिजिलॉकर)' : 'Fetch Documents'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsDigiLockerModalOpen(true)}
            className="w-full bg-gradient-to-r from-amber-400 to-mota-saffron hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
          >
            <FolderLock className="w-4 h-4" />
            <span>{isHi ? 'डिजिलॉकर कनेक्ट करें एवं प्रमाण पत्र सिंक करें' : 'Connect DigiLocker & Sync Certificates'}</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-mota-navy text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isHi ? cat.labelHi : cat.label}
          </button>
        ))}
      </div>

      {/* Document Cards Feed */}
      <div className="space-y-3">
        {filteredDocs.map(doc => {
          const isVerified = doc.verificationStatus === 'verified';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-card-soft space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-mota-navy mt-0.5 flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                      {doc.category} • {doc.source}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-0.5 leading-tight truncate">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                      {doc.docNumber}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 inline-flex items-center text-center justify-center self-start ${
                  isVerified 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {isVerified ? 'Verified ✓' : 'Pending Sync'}
                </span>
              </div>

              {/* Digital Metadata Snippet */}
              <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuer Authority:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{doc.issuerOrg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issued / Synced:</span>
                  <span className="font-medium text-slate-800">{doc.issuedDate}</span>
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Reusable across 5 schemes ✓
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRefreshVerification(doc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    title="Re-verify Hash"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isHi ? 'पूर्वावलोकन' : 'View'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-mota-navy text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 font-mono font-bold uppercase">Digital Certificate</span>
                <h3 className="font-black text-sm text-white">{previewDoc.name}</h3>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                {Object.entries(previewDoc.previewSnippet).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">{key}:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[200px]">{val}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>DigiLocker Trust Mark Verified</span>
                </div>
                <p>This certificate is digitally signed and tamper-evident under Section 9A of the Information Technology Act.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-full bg-mota-navy text-white font-bold py-2.5 rounded-2xl text-xs"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Document Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-mota-navy text-white flex items-center justify-between">
              <h3 className="font-black text-sm text-white">Smart Document Scanner</h3>
              <button onClick={() => setIsScannerOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4 flex-1">
              <div className="w-48 h-48 border-2 border-dashed border-mota-saffron rounded-3xl mx-auto flex flex-col items-center justify-center bg-amber-50/50 space-y-2 relative">
                <Camera className="w-8 h-8 text-mota-saffron animate-pulse" />
                <span className="text-[11px] font-bold text-slate-700">Align Certificate in Camera</span>
                <span className="text-[10px] text-slate-400">OCR edge detection active</span>
              </div>

              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                AI will scan QR code, extract certificate number, and auto-verify with State Revenue database.
              </p>

              <button
                onClick={() => {
                  setIsScannerOpen(false);
                  showToast({
                    type: 'success',
                    title: 'Certificate Scanned & Verified',
                    message: 'QR code matched with state portal. Added to verified wallet.'
                  });
                }}
                className="w-full bg-mota-saffron hover:bg-amber-600 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md"
              >
                Simulate Capture & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Window from Bottom: Fetch DigiLocker Documents */}
      <FetchDigiLockerDrawer 
        isOpen={isFetchDrawerOpen} 
        onClose={() => setIsFetchDrawerOpen(false)} 
      />
    </div>
  );
};
