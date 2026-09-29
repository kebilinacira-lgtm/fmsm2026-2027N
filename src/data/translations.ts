import { AppLanguage } from '../types';

export interface Translations {
  // Top bar & Header
  republicTitle: string;
  ministryTitle: string;
  universityName: string;
  facultyName: string;
  facultySubtitle: string;
  fmsmCode: string;
  grievancePlatform: string;
  officialSite: string;
  myAdminOnline: string;
  facultyLibrary: string;
  adminAccount: string;
  adminAccountTitle: string;
  accountsRBAC: string;
  search: string;
  pedagogicalBridge: string;
  aiAdvisor: string;
  academicChat: string;
  academicChatDesc: string;
  loginPortals: string;
  logout: string;
  studentSpace: string;
  teacherSpace: string;
  adminSpace: string;
  guestUser: string;
  themeDay: string;
  themeNight: string;

  // Tabs
  tabHome: string;
  tabAbout: string;
  tabSpecialties: string;
  tabCommonSM: string;
  tabPhysics: string;
  tabChemistry: string;
  tabMath: string;
  tabAnnouncements: string;
  tabStudent: string;
  tabTeacher: string;
  tabAdmin: string;
  tabChat: string;
  tabPortals: string;
  tabContact: string;

  // Hero & Sections
  welcomeTitle: string;
  welcomeSubtitle: string;
  officialAnnouncementTicker: string;
  syncOfficialNews: string;
  syncedLive: string;
  quickAccess: string;
  departmentsTitle: string;
  statsTitle: string;
  totalStudents: string;
  totalTeachers: string;
  totalLabs: string;
  totalSpecialties: string;
  studentsEnrolled: string;
  professorsSupervisors: string;
  departmentsCount: string;
  programsCount: string;
  labsCount: string;

  // Hero & Ticker specific
  tickerTitle: string;
  tickerSiteLink: string;
  tickerAllNotice: string;
  tickerOfficialBadge: string;
  tickerNoticeBadge: string;
  heroCertifiedBadge: string;
  heroSearchPlaceholder: string;
  heroSearchBtn: string;
  heroBtnStudent: string;
  heroBtnTeacher: string;
  heroBtnPortals: string;
  heroBtnAdvisor: string;
  heroBtnChat: string;
  sealUniversity: string;
  sealFaculty: string;
  sndlTitle: string;
  sndlDesc: string;

  // Dean's section
  deanWordTitle: string;
  deanName: string;
  deanRole: string;
  deanQuote: string;
  deanParagraph1: string;

  // Departments Section
  departmentsSectionTitle: string;
  departmentsSectionSubtitle: string;
  browseDepartment: string;
  tcSmTitle: string;
  tcSmDesc: string;
  physicsDeptTitle: string;
  physicsDeptDesc: string;
  chemistryDeptTitle: string;
  chemistryDeptDesc: string;
  mathDeptTitle: string;
  mathDeptDesc: string;

  // Portals Section
  portalsSectionTitle: string;
  portalsSectionSubtitle: string;

  // 4 Feature Cards
  lmdCalcTitle: string;
  lmdCalcSub: string;
  lmdCalcDesc: string;
  lmdCalcBtn: string;
  coursesTitle: string;
  coursesSub: string;
  coursesDesc: string;
  coursesBtn: string;
  guichetTitle: string;
  guichetSub: string;
  guichetDesc: string;
  guichetBtn: string;
  bridgeCardTitle: string;
  bridgeCardSub: string;
  bridgeCardDesc: string;
  bridgeCardBtn: string;

  // Chat Telegram room
  chatTitle: string;
  chatSubtitle: string;
  chatChannels: string;
  chatAllFaculty: string;
  chatChemistry: string;
  chatPhysics: string;
  chatMath: string;
  chatCommonSM: string;
  chatProfessors: string;
  typeMessagePlaceholder: string;
  sendMessage: string;
  pinnedNotice: string;
  onlineMembers: string;
  filterByDept: string;
  allMembers: string;
  professorsOnly: string;

  // Admin & Independence
  adminIndependenceTitle: string;
  adminIndependenceDesc: string;
  backupDatabase: string;
  restoreDatabase: string;
  exportSuccess: string;
  securitySettings: string;
  changePasswordEmail: string;

