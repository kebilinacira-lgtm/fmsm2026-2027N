import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  RotateCcw, 
  Link as LinkIcon, 
  AlertCircle,
  Camera,
  Maximize2,
  Sliders,
  Building2,
  School,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export type LogoTargetType = 'university' | 'faculty';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLogo?: LogoTargetType;
  initialTarget?: LogoTargetType;
  currentLogoUrl?: string; // Backwards compatible
  currentUniversityLogoUrl?: string;
  currentFacultyLogoUrl?: string;
  universityLogoSize?: number;
  initialSize?: number;
  facultyLogoSize?: number;
  initialFacultySize?: number;
  logoDisplayMode?: 'single' | 'both';
  singleLogoChoice?: 'faculty' | 'university';
  onLogoUpdated: ((newLogoUrl: string) => void) | ((target: LogoTargetType, newLogoUrl: string) => void);
  onSizeUpdated?: (target: LogoTargetType, newSize: number) => void;
  onDisplayModeChange?: (mode: 'single' | 'both') => void;
  onSingleLogoChoiceChange?: (choice: 'faculty' | 'university') => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({
  isOpen,
  onClose,
  targetLogo,
  initialTarget = 'university',
  currentLogoUrl = '/logo_univ_ouargla.png',
  currentUniversityLogoUrl = '/logo_univ_ouargla.png',
  currentFacultyLogoUrl = '/logo_faculty_fmsm.png',
  universityLogoSize,
  initialSize = 54,
  facultyLogoSize,
  initialFacultySize = 54,
  logoDisplayMode = 'single',
  singleLogoChoice = 'faculty',
  onLogoUpdated,
  onSizeUpdated,
  onDisplayModeChange,
  onSingleLogoChoiceChange,
}) => {
  const resolvedTarget = targetLogo || initialTarget;
  const resolvedUnivSize = universityLogoSize ?? initialSize;
  const resolvedFacultySize = facultyLogoSize ?? initialFacultySize;

  const [activeTarget, setActiveTarget] = useState<LogoTargetType>(resolvedTarget);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [syncBothSizes, setSyncBothSizes] = useState(true);

  // Local size state for instant responsive live sliding
  const [currentSize, setCurrentSize] = useState<number>(
    resolvedTarget === 'university' ? resolvedUnivSize : resolvedFacultySize
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync active target when prop changes
  useEffect(() => {
    setActiveTarget(resolvedTarget);
  }, [resolvedTarget]);

  // When active target switches, reset preview and set size
  useEffect(() => {
    setPreviewUrl(null);
    setImageUrlInput('');
    setStatusMessage(null);
    setCurrentSize(activeTarget === 'university' ? universityLogoSize : facultyLogoSize);
  }, [activeTarget, universityLogoSize, facultyLogoSize]);

  // Handle paste events (Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processFile(blob);
            setStatusMessage({ type: 'success', text: 'تم التقاط الصورة من الحافظة بنجاح!' });
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, activeTarget]);

  if (!isOpen) return null;

  const activeCurrentUrl = activeTarget === 'university' 
    ? (currentUniversityLogoUrl || currentLogoUrl)
    : currentFacultyLogoUrl;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP).' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميغابايت.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
        setStatusMessage({ type: 'success', text: 'تم تحميل الصورة بنجاح! اضغط على "اعتماد وحفظ الشعار".' });
      }
    };
    reader.onerror = () => {
      setStatusMessage({ type: 'error', text: 'حدث خطأ أثناء قراءة ملف الصورة.' });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى إدخال رابط الصورة أولاً.' });
      return;
    }
    setPreviewUrl(imageUrlInput.trim());
    setStatusMessage({ type: 'success', text: 'تم جلب رابط الصورة للمعاينة. اضغط على "اعتماد وحفظ الشعار".' });
  };

  // Change size slider
  const handleSizeChange = (newSize: number) => {
    setCurrentSize(newSize);
    if (onSizeUpdated) {
      onSizeUpdated(activeTarget, newSize);
      if (syncBothSizes) {
        onSizeUpdated(activeTarget === 'university' ? 'faculty' : 'university', newSize);
      }
    }
  };

  const handleSaveLogo = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setStatusMessage(null);

    const storageKey = activeTarget === 'university' ? 'fmsm_custom_logo_url' : 'fmsm_faculty_logo_url';

    try {
      // 1. Store in localStorage for immediate client persistence
      try {
        localStorage.setItem(storageKey, previewUrl);
      } catch (e) {
        console.warn('localStorage setItem failed:', e);
      }

      // 2. Upload to server
      if (previewUrl.startsWith('data:image')) {
        const response = await fetch('/api/upload-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imageBase64: previewUrl,
            logoType: activeTarget 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newUrl = data.logoUrl || previewUrl;
          if (onLogoUpdated.length === 2) {
            (onLogoUpdated as (target: LogoTargetType, url: string) => void)(activeTarget, newUrl);
          } else {
            (onLogoUpdated as (url: string) => void)(newUrl);
          }
        } else {
          if (onLogoUpdated.length === 2) {
            (onLogoUpdated as (target: LogoTargetType, url: string) => void)(activeTarget, previewUrl);
          } else {
            (onLogoUpdated as (url: string) => void)(previewUrl);
          }
        }
      } else {
        if (onLogoUpdated.length === 2) {
          (onLogoUpdated as (target: LogoTargetType, url: string) => void)(activeTarget, previewUrl);
        } else {
          (onLogoUpdated as (url: string) => void)(previewUrl);
        }
      }

      const targetTitleAr = activeTarget === 'university' ? 'شعار الجامعة' : 'شعار الكلية';
      setStatusMessage({ type: 'success', text: `تم تحديث ${targetTitleAr} وحجمه بنجاح عبر كامل المنصة!` });
      
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.warn('Upload to server failed, applying locally:', err);
      if (onLogoUpdated.length === 2) {
        (onLogoUpdated as (target: LogoTargetType, url: string) => void)(activeTarget, previewUrl);
      } else {
        (onLogoUpdated as (url: string) => void)(previewUrl);
      }
      setStatusMessage({ type: 'success', text: 'تم حفظ الشعار في متصفحك بنجاح!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = () => {
    const storageKey = activeTarget === 'university' ? 'fmsm_custom_logo_url' : 'fmsm_faculty_logo_url';
    localStorage.removeItem(storageKey);

    const defaultUrl = activeTarget === 'university' 
      ? `/logo_univ_ouargla.png?default=${Date.now()}`
      : `/logo_faculty_fmsm.png?default=${Date.now()}`;

    setPreviewUrl(null);

    if (onLogoUpdated.length === 2) {
      (onLogoUpdated as (target: LogoTargetType, url: string) => void)(activeTarget, defaultUrl);
    } else {
      (onLogoUpdated as (url: string) => void)(defaultUrl);
    }

    // Reset size to 54px
    handleSizeChange(54);

    setStatusMessage({ type: 'success', text: 'تمت استعادة الشعار والحجم الافتراضي.' });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const targetTitle = activeTarget === 'university' 
    ? 'شعار جامعة قاصدي مرباح ورقلة (UKMO)' 
    : 'شعار كلية الرياضيات وعلوم المادة (FMSM)';

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Camera className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">إدارة الشعارات الرسمية والتحكم في الحجم</h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                تغيير شعار الجامعة، شعار الكلية، وضبط الحجم والعرض المباشر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Display Mode Selection: Single Logo vs Dual Logos */}
          <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  نمط عرض الشعار في شريط التنقل والواجهة:
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تخصيص الواجهة: شعار واحد فقط لمظهر بسيط وغير مكرر، أو شعارين متجاورين
                </p>
              </div>

              <div className="inline-flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => onDisplayModeChange?.('single')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    logoDisplayMode === 'single'
                      ? 'bg-emerald-800 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  شعار واحد فقط (المعتمد)
                </button>
                <button
                  type="button"
                  onClick={() => onDisplayModeChange?.('both')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    logoDisplayMode === 'both'
                      ? 'bg-emerald-800 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  شعارين متجاورين
                </button>
              </div>
            </div>

            {logoDisplayMode === 'single' && onSingleLogoChoiceChange && (
              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  اختر الشعار الأساسي المعروض حالياً:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSingleLogoChoiceChange('faculty');
                      setActiveTarget('faculty');
                    }}
                    className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      singleLogoChoice === 'faculty'
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold shadow-xs'
                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-white'
                    }`}
                  >
                    شعار الكلية (FMSM)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSingleLogoChoiceChange('university');
                      setActiveTarget('university');
                    }}
                    className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      singleLogoChoice === 'university'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-white'
                    }`}
                  >
                    شعار الجامعة (UKMO)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logo Selector Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTarget('university')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTarget === 'university'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <School className="w-4 h-4 text-amber-300" />
              <span>شعار الجامعة (UKMO)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTarget('faculty')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTarget === 'faculty'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>شعار الكلية (FMSM)</span>
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
            }`}>
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Size Control Slider & Presets */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  التحكم في حجم وعرض الشعار:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                  {currentSize}px
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  ({currentSize <= 42 ? 'صغير' : currentSize <= 56 ? 'متوسط' : currentSize <= 70 ? 'كبير' : 'بارز جداً'})
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="36"
                max="92"
                step="2"
                value={currentSize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="flex-1 accent-emerald-700 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </div>

            {/* Quick Size Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: 'صغير', size: 40 },
                  { label: 'افتراضي قياسي', size: 54 },
                  { label: 'كبير', size: 68 },
                  { label: 'بارز جداً', size: 84 }
                ].map((preset) => (
                  <button
                    key={preset.size}
                    type="button"
                    onClick={() => handleSizeChange(preset.size)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentSize === preset.size
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label} ({preset.size}px)
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={syncBothSizes}
                  onChange={(e) => setSyncBothSizes(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <span>تطبيق نفس الحجم على الشعارين</span>
              </label>
            </div>
          </div>

          {/* Side by Side Live Visual Preview */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            {/* Current Logo in chosen size */}
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                الشعار الحالي ({activeTarget === 'university' ? 'الجامعة' : 'الكلية'}):
              </span>
              <div 
                style={{ width: `${Math.min(currentSize, 90)}px`, height: `${Math.min(currentSize, 90)}px` }}
                className="rounded-full bg-white p-1 border-2 border-slate-300 dark:border-slate-600 shadow-sm flex items-center justify-center overflow-hidden transition-all duration-200"
              >
                <img
                  src={activeCurrentUrl}
                  alt={targetTitle}
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo_univ_ouargla.png';
                  }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">الحجم: {currentSize}px</span>
            </div>

            {/* New Preview Logo in chosen size */}
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {previewUrl ? 'المعاينة الجديدة:' : 'بانتظار ملف الشعار:'}
              </span>
              <div 
                style={{ width: `${Math.min(currentSize, 90)}px`, height: `${Math.min(currentSize, 90)}px` }}
                className={`rounded-full bg-white p-1 border-2 shadow-sm flex items-center justify-center overflow-hidden transition-all duration-200 ${
                  previewUrl 
                    ? 'border-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950' 
                    : 'border-dashed border-slate-300 dark:border-slate-600'
                }`}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="معاينة الشعار الجديد"
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-slate-300" />
                )}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {previewUrl ? 'جاهز للاعتماد' : 'لم يتم اختيار ملف بعد'}
              </span>
            </div>
          </div>

          {/* Option 1: File Drop Zone & Button */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-800 dark:text-slate-200">
                انقر هنا لاختيار ملف {activeTarget === 'university' ? 'شعار الجامعة' : 'شعار الكلية'} من جهازك
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                أو اسحب وأفلت ملف الشعار مباشرة هنا (PNG, JPG, SVG, WebP) بدقة أصلية
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                يمكنك أيضاً الضغط على <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">Ctrl + V</kbd> للصق الصورة من الحافظة مباشرة
              </div>
            </div>
          </div>

          {/* Option 2: Image URL input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>أو أدخل رابطاً مباشراً لصورة الشعار:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                معاينة
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer order-2 sm:order-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الشعار والحجم الافتراضي</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={!previewUrl || isLoading}
                onClick={handleSaveLogo}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>جارٍ الحفظ...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>اعتماد وحفظ الشعار</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
