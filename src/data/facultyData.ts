import {
  DepartmentInfo,
  ModuleItem,
  CourseResource,
  Announcement,
  ScheduleSession,
  GradeEntry,
  PFESubject,
  ChemicalElement,
  PhysicalConstant,
  OfficialFacultyLink
} from '../types';

export const FACULTY_GENERAL_INFO = {
  universityNameAr: 'جامعة قاصدي مرباح ورقلة',
  universityNameFr: 'Université Kasdi Merbah Ouargla (UKMO)',
  facultyNameAr: 'كلية الرياضيات وعلوم المادة',
  facultyNameFr: 'Faculté des Mathématiques et des Sciences de la Matière (FMSM)',
  addressAr: 'طريق غرداية، القطب الجامعي 01، ص.ب 511، ورقلة 30000، الجزائر',
  deanName: 'البروفيسور جمال بشكي',
  deanTitle: 'عميد كلية الرياضيات وعلوم المادة',
  deanEmail: 'dean.fmsm@univ-ouargla.dz',
  phoneNumbers: ['029-71-19-02', '029-71-24-68', '029-71-36-54'],
  fax: '029-71-19-02',
  email: 'fmsm@univ-ouargla.dz',
  website: 'https://fmsm.univ-ouargla.dz/ar/',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100081219317241',
  universityUrl: 'https://www.univ-ouargla.dz',
  foundingYear: 1988,
  totalStudents: 2650,
  totalTeachers: 116,
  totalLaboratories: 5,
  currentAcademicYear: '2025 - 2026',
  currentSemester: 'السداسي الثاني (S2)',
};

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  common_sm: {
    id: 'common_sm',
    nameAr: 'جذع مشترك علوم المادة',
    nameFr: 'Tronc Commun Sciences de la Matière (TC-SM)',
    shortCode: 'TC-SM',
    headName: 'د. بن زاهي يوسف',
    headTitle: 'مسؤول فرع جذع مشترك علوم المادة',
    headEmail: 'sm.tc@univ-ouargla.dz',
    office: 'الجناح البيداغوجي A - الطابق الأول، مكتب 104',
    description: 'المرحلة التأسيسية لطلبة السنة الأولى في مجالات الفيزياء والكيمياء والرياضيات، تهدف إلى إكساب الطالب القواعد العلمية المتينة للانتقال بتفوق نحو تخصصات الليسانس والماستر في الأقسام المتخصصة.',
    specialties: [
      {
        cycle: 'Licence',
        nameAr: 'السنة الأولى ليسانس علوم المادة (L1 SM)',
        nameFr: '1ère Année Licence Sciences de la Matière',
        description: 'سنة قاعدية تركز على الرياضيات المعمقة، الميكانيكا، الكيمياء البنيوية، والثيرموديناميك مع حصص أعمال موجهة ومخبرية مكثفة.',
        duration: 'سنة واحدة (سداسي 1 + سداسي 2)'
      }
    ],
    labs: [
      {
        nameAr: 'مخابر الأشغال التطبيقية للفيزياء العامة (TP Physique L1)',
        nameFr: 'Laboratoires de TP Physique Générale',
        director: 'أ. د. بن مسعود خالد',
        code: 'TP-PHY-01',
        specialization: 'تجارب الميكانيكا والضوء والكهرباء العامة'
      },
      {
        nameAr: 'مخابر الأشغال التطبيقية للكيمياء العامة (TP Chimie L1)',
        nameFr: 'Laboratoires de TP Chimie Générale',
        director: 'د. لعروسي مريم',
        code: 'TP-CHM-01',
        specialization: 'المعايرات الحجمية وتحضير المحاليل والسلامة المخبرية'
      }
    ],
    stats: {
      students: 980,
      teachers: 42,
      specialtiesCount: 1,
      laboratories: 6
    },
    colorTheme: 'emerald',
    officialPortalUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1060&tmpl=component'
  },
  physics: {
    id: 'physics',
    nameAr: 'قسم الفيزياء',
    nameFr: 'Département de Physique',
    shortCode: 'PHYS',
    headName: 'د. رابح بوعنان',
    headTitle: 'رئيس قسم الفيزياء',
    headEmail: 'dep.physique@univ-ouargla.dz',
    office: 'الجناح البيداغوجي B - الطابق الأرضي، مكتب 012',
    description: 'يعد قسم الفيزياء من أعرق الأقسام بالكلية، يساهم في تكوين إطارات وكفاءات عليا في الفيزياء الأساسية والتطبيقية والطاقات المتجددة والفيزياء الإشعاعية والطبية مع ارتباط وثيق بمخابر البحث العلمي المتقدمة.',
    specialties: [
      {
        cycle: 'Licence',
        nameAr: 'ليسانس فيزياء أساسية وتطبيقية (L2 & L3)',
        nameFr: 'Licence en Physique Fondamentale et Appliquée',
        description: 'تكوين متعمق في الميكانيكا الكمية، الكهرومغناطيسية، الديناميكا الحرارية، وفيزياء المواد الصلبة.',
        duration: '3 سنوات (بعد الجذع المشترك)'
      },
      {
        cycle: 'Master',
        nameAr: 'ماستر فيزياء طاقوية وطاقات متجددة',
        nameFr: 'Master Physique Énergétique et Énergies Renouvelables',
        description: 'تخصص استراتيجي يخدم المنطقة الصحراوية في استغلال الطاقة الشمسية والحرارية والأنظمة الهجينة.',
        duration: 'سنتان'
      },
      {
        cycle: 'Master',
        nameAr: 'ماستر فيزياء كيميائية طبية وفيزياء الإشعاع',
        nameFr: 'Master Physico-Chimie Médicale et Radiophysique',
        description: 'تخصص نوعي حديث يربط الفيزياء بالطب الإشعاعي والتصوير الطبي ومعالجة الأورام.',
        duration: 'سنتان'
      },
      {
        cycle: 'Doctorat',
        nameAr: 'دكتوراه الطور الثالث في الفيزياء الطاقوية وفيزياء المادة المكثفة',
        nameFr: 'Doctorat 3ème cycle en Physique',
        description: 'أبحاث معمقة بالتعاون مع المخابر الوطنية ومراكز البحث في الطاقات المتجددة.',
        duration: '3 إلى 5 سنوات'
      }
    ],
    labs: [
      {
        nameAr: 'مخبر الإشعاع والمادة وأدوات التعيين (LR&M)',
        nameFr: 'Laboratoire Rayonnement et Matière',
        director: 'أ. د. بشير حساني',
        code: 'LRM-UKMO',
        specialization: 'دراسة الخواص الضوئية والكهربائية للمواد النانوية وتأثير الإشعاع'
      },
      {
        nameAr: 'مخبر تطوير الطاقات المتجددة في الأقاليم الصحراوية',
        nameFr: 'Lab Développement Énergies Renouvelables',
        director: 'د. رابح بوعنان',
        code: 'LDER-UKMO',
        specialization: 'تطبيقات الخلايا الكهروضوئية والحرارية والأنظمة الشمسية بواحات ورقلة'
      }
    ],
    stats: {
      students: 540,
      teachers: 36,
      specialtiesCount: 4,
      laboratories: 8
    },
    colorTheme: 'sky',
    officialPortalUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1057&tmpl=component'
  },
  chemistry: {
    id: 'chemistry',
    nameAr: 'قسم الكيمياء',
    nameFr: 'Département de Chimie',
    shortCode: 'CHIM',
    headName: 'د. هادف دراجي',
    headTitle: 'رئيس قسم الكيمياء',
    headEmail: 'dep.chimie@univ-ouargla.dz',
    office: 'الجناح البيداغوجي C - الطابق الأول، مكتب 118',
    description: 'يهتم قسم الكيمياء بدراسة البنية الجزيئية للمادة، التخليق العضوي، كيمياء المواد الجديدة والبوليميرات، بالإضافة إلى كيمياء المياه والبيئة وتثمين الموارد الطبيعية للجنوب الجزائري.',
    specialties: [
      {
        cycle: 'Licence',
        nameAr: 'ليسانس كيمياء عامة وأساسية (L2 & L3)',
        nameFr: 'Licence en Chimie Fondamentale',
        description: 'دراسة الكيمياء العضوية واللاعضوية والتحليلية، والحركية الكيميائية، والتحليل الطيفي.',
        duration: '3 سنوات'
      },
      {
        cycle: 'Master',
        nameAr: 'ماستر كيمياء المواد والبوليميرات',
        nameFr: 'Master Chimie des Matériaux',
        description: 'تصميم واصطناع المواد المتقدمة والبوليميرات الصديقة للبيئة وتطبيقاتها الصناعية والبترولية.',
        duration: 'سنتان'
      },
      {
        cycle: 'Master',
        nameAr: 'ماستر كيمياء عضوية وتثمين المستخلصات الطبيعية',
        nameFr: 'Master Chimie Organique et Substances Naturelles',
        description: 'استخلاص وتنقية المركبات الفعالة من نباتات الصحراء والتمور والزيوت الأساسية وتطبيقاتها الصيدلانية.',
        duration: 'سنتان'
      },
      {
        cycle: 'Doctorat',
        nameAr: 'دكتوراه في الكيمياء التطبيقية والبيئية',
        nameFr: 'Doctorat en Chimie Appliquée',
        description: 'أبحاث نوعية في معالجة مياه الصرف الصناعي، تحلية المياه الجوفية، ومكافحة التآكل المعدني.',
        duration: '3 إلى 5 سنوات'
      }
    ],
    labs: [
      {
        nameAr: 'مخبر الكيمياء والتثمين الطبي والبيئي',
        nameFr: 'Laboratoire Chimie & Valorisation Bio-Environnementale',
        director: 'أ. د. بوقرة عبد الحليم',
        code: 'LCVBE-UKMO',
        specialization: 'فصل وتوصيف الجزيئات الحيوية، كيمياء المواد الخافضة للتوتر السطحي'
      },
      {
        nameAr: 'مخبر التحاليل الطيفية والفيزيوكيميائية الدقيقة',
        nameFr: 'Plateforme d’Analyses Physico-Chimiques',
        director: 'د. بن دريس سفيان',
        code: 'PAPC-UKMO',
        specialization: 'أجهزة الأشعة تحت الحمراء FTIR، مطيافية الأشعة المرئية UV-Vis، والكروماتوغرافيا HPLC'
      }
    ],
    stats: {
      students: 490,
      teachers: 34,
      specialtiesCount: 4,
      laboratories: 9
    },
    colorTheme: 'amber',
    officialPortalUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1059&tmpl=component'
  },
  math: {
    id: 'math',
    nameAr: 'قسم الرياضيات',
    nameFr: 'Département de Mathématiques',
    shortCode: 'MATH',
    headName: 'د. طلاب ابراهيم',
    headTitle: 'رئيس قسم الرياضيات',
    headEmail: 'dep.math@univ-ouargla.dz',
    office: 'الجناح البيداغوجي D - الطابق الثاني، مكتب 205',
    description: 'صرح علمي متميز يعنى بالرياضيات البحتة والتطبيقية، وعلوم المعطيات، والنمذجة الرياضية والذكاء الاصطناعي، بهدف تزويد الطلبة بقدرات تحليلية استثنائية وبناء نماذج للمشاكل الصناعية والعلمية المعقدة.',
    specialties: [
      {
        cycle: 'Licence',
        nameAr: 'ليسانس رياضيات عامة ومعمقة (L2 & L3)',
        nameFr: 'Licence en Mathématiques Générales',
        description: 'التحليل الرياضي، الجبر الخطي والمجرد، الهندسة التفاضلية، التوبولوجيا، وحساب الاحتمالات.',
        duration: '3 سنوات'
      },
      {
        cycle: 'Master',
        nameAr: 'ماستر الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات والبيانات الضخمة',
        nameFr: 'Master Mathématiques Appliquées à l’IA & Big Data',
        description: 'تخصص مستقبلي حديث يدمج التحليل الرياضي، الإحصاء المتقدم، خوارزميات التعلم الآلي والبيانات الضخمة.',
        duration: 'سنتان'
      },
      {
        cycle: 'Master',
        nameAr: 'ماستر النمذجة الرياضية والتحليل العددي',
        nameFr: 'Master Modélisation Mathématique & Calcul Scientifique',
        description: 'حل المعادلات التفاضلية الجزئية، المحاكاة الرقمية، وطرق العناصر المنتهية في الهندسة والفيزياء.',
        duration: 'سنتان'
      },
      {
        cycle: 'Doctorat',
        nameAr: 'دكتوراه علوم في التحليل الدالي والأنظمة الديناميكية',
        nameFr: 'Doctorat en Mathématiques Fondamentales et Appliquées',
        description: 'أبحاث نظرية وتطبيقية في الاستقرارية، التحكم الأمثل، والمعادلات التفاضلية العشوائية.',
        duration: '3 إلى 5 سنوات'
      }
    ],
    labs: [
      {
        nameAr: 'مخبر الرياضيات والنمذجة والحساب العلمي (LM2CS)',
        nameFr: 'Laboratoire Mathématiques, Modélisation et Calcul Scientifique',
        director: 'أ. د. مراد بلخيري',
        code: 'LM2CS-UKMO',
        specialization: 'الخوارزميات العددية، النمذجة البيولوجية والفيزيائية، وتحليل الإشارات والبيانات'
      }
    ],
    stats: {
      students: 640,
      teachers: 33,
      specialtiesCount: 4,
      laboratories: 4
    },
    colorTheme: 'indigo',
    officialPortalUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1058&tmpl=component'
  }
};

