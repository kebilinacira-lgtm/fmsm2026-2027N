import { DepartmentId } from '../types';

export interface DepartmentHeadDetails {
  departmentId: DepartmentId;
  deptNameAr: string;
  deptNameFr: string;
  headName: string;
  headTitle: string;
  office: string;
  email: string;
  defaultPhoto: string;
  originalPhoto: string;
  localStorageKey: string;
  speechTitle: string;
  speechQuote: string;
  speechParagraphs: string[];
  theme: {
    accent: string;
    border: string;
    bgBadge: string;
    textBadge: string;
    buttonBg: string;
    buttonHover: string;
  };
}

export const DEPARTMENT_HEADS_DATA: Record<DepartmentId, DepartmentHeadDetails> = {
  chemistry: {
    departmentId: 'chemistry',
    deptNameAr: 'قسم الكيمياء',
    deptNameFr: 'Département de Chimie',
    headName: 'د. هادف دراجي',
    headTitle: 'رئيس قسم الكيمياء',
    office: 'الجناح البيداغوجي C - الطابق الأول، مكتب 118',
    email: 'dep.chimie@univ-ouargla.dz',
    defaultPhoto: '/head_chemistry_dept.jpg',
    originalPhoto: '/head_chemistry_dept_original.jpg',
    localStorageKey: 'fmsm_custom_chem_head_photo',
    speechTitle: 'كلمة السيد رئيس قسم الكيمياء إلى الأسرة الجامعية والطلبة',
    speechQuote: '«الكيمياء علم المادة وتطبيقاتها الحيوية، وركيزة التنمية الصناعية والطاقوية»',
    speechParagraphs: [
      'أبنائي وبناتي الطلبة الأعزاء، زملائي الأساتذة الأفاضل، يطيب لي أن أرحب بكم باسم أسرة قسم الكيمياء بكلية الرياضيات وعلوم المادة في جامعة قاصدي مرباح ورقلة. إن قسمنا يشهد مسيرة علمية رائدة تجمع بين ترسيخ المفاهيم الأساسية للعلوم الكيميائية والتطبيقات المخبرية والصناعية الدقيقة.',
      'نعمل دوماً في قسم الكيمياء على إعداد كفاءات علمية متخصصة ومتمكنة في أطوار الليسانس، الماستر والدكتوراه، في تخصصات نوعية كالكيمياء الأساسية، كيمياء المواد والبوليميرات، وتثمين المنتجات الطبيعية والموارد البيئية، لتكون رافداً أساسياً لقطاعات الطاقة والصناعة والبحث العلمي.',
      'أبواب قسم الكيمياء وإدارته وطواقمه مفتوحة دائماً أمامكم للإرشاد والمرافقة، ونتمنى لكم جميعاً موسماً جامعياً حافلاً بالنجاح والتألق والتفوق العلمي.'
    ],
    theme: {
      accent: 'amber',
      border: 'border-amber-200 dark:border-amber-800/60',
      bgBadge: 'bg-amber-50 dark:bg-amber-950/60',
      textBadge: 'text-amber-800 dark:text-amber-300',
      buttonBg: 'bg-amber-600',
      buttonHover: 'hover:bg-amber-700'
    }
  },
  physics: {
    departmentId: 'physics',
    deptNameAr: 'قسم الفيزياء',
    deptNameFr: 'Département de Physique',
    headName: 'د. رابح بوعنان',
    headTitle: 'رئيس قسم الفيزياء',
    office: 'الجناح البيداغوجي B - الطابق الأرضي، مكتب 012',
    email: 'dep.physique@univ-ouargla.dz',
    defaultPhoto: '/head_physics_dept.jpg',
    originalPhoto: '/head_physics_dept_original.jpg',
    localStorageKey: 'fmsm_custom_physics_head_photo',
    speechTitle: 'كلمة السيد رئيس قسم الفيزياء إلى الأسرة الجامعية والطلبة',
    speechQuote: '«الفيزياء مفتاح فهم الكون ومحرك الابتكار في الطاقات المتجددة والتكنولوجيا المتقدمة»',
    speechParagraphs: [
      'أهلاً بكم في رحاب قسم الفيزياء، أحد أعرق الصروح العلمية بكلية الرياضيات وعلوم المادة. إن دراسة الفيزياء ليست مجرد استيعاب للقوانين والنظريات، بل هي منهج تفكير دقيق واستكشاف مستمر لأسرار الطبيعة وتطبيقاتها في خدمة التنمية المستدامة.',
      'يتميز قسمنا بتأطير علمي متميز يجمع بين الفيزياء الأساسية والنظرية، والفيزياء الطاقوية والطاقات المتجددة، والفيزياء الكيميائية والطبية، مدعوماً بمخابر بحثية متطورة تسهم بفعالية في حل التحديات الطاقوية والصناعية لبلادنا ومناطقنا الصحراوية.',
      'ندعو طلبتنا الأعزاء إلى الجد والاجتهاد، واستثمار فضاءات القسم وتجهيزاته المخبرية، ونؤكد التزامنا التام بمرافقتكم نحو التميز العلمي والمهني.'
    ],
    theme: {
      accent: 'sky',
      border: 'border-sky-200 dark:border-sky-800/60',
      bgBadge: 'bg-sky-50 dark:bg-sky-950/60',
      textBadge: 'text-sky-800 dark:text-sky-300',
      buttonBg: 'bg-sky-600',
      buttonHover: 'hover:bg-sky-700'
    }
  },
  math: {
    departmentId: 'math',
    deptNameAr: 'قسم الرياضيات',
    deptNameFr: 'Département de Mathématiques',
    headName: 'د. طلاب ابراهيم',
    headTitle: 'رئيس قسم الرياضيات',
    office: 'الجناح البيداغوجي D - الطابق الثاني، مكتب 205',
    email: 'dep.math@univ-ouargla.dz',
    defaultPhoto: '/head_math_dept.jpg',
    originalPhoto: '/head_math_dept_original.jpg',
    localStorageKey: 'fmsm_custom_math_head_photo',
    speechTitle: 'كلمة السيد رئيس قسم الرياضيات إلى الأسرة الجامعية والطلبة',
    speechQuote: '«الرياضيات لغة العلوم الدقيقة وأساس الذكاء الاصطناعي والنمذجة الحديثة»',
    speechParagraphs: [
      'بسم الله الرحمن الرحيم، يسرني أن أرحب بجميع الطلبة والباحثين والأساتذة في قسم الرياضيات بكلية الرياضيات وعلوم المادة. تُعد الرياضيات أم العلوم ولغة الكون، ومنبع التفكير المنطقي الصارم الذي تقوم عليه كافة الابتكارات المعاصرة.',
      'يقدم قسمنا تكويناً عالي المستوى في الرياضيات البحتة والتطبيقية، ويمتد ليشمل أحدث التخصصات المستقبلية كالنمذجة الرياضية، الحساب العلمي، وعلم البيانات والذكاء الاصطناعي، بما يتيح لخريجينا فرصاً واعدة في التدريس، البحث الأكاديمي، والقطاعات الاقتصادية والصناعية المتقدمة.',
      'نسعد بمرافقة كل طالب وطالبة في شغفهم الرياضي، ونتمنى لكم مساراً جامعياً زاخراً بالعطاء والتفوق.'
    ],
    theme: {
      accent: 'indigo',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      bgBadge: 'bg-indigo-50 dark:bg-indigo-950/60',
      textBadge: 'text-indigo-800 dark:text-indigo-300',
      buttonBg: 'bg-indigo-600',
      buttonHover: 'hover:bg-indigo-700'
    }
  },
  common_sm: {
    departmentId: 'common_sm',
    deptNameAr: 'جذع مشترك علوم المادة',
    deptNameFr: 'Tronc Commun Sciences de la Matière',
    headName: 'د. بن زاهي يوسف',
    headTitle: 'مسؤول فرع جذع مشترك علوم المادة',
    office: 'الجناح البيداغوجي A - الطابق الأول، مكتب 104',
    email: 'sm.tc@univ-ouargla.dz',
    defaultPhoto: '/head_common_sm.jpg',
    originalPhoto: '/head_common_sm_original.jpg',
    localStorageKey: 'fmsm_custom_common_sm_head_photo',
    speechTitle: 'كلمة السيد مسؤول فرع جذع مشترك علوم المادة إلى الطلبة الجدد',
    speechQuote: '«الجذع المشترك بوابتكم التأسيسية المتينة نحو التفوق الأكاديمي في علوم المادة»',
    speechParagraphs: [
      'أبنائي وبناتي الطلبة الجدد، يسعدنا أن نرحب بكم في السنة الأولى جذع مشترك علوم المادة (TC-SM). تمثل هذه المرحلة الانطلاقة الحقيقية لحياتكم الجامعية، وفيها تكتسبون القواعد العلمية المتينة والمهارات المخبرية الأساسية في الفيزياء والكيمياء والرياضيات.',
      'إن إدارة الفرع وجميع أساتذة الفرق البيداغوجية مجندون لمساعدتكم على التأقلم السريع مع النظام الجامعي (LMD)، وتوفير أحسن الظروف البيداغوجية والمخبرية لتحقيق النجاح والانتقال بتفوق نحو تخصصات الليسانس والماستر التي تطمحون إليها.',
      'نوصيكم بالانضباط، والمواظبة على حضور المحاضرات والأعمال الموجهة والمخبرية، والتحلي بروح الاستفسار العلمي المستمر. أبوابنا مفتوحة لكم دوماً.'
    ],
    theme: {
      accent: 'emerald',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      bgBadge: 'bg-emerald-50 dark:bg-emerald-950/60',
      textBadge: 'text-emerald-800 dark:text-emerald-300',
      buttonBg: 'bg-emerald-700',
      buttonHover: 'hover:bg-emerald-800'
    }
  }
};
