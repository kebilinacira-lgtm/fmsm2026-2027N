import { FacultyTeacher, PedagogicalInquiry, AdministratorAccount, DepartmentId, AdminAuditLogEntry } from '../types';

// ==========================================
// 1. ADMINISTRATORS (2 Super Admins + 4 Dept Heads)
// Completely flexible, durable, changeable passwords & credentials
// ==========================================
export const INITIAL_ADMINISTRATORS: AdministratorAccount[] = [
  {
    id: 'super-admin-01',
    username: 'admin_principal',
    password: '123', // Initial password - user has complete freedom to change
    name: 'المشرف العام الأول للمنصة',
    role: 'super_admin',
    title: 'المشرف العام على المنصة - إدارة الكلية والرقمنة',
    grade: 'إدارة عليا مركزية',
    email: 'kebili.nacira@gmail.com',
    phone: '029-71-24-68 (مكتب 201)',
    office: 'الإدارة المركزية للكلية - الطابق الثاني، مكتب الإشراف العام',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: 'صلاحيات إشراف ومراقبة وتعديل شاملة ومطلقة على كافة الأقسام والمنصة.'
  },
  {
    id: 'super-admin-02',
    username: 'admin_direction',
    password: '123',
    name: 'المشرف العام المساعد',
    role: 'super_admin',
    title: 'نائب المشرف العام - مصلحة التمدرس والأنظمة البيداغوجية',
    grade: 'إدارة عليا مركزية',
    email: 'admin.platform@univ-ouargla.dz',
    phone: '029-71-24-69 (مكتب 202)',
    office: 'الإدارة المركزية للكلية - الطابق الثاني، مكتب 202',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'صلاحيات إشراف وتعديل ومراقبة كاملة لكافة أقسام الكلية.'
  },
  {
    id: 'head-chem-01',
    username: 'head_chemistry',
    password: '123',
    name: 'د. هادف دراجي',
    role: 'dept_head',
    departmentId: 'chemistry',
    title: 'رئيس قسم الكيمياء',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'dep.chimie@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 103)',
    office: 'الجناح البيداغوجي C - الطابق الأول، مكتب 118',
    avatar: '/head_chemistry_dept.jpg',
    notes: 'مسؤول تسيير قسم الكيمياء (إعلانات، أساتذة، جداول، مقاييس، وموارد الكيمياء).'
  },
  {
    id: 'head-phys-01',
    username: 'head_physics',
    password: '123',
    name: 'د. رابح بوعنان',
    role: 'dept_head',
    departmentId: 'physics',
    title: 'رئيس قسم الفيزياء',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'dep.physique@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 102)',
    office: 'الجناح البيداغوجي B - الطابق الأرضي، مكتب 012',
    avatar: '/head_physics_dept.jpg',
    notes: 'مسؤول تسيير قسم الفيزياء (إعلانات، أساتذة، جداول، مقاييس، وموارد الفيزياء).'
  },
  {
    id: 'head-math-01',
    username: 'head_math',
    password: '123',
    name: 'د. طلاب ابراهيم',
    role: 'dept_head',
    departmentId: 'math',
    title: 'رئيس قسم الرياضيات',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'dep.math@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 104)',
    office: 'الجناح البيداغوجي D - الطابق الثاني، مكتب 205',
    avatar: '/head_math_dept.jpg',
    notes: 'مسؤول تسيير قسم الرياضيات (إعلانات، أساتذة، جداول، مقاييس، وموارد الرياضيات).'
  },
  {
    id: 'head-sm-01',
    username: 'head_sm',
    password: '123',
    name: 'د. بن زاهي يوسف',
    role: 'dept_head',
    departmentId: 'common_sm',
    title: 'مسؤول فرع جذع مشترك علوم المادة',
    grade: 'أستاذ محاضر "أ" (MCA)',
    email: 'sm.tc@univ-ouargla.dz',
    phone: '029-71-24-68 (تحويلة 101)',
    office: 'الجناح البيداغوجي A - الطابق الأول، مكتب 104',
    avatar: '/head_common_sm.jpg',
    notes: 'مسؤول تسيير فرع جذع مشترك علوم المادة (مقررات السنة الأولى والأفواج).'
  }
];