export const OFFICIAL_FACULTY_PORTALS: OfficialFacultyLink[] = [
  // 1. بوابات الأقسام البيداغوجية
  {
    id: 'dept_chemistry',
    titleAr: 'بوابة طلبة قسم الكيمياء',
    titleFr: 'Portail Étudiants - Département de Chimie',
    category: 'department',
    categoryAr: 'بوابات الأقسام البيداغوجية',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1059&tmpl=component',
    descriptionAr: 'الفضاء الرقمي الرسمي لطلبة قسم الكيمياء: إعلانات الدروس، جداول التوقيت، وتوزيع الأفواج ومحاضر المداولات.',
    badge: 'بوابة رسمية',
    iconName: 'chemistry',
    accentColor: 'amber'
  },
  {
    id: 'dept_physics',
    titleAr: 'بوابة قسم الفيزياء',
    titleFr: 'Portail Département de Physique',
    category: 'department',
    categoryAr: 'بوابات الأقسام البيداغوجية',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1057&tmpl=component',
    descriptionAr: 'الفضاء الرقمي الرسمي لقسم الفيزياء لطلبة الليسانس والماستر، ومتابعة برامج التكوين والمخابر.',
    badge: 'بوابة رسمية',
    iconName: 'physics',
    accentColor: 'sky'
  },
  {
    id: 'dept_math',
    titleAr: 'بوابة طلبة قسم الرياضيات',
    titleFr: 'Portail Département de Mathématiques',
    category: 'department',
    categoryAr: 'بوابات الأقسام البيداغوجية',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1058&tmpl=component',
    descriptionAr: 'الفضاء الرقمي الرسمي لقسم الرياضيات: جداول الحصص، المقاييس، وإعلانات الامتحانات لطلبة الرياضيات.',
    badge: 'بوابة رسمية',
    iconName: 'math',
    accentColor: 'indigo'
  },
  {
    id: 'dept_common_sm',
    titleAr: 'بوابة قسم جذع مشترك علوم المادة',
    titleFr: 'Portail Tronc Commun Sciences de la Matière (TC-SM)',
    category: 'department',
    categoryAr: 'بوابات الأقسام البيداغوجية',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1060&tmpl=component',
    descriptionAr: 'الفضاء الرقمي الرسمي لطلبة السنة الأولى ليسانس علوم المادة: التوجيه، توزيع أفواج TD/TP، وبرامج السداسيين.',
    badge: 'السنة الأولى L1',
    iconName: 'common',
    accentColor: 'emerald'
  },

  // 2. بوابات أطوار الدراسة والتكوين
  {
    id: 'cycle_graduation',
    titleAr: 'بوابة طالب التدرج',
    titleFr: 'Portail Étudiant de Graduation (Licence & Master)',
    category: 'cycles',
    categoryAr: 'أطوار التكوين والدراسة',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1061&tmpl=component',
    descriptionAr: 'البوابة المعتمدة الرسمية لطلبة التدرج (ليسانس وماستر): استعلامات المسار الدراسي، الجداول العامة، والخدمات البيداغوجية.',
    badge: 'طور التدرج',
    iconName: 'graduation',
    accentColor: 'teal'
  },
  {
    id: 'cycle_postgrad',
    titleAr: 'بوابة طلبة ما بعد التدرج',
    titleFr: 'Portail Post-Graduation & Recherche Doctorale',
    category: 'cycles',
    categoryAr: 'أطوار التكوين والدراسة',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=%201089%20&tmpl=component',
    descriptionAr: 'البوابة الرسمية لطلبة الدكتوراه، التأهيل الجامعي، ومتابعة مشاريع البحث العلمي والأطروحات بالكلية.',
    badge: 'دكتوراه وبحث',
    iconName: 'postgrad',
    accentColor: 'purple'
  },

  // 3. المنصات الإدارية والخدمية
  {
    id: 'platform_grievances',
    titleAr: 'منصة انشغالات وشكاوى الكلية',
    titleFr: 'Plateforme des Doléances FMSM (Grievances)',
    category: 'admin_service',
    categoryAr: 'المنصات الإدارية والخدمية',
    url: 'https://fmsm-grievances-platform.vercel.app/',
    descriptionAr: 'المنصة الرقمية المباشرة لتقديم ومتابعة انشغالات، شكاوى، واقتراحات طلبة وأساتذة كلية FMSM.',
    badge: 'خدمة تفاعلية',
    iconName: 'grievance',
    accentColor: 'rose'
  },
  {
    id: 'platform_idarati',
    titleAr: 'منصة إدارتي أون لاين',
    titleFr: 'Plateforme Idarati Online - FMSM',
    category: 'admin_service',
    categoryAr: 'المنصات الإدارية والخدمية',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1314&tmpl=component',
    descriptionAr: 'الفضاء الإداري الرقمي للمعاملات الإدارية، طلبات الوثائق الرسمية، وإجراءات الموظفين والأساتذة والطلبة.',
    badge: 'إدارة إلكترونية',
    iconName: 'admin',
    accentColor: 'blue'
  },

  // 4. التوثيق المكتبي والبحث العلمي
  {
    id: 'library_faculty',
    titleAr: 'مكتبة كلية الرياضيات وعلوم المادة',
    titleFr: 'Bibliothèque de la Faculté FMSM',
    category: 'documentation',
    categoryAr: 'قواعد البيانات والتوثيق العلمي',
    url: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=609&tmpl=component',
    descriptionAr: 'رابط البوابة الرسمية لمكتبة الكلية، رصيد المراجع والكتب العلمية، وحجز المطبوعات التخصصية.',
    badge: 'رصيد وثائقي',
    iconName: 'library',
    accentColor: 'teal'
  },
  {
    id: 'system_sndl',
    titleAr: 'النظام الوطني للتوثيق عبر الخط (SNDL)',
    titleFr: 'Système National de Documentation en Ligne - CERIST',
    category: 'documentation',
    categoryAr: 'قواعد البيانات والتوثيق العلمي',
    url: 'https://www.sndl.cerist.dz/',
    descriptionAr: 'النظام الوطني التابع لمركز CERIST للولوج للمجلات العلمية الدولية وقواعد البيانات العالمية المحكمة مجاناً للأساتذة والطلبة.',
    badge: 'CERIST - دولي',
    iconName: 'sndl',
    accentColor: 'cyan'
  },
  {
    id: 'system_dspace',
    titleAr: 'مستودع DSpace جامعة ورقلة',
    titleFr: 'DSpace UKMO - Dépôt Institutionnel',
    category: 'documentation',
    categoryAr: 'قواعد البيانات والتوثيق العلمي',
    url: 'https://dspace.univ-ouargla.dz/jspui/',
    descriptionAr: 'المستودع المؤسساتي الرقمي لجامعة قاصدي مرباح ورقلة: أرشيف أطروحات الدكتوراه، مذكرات الماستر، والمنشورات الأكاديمية.',
    badge: 'أطروحات ومذكرات',
    iconName: 'dspace',
    accentColor: 'emerald'
  }
];

