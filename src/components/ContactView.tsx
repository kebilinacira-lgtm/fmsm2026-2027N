import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Printer, 
  Mail, 
  Clock, 
  Send, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  Navigation,
  Globe,
  AlertCircle
} from 'lucide-react';
import { FACULTY_GENERAL_INFO } from '../data/facultyData';

interface ContactViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('pedagogical');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (): boolean => {
    const errs: { name?: string; email?: string; message?: string } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = 'يرجى كتابة الاسم واللقب الكامل.';
    } else if (trimmedName.length < 3) {
      errs.name = 'يجب أن يحتوي الاسم على 3 أحرف على الأقل.';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = 'يرجى إدخال عنوان البريد الإلكتروني.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'صيغة البريد الإلكتروني غير صحيحة (مثال: name@univ-ouargla.dz).';
    }

    const trimmedMsg = message.trim();
    if (!trimmedMsg) {
      errs.message = 'يرجى كتابة نص الرسالة أو الاستفسار.';
    } else if (trimmedMsg.length < 10) {
      errs.message = 'الرسالة قصيرة جداً، يرجى كتابة تفاصيل كافية (10 أحرف على الأقل).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!validateForm()) {
      onShowToast('بيانات النموذج غير مكتملة', 'يرجى مراجعة الحقول المحددة باللون الأحمر وتصحيحها للمتابعة.', 'warning');
      return;
    }

    setIsSubmitted(true);
    setErrors({});
    onShowToast('تم إرسال رسالتك بنجاح', 'سيتم تحويل استفسارك لمصلحة التمدرس أو الإدارة المعنية وسنوافيك بالرد عبر بريدك.', 'success');
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#0B3D91] via-slate-900 to-[#071739] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>فضاء الاتصال والاستقبال</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            اتصل بإدارة كلية الرياضيات وعلوم المادة
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            تسعد إدارة الكلية ومصالح التمدرس والشؤون البيداغوجية بالاستجابة لاستفساراتكم وانشغالاتكم عبر قنوات التواصل المباشرة ومكاتب الاستقبال بالقطب الجامعي الأول.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Contact Form & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              نموذج الاستفسارات والانشغالات الإلكترونية
            </h2>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  شكراً لتواصلك، تم تسجيل رسالتك بنجاح!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  تم توجيه طلبك إلى مصلحة التمدرس والشؤون البيداغوجية، وستتلقى إشعاراً بالرد عبر البريد الإلكتروني ({email}) خلال 48 ساعة عمل.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                    setSubject('');
                  }}
                  className="mt-2 text-xs font-bold text-[#0B3D91] dark:text-blue-400 underline cursor-pointer"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold block">يرجى تصحيح الأخطاء التالية في النموذج:</span>
                      <span className="text-[11px]">تأكد من كتابة الاسم كاملاً، عنوان بريد إلكتروني صالح، ونص الرسالة بوضوح.</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الاسم واللقب الكامل
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                      placeholder="مثال: محمد بن علي"
                      className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 focus:outline-none transition-all ${
                        errors.name
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0B3D91]'
                      }`}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      البريد الإلكتروني
                      <span className="text-rose-500 mr-1">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                      placeholder="example@univ-ouargla.dz"
                      className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 focus:outline-none transition-all ${
                        errors.email
                          ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0B3D91]'
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الموضوع أو التوجيه
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                    >
                      <option value="pedagogical">شؤون بيداغوجية وتسجيلات</option>
                      <option value="scolarite">مصلحة التمدرس والوثائق</option>
                      <option value="math">قسم الرياضيات</option>
                      <option value="physics">قسم الفيزياء</option>
                      <option value="chemistry">قسم الكيمياء</option>
                      <option value="common_sm">جذع مشترك علوم المادة (SM)</option>
                      <option value="deanship">العمادة والشؤون العامة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      عنوان الرسالة
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="استفسار بخصوص..."
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نص الرسالة أو الانشغال
                    <span className="text-rose-500 mr-1">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, message: true }))}
                    placeholder="اكتب استفسارك بتفصيل مع ذكر رقم التسجيل إن كنت طالباً بالكلية..."
                    className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 focus:outline-none transition-all ${
                      errors.message
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0B3D91]'
                    }`}
                  />
                  {errors.message && (
                    <div className="flex items-center gap-1.5 mt-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#0B3D91] hover:bg-[#093275] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الرسالة الآن</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Interactive Simulated Map */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#0B3D91] dark:text-blue-400" />
                  <span>الموقع الجغرافي وخريطة الكلية</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  القطب الجامعي 01، طريق غرداية، ورقلة (31.95°N, 5.32°E)
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Université+Kasdi+Merbah+Ouargla"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0B3D91] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>فتح في Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Styled Map Canvas Visual */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
              <iframe
                title="موقع جامعة قاصدي مرباح ورقلة"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13778.681128362402!2d5.322047!3d31.947937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x125a1766a5e12cf5%3A0xe54e38c7fdfa76cb!2sUniversit%C3%A9%20Kasdi%20Merbah%20Ouargla!5e0!3m2!1sar!2sdz!4v1680000000000!5m2!1sar!2sdz"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Official Information Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              بيانات الاتصال المعتمدة
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0B3D91] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">العنوان البريدي الرسمي</span>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed block mt-0.5">
                    طريق غرداية، ص.ب 511، ورقلة 30000، الجزائر
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">الهاتف الإداري المركزي</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono mt-0.5 block" dir="ltr">
                    +213 (0) 29 71 38 91
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">رقم الفاكس الرسمي</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono mt-0.5 block" dir="ltr">
                    +213 (0) 29 71 26 27
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">البريد الإلكتروني للكلية</span>
                  <span className="text-[#0B3D91] dark:text-blue-400 font-mono mt-0.5 block" dir="ltr">
                    fmsm@univ-ouargla.dz
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">بوابة الكلية الإلكترونية</span>
                  <span className="text-[#0B3D91] dark:text-blue-400 font-mono mt-0.5 block" dir="ltr">
                    https://fmsm.univ-ouargla.dz
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">ساعات العمل الرسمية</span>
                  <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">
                    من الأحد إلى الخميس: 08:00 صباحاً حتى 16:30 مساءً
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Grievance platform link */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/70 p-4 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-amber-900 dark:text-amber-300 block">
              منصة انشغالات الكلية الرقمية (FMSM Grievances)
            </span>
            <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
              يمكنك أيضاً تقديم شكوى أو تظلم بيداغوجي عبر منصة الانشغالات الرسمية التابعة للكلية مباشرة.
            </p>
            <a
              href="https://fmsm-grievances-platform.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#0B3D91] dark:text-amber-300 underline"
            >
              <span>الانتقال لمنصة الانشغالات</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