// ==========================================
// 2. TEACHERS DIRECTORY & CONSULTATION HOURS
// "همزة الوصل بين الأستاذ والطالب"
// ==========================================
export const INITIAL_FACULTY_TEACHERS: FacultyTeacher[] = [
  // Chemistry Department Teachers
  {
    id: 'tch-chem-01',
    name: 'أ. د. بوقرة عبد الحليم',
    grade: 'أستاذ التعليم العالي (Professeur)',
    departmentId: 'chemistry',
    email: 'a.bouguerra@univ-ouargla.dz',
    phoneExtension: '215',
    office: 'الجناح C - الطابق الأول، مكتب 120',
    specialty: 'الكيمياء العضوية والمنتجات الطبيعية والمثبطات البيئية',
    modules: ['كيمياء عضوية 1 (L2)', 'كيمياء عضوية معمقة (L3)', 'تثمين المنتجات الطبيعية (M1)'],
    receptionHours: [
      { day: 'الأحد', time: '10:00 - 12:00', location: 'المكتب 120' },
      { day: 'الثلاثاء', time: '14:00 - 16:00', location: 'المكتب 120' }
    ],
    laboratory: 'مخبر الكيمياء والتثمين الطبي والبيئي (LCVME)',
    isAcceptingInquiries: true,
    bio: 'أستاذ باحث متخصص في الكيمياء العضوية واستخلاص الزيوت العطرية والنباتات الطبية الصحراوية وتأطير أطروحات الدكتوراه ومذكرات الماستر.'
  },
  {
    id: 'tch-chem-02',
    name: 'د. هادف دراجي',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'chemistry',
    email: 'dep.chimie@univ-ouargla.dz',
    phoneExtension: '103',
    office: 'الجناح C - الطابق الأول، مكتب رئاسة القسم 118',
    specialty: 'الكيمياء الفيزيائية وكيمياء المواد والمحاليل',
    modules: ['ترموديناميك كيميائي (L2)', 'كيمياء المحاليل (L1 SM)', 'مشاريع التخرج والماستر'],
    receptionHours: [
      { day: 'الإثنين', time: '09:00 - 11:30', location: 'مكتب رئيس قسم الكيمياء' },
      { day: 'الأربعاء', time: '13:30 - 15:30', location: 'مكتب رئيس قسم الكيمياء' }
    ],
    laboratory: 'مخبر الكيمياء وتطبيقاتها الصناعية',
    isAcceptingInquiries: true,
    bio: 'رئيس قسم الكيمياء وأستاذ باحث في الكيمياء الفيزيائية والحركية الكيميائية والتطبيقات المخبرية.'
  },
  {
    id: 'tch-chem-03',
    name: 'د. عماري عبد القادر',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'chemistry',
    email: 'a.ammari@univ-ouargla.dz',
    phoneExtension: '218',
    office: 'الجناح C - الطابق الثاني، مكتب 215',
    specialty: 'كيمياء المواد، البوليميرات، والتحفيز الضوئي',
    modules: ['كيمياء البوليميرات (L3)', 'طرق التحليل الطيفي والمطيافية (M1)', 'أشغال تطبيقية كيمياء التحليل'],
    receptionHours: [
      { day: 'الإثنين', time: '10:00 - 12:00', location: 'المكتب 215' },
      { day: 'الخميس', time: '09:30 - 11:30', location: 'المكتب 215' }
    ],
    laboratory: 'مخبر الكيمياء والتثمين الطبي والبيئي',
    isAcceptingInquiries: true,
    bio: 'خبير في تخليق وتوصيف المواد النانوية والمحفزات الضوئية لمعالجة مياه الصرف الصناعي.'
  },

  // Physics Department Teachers
  {
    id: 'tch-phys-01',
    name: 'أ. د. بشير حساني',
    grade: 'أستاذ التعليم العالي (Professeur)',
    departmentId: 'physics',
    email: 'b.hassani@univ-ouargla.dz',
    phoneExtension: '310',
    office: 'الجناح B - الطابق الأول، مكتب 112',
    specialty: 'الفيزياء الطاقوية، الطاقات المتجددة، والخلايا الكهروضوئية',
    modules: ['ميكانيكا الكم 1 (L3)', 'طاقة شمسية كهروضوئية (M1)', 'أنظمة تحويل الطاقة (M2)'],
    receptionHours: [
      { day: 'الأحد', time: '09:00 - 11:00', location: 'مكتب 112' },
      { day: 'الأربعاء', time: '10:00 - 12:00', location: 'مكتب مخبر LRM' }
    ],
    laboratory: 'مخبر الإشعاع والمادة وأدوات التعيين (LR&M)',
    isAcceptingInquiries: true,
    bio: 'مدير مخبر LRM، باحث رائد في النمذجة الفيزيائية للمجمعات الشمسية والمواد الكهروضوئية المتقدمة.'
  },
  {
    id: 'tch-phys-02',
    name: 'د. رابح بوعنان',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'physics',
    email: 'dep.physique@univ-ouargla.dz',
    phoneExtension: '102',
    office: 'الجناح B - الطابق الأرضي، مكتب رئاسة القسم 012',
    specialty: 'فيزياء المواد والإلكترونيات وتطبيقات أشباه الموصلات',
    modules: ['فيزياء الحالة الصلبة (L3)', 'أشباه الموصلات والنبائط (M1)', 'إلكترونيات تطبيقية (L2)'],
    receptionHours: [
      { day: 'الإثنين', time: '10:00 - 12:00', location: 'مكتب رئيس قسم الفيزياء' },
      { day: 'الخميس', time: '13:30 - 15:30', location: 'مكتب رئيس قسم الفيزياء' }
    ],
    laboratory: 'مخبر فيزياء الإشعاع وتطبيقاتها',
    isAcceptingInquiries: true,
    bio: 'رئيس قسم الفيزياء، أستاذ باحث متخصص في النبائط الإلكترونية والمواد الصلبة.'
  },
  {
    id: 'tch-phys-03',
    name: 'د. بلقاسم مرابط',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'physics',
    email: 'b.merabet@univ-ouargla.dz',
    phoneExtension: '315',
    office: 'الجناح B - الطابق الثاني، مكتب 204',
    specialty: 'الفيزياء النووية، الوقاية الإشعاعية، والفيزياء الطبية',
    modules: ['فيزياء نووية وجسيمات (L3)', 'فيزياء الإشعاع الطبي والتصوير (M1)', 'أجهزة الكشف الإشعاعي (M2)'],
    receptionHours: [
      { day: 'الأحد', time: '13:30 - 15:30', location: 'المكتب 204' },
      { day: 'الثلاثاء', time: '10:00 - 12:00', location: 'المكتب 204' }
    ],
    laboratory: 'مخبر الإشعاع والمادة (LR&M)',
    isAcceptingInquiries: true,
    bio: 'أستاذ مؤطر في مسار الفيزياء الإشعاعية الطبية بالتعاون مع مراكز علاج الأورام والمستشفيات الجامعية.'
  },

  // Mathematics Department Teachers
  {
    id: 'tch-math-01',
    name: 'أ. د. مراد بلخيري',
    grade: 'أستاذ التعليم العالي (Professeur)',
    departmentId: 'math',
    email: 'm.belkheiri@univ-ouargla.dz',
    phoneExtension: '410',
    office: 'الجناح D - الطابق الثاني، مكتب 210',
    specialty: 'التحليل الرياضي التابعي، المعادلات التفاضلية الجزئية، والطبولوجيا',
    modules: ['طبولوجيا الفضاءات المترية (L2)', 'تحليل تابعي ونظريات المشغلات (L3)', 'معادلات تفاضلية جزئية متقدمة (M1)'],
    receptionHours: [
      { day: 'الإثنين', time: '09:00 - 11:30', location: 'المكتب 210' },
      { day: 'الأربعاء', time: '11:00 - 13:00', location: 'المكتب 210' }
    ],
    laboratory: 'مخبر الرياضيات والحساب العلمي والنمذجة (LM2CS)',
    isAcceptingInquiries: true,
    bio: 'أستاذ التعليم العالي، باحث في الوجود والوحدانية لحلول المعادلات التفاضلية اللاخطية ونظم المعادلات التطورية.'
  },
  {
    id: 'tch-math-02',
    name: 'د. طلاب ابراهيم',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'math',
    email: 'dep.math@univ-ouargla.dz',
    phoneExtension: '104',
    office: 'الجناح D - الطابق الثاني، مكتب رئاسة القسم 205',
    specialty: 'الجبر الخطي المتقدم، نظرية الزمر، وتطبيقات التشفير',
    modules: ['جبر 3 ونظرية الحقول (L2)', 'هياكل جبرية متقدمة (L3)', 'تشفير وحماية البيانات (M1)'],
    receptionHours: [
      { day: 'الأحد', time: '11:00 - 13:00', location: 'مكتب رئيس قسم الرياضيات' },
      { day: 'الثلاثاء', time: '09:30 - 11:30', location: 'مكتب رئيس قسم الرياضيات' }
    ],
    laboratory: 'مخبر الرياضيات والحساب العلمي',
    isAcceptingInquiries: true,
    bio: 'رئيس قسم الرياضيات، باحث في الهياكل الجبرية ونظم الحساب الرمزي والتطبيقات الرياضية للمعلوماتية.'
  },
  {
    id: 'tch-math-03',
    name: 'د. العيد بن سالم',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'math',
    email: 'e.bensalem@univ-ouargla.dz',
    phoneExtension: '416',
    office: 'الجناح D - الطابق الأول، مكتب 114',
    specialty: 'الرياضيات التطبيقية، خوارزميات الذكاء الاصطناعي، وعلم البيانات',
    modules: ['الأسس الرياضية للذكاء الاصطناعي (M1)', 'التحليل العددي والخوارزميات (L2)', 'الإحصاء والاحتمالات المتقدمة (L3)'],
    receptionHours: [
      { day: 'الثلاثاء', time: '13:00 - 15:30', location: 'المكتب 114' },
      { day: 'الخميس', time: '10:00 - 12:00', location: 'المكتب 114' }
    ],
    laboratory: 'مخبر النمذجة والحساب العلمي (LM2CS)',
    isAcceptingInquiries: true,
    bio: 'مسؤول مسار ماستر الذكاء الاصطناعي، باحث في التحسين الرياضي وخوارزميات تعلم الآلة والتعلم العميق.'
  },

  // Common Core SM Teachers
  {
    id: 'tch-sm-01',
    name: 'د. بن زاهي يوسف',
    grade: 'أستاذ محاضر "أ" (MCA)',
    departmentId: 'common_sm',
    email: 'sm.tc@univ-ouargla.dz',
    phoneExtension: '101',
    office: 'الجناح A - الطابق الأول، مكتب مسؤول الفرع 104',
    specialty: 'ميكانيكا النقطة المادية والكهرباء العامة',
    modules: ['فيزياء 1 (ميكانيكا النقطة S1)', 'فيزياء 2 (كهرباء ومغناطيسية S2)', 'التوجيه البيداغوجي لطلبة الجذع المشترك'],
    receptionHours: [
      { day: 'الأحد', time: '09:00 - 12:00', location: 'مكتب مسؤول الجذع المشترك SM' },
      { day: 'الأربعاء', time: '09:00 - 12:00', location: 'مكتب مسؤول الجذع المشترك SM' }
    ],
    laboratory: 'مخبر الإشعاع والمادة',
    isAcceptingInquiries: true,
    bio: 'مسؤول فرع الجذع المشترك علوم المادة، يواكب الطلبة الجدد في انتقالهم من الثانوي إلى التعليم الجامعي ونظام LMD.'
  },
  {
    id: 'tch-sm-02',
    name: 'د. زايدي مصطفى',
    grade: 'أستاذ محاضر "ب" (MCB)',
    departmentId: 'common_sm',
    email: 'm.zaidi@univ-ouargla.dz',
    phoneExtension: '108',
    office: 'الجناح A - الطابق الأرضي، قاعة الأساتذة 008',
    specialty: 'كيمياء المادة والترموديناميك الكيميائي الأساسي',
    modules: ['كيمياء 1 (بنية المادة والجدول الدوري S1)', 'كيمياء 2 (الديناميكا الحرارية الكيميائية S2)'],
    receptionHours: [
      { day: 'الإثنين', time: '11:00 - 13:00', location: 'المكتب 008' },
      { day: 'الخميس', time: '11:00 - 13:00', location: 'المكتب 008' }
    ],
    laboratory: 'مخبر الكيمياء والتثمين البيئي',
    isAcceptingInquiries: true,
    bio: 'أستاذ منسق لمقياس كيمياء 1 و 2 لطلبة السنة الأولى علوم المادة.'
  },
  {
    id: 'tch-sm-03',
    name: 'أ. مسعودي رضوان',
    grade: 'أستاذ مساعد "أ" (MAA)',
    departmentId: 'common_sm',
    email: 'r.messaoudi@univ-ouargla.dz',
    phoneExtension: '112',
    office: 'مركز الحساب المكثف - قاعة البرمجة 03',
    specialty: 'الإعلام الآلي والبرمجة العلمية بلغة بايثون و فورتران',
    modules: ['إعلام آلي 1 و خوارزميات (S1)', 'إعلام آلي 2 و برمجة بايثون العلمية (S2)'],
    receptionHours: [
      { day: 'الثلاثاء', time: '09:30 - 12:00', location: 'مخبر الحاسوب 03' },
      { day: 'الخميس', time: '13:30 - 15:30', location: 'مخبر الحاسوب 03' }
    ],
    laboratory: 'مركز النمذجة والحساب العلمي',
    isAcceptingInquiries: true,
    bio: 'أستاذ مادة البرمجة والحساب الآلي لطلبة الجذع المشترك والسنوات الثانية.'
  }
];