export const MODULES_DATABASE: ModuleItem[] = [
  // L1 SM - Semester 1
  {
    id: 'sm-s1-phys1',
    code: 'SM111',
    nameAr: 'فيزياء 1 (ميكانيكا النقطة المادية)',
    nameFr: 'Physique 1 : Mécanique du Point Matériel',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. قدوري ناصر',
    description: 'دراسة الحركات في مختلف المعالم (الكارتيزية والأسطوانية والكروية)، الميكانيكا النيوتونية، كمية الحركة، العزم، والطاقة والعمل وقوانين الانحفاظ.'
  },
  {
    id: 'sm-s1-chm1',
    code: 'SM112',
    nameAr: 'كيمياء 1 (بنية المادة)',
    nameFr: 'Chimie 1 : Structure de la Matière',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. عماري عبد القادر',
    description: 'الذرة، النواة، النظائر، ميكانيكا الكم المبسطة (بور، شرودنغر)، الترتيب الدوري للعناصر، والروابط الكيميائية (لويس، VSEPR، والأفلاك الجزيئية).'
  },
  {
    id: 'sm-s1-math1',
    code: 'SM113',
    nameAr: 'رياضيات 1 (التحليل 1 والجبر 1)',
    nameFr: 'Mathématiques 1 : Analyse 1 & Algèbre 1',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: false,
    hoursLecture: 3,
    hoursTD: 3,
    hoursTP: 0,
    responsibleTeacher: 'د. العيد بن سالم',
    description: 'المجموعات والتطبيقات، الأعداد الحقيقية، المتتاليات العددية، الدوال الحقيقية لمتحول حقيقي، النهايات، الاستمرار والاشتقاقية، التوسيع المحدود بنشر تايلور.'
  },
  {
    id: 'sm-s1-tp1',
    code: 'SM114',
    nameAr: 'أشغال تطبيقية فيزياء وكيمياء 1',
    nameFr: 'TP Physique 1 & TP Chimie 1',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'methodologique',
    coefficient: 2,
    credits: 4,
    hasTD: false,
    hasTP: true,
    hoursLecture: 0,
    hoursTD: 0,
    hoursTP: 3,
    responsibleTeacher: 'أ. د. بن مسعود خالد',
    description: 'حساب الارتياب والأخطاء التجريبية، دراسة حركة السقوط الحر، البندول البسيط، تحضير محاليل عيارية، والمعايرة البيكاربوناتية والحمضية-القاعدية.'
  },
  {
    id: 'sm-s1-info1',
    code: 'SM115',
    nameAr: 'إعلام آلي 1 وخوارزميات',
    nameFr: 'Informatique 1 : Algorithmique & Bureautique',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'methodologique',
    coefficient: 2,
    credits: 4,
    hasTD: false,
    hasTP: true,
    hoursLecture: 1.5,
    hoursTD: 0,
    hoursTP: 1.5,
    responsibleTeacher: 'أ. مسعودي رضوان',
    description: 'بنية الحاسوب ونظم التشغيل، مفاهيم الخوارزميات، المتغيرات، التراكيب الشرطية والحلقات التكرارية والبرمجة بلغة C أو Python.'
  },
  {
    id: 'sm-s1-mst',
    code: 'SM116',
    nameAr: 'منهجية وتاريخ العلوم والتكنولوجيا',
    nameFr: 'Méthodologie & Histoire des Sciences',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'decouverte',
    coefficient: 1,
    credits: 2,
    hasTD: false,
    hasTP: false,
    hoursLecture: 1.5,
    hoursTD: 0,
    hoursTP: 0,
    responsibleTeacher: 'د. حميدي فاطمة',
    description: 'التطور التاريخي للاكتشافات الفيزيائية والكيميائية، المنهج العلمي التجريبي، كتابة المقالات والتقارير العلمية وأخلاقيات البحث الجامعي.'
  },
  {
    id: 'sm-s1-ang1',
    code: 'SM117',
    nameAr: 'لغة إنجليزية علمية 1',
    nameFr: 'Anglais Scientifique 1',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    unitType: 'transversale',
    coefficient: 1,
    credits: 2,
    hasTD: false,
    hasTP: false,
    hoursLecture: 1.5,
    hoursTD: 0,
    hoursTP: 0,
    responsibleTeacher: 'أ. ديدي عبد الله',
    description: 'المصطلحات العلمية التقنية بالإنجليزية لعلوم المادة، قراءة المقالات العلمية، التراكيب الأساسية للغة العلمية الأكاديمية.'
  },

  // L1 SM - Semester 2
  {
    id: 'sm-s2-phys2',
    code: 'SM211',
    nameAr: 'فيزياء 2 (الكهرباء والمغناطيسية)',
    nameFr: 'Physique 2 : Électricité & Magnétostatique',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. قدوري ناصر',
    description: 'الكهرباء الساكنة (قانون كولوم، الحقل والكمون الكهربائي، نظرية غاوس)، النواقل والعوازل، السعات والمكثفات، التيار المستمر، والمغناطيسية الساكنة (قانون بيو-سافار وقانون أمبير).'
  },
  {
    id: 'sm-s2-chm2',
    code: 'SM212',
    nameAr: 'كيمياء 2 (الديناميكا الحرارية الكيميائية)',
    nameFr: 'Chimie 2 : Thermodynamique Chimique',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'أ. د. بوقرة عبد الحليم',
    description: 'المبادئ الأول والثاني والثالث للديناميكا الحرارية، حرارة التفاعل والأنطالبي، الأنتروبي، طاقة غيبس الحرة، والتوازنات الكيميائية في المحاليل المائية.'
  },
  {
    id: 'sm-s2-math2',
    code: 'SM213',
    nameAr: 'رياضيات 2 (التحليل 2 والجبر الخطي)',
    nameFr: 'Mathématiques 2 : Analyse 2 & Algèbre Linéaire',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: false,
    hoursLecture: 3,
    hoursTD: 3,
    hoursTP: 0,
    responsibleTeacher: 'د. العيد بن سالم',
    description: 'التكامل وحساب المساحات والحجوم، المعادلات التفاضلية العادية من الرتبة الأولى والثانية، الفضاءات الشعاعية، المصفوفات، وحساب المحددات وحل جمل المعادلات الخطية.'
  },

  // Physics Advanced Modules
  {
    id: 'phys-l2-qm1',
    code: 'PHY311',
    nameAr: 'ميكانيكا الكم 1',
    nameFr: 'Mécanique Quantique 1',
    departmentId: 'physics',
    level: 'L2 Physique - S3',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: false,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 0,
    responsibleTeacher: 'أ. د. بشير حساني',
    description: 'الظواهر التجريبية المؤسسة للكم (إشعاع الجسم الأسود، المفعول الكهروضوئي، مفعول كومبتون)، ثنائية موجة-جسيم، معادلة شرودنغر، ودراسة حواجز وآبار الجهد.'
  },
  {
    id: 'phys-l3-solid',
    code: 'PHY511',
    nameAr: 'فيزياء المادة الصلبة وأشباه الموصلات',
    nameFr: 'Physique de l’État Solide et Semi-conducteurs',
    departmentId: 'physics',
    level: 'L3 Physique - S5',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. قدوري ناصر',
    description: 'الشبكات البلورية وشبكة برافي، الفضاء المقلوب وحيود الأشعة السينية، نظرية حزم الطاقة في الأجسام الصلبة، وتطبيقات السيليكون والخلايا الشمسية الكهروضوئية.'
  },

  // Chemistry Advanced Modules
  {
    id: 'chm-l2-org1',
    code: 'CHM311',
    nameAr: 'الكيمياء العضوية 1 (الآليات التفاعلية)',
    nameFr: 'Chimie Organique 1 : Mécanismes Réactionnels',
    departmentId: 'chemistry',
    level: 'L2 Chimie - S3',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. عماري عبد القادر',
    description: 'الكيمياء الفراغية (Stereochemistry)، الألكانات والألكينات، الاستبدال النيكليوفيلي (SN1, SN2)، والحذف (E1, E2)، والمركبات الأروماتية.'
  },
  {
    id: 'chm-l3-spec',
    code: 'CHM511',
    nameAr: 'الطرق الطيفية في التحليل الكيميائي',
    nameFr: 'Méthodes Spectroscopiques d’Analyse',
    departmentId: 'chemistry',
    level: 'L3 Chimie - S5',
    unitType: 'fondamentale',
    coefficient: 3,
    credits: 6,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. بن دريس سفيان',
    description: 'مطيافية الأشعة تحت الحمراء FTIR، مطيافية الرنين المغناطيسي النووي 1H-NMR و 13C-NMR، ومطيافية الكتلة (Mass Spectrometry) لتحديد البنى الجزيئية.'
  },

  // Math Advanced Modules
  {
    id: 'math-l2-topo',
    code: 'MTH311',
    nameAr: 'التوبولوجيا والفضاءات المترية',
    nameFr: 'Topologie des Espaces Métriques',
    departmentId: 'math',
    level: 'L2 Math - S3',
    unitType: 'fondamentale',
    coefficient: 4,
    credits: 7,
    hasTD: true,
    hasTP: false,
    hoursLecture: 3,
    hoursTD: 3,
    hoursTP: 0,
    responsibleTeacher: 'أ. د. مراد بلخيري',
    description: 'الفضاءات المترية، المجموعات المفتوحة والمغلقة، الالتصاق والداخل والحدود، الفضاءات المدمجة والمترابطة، والاستمرار المنتظم ونظرية باناخ للنقطة الثابتة.'
  },
  {
    id: 'math-m1-ia',
    code: 'MTH711',
    nameAr: 'الأسس الرياضية للذكاء الاصطناعي وتعلم الآلة',
    nameFr: 'Fondements Mathématiques de l’IA & Machine Learning',
    departmentId: 'math',
    level: 'M1 Math IA - S1',
    unitType: 'fondamentale',
    coefficient: 4,
    credits: 8,
    hasTD: true,
    hasTP: true,
    hoursLecture: 3,
    hoursTD: 1.5,
    hoursTP: 1.5,
    responsibleTeacher: 'د. العيد بن سالم',
    description: 'التحسين المحدب وغير المحدب (Convex Optimization)، خوارزميات الانحدار التدريجي (Gradient Descent)، تفكيك القيم الشاذة SVD، ونظرية التعلم الإحصائي والشبكات العصبية العميقة.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-01',
    title: 'رزنامة الامتحانات الاستدراكية للسداسي الثاني 2025/2026',
    departmentId: 'all',
    targetAudience: 'students',
    category: 'exams',
    date: '2026-06-10',
    isPinned: true,
    author: 'نيابة العمادة للبيداغوجيا وشؤون الطلبة',
    content: 'تنهي نيابة العمادة للدراسات إلى علم كافة طلبة كلية الرياضيات وعلوم المادة (جميع الأقسام والجذع المشترك) أن الامتحانات الاستدراكية ستنطلق ابتداءً من يوم الأحد القادم حسب الرزنامة المعلقة. يرجى من الطلبة المعنيين الحضور 15 دقيقة قبل موعد الامتحان مصحوبين ببطاقة الطالب وبطاقة التعريف الوطنية.',
    attachmentName: 'Planning_Examens_Rattrapage_FMSM_2026.pdf'
  },
  {
    id: 'anc-02',
    title: 'تذكير للأساتذة الكرام: آخر أجل لإيداع علامات المراقبة المستمرة (CC) والامتحانات',
    departmentId: 'all',
    targetAudience: 'teachers',
    category: 'deliberations',
    date: '2026-06-08',
    isPinned: true,
    author: 'عميد الكلية - أ.د. خير الدين قريشي',
    content: 'نرجو من السادة الأساتذة ومسؤولي المواد في أقسام الفيزياء والكيمياء والرياضيات والجذع المشترك موافاة رؤساء الأقسام بمحاضر النقاط الأولية وبطاقات التقييم المستمر قبل انعقاد لجان المداولات تمهيداً لفتح فترة الطعون البيداغوجية للطلبة.',
    attachmentName: 'Bordereau_Notes_Examen_FMSM.xlsx'
  },
  {
    id: 'anc-03',
    title: 'انطلاق عملية اختيار مواضيع مذكرات التخرج ماستر 2 فيزياء وكيمياء ورياضيات',
    departmentId: 'all',
    targetAudience: 'students',
    category: 'pedagogical',
    date: '2026-05-25',
    isPinned: false,
    author: 'لجان التكوين في الماستر',
    content: 'تم فتح باب التسجيل لاختيار مواضيع مذكرات التخرج (PFE) لطلبة السنة الثانية ماستر عبر المنصة الرقمية. يرجى الاطلاع على قائمة العناوين المقترحة من قبل الأساتذة ومخابر البحث والتواصل مع المشرفين لتأكيد الاختيار.',
    attachmentName: 'Liste_Sujets_PFE_Master_FMSM.pdf'
  },
  {
    id: 'anc-04',
    title: 'الملتقى الوطني الثالث حول الطاقات المتجددة والمواد المتقدمة بالصحراء (NERMAS 2026)',
    departmentId: 'physics',
    targetAudience: 'all',
    category: 'scientific',
    date: '2026-05-18',
    isPinned: false,
    author: 'مخبر تطوير الطاقات المتجددة في الأقاليم الصحراوية (LDER)',
    content: 'ينظم قسم الفيزياء ومخبر LDER بجامعة قاصدي مرباح ورقلة الملتقى الوطني حول المواد الكهروضوئية وتطبيقات الهيدروجين الأخضر. الدعوة مفتوحة لكافة الأساتذة والباحثين وطلبة الدكتوراه والماستر للمشاركة ببحوثهم.',
    attachmentName: 'Depliant_Colloque_National_NERMAS_2026.pdf'
  },
  {
    id: 'anc-05',
    title: 'فتح طلبات شهادات التسجيل وكشوف النقاط لطلبة جذع مشترك علوم المادة',
    departmentId: 'common_sm',
    targetAudience: 'students',
    category: 'administrative',
    date: '2026-05-12',
    isPinned: false,
    author: 'مصلحة التدريس - فرع الجذع المشترك SM',
    content: 'يمكن لطلبة السنة الأولى ليسانس علوم المادة استخراج الوثائق الإدارية وكشوف النقاط إلكترونياً عبر البوابة الموحدة للمنصة أو التقدم للشباك الإداري خلال أوقات الاستقبال (من 09:00 إلى 12:00).'
  }
];

