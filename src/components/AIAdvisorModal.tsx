import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  RotateCcw, 
  BookOpen, 
  Copy,
  Check,
  Atom,
  FlaskConical,
  Binary,
  Layers,
  GraduationCap
} from 'lucide-react';
import { DEPARTMENTS, FACULTY_GENERAL_INFO } from '../data/facultyData';

export interface AIAdvisorModalProps {
  isOpen?: boolean;
  onClose: () => void;
  selectedDeptId?: string;
  initialQuestion?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  copied?: boolean;
}

const QUICK_QUESTIONS = [
  'كيف يتم حساب معدل السداسي وقانون التعويض في L1 علوم المادة؟',
  'ما هي شروط الانتقال بالدين (Dette) من السنة الأولى إلى الثانية؟',
  'ما هي تخصصات الماستر المتاحة في أقسام الفيزياء، الكيمياء، والرياضيات؟',
  'كيف يقدم الطالب طعناً بيداغوجياً بخصوص علامة الامتحان أو الأعمال الموجهة؟',
  'ما هي خطوات اختيار وتأطير مذكرة التخرج PFE لطلبة الماستر؟',
  'ما هي مخابر البحث العلمي المعتمدة التابعة للكلية؟'
];

// Comprehensive local academic knowledge base for offline / fallback resilience
function getLocalKnowledgeAnswer(question: string, deptId?: string): string {
  const q = question.toLowerCase();

  if (q.includes('معدل') || q.includes('حساب') || q.includes('تعويض') || q.includes('سداسي') || q.includes('lmd')) {
    return `📌 **قواعد حساب المعدل الفصلي ونظام التعويض LMD بكلية الرياضيات وعلوم المادة:**

1. **حساب معدل المقياس (Moyenne de la Matière):**
• المقاييس ذات أعمال موجهة (TD): يتم الحساب عبر الصيغة: 
$$\\text{المعدل} = (\\text{علامة الامتحان} \\times 60\\%) + (\\text{علامة المراقبة المستمرة CC} \\times 40\\%)$$
• المقاييس ذات أعمال تطبيقية (TP): يتم احتساب TP وفق المعامل المعتمد في السداسي (غالباً 33% امتحان + 33% TD + 34% TP).

2. **التعويض بين المقاييس والوحدات (Compensation):**
• **تعويض داخل الوحدة (Intra-Unité):** تعوض النقاط بين مقاييس الوحدة الواحدة باحتساب المعاملات.
• **تعويض بين الوحدات (Inter-Unités):** إذا بلغ المعدل العام للسداسي $\\ge 10.00/20$، يعتبر السداسي مكتسباً بالتعويض وتمنح للطالب كامل الأرصدة (30 رصيداً).

3. **النجاح السنوي:**
• يكتسب الطالب السنة الجامعية إذا كان المعدل السنوي (متوسط السداسيين $S_1$ و $S_2$) $\\ge 10.00/20$، ويتحصل على 60 رصيداً.`;
  }

  if (q.includes('دين') || q.includes('ديون') || q.includes('dette') || q.includes('انتقال') || q.includes('شروط')) {
    return `📋 **شروط الانتقال بالدين (Dette) في نظام LMD بكلية FMSM ورقلة:**

• **من السنة الأولى (L1) إلى السنة الثانية (L2):**
  1. النجاح العادي: الحصول على معدل سنوي $\\ge 10/20$ (60 رصيداً).
  2. الانتقال بالدين: الحصول على 30 رصيداً على الأقل في السنة الأولى، أو اكتساب أحد السداسيين ($S_1$ أو $S_2$) كاملاً بمعدل $\\ge 10/20$.

• **من السنة الثانية (L2) إلى السنة الثالثة (L3):**
  1. اكتساب 90 رصيداً تراكمياً على الأقل.
  2. استيفاء واكتساب كافة مقاييس الوحدات التعليمية الأساسية (Unités Fondamentales) للسنة الأولى L1.

• **المقاييس بالدين:** يمتحن الطالب في الدورة العادية والاستدراكية في المقاييس المتبقية عليه بالدين في سداسياتها المعنية.`;
  }

  if (q.includes('ماستر') || q.includes('تخصص') || q.includes('توجيه') || q.includes('ليسانس') || q.includes('عروض')) {
    return `🎓 **دليل التخصصات وعروض التكوين LMD بالكلية:**

🔬 **1. قسم الفيزياء (Département de Physique):**
• **ليسانس:** فيزياء عامة وتطبيقية (Physique Fondamentale et Appliquée)
• **ماستر:** فيزياء طاقوية وطاقات متجددة (Énergétique & Énergies Renouvelables)
• **ماستر:** فيزياء كيميائية وطبية (Physico-chimie & Physique Médicale)

🧪 **2. قسم الكيمياء (Département de Chimie):**
• **ليسانس:** كيمياء أساسية (Chimie Fondamentale)
• **ماستر:** كيمياء المواد والبوليميرات (Chimie des Matériaux)
• **ماستر:** كيمياء صيدلانية وعضوية وتثمين الموارد الصحراوية

📐 **3. قسم الرياضيات (Département de Mathématiques):**
• **ليسانس:** رياضيات أساسية وتطبيقية (Mathématiques Générales)
• **ماستر:** الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات (IA & Data Science)
• **ماستر:** النمذجة الرياضية والتحليل الحسابي المتقدم

⚛️ **4. جذع مشترك علوم المادة (TC-SM):**
تكوين قاعدي معمق في السنة الأولى L1 يؤهل للتوجيه المباشر نحو تخصصات الفيزياء أو الكيمياء حسب رغبة الطالب واستحقاقه.`;
  }

  if (q.includes('طعن') || q.includes('طعون') || q.includes('علامة') || q.includes('نقطة') || q.includes('امتحان') || q.includes('تصحيح')) {
    return `📝 **إجراءات تقديم الطعون البيداغوجية في النتائج والامتحانات:**

1. **الآجال القانونية:** يحق للطالب تقديم طعن رسمي خلال **48 إلى 72 ساعة** من تاريخ نشر محضر النقاط الأولي أو إجراء جلسة الاطلاع على أوراق الامتحان (Consultation des copies).
2. **خطوات تقديم الطعن:**
• يتم ملء استمارة الطعن الإلكترونية عبر "فضاء الطالب" في البوابة، أو مباشرة لدى أمانة القسم المعني.
• تحديد رقم الفوج، المقياس، ونوع الخلل الملاحظ (خطأ في جمع النقاط، إغفال تدوين علامة TD أو TP، أو عدم احتساب سؤال).
3. **دراسة الطعن:** تجتمع اللجنة البيداغوجية ورئيس المادة لمراجعة ورقة الامتحان، ويتم تحيين المحضر ونشر النتيجة المصحوبة بتوقيع أستاذ المادة ورئيس القسم.`;
  }

  if (q.includes('مذكرة') || q.includes('تخرج') || q.includes('pfe') || q.includes('ماستر 2') || q.includes('تأطير')) {
    return `📚 **دليل مشاريع ومذكرات التخرج (PFE) لطلبة ماستر 2:**

• **رزنامة إعداد المذكرة:**
1. اقتراح مواضيع التخرج: يعلن عنها أساتذة ومخابر البحث في بداية السداسي الثالث (S3).
2. اختيار وتثبيت الموضوع: يتم تقديم بطاقة الرغبات والمصادقة على المشرف (Encadreur) مع نهاية السداسي الثالث.
3. العمل المخبري والميداني: يمتد طيلة السداسي الرابع (S4) بمخابر الكلية أو بالتنسيق مع المؤسسات الصناعية بالمنطقة (سوناطراك، محطات الطاقة الشمسية...).
4. الإيداع والمناقشة (Soutenance): تودع النسخ الأولية للمذكرات في شهر ماي/جوان بعد موافقة المشرف ومصادقة اللجنة العلمية للقسم.`;
  }

  if (q.includes('مخبر') || q.includes('مخابر') || q.includes('بحث') || q.includes('lder') || q.includes('lcmns') || q.includes('lma') || q.includes('lpm') || q.includes('lcp')) {
    return `🔬 **مخابر البحث العلمي المعتمدة بكلية الرياضيات وعلوم المادة:**

1. **مخبر تطوير الطاقات المتجددة وموارد الصحراء (LDER):**
أبحاث الطاقة الشمسية الكهروضوئية والحرارية، تحلية المياه الجوفية، والهيدروجين الأخضر.
2. **مخبر كيمياء المواد والمستخلصات الطبيعية (LCMNS):**
تخليق وتوصيف البوليميرات، كيمياء المعقدات العضوية، وتثمين النباتات الطبية الصحراوية.
3. **مخبر الرياضيات وتطبيقاتها المعاصرة (LMA):**
التحليل الدالي، المعادلات التفاضلية الجزئية، والنمذجة الرياضية لتدفق الموائع.
4. **مخبر فيزياء المادة والإشعاع (LPM):**
دراسة المواد المغناطيسية، أشباه الموصلات، والفيزياء الطبية للإشعاعات.
5. **مخبر الكيمياء الفيزيائية والبيئة (LCP):**
معالجة المياه العادمة الصناعية ومكافحة التآكل في المنشآت البترولية.`;
  }

  if (q.includes('عميد') || q.includes('إدارة') || q.includes('هاتف') || q.includes('اتصال') || q.includes('موقع') || q.includes('عنوان')) {
    return `🏛️ **معلومات إدارة كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة:**

• **عميد الكلية:** البروفيسور جمال بشكي
• **الموقع الجغرافي:** القطب الجامعي 01، طريق غرداية، ص.ب 511، ورقلة 30000، الجزائر
• **الهاتف المعتمد:** 029 71 38 91
• **الفاكس:** 029 71 26 27
• **البريد الرسمي:** fmsm@univ-ouargla.dz
• **مواقيت العمل الإداري:** الأحد إلى الخميس، من 08:00 صباحاً إلى 16:30 مساءً.`;
  }

  // General department-informed answer
  const dept = deptId ? DEPARTMENTS[deptId as keyof typeof DEPARTMENTS] : null;
  const deptContext = dept ? `في ${dept.nameAr}` : 'بكلية الرياضيات وعلوم المادة';

  return `مرحباً بك في المستشار الأكاديمي الرقمي ${deptContext} (جامعة قاصدي مرباح ورقلة).

بخصوص استفسارك: "${question}"
يسرنا إفادتك بأن المنصة الرقمية توفر لك كامل الأدوات اللازمة:
1. **الاطلاع على المقررات وسلاسل التمارين:** متوفرة عبر "فضاء المقررات" مع إمكانية التحميل المباشر.
2. **حساب وتتبع المعدل الفصلي:** متوفر عبر "حاسبة معدل LMD" المبرمجة بالمعاملات والأرصدة الرسمية لمقاييسك.
3. **الطلبات الإدارية والشباك الإلكتروني:** يمكنك تقديم طلب شهادة مدرسية، كشف نقاط، أو إعادة إدماج برمز تتبع فوري.
4. **التواصل مع الأساتذة ومسؤولي الشعب:** متاح عبر منتدى الاستفسارات البيداغوجية.

إذا كنت تحتاج إلى توضيح إضافي حول مقياس محدد أو لائحة بيداغوجية، تفضل بطرح سؤالك بالتفصيل! 🎓`;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ 
  isOpen = false, 
  onClose, 
  selectedDeptId, 
  initialQuestion 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-01',
      sender: 'assistant',
      text: `مرحباً بك في المستشار الأكاديمي الذكي لكلية الرياضيات وعلوم المادة (FMSM) - جامعة قاصدي مرباح ورقلة! 🎓\n\nأنا هنا لمساعدتك في كل ما يتعلق بـ:\n• نظام التقييم، حساب المعدلات، وأرصدة التعويض في نظام LMD.\n• برامج ومقاييس أقسام الفيزياء، الكيمياء، الرياضيات، وجذع مشترك SM.\n• التوجيه الأكاديمي، عروض الماستر، ومشاريع التخرج PFE ومخابر البحث.\n• الإجراءات الإدارية والطعون البيداغوجية.\n\nكيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  // If not open, DO NOT render anything!
  if (!isOpen) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Try server API with a 7-second timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      let answerText = '';

      try {
        const response = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question: text,
            context: selectedDeptId ? `القسم: ${selectedDeptId}` : 'كلية الرياضيات وعلوم المادة ورقلة'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.answer && typeof data.answer === 'string') {
            answerText = data.answer;
          }
        }
      } catch (networkOrAbortErr) {
        // Fallback silently to local knowledge base
      }

      // If server returned an empty answer or failed, use local academic knowledge engine
      if (!answerText) {
        answerText = getLocalKnowledgeAnswer(text, selectedDeptId);
      }

      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      // Ultimate fallback guaranteeing the advisor always answers!
      const fallbackText = getLocalKnowledgeAnswer(text, selectedDeptId);
      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `تمت إعادة تهيئة المحادثة. أهلاً بك مجدداً في مستشارك الأكاديمي! كيف أستطيع خدمتك الآن؟`,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200"
      onClick={(e) => {
        // Close when clicking outer backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-advisor-title"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full h-[620px] max-h-[92vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-[#071739] via-[#0B3D91] to-blue-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-blue-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-advisor-title" className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  المستشار الأكاديمي الذكي (FMSM)
                </h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  UKMO AI
                </span>
              </div>
              <p className="text-[11px] text-blue-200 font-medium">
                بوابة الإرشاد البيداغوجي واللوائح الجامعية ونظام LMD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Reset chat button */}
            <button
              onClick={handleResetChat}
              className="text-blue-200 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="إعادة بدء المحادثة"
              aria-label="إعادة بدء المحادثة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close button with explicit styling and area */}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
              title="إغلاق المستشار (Esc)"
              aria-label="إغلاق المستشار الأكاديمي"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 p-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold shrink-0 ml-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>أسئلة شائعة:</span>
          </span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 hover:border-blue-400 dark:hover:border-slate-500 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-colors cursor-pointer shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 ${isUser ? 'justify-start flex-row-reverse' : 'justify-start'}`}
              >
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
                    isUser 
                      ? 'bg-[#0B3D91] text-white' 
                      : 'bg-amber-500 text-slate-950 font-bold'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div 
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser 
                      ? 'bg-[#0B3D91] text-white rounded-tr-xs shadow-xs' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed font-sans">{m.text}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                    <span className={`text-[10px] font-mono ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[10px] flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        title="نسخ الإجابة"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>نسخ</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0B3D91] dark:bg-amber-400 animate-ping"></span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  جاري مراجعة اللوائح وصياغة الإجابة الأكاديمية...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="اطرح سؤالك حول اللوائح، المقاييس، حساب المعدل LMD، أو التخصصات..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] dark:focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#0B3D91] hover:bg-blue-900 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
              title="إرسال السؤال"
            >
              <Send className="w-4 h-4 rtl:-rotate-90" />
              <span className="hidden sm:inline">إرسال</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1">
            <span>كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة</span>
            <span>اضغط Esc أو انقر خارج الإطار للإغلاق</span>
          </div>
        </div>
      </div>
    </div>
  );
};