// ==========================================
// 3. INITIAL SAMPLE PEDAGOGICAL INQUIRIES
// Real interaction between students & teachers
// ==========================================
export const INITIAL_PEDAGOGICAL_INQUIRIES: PedagogicalInquiry[] = [
  {
    id: 'inq-01',
    trackingCode: 'PED-FMSM-2026-901',
    studentName: 'بن علي عبد الرؤوف',
    matricule: '232339011452',
    studentEmail: 'abderraouf.benali@etu.univ-ouargla.dz',
    departmentId: 'common_sm',
    targetTeacherId: 'tch-sm-01',
    targetTeacherName: 'د. بن زاهي يوسف',
    moduleName: 'فيزياء 1 (ميكانيكا النقطة المادية)',
    subject: 'استفسار حول تمرين الحركة الدائرية المتغيرة بانتظام في السلسلة 2',
    question: 'السلام عليكم أستاذنا الفاضل، بخصوص التمرين الرابع في السلسلة رقم 02، هل يمكن تطبيق نظرية الطاقة الحركية مباشرة لحساب التسارع المماسي والناظمي بدون المرور عبر الإحداثيات الأسطوانية؟ شكراً جزيلاً لكم.',
    dateSubmitted: '2026-06-02',
    status: 'تمت الإجابة',
    replyContent: 'وعليكم السلام ورحمة الله وبركاته، نعم يا بني، يمكنك تطبيق نظرية الطاقة الحركية للحصول على عبارة السرعة بدلالة الموضع الزاوي θ، ومنها تشتق بالنسبة للزمن للحصول على التسارع المماسي at = dv/dt، أما التسارع الناظمي an = v²/R فيحسب مباشرة من قيمة السرعة المحسوبة. مرحباً بك في ساعاتي الاستقبالية يوم الأحد إن رغبت في توضيح بياني إضافي.',
    replyAuthor: 'د. بن زاهي يوسف',
    replyDate: '2026-06-03'
  },
  {
    id: 'inq-02',
    trackingCode: 'PED-FMSM-2026-902',
    studentName: 'أحمد بن سالم',
    matricule: '2139045812',
    studentEmail: 'ahmed.bensalem@etu.univ-ouargla.dz',
    departmentId: 'chemistry',
    targetTeacherId: 'tch-chem-01',
    targetTeacherName: 'أ. د. بوقرة عبد الحليم',
    moduleName: 'كيمياء عضوية معمقة (L3)',
    subject: 'طلب مرافقة وتوجيه لاختيار موضوع مذكرة ماستر كيمياء المواد الخضراء',
    question: 'أستاذي العزيز، أرغب بشدة في التخصص في كيمياء المواد الخضراء وتثمين النباتات الصحراوية خلال طور الماستر، وأرجو منكم تحديد موعد لمناقشة فكرة مذكرة حول استخلاص المركبات النشطة في نبات الحرمل بمخبركم. بارك الله فيكم.',
    dateSubmitted: '2026-06-04',
    status: 'تمت الإجابة',
    replyContent: 'أهلاً بك يا أحمد، فكرة ممتازة وتتوافق مع المشاريع البحثية الحالية لمخبر الكيمياء والتثمين البيئي (LCVME). يسعدني استقبالك في مكتبي 120 بالجناح C يوم الثلاثاء القادم على الساعة 14:30 لمناقشة الخطة والبروتوكول التجريبي بالتفصيل.',
    replyAuthor: 'أ. د. بوقرة عبد الحليم',
    replyDate: '2026-06-05'
  },
  {
    id: 'inq-03',
    trackingCode: 'PED-FMSM-2026-903',
    studentName: 'عثماني خولة',
    matricule: '232339088219',
    studentEmail: 'khawla.othmani@etu.univ-ouargla.dz',
    departmentId: 'math',
    targetTeacherId: 'tch-math-03',
    targetTeacherName: 'د. العيد بن سالم',
    moduleName: 'الأسس الرياضية للذكاء الاصطناعي',
    subject: 'سؤال بخصوص خوارزمية Gradient Descent والتفاضل التلقائي',
    question: 'أستاذ، في المحاضرة الثالثة حول تفكيك المصفوفات SVD وتطبيقه في PCA، هل يشترط أن تكون المصفوفة مربعة ومتناظرة لتطبيق التفكيك أم يصح على أي مصفوفة مستطيلة ذات أبعاد m x n؟',
    dateSubmitted: '2026-06-06',
    status: 'قيد المراجعة'
  }
];