export const INITIAL_RESOURCES: CourseResource[] = [
  {
    id: 'res-01',
    title: 'محاضرات ميكانيكا النقطة المادية مع أمثلة تطبيقية كاملة',
    moduleCode: 'SM111',
    moduleName: 'فيزياء 1 (ميكانيكا النقطة المادية)',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    type: 'cours',
    teacherName: 'د. قدوري ناصر',
    academicYear: '2025 - 2026',
    fileSize: '4.8 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-10-15',
    downloadsCount: 1420,
    description: 'ملخص شامل لكل فصول الميكانيكا: الحركيات، التحريك، وعمل وطاقة النقطة المادية.'
  },
  {
    id: 'res-02',
    title: 'سلسلة تمارين الكيمياء 1 (بنية المادة) مع الحلول النموذجية المفصلة',
    moduleCode: 'SM112',
    moduleName: 'كيمياء 1 (بنية المادة)',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    type: 'td',
    teacherName: 'د. عماري عبد القادر',
    academicYear: '2025 - 2026',
    fileSize: '3.2 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-11-02',
    downloadsCount: 1890,
    description: 'تمارين تغطي نموذج بور، أعداد الكم، جدول مندليف، وحساب طاقة التأين والروابط الكيميائية.'
  },
  {
    id: 'res-03',
    title: 'دليل الأشغال التطبيقية لكيمياء المحاليل والمعايرات الحجمية (TP Chimie 1)',
    moduleCode: 'SM114',
    moduleName: 'أشغال تطبيقية فيزياء وكيمياء 1',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    type: 'tp',
    teacherName: 'د. لعروسي مريم',
    academicYear: '2025 - 2026',
    fileSize: '5.1 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-10-20',
    downloadsCount: 970,
    description: 'قواعد الأمن المخبري، استخدام السحاحات والماصات، وكيفية إعداد التقرير المخبري النموذجي (Compte-rendu).'
  },
  {
    id: 'res-04',
    title: 'مطبوعة محاضرات التحليل 1: النهايات والاستمرار وحساب التفاضل والتكامل',
    moduleCode: 'SM113',
    moduleName: 'رياضيات 1 (التحليل 1 والجبر 1)',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    type: 'cours',
    teacherName: 'د. العيد بن سالم',
    academicYear: '2025 - 2026',
    fileSize: '6.4 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-10-12',
    downloadsCount: 2150,
    description: 'مقرر رسمي يتضمن البراهين الرياضية والنظريات الأساسية وتمارين محلولة في المتتاليات والدوال.'
  },
  {
    id: 'res-05',
    title: 'امتحان السداسي الأول 2025 في فيزياء 1 مع التصحيح وسلم التنقيط',
    moduleCode: 'SM111',
    moduleName: 'فيزياء 1 (ميكانيكا النقطة المادية)',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    type: 'exam_correction',
    teacherName: 'فريق أساتذة فيزياء 1',
    academicYear: '2024 - 2025',
    fileSize: '1.9 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-02-10',
    downloadsCount: 2310,
    description: 'موضوع الامتحان الشامل مع تفصيل كل خطوة وسلم الدرجات للمراجعة الذاتية والتحضير للاستدراك.'
  },
  {
    id: 'res-06',
    title: 'محاضرات ميكانيكا الكم المعمقة وفضاءات هلبرت L2 Physique',
    moduleCode: 'PHY311',
    moduleName: 'ميكانيكا الكم 1',
    departmentId: 'physics',
    level: 'L2 Physique - S3',
    type: 'cours',
    teacherName: 'أ. د. بشير حساني',
    academicYear: '2025 - 2026',
    fileSize: '7.2 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-11-18',
    downloadsCount: 620,
    description: 'الميكانيكا المصفوفية لـ هايزنبرغ، براكيت ديراك، المؤثرات الهرميتية وتطبيقات الذبذبات التوافقية.'
  },
  {
    id: 'res-07',
    title: 'أطلس الآليات التفاعلية في الكيمياء العضوية L2/L3 Chimie',
    moduleCode: 'CHM311',
    moduleName: 'الكيمياء العضوية 1 (الآليات التفاعلية)',
    departmentId: 'chemistry',
    level: 'L2 Chimie - S3',
    type: 'resume',
    teacherName: 'د. عماري عبد القادر',
    academicYear: '2025 - 2026',
    fileSize: '8.5 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-12-05',
    downloadsCount: 840,
    description: 'مخططات بصرية ملونة تشرح آليات SN1, SN2, E1, E2 وإعادة الترتيب الجزيئي مع أمثلة من الصناعة الدوائية.'
  },
  {
    id: 'res-08',
    title: 'محاضرات خوارزميات تعلم الآلة والشبكات العصبية M1 Mathématiques IA',
    moduleCode: 'MTH711',
    moduleName: 'الأسس الرياضية للذكاء الاصطناعي وتعلم الآلة',
    departmentId: 'math',
    level: 'M1 Math IA - S1',
    type: 'cours',
    teacherName: 'د. العيد بن سالم',
    academicYear: '2025 - 2026',
    fileSize: '12.1 MB',
    fileFormat: 'PDF',
    uploadDate: '2025-10-30',
    downloadsCount: 780,
    description: 'الانحدار اللوجستي، مصفوفات التشتت، خوارزمية انتشار الخطأ الخلفي (Backpropagation)، ودفاتر Jupyter Notebook تطبيقية.'
  }
];

