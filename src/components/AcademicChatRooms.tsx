import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Pin,
  Search,
  CheckCheck,
  Users,
  Award,
  BookOpen,
  Atom,
  FlaskConical,
  Binary,
  Layers,
  GraduationCap,
  Sparkles,
  Download,
  Reply,
  Volume2,
  Play,
  Pause,
  MessageSquare,
  X,
  FileText,
  ShieldCheck,
  Radio,
  RotateCcw,
  Trash2,
  StopCircle,
  File
} from 'lucide-react';
import { AppLanguage, DepartmentId, UserProfile } from '../types';
import { getTranslation } from '../data/translations';

export interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: 'professor' | 'dept_head' | 'student' | 'admin';
  senderTitle?: string;
  departmentId: DepartmentId | 'all';
  avatar?: string;
  content: string;
  timestamp: string;
  time: string;
  isPinned?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  attachment?: {
    type: 'pdf' | 'image' | 'archive';
    name: string;
    size: string;
    url?: string;
  };
  audioNote?: {
    duration: string;
    url?: string;
  };
  reactions: {
    emoji: string;
    count: number;
    userReacted?: boolean;
  }[];
}

interface ChatChannel {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  deptId: DepartmentId | 'all';
  icon: 'all' | 'chemistry' | 'physics' | 'math' | 'common_sm' | 'advice';
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  membersCount: number;
  onlineCount: number;
  pinnedNoticeAr?: string;
  pinnedNoticeFr?: string;
  pinnedNoticeEn?: string;
}

const CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    nameAr: '📢 القناة العامة للكلية (جميع الأقسام)',
    nameFr: '📢 Canal Général FMSM (Tous Départements)',
    nameEn: '📢 FMSM General Channel (All Departments)',
    deptId: 'all',
    icon: 'all',
    descriptionAr: 'فضاء الإعلانات والتنسيق الأكاديمي الشامل لطلبة وأساتذة كلية الرياضيات وعلوم المادة',
    descriptionFr: 'Espace officiel pour les annonces générales et échanges inter-départements',
    descriptionEn: 'Official channel for general announcements and cross-department discussions',
    membersCount: 1420,
    onlineCount: 86,
    pinnedNoticeAr: '📌 تنبيه هام: انطلاق سحب استدعاءات الامتحانات النهائية للسداسي الثاني عبر فضاء الطالب',
    pinnedNoticeFr: '📌 Avis: Retrait des convocations aux examens finaux S2 via le portail étudiant',
    pinnedNoticeEn: '📌 Notice: S2 final exam convocation forms are now available in the student portal'
  },
  {
    id: 'common_sm',
    nameAr: '🔬 غرفة الجذع المشترك علوم المادة (SM)',
    nameFr: '🔬 Salon Tronc Commun Sciences de la Matière',
    nameEn: '🔬 Common Core Matter Sciences Room',
    deptId: 'common_sm',
    icon: 'common_sm',
    descriptionAr: 'قناة طلبة السنة الأولى والثانية جذع مشترك SM مع منسقي المقاييس والأساتذة',
    descriptionFr: 'Canal dédié aux étudiants L1 & L2 Tronc Commun SM avec les coordinateurs',
    descriptionEn: 'Dedicated channel for L1 & L2 Common Core SM students with professors',
    membersCount: 680,
    onlineCount: 42,
    pinnedNoticeAr: '📌 حلول الأعمال الموجهة لمقياس الفيزياء 2 (الكهرباء والمغناطيسية) متوفرة للتحميل الآن',
    pinnedNoticeFr: '📌 Séries d’exercices et corrigés de Physique 2 disponibles au téléchargement',
    pinnedNoticeEn: '📌 Physics 2 (Electricity & Magnetism) tutorial solutions now available'
  },
  {
    id: 'chemistry',
    nameAr: '🧪 غرفة قسم الكيمياء (Chimie)',
    nameFr: '🧪 Salon Département de Chimie',
    nameEn: '🧪 Chemistry Department Room',
    deptId: 'chemistry',
    icon: 'chemistry',
    descriptionAr: 'متابعة الأعمال المخبرية (TP)، الكيمياء العضوية، الحركية الكيميائية ومشاريع الماستر',
    descriptionFr: 'Discussions TP, Chimie Organique, Cinétique et projets de Master/Doctorat',
    descriptionEn: 'Lab sessions (TP), Organic Chemistry, Kinetics, and Master research projects',
    membersCount: 390,
    onlineCount: 28,
    pinnedNoticeAr: '📌 بروتوكول السلامة المخبرية وجدول أفواج TP الكيمياء التحليلية معلق بالمخبر 3',
    pinnedNoticeFr: '📌 Protocole de sécurité et planning des groupes TP Chimie Analytique au Labo 3',
    pinnedNoticeEn: '📌 Lab safety protocol and Analytical Chemistry TP roster posted at Lab 3'
  },
  {
    id: 'physics',
    nameAr: '⚛️ غرفة قسم الفيزياء (Physique)',
    nameFr: '⚛️ Salon Département de Physique',
    nameEn: '⚛️ Physics Department Room',
    deptId: 'physics',
    icon: 'physics',
    descriptionAr: 'ميكانيكا الكم، الديناميكا الحرارية، الفيزياء الإشعاعية ومناقشات مذكرات التخرج',
    descriptionFr: 'Mécanique quantique, thermodynamique, physique des rayonnements et mémoires',
    descriptionEn: 'Quantum mechanics, thermodynamics, radiation physics, and thesis discussions',
    membersCount: 340,
    onlineCount: 22,
    pinnedNoticeAr: '📌 موعد مناقشة مشاريع نهاية الدراسة (PFE) ليسانس وماستر فيزياء طاقوية الأسبوع القادم',
    pinnedNoticeFr: '📌 Soutenances PFE Licence & Master Physique Énergétique programmées la semaine prochaine',
    pinnedNoticeEn: '📌 PFE defense schedules for BSc & MSc Energy Physics announced for next week'
  },
  {
    id: 'math',
    nameAr: '📐 غرفة قسم الرياضيات (Mathématiques)',
    nameFr: '📐 Salon Département de Mathématiques',
    nameEn: '📐 Mathematics Department Room',
    deptId: 'math',
    icon: 'math',
    descriptionAr: 'التحليل الرياضي، الجبر، الطوبولوجيا، حساب الاحتمالات والاستشارات الأكاديمية',
    descriptionFr: 'Analyse, Algèbre générale, Topologie, Probabilités et consultations',
    descriptionEn: 'Mathematical Analysis, Algebra, Topology, Probability, and tutoring',
    membersCount: 310,
    onlineCount: 19,
    pinnedNoticeAr: '📌 حلقة استدراكية لمقياس التحليل 3 يوم الخميس على الساعة 10:00 بالقاعة 14',
    pinnedNoticeFr: '📌 Séance de rattrapage d’Analyse 3 ce jeudi à 10h00 en Salle 14',
    pinnedNoticeEn: '📌 Remedial session for Analysis 3 this Thursday at 10:00 in Room 14'
  },
  {
    id: 'advisory',
    nameAr: '👨‍🏫 صالون التوجيه والاستشارات مع الأساتذة',
    nameFr: '👨‍🏫 Salon Conseils & Orientation Enseignants',
    nameEn: '👨‍🏫 Professor Advisory & Mentorship Lounge',
    deptId: 'all',
    icon: 'advice',
    descriptionAr: 'طرح الأسئلة المباشرة على الأساتذة المحاضرين، ساعات الاستقبال، وإرشاد الطلبة',
    descriptionFr: 'Questions directes aux enseignants-chercheurs, permanences et conseils',
    descriptionEn: 'Direct Q&A with faculty professors, office hours, and academic guidance',
    membersCount: 890,
    onlineCount: 54,
    pinnedNoticeAr: '📌 الأساتذة يستقبلون استفساراتكم حول التوجيه واختيار تخصصات الماستر يومياً',
    pinnedNoticeFr: '📌 Les professeurs répondent à vos questions d’orientation Master au quotidien',
    pinnedNoticeEn: '📌 Faculty advisors are answering questions on Master specialization choices daily'
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  // General Channel
  {
    id: 'm-gen-1',
    channelId: 'general',
    senderName: 'أ.د. كبيلي ناصرة (المشرف العام للمنصة)',
    senderRole: 'admin',
    senderTitle: 'المشرف العام - عمادة الكلية',
    departmentId: 'all',
    content: 'مرحباً بجميع طلبتنا وأساتذتنا الأفاضل في الفضاء الأكاديمي التفاعلي للكلية! صُممت هذه الغرف على طراز التلغرام لتمكين التواصل الأكاديمي الفوري وتسهيل تداول المحاضرات والإجابة على تساؤلاتكم.',
    timestamp: '2026-06-05T08:30:00Z',
    time: '08:30',
    isPinned: true,
    reactions: [
      { emoji: '👏', count: 48, userReacted: true },
      { emoji: '❤️', count: 35, userReacted: false },
      { emoji: '🔥', count: 21, userReacted: false }
    ]
  },
  {
    id: 'm-gen-2',
    channelId: 'general',
    senderName: 'د. بن سالم أحمد (أستاذ محاضر)',
    senderRole: 'professor',
    senderTitle: 'قسم الفيزياء',
    departmentId: 'physics',
    content: 'السلام عليكم ورحمة الله، تم نشر رزنامة امتحانات السداسي الثاني لكافة السنوات والأقسام، يرجى من جميع الطلبة التقيد بالمدرجات المحددة.',
    timestamp: '2026-06-05T09:15:00Z',
    time: '09:15',
    attachment: {
      type: 'pdf',
      name: 'رزنامة_الامتحانات_النهائية_S2_FMSM_2026.pdf',
      size: '1.8 MB'
    },
    reactions: [
      { emoji: '👍', count: 29, userReacted: false },
      { emoji: '💡', count: 12, userReacted: false }
    ]
  },
  {
    id: 'm-gen-3',
    channelId: 'general',
    senderName: 'محمد أمين دريدي (طالب L2 SM)',
    senderRole: 'student',
    senderTitle: 'طالب سنة ثانية',
    departmentId: 'common_sm',
    content: 'شكراً جزيلاً أستاذنا الفاضل، هل تتوفر إمكانية تقديم طعون في نقاط المراقبة المستمرة قبل انطلاق الامتحانات؟',
    timestamp: '2026-06-05T09:30:00Z',
    time: '09:30',
    replyTo: {
      id: 'm-gen-2',
      senderName: 'د. بن سالم أحمد',
      text: 'السلام عليكم ورحمة الله، تم نشر رزنامة امتحانات السداسي الثاني...'
    },
    reactions: [
      { emoji: '👍', count: 8, userReacted: false }
    ]
  },
  {
    id: 'm-gen-4',
    channelId: 'general',
    senderName: 'د. عمراني عبد القادر (رئيس قسم الكيمياء)',
    senderRole: 'dept_head',
    senderTitle: 'رئيس قسم الكيمياء',
    departmentId: 'chemistry',
    content: 'نعم بالتأكيد يا بني، فترة الطعون مفتوحة لغاية يوم الخميس بمكاتب رؤساء الأقسام أو عبر منصة الانشغالات الرسمية.',
    timestamp: '2026-06-05T09:35:00Z',
    time: '09:35',
    reactions: [
      { emoji: '❤️', count: 19, userReacted: true },
      { emoji: '👏', count: 14, userReacted: false }
    ]
  },

  // Chemistry Channel
  {
    id: 'm-ch-1',
    channelId: 'chemistry',
    senderName: 'د. عمراني عبد القادر (رئيس قسم الكيمياء)',
    senderRole: 'dept_head',
    senderTitle: 'رئيس قسم الكيمياء',
    departmentId: 'chemistry',
    content: 'أبنائي طلبة قسم الكيمياء: مرفق إليكم نموذج تقرير الأعمال التطبيقية (Compte Rendu TP) المعتمد في السداسي الثاني للكيمياء العضوية والتحليلية.',
    timestamp: '2026-06-04T10:00:00Z',
    time: '10:00',
    isPinned: true,
    attachment: {
      type: 'pdf',
      name: 'Guide_Redaction_Compte_Rendu_TP_Chimie.pdf',
      size: '2.4 MB'
    },
    reactions: [
      { emoji: '👍', count: 32, userReacted: false },
      { emoji: '💡', count: 17, userReacted: false }
    ]
  },
  {
    id: 'm-ch-2',
    channelId: 'chemistry',
    senderName: 'أمينة قاسمي (طالبة ماستر 1 كيمياء المواد)',
    senderRole: 'student',
    senderTitle: 'Master 1 Chimie des Matériaux',
    departmentId: 'chemistry',
    content: 'أستاذ، بخصوص تفاعل التكثيف الألدولي (Aldol Condensation) في التجربة 4، هل نستخدم حمض الكبريتيك أم هيدروكسيد الصوديوم كوسيط؟',
    timestamp: '2026-06-04T10:25:00Z',
    time: '10:25',
    reactions: [
      { emoji: '💡', count: 6, userReacted: false }
    ]
  },
  {
    id: 'm-ch-3',
    channelId: 'chemistry',
    senderName: 'أ. د. فاطمة الزهراء بن حمزة',
    senderRole: 'professor',
    senderTitle: 'أستاذة الكيمياء العضوية',
    departmentId: 'chemistry',
    content: 'سؤال وجيه جداً يا أمينة. في الشروط التجريبية للمخبر نستعمل قاعدة (NaOH 10%) لإنتاج أنيون الإينولات بسهولة وبدرجة نقاوة أعلى دون تفاعلات جانبية.',
    timestamp: '2026-06-04T10:32:00Z',
    time: '10:32',
    audioNote: {
      duration: '0:42'
    },
    reactions: [
      { emoji: '🔥', count: 18, userReacted: true },
      { emoji: '❤️', count: 11, userReacted: false }
    ]
  },

  // Physics Channel
  {
    id: 'm-ph-1',
    channelId: 'physics',
    senderName: 'د. خالد زروقي (أستاذ محاضر)',
    senderRole: 'professor',
    senderTitle: 'مسؤول تخصص فيزياء الإشعاعات',
    departmentId: 'physics',
    content: 'طلبة ماستر 1 و 2 فيزياء: نذكركم بالندوة العلمية حول "تطبيقات الأشعة السينية والكواشف النووية" بقاعة المحاضرات غداً الساعة 09:30 صباحاً.',
    timestamp: '2026-06-04T11:00:00Z',
    time: '11:00',
    reactions: [
      { emoji: '👏', count: 24, userReacted: false },
      { emoji: '👍', count: 15, userReacted: false }
    ]
  },
  {
    id: 'm-ph-2',
    channelId: 'physics',
    senderName: 'ياسين بلخير (طالب L3 فيزياء أساسية)',
    senderRole: 'student',
    senderTitle: 'طالب L3',
    departmentId: 'physics',
    content: 'أستاذنا الفاضل، هل تتوفر نسخة إلكترونية من ملخص معادلات ميكانيكا الكم (معادلة شرودنغر المعتمدة على الزمن والجهد الحلقي)؟',
    timestamp: '2026-06-04T11:40:00Z',
    time: '11:40',
    reactions: [
      { emoji: '💡', count: 9, userReacted: false }
    ]
  },
  {
    id: 'm-ph-3',
    channelId: 'physics',
    senderName: 'د. خالد زروقي (أستاذ محاضر)',
    senderRole: 'professor',
    senderTitle: 'قسم الفيزياء',
    departmentId: 'physics',
    content: 'تفضل يا ياسين، هذا الملف يحوي كامل البراهين وحلول تمارين الحالات الخاصة في معادلة شرودنغر ثلاثية الأبعاد.',
    timestamp: '2026-06-04T11:45:00Z',
    time: '11:45',
    attachment: {
      type: 'pdf',
      name: 'Resume_Mecanique_Quantique_L3_FMSM.pdf',
      size: '3.1 MB'
    },
    reactions: [
      { emoji: '🔥', count: 26, userReacted: true },
      { emoji: '👏', count: 18, userReacted: false }
    ]
  },

  // Math Channel
  {
    id: 'm-ma-1',
    channelId: 'math',
    senderName: 'د. مصطفى لعرابي (رئيس قسم الرياضيات)',
    senderRole: 'dept_head',
    senderTitle: 'رئيس قسم الرياضيات',
    departmentId: 'math',
    content: 'نرحب بجميع طلبة الرياضيات. سلسلة تمارين الفضاءات المترية والطوبولوجيا العامة للسداسي الثاني مرفوعة الآن بالموقع.',
    timestamp: '2026-06-03T14:00:00Z',
    time: '14:00',
    isPinned: true,
    attachment: {
      type: 'pdf',
      name: 'Serie_TD_Topologie_Espaces_Metriques.pdf',
      size: '1.2 MB'
    },
    reactions: [
      { emoji: '👍', count: 31, userReacted: false },
      { emoji: '💡', count: 14, userReacted: false }
    ]
  },

  // Common Core SM
  {
    id: 'm-sm-1',
    channelId: 'common_sm',
    senderName: 'د. كريم سلطاني (مسؤول الجذع المشترك SM)',
    senderRole: 'dept_head',
    senderTitle: 'مسؤول الجذع المشترك SM',
    departmentId: 'common_sm',
    content: 'أعزائي طلبة السنة الأولى جذع مشترك علوم المادة (SM): جدول امتحانات السداسي الثاني ونظام التفويج أصبح متوفراً. تمنياتنا لكم بالتوفيق والنجاح.',
    timestamp: '2026-06-04T09:00:00Z',
    time: '09:00',
    isPinned: true,
    reactions: [
      { emoji: '❤️', count: 45, userReacted: true },
      { emoji: '👏', count: 38, userReacted: false }
    ]
  },

  // Advisory Lounge
  {
    id: 'm-adv-1',
    channelId: 'advisory',
    senderName: 'أ.د. كبيلي ناصرة',
    senderRole: 'admin',
    senderTitle: 'عمادة الكلية - التوجيه والمرافقة',
    departmentId: 'all',
    content: 'أبنائي وبناتي الطلبة، هذا الصالون مخصص لاستشاراتكم الأكاديمية: كيف تختار تخصصك في السنة الثانية والثالثة؟ كيف تحضر لمشاريع التخرج والماستر؟ اطرحوا استفساراتكم وسيجيبكم خيرة أساتذة الكلية.',
    timestamp: '2026-06-05T07:30:00Z',
    time: '07:30',
    isPinned: true,
    reactions: [
      { emoji: '❤️', count: 52, userReacted: true },
      { emoji: '👏', count: 39, userReacted: false }
    ]
  }
];