// Local Storage Keys
const STORAGE_ADMINS_KEY = 'fmsm_administrators_accounts_v3';
const STORAGE_TEACHERS_KEY = 'fmsm_faculty_teachers_directory_v1';
const STORAGE_INQUIRIES_KEY = 'fmsm_pedagogical_inquiries_v1';
const STORAGE_AUDIT_LOG_KEY = 'fmsm_admin_audit_logs_v1';

// Load Administrators
export function loadAdministrators(): AdministratorAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_ADMINS_KEY);
    if (!raw) return INITIAL_ADMINISTRATORS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ADMINISTRATORS;
  } catch (err) {
    console.error('Error loading administrators:', err);
    return INITIAL_ADMINISTRATORS;
  }
}

// Save Administrators
export function saveAdministrators(admins: AdministratorAccount[]): void {
  try {
    localStorage.setItem(STORAGE_ADMINS_KEY, JSON.stringify(admins));
    // Also sync to server in background
    fetch('/api/administrators/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ administrators: admins })
    }).catch(e => console.warn('Server admin sync notice:', e));
  } catch (err) {
    console.error('Error saving administrators:', err);
  }
}

// Load Teachers
export function loadFacultyTeachers(): FacultyTeacher[] {
  try {
    const raw = localStorage.getItem(STORAGE_TEACHERS_KEY);
    if (!raw) return INITIAL_FACULTY_TEACHERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FACULTY_TEACHERS;
  } catch (err) {
    console.error('Error loading teachers:', err);
    return INITIAL_FACULTY_TEACHERS;
  }
}

// Save Teachers
export function saveFacultyTeachers(teachers: FacultyTeacher[]): void {
  try {
    localStorage.setItem(STORAGE_TEACHERS_KEY, JSON.stringify(teachers));
  } catch (err) {
    console.error('Error saving teachers:', err);
  }
}

// Load Inquiries
export function loadPedagogicalInquiries(): PedagogicalInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_INQUIRIES_KEY);
    if (!raw) return INITIAL_PEDAGOGICAL_INQUIRIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PEDAGOGICAL_INQUIRIES;
  } catch (err) {
    console.error('Error loading inquiries:', err);
    return INITIAL_PEDAGOGICAL_INQUIRIES;
  }
}

// Save Inquiries
export function savePedagogicalInquiries(inquiries: PedagogicalInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Error saving inquiries:', err);
  }
}

// Audit Log Helpers
export function loadAdminAuditLogs(): AdminAuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logAdminAction(entry: Omit<AdminAuditLogEntry, 'id' | 'timestamp'>): void {
  try {
    const existing = loadAdminAuditLogs();
    const newEntry: AdminAuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    const updated = [newEntry, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error writing audit log:', err);
  }
}