export const SCHEDULE_DATABASE: ScheduleSession[] = [
  // L1 SM - Group 1
  {
    id: 'sch-01',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الأحد',
    timeSlot: '08:00 - 09:30',
    moduleName: 'فيزياء 2 (الكهرباء والمغناطيسية)',
    type: 'محاضرة',
    room: 'مدرج ابن الهيثم (Amphi A)',
    teacher: 'د. قدوري ناصر'
  },
  {
    id: 'sch-02',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الأحد',
    timeSlot: '09:40 - 11:10',
    moduleName: 'أعمال موجهة فيزياء 2',
    type: 'أعمال موجهة (TD)',
    room: 'قاعة 101 - الجناح A',
    teacher: 'أ. د. بن مسعود خالد'
  },
  {
    id: 'sch-03',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الأحد',
    timeSlot: '11:20 - 12:50',
    moduleName: 'كيمياء 2 (الديناميكا الحرارية)',
    type: 'محاضرة',
    room: 'مدرج جابر بن حيان (Amphi B)',
    teacher: 'أ. د. بوقرة عبد الحليم'
  },
  {
    id: 'sch-04',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الإثنين',
    timeSlot: '08:00 - 09:30',
    moduleName: 'رياضيات 2 (التحليل 2 والجبر)',
    type: 'محاضرة',
    room: 'مدرج الخوارزمي (Amphi C)',
    teacher: 'د. العيد بن سالم'
  },
  {
    id: 'sch-05',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الإثنين',
    timeSlot: '09:40 - 11:10',
    moduleName: 'أعمال موجهة رياضيات 2',
    type: 'أعمال موجهة (TD)',
    room: 'قاعة 102 - الجناح A',
    teacher: 'أ. بلعور رشيد'
  },
  {
    id: 'sch-06',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الثلاثاء',
    timeSlot: '13:00 - 14:30',
    moduleName: 'أعمال تطبيقية كيمياء (TP Chimie)',
    type: 'أعمال تطبيقية (TP)',
    room: 'مخبر الكيمياء العامة 02',
    teacher: 'د. لعروسي مريم'
  },
  {
    id: 'sch-07',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الأربعاء',
    timeSlot: '08:00 - 09:30',
    moduleName: 'أعمال تطبيقية فيزياء (TP Physique)',
    type: 'أعمال تطبيقية (TP)',
    room: 'مخبر الكهرباء والضوء 01',
    teacher: 'أ. حراثي عمار'
  },
  {
    id: 'sch-08',
    departmentId: 'common_sm',
    level: 'L1 SM - S2',
    group: 'الفوج 01 (Groupe 1)',
    day: 'الخميس',
    timeSlot: '09:40 - 11:10',
    moduleName: 'إعلام آلي 2 وبرمجة',
    type: 'أعمال موجهة (TD)',
    room: 'مخبر الحاسوب 03 - مركز الحساب',
    teacher: 'أ. مسعودي رضوان'
  }
];