  // Common UI
  close: string;
  save: string;
  cancel: string;
  loading: string;
  download: string;
  viewDetails: string;
  filter: string;
  all: string;
  level: string;
  semester: string;
  date: string;
  status: string;
  approved: string;
  pending: string;
  rejected: string;
}

export const translations: Record<AppLanguage, Translations> = {
  ar: {
    republicTitle: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    ministryTitle: 'وزارة التعليم العالي والبحث العلمي',
    universityName: 'جامعة قاصدي مرباح ورقلة',
    facultyName: 'كلية الرياضيات وعلوم المادة',
    facultySubtitle: 'Université Kasdi Merbah Ouargla - Faculté des Mathématiques et des Sciences de la Matière',
    fmsmCode: 'FMSM - UKMO',
    grievancePlatform: 'منصة الانشغالات والشكاوى',
    officialSite: 'موقع الكلية الرسمي',
    myAdminOnline: 'إدارتي أون لاين',
    facultyLibrary: 'مكتبة الكلية',
    adminAccount: 'حساب الإدارة العامة',
    adminAccountTitle: 'حساب الإدارة العامة المعتمد',
    accountsRBAC: 'حسابات الإدارة والأقسام',
    search: 'بحث',
    pedagogicalBridge: 'همزة الوصل',
    aiAdvisor: 'المستشار الذكي',
    academicChat: 'غرف الدردشة الأكاديمية (شات الكلية)',
    academicChatDesc: 'فضاء تواصل مباشر وفوري بين طلبة جميع التخصصات وأساتذتهم (على غرار التلغرام)',
    loginPortals: 'دخول الفضاءات',
    logout: 'تسجيل الخروج',
    studentSpace: 'فضاء الطالب',
    teacherSpace: 'فضاء الأستاذ',
    adminSpace: 'فضاء الإدارة',
    guestUser: 'زائر المنصة',
    themeDay: 'الوضع النهاري',
    themeNight: 'الوضع الليلي',

    tabHome: 'الرئيسية',
    tabAbout: 'عن الكلية والمخابر',
    tabSpecialties: 'التخصصات وعروض التكوين',
    tabCommonSM: 'جذع مشترك SM',
    tabPhysics: 'قسم الفيزياء',
    tabChemistry: 'قسم الكيمياء',
    tabMath: 'قسم الرياضيات',
    tabAnnouncements: 'الأخبار والإعلانات',
    tabStudent: 'فضاء الطالب',
    tabTeacher: 'فضاء الأستاذ',
    tabAdmin: 'فضاء الإدارة',
    tabChat: 'شات الكلية (تلغرام)',
    tabPortals: 'المنصات الرسمية',
    tabContact: 'اتصل بنا',

    welcomeTitle: 'المنصة البيداغوجية والإدارية الرقمية الشاملة',
    welcomeSubtitle: 'منصة تفاعلية متكاملة تجمع كافة الخدمات البيداغوجية، الإدارية، والبحثية لأقسام الفيزياء، الكيمياء، الرياضيات، وفرع جذع مشترك علوم المادة؛ مع فضاءات مخصصة لأساتذة الكلية والطلبة بنظام LMD.',
    officialAnnouncementTicker: 'شريط المستجدات المباشر من موقع الكلية الرسمي',
    syncOfficialNews: 'تحديث ومزامنة الأخبار الآن',
    syncedLive: 'مربوط مباشرة ومحدث',
    quickAccess: 'الوصول السريع للخدمات',
    departmentsTitle: 'أقسام الكلية',
    statsTitle: 'إحصائيات الكلية الرسمية',
    totalStudents: 'إجمالي الطلبة المسجلين',
    totalTeachers: 'إجمالي هيئة التدريس',
    totalLabs: 'مخابر البحث العلمي المعتمدة',
    totalSpecialties: 'عروض التكوين (ليسانس وماستر)',
    studentsEnrolled: 'طالب وطالبة مسجلين',
    professorsSupervisors: 'أستاذ وباحث مؤطر',
    departmentsCount: 'أقسام وفروع علمية',
    programsCount: 'عروض ليسانس وماستر',
    labsCount: 'مخابر بحث معتمدة',

    tickerTitle: 'آخر المستجدات',
    tickerSiteLink: 'موقع الكلية',
    tickerAllNotice: 'كل الإعلانات',
    tickerOfficialBadge: 'رسمي FMSM',
    tickerNoticeBadge: 'إعلان',
    heroCertifiedBadge: 'البوابة الرقمية المعتمدة للأساتذة والطلبة - السنة الجامعية 2025 - 2026',
    heroSearchPlaceholder: 'ابحث عن مقياس، أستاذ، جدول توقيت، محاضرة، أو تخصص...',
    heroSearchBtn: 'بحث بالمقررات',
    heroBtnStudent: 'دخول فضاء الطالب',
    heroBtnTeacher: 'دخول فضاء الأستاذ',
    heroBtnPortals: 'المنصات الرسمية (11)',
    heroBtnAdvisor: 'المستشار الذكي',
    heroBtnChat: 'شات الكلية الأكاديمي (تلغرام)',
    sealUniversity: 'جامعة قاصدي مرباح ورقلة',
    sealFaculty: 'كلية الرياضيات وعلوم المادة',
    sndlTitle: 'نظام SNDL',
    sndlDesc: 'توثيق CERIST الدولي',

    deanWordTitle: 'كلمة السيد عميد الكلية إلى الأسرة الجامعية',
    deanName: 'البروفيسور جمال بشكي',
    deanRole: 'عميد كلية الرياضيات وعلوم المادة',
    deanQuote: '«تتغير الأسماء ويبقى الجوهر واحداً، تلكم هي كليتنا»',
    deanParagraph1: 'تتغير الأسماء ويبقى الجوهر واحداً، تلكم هي كليتنا، بدأت عام 1987 بنواة واحدة اسمها المدرسة العليا للأساتذة، ثم سُمّيت معهد العلوم الدقيقة، ثم كلية العلوم وعلوم المهندس، وهي الآن كلية الرياضيات وعلوم المادة. بهياكلها القديمة وبنيتها ذاتها، تَعاقَبَ على رأس هرم مسؤوليتها أساتذةٌ كرامٌ، نجزم أنه ما ادّخر واحدٌ منهم جهداً في سبيل إعلائها والحفاظ على تقاليدها.',

    departmentsSectionTitle: 'الأقسام والفروع البيداغوجية بالكلية',
    departmentsSectionSubtitle: 'اختر القسم لاستعراض المناهج، جداول التوقيت، هيئة التدريس، والمخابر التابعة',
    browseDepartment: 'تصفح القسم',
    tcSmTitle: 'جذع مشترك علوم المادة',
    tcSmDesc: 'السنة الأولى ليسانس SM القاعدية للفيزياء والكيمياء والرياضيات المعمقة.',
    physicsDeptTitle: 'قسم الفيزياء',
    physicsDeptDesc: 'تخصصات الطاقات المتجددة، الفيزياء الطبية والإشعاعية، والفيزياء الأساسية.',
    chemistryDeptTitle: 'قسم الكيمياء',
    chemistryDeptDesc: 'كيمياء المواد والبوليميرات، الكيمياء العضوية وتثمين الموارد الصحراوية.',
    mathDeptTitle: 'قسم الرياضيات',
    mathDeptDesc: 'الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات والنمذجة الرياضية.',

    portalsSectionTitle: 'بوابة المنصات والأنظمة الرسمية المعتمدة',
    portalsSectionSubtitle: 'روابط مباشرة لجميع المنصات الوزارية والجامعية المعتمدة لطلبة وأأساتذة FMSM',

    lmdCalcTitle: 'حاسبة معدل السداسي LMD',
    lmdCalcSub: 'مخصصة لطلبة FMSM ورقلة',
    lmdCalcDesc: 'احسب معدلك الفصلي بدقة بمقاييس الكلية (معاملات، أرصدة، نقاط TD و TP والامتحان)، مع احتساب الديون والتعويض.',
    lmdCalcBtn: 'ابدأ حساب المعدل الآن',
    coursesTitle: 'المكتبة والمقررات الرقمية',
    coursesSub: 'تحميل المحاضرات والـ TPs',
    coursesDesc: 'تحميل فوري لمطبوعات المحاضرات المعتمدة، سلاسل التمارين المحلولة، وتقارير الأعمال المخبرية ونماذج الامتحانات.',
    coursesBtn: 'تصفح المقررات المحملة',
    guichetTitle: 'الشباك الإلكتروني الموحد',
    guichetSub: 'طلبات إدارية وطعون معتمدة',
    guichetDesc: 'استخراج الشهادات المدرسية، كشوف النقاط، شهادات العمل للأساتذة، وتقديم الطعون البيداغوجية الرسمية مع كود التتبع.',
    guichetBtn: 'الدخول للشباك الإلكتروني',
    bridgeCardTitle: 'همزة الوصل البيداغوجية',
    bridgeCardSub: 'ساعات الاستقبال والتواصل المباشر',
    bridgeCardDesc: 'تواصل مباشر مع الأساتذة المحاضرين، طرح الاستفسارات، حجز مواعيد الاستقبال، ومتابعة مشاريع التخرج.',
    bridgeCardBtn: 'فتح فضاء همزة الوصل',

    chatTitle: 'فضاء غرف المحادثة والتواصل الأكاديمي',
    chatSubtitle: 'غرف دردشة فورية تجمع أساتذة وطلبة كل الأقسام والتخصصات بتنظيم وتفاعل فوري كتطبيق التلغرام',
    chatChannels: 'قنوات وغرف الأقسام',
    chatAllFaculty: 'القناة العامة للكلية',
    chatChemistry: 'غرفة قسم الكيمياء',
    chatPhysics: 'غرفة قسم الفيزياء',
    chatMath: 'غرفة قسم الرياضيات',
    chatCommonSM: 'غرفة الجذع المشترك SM',
    chatProfessors: 'صالون استشارات الأساتذة',
    typeMessagePlaceholder: 'اكتب رسالتك أو استفسارك هنا (يمكنك إرفاق ملف أو معادلة)...',
    sendMessage: 'إرسال',
    pinnedNotice: 'رسالة مثبتة من إدارة القسم',
    onlineMembers: 'متصلون الآن',
    filterByDept: 'تصفية حسب القسم',
    allMembers: 'الجميع',
    professorsOnly: 'الأساتذة المعتمدون',

    adminIndependenceTitle: 'التحكم الإداري الكامل واستقلالية المنصة',
    adminIndependenceDesc: 'يمكنك إدارة وتعديل كل صغيرة وكبيرة بالمنصة من المتصفح مباشرة دون الحاجة لأي مسؤول استضافة',
    backupDatabase: 'تنزيل نسخة احتياطية كاملة (JSON)',
    restoreDatabase: 'استرجاع قاعدة البيانات',
    exportSuccess: 'تم تصدير النسخة الاحتياطية بنجاح!',
    securitySettings: 'إعدادات الأمان الشخصية',
    changePasswordEmail: 'تغيير كلمة المرور والبريد',

    close: 'إغلاق',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    loading: 'جاري التحميل...',
    download: 'تحميل',
    viewDetails: 'عرض التفاصيل',
    filter: 'تصفية',
    all: 'الكل',
    level: 'المستوى',
    semester: 'السداسي',
    date: 'التاريخ',
    status: 'الحالة',
    approved: 'مقبول ومصادق عليه',
    pending: 'قيد المعالجة',
    rejected: 'مرفوض'
  },

  fr: {
    republicTitle: 'République Algérienne Démocratique et Populaire',
    ministryTitle: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    universityName: 'Université Kasdi Merbah Ouargla',
    facultyName: 'Faculté des Mathématiques et des Sciences de la Matière',
    facultySubtitle: 'Université Kasdi Merbah Ouargla - Faculté des Mathématiques et des Sciences de la Matière',
    fmsmCode: 'FMSM - UKMO',
    grievancePlatform: 'Portail des Doléances & Réclamations',
    officialSite: 'Site Officiel',
    myAdminOnline: 'Mon Administration En Ligne',
    facultyLibrary: 'Bibliothèque de la Faculté',
    adminAccount: 'Compte Administration',
    adminAccountTitle: 'Compte Officiel Administration Générale',
    accountsRBAC: 'Comptes Administration',
    search: 'Recherche',
    pedagogicalBridge: 'Passerelle Pédagogique',
    aiAdvisor: 'Conseiller IA',
    academicChat: 'Chat Académique (FMSM)',
    academicChatDesc: 'Espace interactif type Telegram reliant étudiants de toutes filières et professeurs',
    loginPortals: 'Connexion Espaces',
    logout: 'Déconnexion',
    studentSpace: 'Espace Étudiant',
    teacherSpace: 'Espace Enseignant',
    adminSpace: 'Espace Administration',
    guestUser: 'Invité',
    themeDay: 'Mode Clair',
    themeNight: 'Mode Sombre',

    tabHome: 'Accueil',
    tabAbout: 'À propos & Labos',
    tabSpecialties: 'Formations & Offres',
    tabCommonSM: 'Tronc Commun SM',
    tabPhysics: 'Dép. Physique',
    tabChemistry: 'Dép. Chimie',
    tabMath: 'Dép. Mathématiques',
    tabAnnouncements: 'Actualités & Avis',
    tabStudent: 'Espace Étudiant',
    tabTeacher: 'Espace Enseignant',
    tabAdmin: 'Administration',
    tabChat: 'Chat Académique',
    tabPortals: 'Portails Officiels',
    tabContact: 'Contactez-nous',

    welcomeTitle: 'Faculté des Mathématiques et des Sciences de la Matière',
    welcomeSubtitle: 'Plateforme interactive unifiée regroupant les services pédagogiques, administratifs et de recherche pour les départements de Physique, Chimie, Mathématiques et le Tronc Commun Sciences de la Matière (Système LMD).',
    officialAnnouncementTicker: 'Flux en direct des actualités du site officiel FMSM',
    syncOfficialNews: 'Actualiser le flux',
    syncedLive: 'Synchronisé en direct',
    quickAccess: 'Accès Rapide aux Services',
    departmentsTitle: 'Départements de la Faculté',
    statsTitle: 'Statistiques Officielles de la Faculté',
    totalStudents: 'Étudiants Inscrits',
    totalTeachers: 'Corps Enseignant',
    totalLabs: 'Laboratoires de Recherche',
    totalSpecialties: 'Filières & Spécialités',
    studentsEnrolled: 'Étudiants inscrits',
    professorsSupervisors: 'Enseignants-chercheurs',
    departmentsCount: 'Départements académiques',
    programsCount: 'Offres Licence & Master',
    labsCount: 'Laboratoires accrédités',

    tickerTitle: 'Dernières Nouvelles',
    tickerSiteLink: 'Site Officiel',
    tickerAllNotice: 'Tous les avis',
    tickerOfficialBadge: 'Officiel FMSM',
    tickerNoticeBadge: 'Avis',
    heroCertifiedBadge: 'Portail Numérique Officiel Enseignants & Étudiants - Année Universitaire 2025 - 2026',
    heroSearchPlaceholder: 'Rechercher un module, enseignant, emploi du temps, cours, spécialité...',
    heroSearchBtn: 'Rechercher',
    heroBtnStudent: 'Espace Étudiant',
    heroBtnTeacher: 'Espace Enseignant',
    heroBtnPortals: 'Portails Officiels (11)',
    heroBtnAdvisor: 'Conseiller IA',
    heroBtnChat: 'Chat Académique (Telegram)',
    sealUniversity: 'Université Kasdi Merbah Ouargla',
    sealFaculty: 'Faculté des Mathématiques et des Sciences de la Matière',
    sndlTitle: 'Portail SNDL',
    sndlDesc: 'Documentation CERIST',

    deanWordTitle: 'Mot du Doyen de la Faculté à la Communauté Universitaire',
    deanName: 'Pr. Djamel Bechki',
    deanRole: 'Doyen de la Faculté des Mathématiques et des Sciences de la Matière',
    deanQuote: '« Les dénominations évoluent, mais l’essence demeure : telle est notre faculté »',
    deanParagraph1: "Les dénominations changent, mais l'essence demeure. Notre faculté, née en 1987 de l'École Normale Supérieure, devenue ensuite l'Institut des Sciences Exactes, puis Faculté des Sciences et Sciences de l'Ingénieur, s'affirme aujourd'hui comme la Faculté des Mathématiques et des Sciences de la Matière. Au fil des décennies, d'éminents professeurs ont œuvré sans relâche pour son rayonnement académique.",

    departmentsSectionTitle: 'Départements et Filières Pédagogiques',
    departmentsSectionSubtitle: 'Consultez les cursus, emplois du temps, corps professoral et laboratoires de recherche',
    browseDepartment: 'Explorer le département',
    tcSmTitle: 'Tronc Commun Sciences de la Matière',
    tcSmDesc: 'Première année Licence SM fondamentale en physique, chimie et mathématiques appliquées.',
    physicsDeptTitle: 'Département de Physique',
    physicsDeptDesc: 'Énergies renouvelables, physique médicale, rayonnements et physique fondamentale.',
    chemistryDeptTitle: 'Département de Chimie',
    chemistryDeptDesc: 'Chimie des matériaux, polymères, chimie organique et valorisation des ressources sahariennes.',
    mathDeptTitle: 'Département de Mathématiques',
    mathDeptDesc: 'Mathématiques appliquées à l’intelligence artificielle, science des données et modélisation.',

    portalsSectionTitle: 'Plateformes et Systèmes Officiels Accrédités',
    portalsSectionSubtitle: 'Accès direct aux plateformes ministérielles et universitaires accréditées pour étudiants et enseignants',

    lmdCalcTitle: 'Calculateur Moyenne Semestre LMD',
    lmdCalcSub: 'Dédié aux étudiants FMSM Ouargla',
    lmdCalcDesc: 'Calculez votre moyenne semestrielle avec coefficients, crédits, notes TD, TP et examens, rattrapages et dettes.',
    lmdCalcBtn: 'Calculer ma moyenne',
    coursesTitle: 'Bibliothèque & Cours Numériques',
    coursesSub: 'Téléchargement cours & TPs',
    coursesDesc: 'Téléchargement immédiat des polycopiés, séries d’exercices corrigés, comptes rendus TP et annales d’examens.',
    coursesBtn: 'Consulter les cours',
    guichetTitle: 'Guichet Électronique Unique',
    guichetSub: 'Demandes administratives & recours',
    guichetDesc: 'Certificats de scolarité, relevés de notes, attestations de travail et recours pédagogiques avec code de suivi.',
    guichetBtn: 'Accéder au guichet',
    bridgeCardTitle: 'Passerelle Pédagogique',
    bridgeCardSub: 'Permanences & contact direct',
    bridgeCardDesc: 'Contact direct avec les enseignants-chercheurs, questions, réservations d’audiences et suivi des mémoires PFE.',
    bridgeCardBtn: 'Accéder à la passerelle',

    chatTitle: 'Salons de Discussion et Communication Académique',
    chatSubtitle: 'Canaux interactifs type Telegram connectant les étudiants et leurs professeurs par spécialité',
    chatChannels: 'Canaux des Départements',
    chatAllFaculty: 'Canal Général Faculté',
    chatChemistry: 'Salon Département Chimie',
    chatPhysics: 'Salon Département Physique',
    chatMath: 'Salon Département Mathématiques',
    chatCommonSM: 'Salon Tronc Commun SM',
    chatProfessors: 'Conseils & Orientation Enseignants',
    typeMessagePlaceholder: 'Écrivez votre message ou question ici (avec fichier ou formule)...',
    sendMessage: 'Envoyer',
    pinnedNotice: 'Message épinglé de la direction',
    onlineMembers: 'Membres en ligne',
    filterByDept: 'Filtrer par département',
    allMembers: 'Tous les membres',
    professorsOnly: 'Professeurs certifiés',

    adminIndependenceTitle: 'Autonomie Totale de Gestion',
    adminIndependenceDesc: 'Gérez et modifiez tout le contenu de la plateforme depuis votre navigateur sans contacter votre hébergeur',
    backupDatabase: 'Sauvegarder la base de données (JSON)',
    restoreDatabase: 'Restaurer les données',
    exportSuccess: 'Sauvegarde exportée avec succès !',
    securitySettings: 'Paramètres de Sécurité Personnels',
    changePasswordEmail: 'Changer le mot de passe et email',

    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    loading: 'Chargement en cours...',
    download: 'Télécharger',
    viewDetails: 'Voir détails',
    filter: 'Filtrer',
    all: 'Tous',
    level: 'Niveau',
    semester: 'Semestre',
    date: 'Date',
    status: 'État',
    approved: 'Validé & Prêt',
    pending: 'En cours de traitement',
    rejected: 'Rejeté'
  },

  en: {
    republicTitle: "People's Democratic Republic of Algeria",
    ministryTitle: 'Ministry of Higher Education and Scientific Research',
    universityName: 'Kasdi Merbah University Ouargla',
    facultyName: 'Faculty of Mathematics and Matter Sciences',
    facultySubtitle: 'Kasdi Merbah University Ouargla - Faculty of Mathematics and Matter Sciences',
    fmsmCode: 'FMSM - UKMO',
    grievancePlatform: 'Grievances & Complaints Portal',
    officialSite: 'Official Site',
    myAdminOnline: 'My Online Admin',
    facultyLibrary: 'Faculty Library',
    adminAccount: 'Administration Account',
    adminAccountTitle: 'Official General Administration Account',
    accountsRBAC: 'Admin Accounts',
    search: 'Search',
    pedagogicalBridge: 'Pedagogical Bridge',
    aiAdvisor: 'AI Advisor',
    academicChat: 'Academic Chat (FMSM)',
    academicChatDesc: 'Interactive instant messaging between all department students and verified professors',
    loginPortals: 'Portal Access',
    logout: 'Log Out',
    studentSpace: 'Student Space',
    teacherSpace: 'Teacher Space',
    adminSpace: 'Admin Space',
    guestUser: 'Guest',
    themeDay: 'Light Mode',
    themeNight: 'Dark Mode',

    tabHome: 'Home',
    tabAbout: 'About & Labs',
    tabSpecialties: 'Programs & Degrees',
    tabCommonSM: 'Common Core SM',
    tabPhysics: 'Physics Dept',
    tabChemistry: 'Chemistry Dept',
    tabMath: 'Mathematics Dept',
    tabAnnouncements: 'News & Announcements',
    tabStudent: 'Student Portal',
    tabTeacher: 'Teacher Portal',
    tabAdmin: 'Admin Portal',
    tabChat: 'Academic Chat',
    tabPortals: 'Official Portals',
    tabContact: 'Contact Us',

    welcomeTitle: 'Faculty of Mathematics and Matter Sciences',
    welcomeSubtitle: 'Integrated interactive platform gathering pedagogical, administrative, and research services for the Departments of Physics, Chemistry, Mathematics, and Common Core Matter Sciences (LMD System).',
    officialAnnouncementTicker: 'Live Updates Ticker from the Official FMSM Website',
    syncOfficialNews: 'Sync News Now',
    syncedLive: 'Live Synchronized',
    quickAccess: 'Quick Services Access',
    departmentsTitle: 'Faculty Departments',
    statsTitle: 'Official Faculty Statistics',
    totalStudents: 'Total Enrolled Students',
    totalTeachers: 'Academic Staff',
    totalLabs: 'Accredited Research Labs',
    totalSpecialties: 'Academic Programs (BSc & MSc)',
    studentsEnrolled: 'Enrolled Students',
    professorsSupervisors: 'Academic & Research Staff',
    departmentsCount: 'Academic Departments',
    programsCount: 'BSc & MSc Offerings',
    labsCount: 'Accredited Research Labs',

    tickerTitle: 'Latest Updates',
    tickerSiteLink: 'Official Site',
    tickerAllNotice: 'All Notices',
    tickerOfficialBadge: 'Official FMSM',
    tickerNoticeBadge: 'Notice',
    heroCertifiedBadge: 'Official Digital Gateway for Faculty & Students - Academic Year 2025 - 2026',
    heroSearchPlaceholder: 'Search for a module, professor, timetable, lecture, program...',
    heroSearchBtn: 'Search',
    heroBtnStudent: 'Student Portal',
    heroBtnTeacher: 'Teacher Portal',
    heroBtnPortals: 'Official Portals (11)',
    heroBtnAdvisor: 'AI Advisor',
    heroBtnChat: 'Academic Chat (Telegram)',
    sealUniversity: 'Kasdi Merbah University Ouargla',
    sealFaculty: 'Faculty of Mathematics and Matter Sciences',
    sndlTitle: 'SNDL Portal',
    sndlDesc: 'CERIST Documentation',

    deanWordTitle: 'Welcome Message from the Dean of the Faculty',
    deanName: 'Prof. Djamel Bechki',
    deanRole: 'Dean of the Faculty of Mathematics and Matter Sciences',
    deanQuote: '"Names change, but the core essence endures: this is our faculty"',
    deanParagraph1: "Names evolve, but the core essence remains constant. Established in 1987 as the Higher Teacher Training School, later known as the Institute of Exact Sciences, then the Faculty of Sciences and Engineering, our institution now stands proudly as the Faculty of Mathematics and Matter Sciences. Throughout its history, dedicated scholars have continuously preserved its academic excellence.",

    departmentsSectionTitle: 'Academic Departments and Disciplines',
    departmentsSectionSubtitle: 'Explore curriculums, timetables, academic staff, and accredited research laboratories',
    browseDepartment: 'Explore Department',
    tcSmTitle: 'Common Core Matter Sciences',
    tcSmDesc: 'First year Bachelor SM foundational program in physics, chemistry, and mathematics.',
    physicsDeptTitle: 'Department of Physics',
    physicsDeptDesc: 'Renewable energy, medical physics, radiation sciences, and fundamental physics.',
    chemistryDeptTitle: 'Department of Chemistry',
    chemistryDeptDesc: 'Materials chemistry, polymers, organic chemistry, and desert natural resources.',
    mathDeptTitle: 'Department of Mathematics',
    mathDeptDesc: 'Applied mathematics for AI, data science, and mathematical modeling.',

    portalsSectionTitle: 'Accredited Official Portals & Systems',
    portalsSectionSubtitle: 'Direct links to ministerial and university platforms for faculty members and students',

    lmdCalcTitle: 'LMD Semester GPA Calculator',
    lmdCalcSub: 'Dedicated to FMSM Ouargla students',
    lmdCalcDesc: 'Calculate your semester GPA with course credits, coefficients, TD, TP, and exam grades.',
    lmdCalcBtn: 'Calculate GPA Now',
    coursesTitle: 'Digital Library & Courses',
    coursesSub: 'Download lectures & lab works',
    coursesDesc: 'Instant access to official lecture notes, solved exercise sheets, and previous exam archives.',
    coursesBtn: 'Browse Courses',
    guichetTitle: 'Unified E-Desk Services',
    guichetSub: 'Administrative requests & appeals',
    guichetDesc: 'School registration certificates, transcripts, teacher work certificates, and appeals with tracking codes.',
    guichetBtn: 'Open E-Desk',
    bridgeCardTitle: 'Pedagogical Bridge',
    bridgeCardSub: 'Office hours & direct communication',
    bridgeCardDesc: 'Direct contact with professors, consultations, appointment bookings, and PFE thesis monitoring.',
    bridgeCardBtn: 'Open Pedagogical Bridge',

    chatTitle: 'Academic Chat Rooms & Communication',
    chatSubtitle: 'Telegram-style real-time channels connecting students and professors across all fields',
    chatChannels: 'Department Channels',
    chatAllFaculty: 'Faculty General Channel',
    chatChemistry: 'Chemistry Dept Room',
    chatPhysics: 'Physics Dept Room',
    chatMath: 'Mathematics Dept Room',
    chatCommonSM: 'Common Core SM Room',
    chatProfessors: 'Faculty Advisory & Consultation',
    typeMessagePlaceholder: 'Type your message or inquiry here (attach file or formula)...',
    sendMessage: 'Send',
    pinnedNotice: 'Pinned department notice',
    onlineMembers: 'Online Members',
    filterByDept: 'Filter by Department',
    allMembers: 'All Members',
    professorsOnly: 'Verified Professors',

    adminIndependenceTitle: 'Full Administrative Independence',
    adminIndependenceDesc: 'Manage and modify every single aspect of the platform directly from your browser without contacting server hosting',
    backupDatabase: 'Download Full Database Backup (JSON)',
    restoreDatabase: 'Restore Database',
    exportSuccess: 'Backup exported successfully!',
    securitySettings: 'Personal Security Settings',
    changePasswordEmail: 'Change Password & Email',

    close: 'Close',
    save: 'Save Changes',
    cancel: 'Cancel',
    loading: 'Loading...',
    download: 'Download',
    viewDetails: 'View Details',
    filter: 'Filter',
    all: 'All',
    level: 'Level',
    semester: 'Semester',
    date: 'Date',
    status: 'Status',
    approved: 'Approved & Ready',
    pending: 'Under Review',
    rejected: 'Declined'
  }
};

export const getTranslation = (lang: AppLanguage): Translations => {
  return translations[lang] || translations.ar;
};