interface AcademicChatRoomsProps {
  currentUser: UserProfile | null;
  language: AppLanguage;
  onOpenLoginModal?: (role: 'student' | 'teacher' | 'admin') => void;
  onClose?: () => void;
}

export const AcademicChatRooms: React.FC<AcademicChatRoomsProps> = ({
  currentUser,
  language,
  onOpenLoginModal,
  onClose
}) => {
  const t = getTranslation(language);
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState<'all' | DepartmentId>('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [customSenderName, setCustomSenderName] = useState<string>('');

  // Audio Recording & File Upload States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load and save messages in localStorage for permanent persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('fmsm_telegram_chat_messages_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('fmsm_telegram_chat_messages_v2', JSON.stringify(messages));
    } catch {
      // storage quota or error
    }
  }, [messages]);

  // Handle Clear / Reset Chat (تصفير المحادثات)
  const handleClearCurrentChannel = () => {
    setMessages((prev) => prev.filter((m) => m.channelId !== activeChannelId));
    setResetConfirmOpen(false);
  };

  const handleClearAllChannels = () => {
    setMessages([]);
    localStorage.removeItem('fmsm_telegram_chat_messages_v2');
    setResetConfirmOpen(false);
  };

  // Real File Upload Handler (Student or Professor)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const type: 'pdf' | 'image' | 'archive' = 
      fileExt === 'pdf' ? 'pdf' : 
      ['png', 'jpg', 'jpeg', 'webp'].includes(fileExt || '') ? 'image' : 'archive';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const now = new Date();
      const timeStr = now.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let senderName = currentUser ? currentUser.name : (customSenderName.trim() || 'مشارك في الغرفة');
      let senderRole: ChatMessage['senderRole'] = currentUser?.role === 'teacher' ? 'professor' : 'student';
      let senderTitle = currentUser?.grade || currentUser?.specialty || (language === 'ar' ? 'مرفق ملف' : 'Fichier partagé');

      const newMessage: ChatMessage = {
        id: `msg-file-${Date.now()}`,
        channelId: activeChannelId,
        senderName,
        senderRole,
        senderTitle,
        departmentId: activeChannel.deptId,
        content: `📎 تم إرفاق ملف: ${file.name}`,
        timestamp: now.toISOString(),
        time: timeStr,
        attachment: {
          type,
          name: file.name,
          size: fileSizeStr,
          url: dataUrl
        },
        reactions: [{ emoji: '👍', count: 1, userReacted: true }]
      };

      setMessages((prev) => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Real Audio File Upload Handler
  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const audioUrl = reader.result as string;
      const now = new Date();
      const timeStr = now.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let senderName = currentUser ? currentUser.name : (customSenderName.trim() || 'مشارك في الغرفة');
      let senderRole: ChatMessage['senderRole'] = currentUser?.role === 'teacher' ? 'professor' : 'student';

      const newMessage: ChatMessage = {
        id: `msg-audio-${Date.now()}`,
        channelId: activeChannelId,
        senderName,
        senderRole,
        senderTitle: language === 'ar' ? 'تسجيل صوتي' : 'Note Vocale',
        departmentId: activeChannel.deptId,
        content: `🎙️ تسجيل صوتي: ${file.name}`,
        timestamp: now.toISOString(),
        time: timeStr,
        audioNote: {
          duration: 'مرفق صوتي',
          url: audioUrl
        },
        reactions: [{ emoji: '🎧', count: 1, userReacted: true }]
      };

      setMessages((prev) => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);

    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  // Real Microphone Voice Recording
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        audioInputRef.current?.click();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const durationFormatted = `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`;

        const now = new Date();
        const timeStr = now.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        let senderName = currentUser ? currentUser.name : (customSenderName.trim() || 'مشارك في الغرفة');
        let senderRole: ChatMessage['senderRole'] = currentUser?.role === 'teacher' ? 'professor' : 'student';

        const newMessage: ChatMessage = {
          id: `msg-voice-${Date.now()}`,
          channelId: activeChannelId,
          senderName,
          senderRole,
          senderTitle: language === 'ar' ? 'رسالة صوتية مسجلة' : 'Message vocal',
          departmentId: activeChannel.deptId,
          content: '🎙️ تسجيل صوتي مباشر',
          timestamp: now.toISOString(),
          time: timeStr,
          audioNote: {
            duration: durationFormatted,
            url: audioUrl
          },
          reactions: [{ emoji: '🎙️', count: 1, userReacted: true }]
        };

        setMessages((prev) => [...prev, newMessage]);
        stream.getTracks().forEach((track) => track.stop());
        setRecordingSeconds(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      // Fallback: open audio file upload
      audioInputRef.current?.click();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Safe file download without window.alert
  const handleDownloadFile = (name: string, url?: string) => {
    if (!url) {
      const dummyContent = `كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة\nاسم الوثيقة: ${name}\nالتاريخ: ${new Date().toLocaleDateString('ar-DZ')}`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      const dlUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = dlUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];

  const channelMessages = messages.filter((m) => {
    const matchesChannel = m.channelId === activeChannelId;
    if (!matchesChannel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.content.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        (m.attachment && m.attachment.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChannelId, channelMessages.length]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let senderName = customSenderName.trim();
    let senderRole: ChatMessage['senderRole'] = 'student';
    let senderTitle = language === 'ar' ? 'طالب جامعي' : 'Étudiant';

    if (currentUser) {
      senderName = currentUser.name;
      if (currentUser.role === 'super_admin' || currentUser.adminRole === 'super_admin') {
        senderRole = 'admin';
        senderTitle = currentUser.adminTitle || (language === 'ar' ? 'المشرف العام للمنصة' : 'Super Admin');
      } else if (currentUser.role === 'dept_head' || currentUser.adminRole === 'dept_head') {
        senderRole = 'dept_head';
        senderTitle = currentUser.adminTitle || (language === 'ar' ? 'رئيس القسم' : 'Chef de Département');
      } else if (currentUser.role === 'teacher') {
        senderRole = 'professor';
        senderTitle = currentUser.grade || (language === 'ar' ? 'أستاذ محاضر' : 'Enseignant');
      } else {
        senderRole = 'student';
        senderTitle = currentUser.specialty || currentUser.level || (language === 'ar' ? 'طالب LMD' : 'Étudiant');
      }
    }

    if (!senderName) {
      senderName = language === 'ar' ? 'طالب / أستاذ (زائر)' : 'Visiteur Académique';
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderName,
      senderRole,
      senderTitle,
      departmentId: activeChannel.deptId,
      content: messageText.trim(),
      timestamp: now.toISOString(),
      time: timeStr,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.content.slice(0, 70) + (replyingTo.content.length > 70 ? '...' : '')
          }
        : undefined,
      reactions: [
        { emoji: '👍', count: 1, userReacted: true }
      ]
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existing = msg.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          if (existing.userReacted) {
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) => (r.emoji === emoji ? { ...r, count: Math.max(0, r.count - 1), userReacted: false } : r))
                .filter((r) => r.count > 0)
            };
          } else {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r
              )
            };
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, userReacted: true }]
          };
        }
      })
    );
  };

  const handleAddAttachmentMock = (type: 'pdf' | 'image') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const isAr = language === 'ar';
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderName: currentUser ? currentUser.name : (isAr ? 'أستاذ المقياس' : 'Enseignant'),
      senderRole: currentUser?.role === 'teacher' ? 'professor' : 'student',
      senderTitle: isAr ? 'مرفق أكاديمي معتمد' : 'Document pédagogique',
      departmentId: activeChannel.deptId,
      content: isAr ? 'مرفق جديد للتحميل والمراجعة بخصوص هذا الأسبوع:' : 'Nouveau document partagé:',
      timestamp: now.toISOString(),
      time: timeStr,
      attachment: {
        type,
        name: type === 'pdf' ? `TD_Corrige_Semestre2_${activeChannelId}.pdf` : `Schema_Experience_TP.png`,
        size: type === 'pdf' ? '2.1 MB' : '850 KB'
      },
      reactions: [{ emoji: '👍', count: 3, userReacted: true }]
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const channelDisplayName = (c: ChatChannel) => {
    if (language === 'fr') return c.nameFr;
    if (language === 'en') return c.nameEn;
    return c.nameAr;
  };

  const channelDesc = (c: ChatChannel) => {
    if (language === 'fr') return c.descriptionFr;
    if (language === 'en') return c.descriptionEn;
    return c.descriptionAr;
  };

  const channelNotice = (c: ChatChannel) => {
    if (language === 'fr') return c.pinnedNoticeFr;
    if (language === 'en') return c.pinnedNoticeEn;
    return c.pinnedNoticeAr;
  };

  const filteredChannels = CHANNELS.filter((c) => {
    if (filterDept === 'all') return true;
    return c.deptId === filterDept || c.deptId === 'all';
  });

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl flex flex-col h-[750px] max-h-[85vh] transition-all">
      {/* Telegram Style Top Header */}
      <div className="bg-linear-to-r from-emerald-950 via-teal-900 to-slate-900 px-4 sm:px-6 py-3 border-b border-teal-800/40 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                {t.chatTitle}
              </h2>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Telegram Web Mode
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              {t.chatSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* User Status / Login Prompt */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-emerald-300">{currentUser.name}</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded-md font-mono">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <button
              onClick={() => onOpenLoginModal?.('student')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-md"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t.loginPortals}</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body: Telegram 2-Column Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Sidebar: Channels & Departments (Telegram Chat List) */}
        <div className="w-72 sm:w-80 border-r border-slate-800 bg-slate-950/70 flex flex-col shrink-0">
          {/* Channels Header & Dept Filter */}
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
              <span>{t.chatChannels}</span>
              <span className="text-[11px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/50">
                06 {language === 'ar' ? 'غرف مفعلة' : 'salons'}
              </span>
            </div>

            {/* Quick Dept Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                onClick={() => setFilterDept('all')}
                className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterDept === 'all'
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setFilterDept('chemistry')}
                className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterDept === 'chemistry'
                    ? 'bg-amber-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                كيمياء
              </button>
              <button
                onClick={() => setFilterDept('physics')}
                className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterDept === 'physics'
                    ? 'bg-cyan-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                فيزياء
              </button>
              <button
                onClick={() => setFilterDept('math')}
                className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterDept === 'math'
                    ? 'bg-blue-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                رياضيات
              </button>
              <button
                onClick={() => setFilterDept('common_sm')}
                className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterDept === 'common_sm'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                جذع SM
              </button>
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {filteredChannels.map((c) => {
              const isActive = c.id === activeChannelId;
              const lastMsg = [...messages].reverse().find((m) => m.channelId === c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveChannelId(c.id);
                    setReplyingTo(null);
                  }}
                  className={`w-full text-right p-2.5 rounded-2xl transition-all cursor-pointer flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-800/80 to-emerald-900/60 border border-teal-500/50 shadow-md text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                      c.deptId === 'chemistry'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                        : c.deptId === 'physics'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/40'
                        : c.deptId === 'math'
                        ? 'bg-blue-950 text-blue-300 border border-blue-600/40'
                        : c.deptId === 'common_sm'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                        : 'bg-teal-950 text-teal-300 border border-teal-600/40'
                    }`}
                  >
                    {c.icon === 'chemistry' && <FlaskConical className="w-5 h-5" />}
                    {c.icon === 'physics' && <Atom className="w-5 h-5" />}
                    {c.icon === 'math' && <Binary className="w-5 h-5" />}
                    {c.icon === 'common_sm' && <Layers className="w-5 h-5" />}
                    {c.icon === 'all' && <Radio className="w-5 h-5" />}
                    {c.icon === 'advice' && <Sparkles className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold truncate text-white">
                        {channelDisplayName(c)}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {lastMsg.time}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate line-clamp-1">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : channelDesc(c)}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-teal-400" />
                        <span>{c.membersCount}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{c.onlineCount} {t.onlineMembers}</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right / Center: Active Channel Telegram Chat Space */}
        <div className="flex-1 flex flex-col bg-slate-900/90 relative">
          {/* Active Channel Banner */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {channelDisplayName(activeChannel)}
                  </h3>
                  <span className="text-[11px] text-teal-300 font-mono bg-teal-950 px-2 py-0.5 rounded-full border border-teal-800/60">
                    {activeChannel.membersCount} {language === 'ar' ? 'عضو' : 'membres'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {channelDesc(activeChannel)}
                </p>
              </div>
            </div>

            {/* Reset / Clear Chat and In-Chat Search Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="تصفير ومسح رسائل هذه الغرفة"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">تصفير المحادثة</span>
              </button>

              <div className="relative w-36 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pr-8 pl-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Telegram Pinned Message Strip */}
          {channelNotice(activeChannel) && (
            <div className="bg-teal-950/90 border-b border-teal-800/60 px-4 py-1.5 flex items-center justify-between text-xs text-teal-200">
              <div className="flex items-center gap-2 truncate">
                <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 transform rotate-45" />
                <span className="font-bold text-amber-300 shrink-0">{t.pinnedNotice}:</span>
                <span className="truncate">{channelNotice(activeChannel)}</span>
              </div>
            </div>
          )}

          {/* Telegram Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin bg-radial from-slate-900 via-slate-950 to-slate-950">
            {channelMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <MessageSquare className="w-12 h-12 text-slate-600 stroke-[1.5]" />
                <p className="font-bold text-sm text-slate-300">
                  {language === 'ar' ? 'لا توجد رسائل مطابقة للبحث' : 'Aucun message trouvé'}
                </p>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'كن أول من يبدأ النقاش في هذه الغرفة الأكاديمية!' : 'Soyez le premier à poser une question !'}
                </p>
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isProf = msg.senderRole === 'professor';
                const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'dept_head';
                const isCurrentLoggedUser = currentUser && currentUser.name === msg.senderName;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 group/msg ${
                      isCurrentLoggedUser ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* User Avatar */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
                        isAdmin
                          ? 'bg-linear-to-br from-amber-600 to-amber-800 text-amber-100 ring-2 ring-amber-400/50'
                          : isProf
                          ? 'bg-linear-to-br from-teal-600 to-emerald-800 text-teal-100 ring-2 ring-teal-400/50'
                          : 'bg-linear-to-br from-slate-700 to-slate-800 text-slate-200'
                      }`}
                      title={msg.senderTitle || msg.senderName}
                    >
                      {isAdmin ? '👑' : isProf ? '👨‍🏫' : '🎓'}
                    </div>

                    {/* Message Bubble (Telegram Card) */}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-md transition-all ${
                        isCurrentLoggedUser
                          ? 'bg-teal-900/80 border border-teal-600/60 text-white rounded-tr-none'
                          : isAdmin
                          ? 'bg-slate-900 border-2 border-amber-500/50 text-slate-100 rounded-tl-none shadow-amber-950/20'
                          : isProf
                          ? 'bg-slate-900 border border-teal-700/60 text-slate-100 rounded-tl-none shadow-teal-950/20'
                          : 'bg-slate-850 bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-white/10 pb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-black ${
                              isAdmin
                                ? 'text-amber-300'
                                : isProf
                                ? 'text-teal-300'
                                : 'text-emerald-400'
                            }`}
                          >
                            {msg.senderName}
                          </span>
                          {msg.senderTitle && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300 font-medium">
                              {msg.senderTitle}
                            </span>
                          )}
                          {isAdmin && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded-sm font-bold flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              إدارة الكلية
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-slate-400 hover:text-teal-300 p-0.5 rounded cursor-pointer"
                          title="رد على الرسالة"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quoted / Replied message preview */}
                      {msg.replyTo && (
                        <div className="mb-2 p-1.5 rounded-lg bg-black/25 border-r-2 border-teal-400 text-[11px] text-slate-300">
                          <span className="font-bold text-teal-300 block text-[10px]">
                            {msg.replyTo.senderName}
                          </span>
                          <p className="truncate italic text-slate-400">{msg.replyTo.text}</p>
                        </div>
                      )}

                      {/* Main Message Text */}
                      <p className="text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed font-sans select-text">
                        {msg.content}
                      </p>

                      {/* Attachment Card if present */}
                      {msg.attachment && (
                        <div className="mt-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-700/80 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 flex items-center justify-center shrink-0 border border-rose-800/40">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-bold text-white block truncate">
                                {msg.attachment.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {msg.attachment.size}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(msg.attachment!.name, msg.attachment?.url)}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-xs"
                            title="تحميل الملف إلى جهازك"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تحميل</span>
                          </button>
                        </div>
                      )}

                      {/* Real Audio Note Player */}
                      {msg.audioNote && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-teal-950/70 border border-teal-800/60 flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs text-teal-300 font-bold">
                            <Mic className="w-4 h-4 text-emerald-400" />
                            <span>تسجيل صوتي ({msg.audioNote.duration})</span>
                          </div>
                          {msg.audioNote.url ? (
                            <audio 
                              controls 
                              src={msg.audioNote.url} 
                              className="w-full h-8 rounded-lg"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsPlayingAudio(isPlayingAudio === msg.id ? null : msg.id)}
                                className="w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                              >
                                {isPlayingAudio === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                              </button>
                              <div className="flex-1 h-3 flex items-center gap-0.5">
                                {[40, 70, 30, 90, 60, 80, 50, 95, 40, 60, 30, 70, 85, 45, 60].map((h, i) => (
                                  <span
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className={`w-1 rounded-full transition-all ${
                                      isPlayingAudio === msg.id ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer: Time + Reactions + Checks */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                        {/* Emoji Reactions Pill Bar */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {msg.reactions.map((r) => (
                            <button
                              key={r.emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, r.emoji)}
                              className={`px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                                r.userReacted
                                  ? 'bg-teal-700/80 text-white border border-teal-400/80 font-bold'
                                  : 'bg-black/30 hover:bg-black/50 text-slate-300 border border-white/5'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span className="font-mono">{r.count}</span>
                            </button>
                          ))}

                          {/* Quick Add Reaction Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleReaction(msg.id, '👍')}
                            className="p-1 text-slate-400 hover:text-amber-400 rounded-full hover:bg-black/20 text-xs transition-colors cursor-pointer"
                            title="إضافة تفاعل"
                          >
                            +
                          </button>
                        </div>

                        {/* Timestamp & Seen checkmarks */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono shrink-0">
                          <span>{msg.time}</span>
                          <CheckCheck className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Replying banner */}
          {replyingTo && (
            <div className="px-4 py-2 bg-slate-950 border-t border-teal-800/50 flex items-center justify-between text-xs text-teal-200">
              <div className="flex items-center gap-2 truncate">
                <Reply className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>
                  {language === 'ar' ? 'الرد على' : 'Réponse à'}{' '}
                  <strong className="text-white">{replyingTo.senderName}</strong>: {replyingTo.content.slice(0, 50)}...
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Telegram Bottom Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 relative"
          >
            {/* Quick Sender Name customizer if guest */}
            {!currentUser && (
              <div className="hidden lg:block w-32 shrink-0">
                <input
                  type="text"
                  value={customSenderName}
                  onChange={(e) => setCustomSenderName(e.target.value)}
                  placeholder={language === 'ar' ? 'اسمك هنا...' : 'Votre nom...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            )}

            {/* Hidden File & Audio Inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
            />
            <input 
              type="file" 
              accept="audio/*" 
              ref={audioInputRef} 
              className="hidden" 
              onChange={handleAudioFileSelect} 
            />

            {/* Action buttons: Attach File, Voice Record, Emoji */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="إرفاق ملف (PDF / مستند / صورة)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse shadow-md' 
                    : 'text-slate-400 hover:text-teal-300 hover:bg-slate-800'
                }`}
                title={isRecording ? 'إيقاف وإرسال التسجيل الصوتي' : 'تسجيل رسالة صوتية'}
              >
                {isRecording ? (
                  <>
                    <StopCircle className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-mono font-bold">
                      0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
                    </span>
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="رموز تعبيرية"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Emoji Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-14 right-4 z-50 bg-slate-900 border border-slate-700 p-2 rounded-2xl shadow-xl flex items-center gap-2">
                {['👍', '❤️', '👏', '🔥', '💡', '🔬', '⚛️', '📐', '📚', '✅'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setMessageText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1 text-base hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={isRecording ? 'جاري التسجيل الصوتي... انقر على زر الإيقاف للإرسال' : t.typeMessagePlaceholder}
                disabled={isRecording}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 shadow-inner disabled:opacity-50"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!messageText.trim() && !isRecording}
              className={`p-2.5 rounded-2xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                messageText.trim()
                  ? 'bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20 scale-105'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              title={t.sendMessage}
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog for Reset Chat (تصفير المحادثات) */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">
                تصفير ومسح المحادثات
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                هل ترغب في تصفير رسائل هذه الغرفة الحالية فقط أم مسح محادثات كافة الغرف؟
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleClearCurrentChannel}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                تصفير هذه الغرفة فقط
              </button>
              <button
                type="button"
                onClick={handleClearAllChannels}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                تصفير كافة غرف المحادثة (بدء من الصفر)
              </button>
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