export const INITIAL_GRADES: GradeEntry[] = [
  {
    id: 'grd-01',
    matricule: '232339011452',
    studentName: 'بن علي عبد الرؤوف',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    group: 'الفوج 01',
    moduleCode: 'SM111',
    moduleName: 'فيزياء 1 (ميكانيكا النقطة المادية)',
    ccGrade: 14.5,
    tpGrade: 15.0,
    examGrade: 13.5,
    finalGrade: 14.05,
    session: 'عادية',
    isDeliberated: true
  },
  {
    id: 'grd-02',
    matricule: '232339011452',
    studentName: 'بن علي عبد الرؤوف',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    group: 'الفوج 01',
    moduleCode: 'SM112',
    moduleName: 'كيمياء 1 (بنية المادة)',
    ccGrade: 13.0,
    tpGrade: 16.0,
    examGrade: 12.0,
    finalGrade: 13.1,
    session: 'عادية',
    isDeliberated: true
  },
  {
    id: 'grd-03',
    matricule: '232339011452',
    studentName: 'بن علي عبد الرؤوف',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    group: 'الفوج 01',
    moduleCode: 'SM113',
    moduleName: 'رياضيات 1 (التحليل 1 والجبر 1)',
    ccGrade: 16.0,
    examGrade: 15.5,
    finalGrade: 15.7,
    session: 'عادية',
    isDeliberated: true
  },
  {
    id: 'grd-04',
    matricule: '232339088219',
    studentName: 'عثماني خولة',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    group: 'الفوج 02',
    moduleCode: 'SM111',
    moduleName: 'فيزياء 1 (ميكانيكا النقطة المادية)',
    ccGrade: 12.5,
    tpGrade: 14.0,
    examGrade: 10.5,
    finalGrade: 11.65,
    session: 'عادية',
    isDeliberated: true
  },
  {
    id: 'grd-05',
    matricule: '232339088219',
    studentName: 'عثماني خولة',
    departmentId: 'common_sm',
    level: 'L1 SM - S1',
    group: 'الفوج 02',
    moduleCode: 'SM112',
    moduleName: 'كيمياء 1 (بنية المادة)',
    ccGrade: 15.5,
    tpGrade: 16.5,
    examGrade: 14.0,
    finalGrade: 14.85,
    session: 'عادية',
    isDeliberated: true
  }
];

