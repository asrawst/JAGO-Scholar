import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DigiLockerDoc } from '../../types';
import { 
  X, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building2, 
  Sparkles, 
  Loader2,
  Lock,
  Layers,
  Award,
  GraduationCap,
  Banknote,
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FetchDigiLockerDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    digiLockerDocs, 
    importBatchDigiLockerDocs, 
    language,
    showToast 
  } = useApp();

  const isHi = language === 'hi';

  // Selected doc IDs for checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // When drawer opens, select documents that are not yet imported, or all documents
  useEffect(() => {
    if (isOpen) {
      // By default pre-check unimported documents, or all if none unimported
      const unimported = digiLockerDocs.filter(d => !d.isImported).map(d => d.id);
      if (unimported.length > 0) {
        setSelectedIds(unimported);
      } else {
        setSelectedIds(digiLockerDocs.map(d => d.id));
      }
    }
  }, [isOpen, digiLockerDocs]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Documents', labelHi: 'सभी दस्तावेज़' },
    { id: 'caste', label: 'Caste / Domicile', labelHi: 'जाति / निवास' },
    { id: 'income', label: 'Income', labelHi: 'आय प्रमाण पत्र' },
    { id: 'academic', label: 'Academic', labelHi: 'शैक्षणिक' },
    { id: 'identity', label: 'Identity', labelHi: 'पहचान' },
    { id: 'bank', label: 'Bank', labelHi: 'बैंक / APBS' }
  ];

  const filteredDocs = digiLockerDocs.filter(doc => {
    if (activeCategory === 'all') return true;
    return doc.category === activeCategory;
  });

  const allFilteredSelected = filteredDocs.length > 0 && filteredDocs.every(d => selectedIds.includes(d.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      // Unselect filtered docs
      const filteredDocIds = new Set(filteredDocs.map(d => d.id));
      setSelectedIds(prev => prev.filter(id => !filteredDocIds.has(id)));
    } else {
      // Select all filtered docs
      const newIds = new Set([...selectedIds, ...filteredDocs.map(d => d.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleToggleDoc = (docId: string) => {
    setSelectedIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleAddSelectedToWallet = async () => {
    if (selectedIds.length === 0) {
      showToast({
        type: 'warning',
        title: isHi ? 'कोई दस्तावेज़ नहीं चुना गया' : 'No Documents Selected',
        message: isHi ? 'कृपया जोड़ने के लिए कम से कम 1 दस्तावेज़ चुनें।' : 'Please select at least one document to add to your wallet.'
      });
      return;
    }

    setIsImporting(true);
    await importBatchDigiLockerDocs(selectedIds, false);
    setIsImporting(false);
    onClose();
  };

  const getCategoryIcon = (category: DigiLockerDoc['category']) => {
    switch (category) {
      case 'caste':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'income':
        return <Banknote className="w-5 h-5 text-emerald-600" />;
      case 'academic':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'identity':
        return <UserCheck className="w-5 h-5 text-sky-600" />;
      case 'bank':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getCategoryBg = (category: DigiLockerDoc['category']) => {
    switch (category) {
      case 'caste':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'income':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'academic':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'identity':
        return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'bank':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Clickable Backdrop to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
        aria-label="Close background"
      />

      {/* Sliding Window from Bottom */}
      <div className="bg-white rounded-t-[32px] shadow-2xl flex flex-col max-h-[88vh] w-full border-t border-slate-100 overflow-hidden transform transition-all duration-300 ease-out animate-slide-up">
        
        {/* Pull / Drag Indicator Handle */}
        <div className="pt-3 pb-1 flex justify-center flex-shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 pt-2 pb-3 border-b border-slate-100 flex-shrink-0 flex items-start justify-between bg-gradient-to-b from-slate-50/80 to-white">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0E2954] text-white tracking-wide">
                <Lock className="w-3 h-3 mr-1 text-amber-400" />
                DigiLocker Depository
              </span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                IT Act 2000 Valid
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-1.5">
              <span>{isHi ? 'डिजिलॉकर से दस्तावेज़ प्राप्त करें' : 'Fetch DigiLocker Documents'}</span>
            </h3>

            <p className="text-xs text-slate-500 leading-snug">
              {isHi 
                ? 'अपने आधार से जुड़े डिजिटल प्रमाण पत्र चुनें और सीधे अपने वॉलेट में जोड़ें।'
                : 'Select official verified certificates from your linked account to add to your app wallet.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0 mt-0.5 ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters and Select All Header */}
        <div className="px-5 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex flex-col space-y-2.5 flex-shrink-0">
          {/* Top Row: Select All Checkbox & Count */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center space-x-2 group cursor-pointer text-left"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                allFilteredSelected 
                  ? 'bg-[#0E2954] border-[#0E2954] text-white shadow-xs' 
                  : 'bg-white border-slate-300 group-hover:border-slate-400'
              }`}>
                {allFilteredSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-slate-950">
                {isHi ? 'सभी का चयन करें' : 'Select All'} ({filteredDocs.length})
              </span>
            </button>

            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60">
              {selectedIds.length} {isHi ? 'चयनित' : 'Selected'}
            </span>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all ${
                    isActive
                      ? 'bg-[#0E2954] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {isHi ? cat.labelHi : cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Cards List with Individual Checkboxes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
          {filteredDocs.map((doc) => {
            const isSelected = selectedIds.includes(doc.id);
            const isExpanded = expandedDocId === doc.id;

            return (
              <div 
                key={doc.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isSelected 
                    ? 'border-[#0E2954]/50 bg-blue-50/30 shadow-xs ring-1 ring-[#0E2954]/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Main Card Header Row */}
                <div 
                  onClick={() => handleToggleDoc(doc.id)}
                  className="p-3.5 flex items-start space-x-3 cursor-pointer select-none"
                >
                  {/* Custom Checkbox */}
                  <div className="pt-0.5 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#0E2954] border-[#0E2954] text-white shadow-xs' 
                        : 'bg-white border-slate-300 hover:border-slate-400'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Category Icon Badge */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${getCategoryBg(doc.category)}`}>
                    {getCategoryIcon(doc.category)}
                  </div>

                  {/* Document Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        {doc.name}
                      </h4>
                      {doc.isImported && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex-shrink-0">
                          {isHi ? 'वॉलेट में है ✓' : 'In Wallet ✓'}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {doc.issuerOrg || doc.source}
                    </p>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 pt-0.5 text-[10px] text-slate-600 font-mono">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                        {doc.docNumber}
                      </span>
                      {doc.issuedDate && (
                        <span className="flex items-center text-slate-500 font-sans">
                          <Calendar className="w-3 h-3 mr-0.5 text-slate-400" />
                          {doc.issuedDate}
                        </span>
                      )}
                      <span className="text-emerald-600 font-bold font-sans flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" />
                        SHA-256 Signed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Preview Details Snippet Toggle */}
                {doc.previewSnippet && Object.keys(doc.previewSnippet).length > 0 && (
                  <div className="border-t border-slate-100 px-3.5 py-1.5 bg-slate-50/60 flex items-center justify-between text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDocId(isExpanded ? null : doc.id);
                      }}
                      className="text-[#0E2954] hover:text-blue-900 font-bold flex items-center space-x-1"
                    >
                      <span>{isExpanded ? (isHi ? 'विवरण छिपाएं' : 'Hide Certificate Details') : (isHi ? 'प्रमाण पत्र विवरण देखें' : 'View Certificate Details')}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                  </div>
                )}

                {/* Expanded Snippet Content */}
                {isExpanded && doc.previewSnippet && (
                  <div className="p-3 bg-white border-t border-slate-100 text-xs space-y-1.5 animate-fade-in">
                    <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-[11px]">
                      {Object.entries(doc.previewSnippet).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-baseline border-b border-slate-200/50 pb-1 last:border-0 last:pb-0">
                          <span className="text-slate-500 font-sans text-[10px] uppercase font-bold">{key}:</span>
                          <span className="text-slate-900 font-semibold text-right max-w-[65%] truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sticky Bottom Action Footer */}
        <div className="p-4 bg-white border-t border-slate-200/90 flex-shrink-0 flex items-center space-x-3 shadow-lg">
          <button
            onClick={onClose}
            disabled={isImporting}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors disabled:opacity-50"
          >
            {isHi ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            onClick={handleAddSelectedToWallet}
            disabled={isImporting || selectedIds.length === 0}
            className="flex-[2] bg-gradient-to-r from-amber-500 via-[#F57C00] to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{isHi ? 'वॉलेट में जोड़े जा रहे हैं...' : 'Adding to Wallet...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>
                  {isHi 
                    ? `वॉलेट में जोड़ें (${selectedIds.length})` 
                    : `Add to Wallet (${selectedIds.length} Docs)`}
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