export const INITIAL_PFE_SUBJECTS: PFESubject[] = [
  {
    id: 'pfe-01',
    title: 'دراسة محاكاة عددية لتحسين مردود الخلايا الكهروضوئية السيليكونية تحت الظروف المناخية لولاية ورقلة',
    departmentId: 'physics',
    level: 'Master 2',
    specialty: 'فيزياء طاقوية وطاقات متجددة',
    supervisor: 'أ. د. بشير حساني',
    laboratory: 'مخبر الإشعاع والمادة (LR&M)',
    description: 'استخدام برمجيات Silvaco-Atlas و SCAPS-1D لدراسة تأثير درجة الحرارة العالية والغبار الصحراوي على نجاعة وصلات p-n وخلايا البيروفسكايت.',
    maxStudents: 2,
    enrolledStudents: ['بلال قويدري', 'إسماعيل شواشنة'],
    status: 'مكتمل'
  },
  {
    id: 'pfe-02',
    title: 'تثمين مستخلصات نبات الشيح والحرمل الصحراويين واستخدامها كمثبطات بيئية لتآكل الفولاذ الكربوني في وسط حمضي',
    departmentId: 'chemistry',
    level: 'Master 2',
    specialty: 'كيمياء عضوية ومواد خضراء',
    supervisor: 'أ. د. بوقرة عبد الحليم',
    laboratory: 'مخبر الكيمياء والتثمين الطبي والبيئي',
    description: 'استخلاص المركبات الفينولية والفلافونويدات، ثم قياس منحنيات الاستقطاب الكهروكيميائي ومطيافية الممانعة EIS لتحديد فعالية التثبيط.',
    maxStudents: 2,
    enrolledStudents: ['مريم زايدي'],
    status: 'متاح للتسجيل'
  },
  {
    id: 'pfe-03',
    title: 'خوارزميات التعلم العميق والشبكات العصبية الالتفافية (CNN) لتصنيف الصور الطبية للأورام الإشعاعية',
    departmentId: 'math',
    level: 'Master 2',
    specialty: 'الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات',
    supervisor: 'د. العيد بن سالم',
    laboratory: 'مخبر الرياضيات والحساب العلمي (LM2CS)',
    description: 'بناء نموذج رياضي وخوارزمية تعلم آلي باستخدام بايثون و PyTorch لتحليل صور الرنين المغناطيسي وتحسين الدقة الإحصائية للكشف المبكر.',
    maxStudents: 2,
    enrolledStudents: [],
    status: 'متاح للتسجيل'
  },
  {
    id: 'pfe-04',
    title: 'اصطناع وتوصيف جسيمات أكسيد الزنك (ZnO) النانوية المشوبة بالفضة ودراسة نشاطها المحفز ضوئياً لتطهير المياه',
    departmentId: 'chemistry',
    level: 'Master 2',
    specialty: 'كيمياء المواد والبوليميرات',
    supervisor: 'د. عماري عبد القادر',
    laboratory: 'مخبر الكيمياء والتثمين الطبي والبيئي',
    description: 'تحضير المواد بطريقة Sol-Gel والترسيب الكيميائي، ثم التوصيف بواسطة XRD و UV-Vis و FTIR واختبار تحلل ملوثات الأصبغة النسيجية تحت الأشعة الشمسية.',
    maxStudents: 2,
    enrolledStudents: ['طارق بن ناصر', 'ياسين حدوش'],
    status: 'قيد المناقشة',
    defenseDate: '2026-06-22'
  }
];

export const CHEMICAL_ELEMENTS: ChemicalElement[] = [
  { number: 1, symbol: 'H', nameAr: 'هيدروجين', nameFr: 'Hydrogène', atomicMass: 1.008, category: 'لا فلز', electronConfig: '1s¹', period: 1, group: 1, summary: 'أخف العناصر الكيميائية وأكثرها وفرة في الكون، غاز عديم اللون والرائحة شديد الاشتعال.' },
  { number: 2, symbol: 'He', nameAr: 'هيليوم', nameFr: 'Hélium', atomicMass: 4.0026, category: 'غاز نبيل', electronConfig: '1s²', period: 1, group: 18, summary: 'غاز خامل عديم اللون والرائحة، ثاني أكثر العناصر وفرة في الكون، يستخدم في التبريد الفائق والمناطيد.' },
  { number: 3, symbol: 'Li', nameAr: 'ليثيوم', nameFr: 'Lithium', atomicMass: 6.94, category: 'فلز قلوي', electronConfig: '[He] 2s¹', period: 2, group: 1, summary: 'فلز خفيف ناعم فضي اللون، عنصر أساسي في بطاريات الليثيوم-أيون الحديثة.' },
  { number: 4, symbol: 'Be', nameAr: 'بيريليوم', nameFr: 'Béryllium', atomicMass: 9.0122, category: 'فلز قلوي ترابي', electronConfig: '[He] 2s²', period: 2, group: 2, summary: 'فلز صلب خفيف الوزن ذو نقطة انصهار عالية، يستخدم في الصناعات الفضائية وأنابيب الأشعة السينية.' },
  { number: 5, symbol: 'B', nameAr: 'بورون', nameFr: 'Bore', atomicMass: 10.81, category: 'شبه فلز', electronConfig: '[He] 2s² 2p¹', period: 2, group: 13, summary: 'شبه فلز نادر يستخدم في زجاج البوروسيليكات المقاوم للحرارة ودروع المفاعلات النووية.' },
  { number: 6, symbol: 'C', nameAr: 'كربون', nameFr: 'Carbone', atomicMass: 12.011, category: 'لا فلز', electronConfig: '[He] 2s² 2p²', period: 2, group: 14, summary: 'حجر الأساس لكل الكيمياء العضوية والحياة، يتآصل في هيئة غرافيت وألماس وفوليرين وأنابيب نانوية.' },
  { number: 7, symbol: 'N', nameAr: 'نيتروجين', nameFr: 'Azote', atomicMass: 14.007, category: 'لا فلز', electronConfig: '[He] 2s² 2p³', period: 2, group: 15, summary: 'يشكل حوالي 78% من الغلاف الجوي للأرض، عنصر جوهري في الأحماض الأمينية والبروتينات.' },
  { number: 8, symbol: 'O', nameAr: 'أكسجين', nameFr: 'Oxygène', atomicMass: 15.999, category: 'لا فلز', electronConfig: '[He] 2s² 2p⁴', period: 2, group: 16, summary: 'عنصر شديد التفاعل ضروري لتنفس معظم الكائنات الحية وعمليات الاحتراق والأكسدة.' },
  { number: 9, symbol: 'F', nameAr: 'فلور', nameFr: 'Fluor', atomicMass: 18.998, category: 'هالوجين', electronConfig: '[He] 2s² 2p⁵', period: 2, group: 17, summary: 'أعلى العناصر كهروسالبية وأكثرها نشاطاً كيميائياً، يشكل مركبات مع جميع العناصر تقريباً.' },
  { number: 10, symbol: 'Ne', nameAr: 'نيون', nameFr: 'Néon', atomicMass: 20.180, category: 'غاز نبيل', electronConfig: '[He] 2s² 2p⁶', period: 2, group: 18, summary: 'غاز خامل يتوهج بضوء برتقالي أحمر مائل للحمرة عند مرور تيار كهربائي عالي الجهد.' },
  { number: 11, symbol: 'Na', nameAr: 'صوديوم', nameFr: 'Sodium', atomicMass: 22.990, category: 'فلز قلوي', electronConfig: '[Ne] 3s¹', period: 3, group: 1, summary: 'فلز لين شديد التفاعل مع الماء، يشكل مع الكلور ملح الطعام NaCl الشائع.' },
  { number: 12, symbol: 'Mg', nameAr: 'مغنيسيوم', nameFr: 'Magnésium', atomicMass: 24.305, category: 'فلز قلوي ترابي', electronConfig: '[Ne] 3s²', period: 3, group: 2, summary: 'فلز هيكلي خفيف، ذرة مركزية في جزيء الكلوروفيل المسؤول عن التمثيل الضوئي في النبات.' },
  { number: 13, symbol: 'Al', nameAr: 'ألومنيوم', nameFr: 'Aluminium', atomicMass: 26.982, category: 'فلز بعد انتقالي', electronConfig: '[Ne] 3s² 3p¹', period: 3, group: 13, summary: 'فلز أبيض فضي خفيف مقاوم للتآكل بفضل طبقة الأكسيد، واسع الاستخدام في الطيران والبناء.' },
  { number: 14, symbol: 'Si', nameAr: 'سيليكون', nameFr: 'Silicium', atomicMass: 28.085, category: 'شبه فلز', electronConfig: '[Ne] 3s² 3p²', period: 3, group: 14, summary: 'عماد صناعة الإلكترونيات والخلايا الشمسية في ورقلة والعالم، ثاني أكثر العناصر وفرة في القشرة الأرضية.' },
  { number: 15, symbol: 'P', nameAr: 'فسفور', nameFr: 'Phosphore', atomicMass: 30.974, category: 'لا فلز', electronConfig: '[Ne] 3s² 3p³', period: 3, group: 15, summary: 'عنصر حيوي في DNA و RNA وجزيئات نقل الطاقة ATP، ضروري للأسمدة الزراعية.' },
  { number: 16, symbol: 'S', nameAr: 'كبريت', nameFr: 'Soufre', atomicMass: 32.06, category: 'لا فلز', electronConfig: '[Ne] 3s² 3p⁴', period: 3, group: 16, summary: 'مادة صلبة صفراء بلورية تنتج حمض الكبريتيك H2SO4، أهم مركب في الصناعات الكيميائية.' },
  { number: 17, symbol: 'Cl', nameAr: 'كلور', nameFr: 'Chlore', atomicMass: 35.45, category: 'هالوجين', electronConfig: '[Ne] 3s² 3p⁵', period: 3, group: 17, summary: 'غاز أصفر مخضر سام مؤكسد قوي، يستخدم بكثافة في تعقيم مياه الشرب والمطهرات الصناعية.' },
  { number: 18, symbol: 'Ar', nameAr: 'آرغون', nameFr: 'Argon', atomicMass: 39.948, category: 'غاز نبيل', electronConfig: '[Ne] 3s² 3p⁶', period: 3, group: 18, summary: 'أكثر الغازات النبيلة وفرة في الهواء (حوالي 0.93%)، يستخدم كغاز واقٍ في عمليات اللحام.' },
  { number: 26, symbol: 'Fe', nameAr: 'حديد', nameFr: 'Fer', atomicMass: 55.845, category: 'فلز انتقالي', electronConfig: '[Ar] 3d⁶ 4s²', period: 4, group: 8, summary: 'العمود الفقري للصناعة والحضارة، ومكون أساسي للهيموغلوبين الناقل للأكسجين في الدم.' },
  { number: 29, symbol: 'Cu', nameAr: 'نحاس', nameFr: 'Cuivre', atomicMass: 63.546, category: 'فلز انتقالي', electronConfig: '[Ar] 3d¹⁰ 4s¹', period: 4, group: 11, summary: 'فلز ممتاز التوصيل الكهربائي والحراري، يستخدم في الأسلاك والكابلات والمبادلات الحرارية.' }
];

export const PHYSICAL_CONSTANTS: PhysicalConstant[] = [
  {
    nameAr: 'سرعة الضوء في الفراغ',
    nameFr: 'Vitesse de la lumière dans le vide',
    symbol: 'c',
    value: '2.997 924 58 × 10⁸',
    unit: 'm / s',
    category: 'ثوابت عامة'
  },
  {
    nameAr: 'ثابت بلانك',
    nameFr: 'Constante de Planck',
    symbol: 'h',
    value: '6.626 070 15 × 10⁻³⁴',
    unit: 'J · s',
    category: 'الذرية والنووية'
  },
  {
    nameAr: 'ثابت بلانك المختزل',
    nameFr: 'Constante de Dirac (ħ)',
    symbol: 'ħ = h / 2π',
    value: '1.054 571 817 × 10⁻³⁴',
    unit: 'J · s',
    category: 'الذرية والنووية'
  },
  {
    nameAr: 'الشحنة العنصرية للإلكترون',
    nameFr: 'Charge élémentaire',
    symbol: 'e',
    value: '1.602 176 634 × 10⁻¹⁹',
    unit: 'C',
    category: 'الكهرومغناطيسية'
  },
  {
    nameAr: 'كتلة الإلكترون في السكون',
    nameFr: 'Masse de l’électron au repos',
    symbol: 'mₑ',
    value: '9.109 383 70 × 10⁻³¹',
    unit: 'kg',
    category: 'الذرية والنووية'
  },
  {
    nameAr: 'كتلة البروتون في السكون',
    nameFr: 'Masse du proton',
    symbol: 'mₚ',
    value: '1.672 621 92 × 10⁻²⁷',
    unit: 'kg',
    category: 'الذرية والنووية'
  },
  {
    nameAr: 'ثابت أفوجادرو',
    nameFr: 'Nombre d’Avogadro',
    symbol: 'Nₐ',
    value: '6.022 140 76 × 10²³',
    unit: 'mol⁻¹',
    category: 'ثوابت عامة'
  },
  {
    nameAr: 'ثابت الغازات المثالية',
    nameFr: 'Constante des gaz parfaits',
    symbol: 'R',
    value: '8.314 462 618',
    unit: 'J / (mol · K)',
    category: 'الديناميكا الحرارية'
  },
  {
    nameAr: 'ثابت بولتزمان',
    nameFr: 'Constante de Boltzmann',
    symbol: 'k_B',
    value: '1.380 649 × 10⁻²³',
    unit: 'J / K',
    category: 'الديناميكا الحرارية'
  },
  {
    nameAr: 'سماحية الفراغ الكهربائية',
    nameFr: 'Permittivité diélectrique du vide',
    symbol: 'ε₀',
    value: '8.854 187 8128 × 10⁻¹²',
    unit: 'F / m',
    category: 'الكهرومغناطيسية'
  },
  {
    nameAr: 'نفاذية الفراغ المغناطيسية',
    nameFr: 'Perméabilité magnétique du vide',
    symbol: 'μ₀',
    value: '1.256 637 062 × 10⁻⁶',
    unit: 'N / A²',
    category: 'الكهرومغناطيسية'
  },
  {
    nameAr: 'ثابت الجذب العام لنيوتن',
    nameFr: 'Constante universelle de gravitation',
    symbol: 'G',
    value: '6.674 30 × 10⁻¹¹',
    unit: 'm³ / (kg · s²)',
    category: 'ثوابت عامة'
  },
  {
    nameAr: 'ثابت ستيفان-بولتزمان للإشعاع',
    nameFr: 'Constante de Stefan-Boltzmann',
    symbol: 'σ',
    value: '5.670 374 419 × 10⁻⁸',
    unit: 'W / (m² · K⁴)',
    category: 'الديناميكا الحرارية'
  }
];
