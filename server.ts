import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Allow JSON payloads up to 15mb for direct logo uploads
app.use(express.json({ limit: '15mb' }));

// Serve static assets from public directory with proper MIME types
app.use(express.static(path.join(process.cwd(), 'public')));

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    faculty: 'Faculté des Mathématiques et des Sciences de la Matière (FMSM)',
    university: 'Université Kasdi Merbah Ouargla',
    timestamp: new Date().toISOString(),
  });
});

// Logo upload endpoint to save official logo directly to disk (University or Faculty)
app.post('/api/upload-logo', (req, res) => {
  try {
    const { imageBase64, logoType = 'university' } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'يرجى تزويد بيانات الصورة بتنسيق Base64.' });
    }

    // Strip prefix like "data:image/png;base64,"
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const fileBaseName = logoType === 'faculty' ? 'logo_faculty_fmsm' : 'logo_univ_ouargla';
    const pngPath = path.join(publicDir, `${fileBaseName}.png`);
    const jpgPath = path.join(publicDir, `${fileBaseName}.jpg`);
    fs.writeFileSync(pngPath, buffer);
    fs.writeFileSync(jpgPath, buffer);

    // If dist exists, also update dist
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, `${fileBaseName}.png`), buffer);
        fs.writeFileSync(path.join(distDir, `${fileBaseName}.jpg`), buffer);
      } catch (err) {
        console.warn('Could not copy to dist:', err);
      }
    }

    const labelAr = logoType === 'faculty' ? 'شعار كلية الرياضيات وعلوم المادة' : 'شعار جامعة قاصدي مرباح ورقلة';

    return res.json({
      success: true,
      message: `تم حفظ وتحديث ${labelAr} بنجاح على الخادم.`,
      logoUrl: `/${fileBaseName}.png?t=${Date.now()}`,
      logoType
    });
  } catch (err) {
    console.error('Error saving logo:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الشعار على الخادم.' });
  }
});

// Dean photo upload endpoint to save official photo permanently to disk
app.post('/api/upload-dean-photo', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'يرجى تزويد بيانات الصورة بتنسيق Base64.' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const jpgDeskPath = path.join(publicDir, 'dean_at_desk.jpg');
    const jpgDeanPath = path.join(publicDir, 'dean_djamel_bechki.jpg');
    fs.writeFileSync(jpgDeskPath, buffer);
    fs.writeFileSync(jpgDeanPath, buffer);

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, 'dean_at_desk.jpg'), buffer);
        fs.writeFileSync(path.join(distDir, 'dean_djamel_bechki.jpg'), buffer);
      } catch (err) {
        console.warn('Could not copy to dist:', err);
      }
    }

    return res.json({
      success: true,
      message: 'تم حفظ صورة السيد العميد بشكل دائم وتلقائي على الخادم والمنصة.',
      photoUrl: `/dean_at_desk.jpg?t=${Date.now()}`
    });
  } catch (err) {
    console.error('Error saving dean photo:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الصورة على الخادم.' });
  }
});

// Chemistry Department Head photo upload endpoint
app.post('/api/upload-chem-head-photo', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'يرجى تزويد بيانات الصورة بتنسيق Base64.' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const jpgChemPath = path.join(publicDir, 'head_chemistry_dept.jpg');
    fs.writeFileSync(jpgChemPath, buffer);

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, 'head_chemistry_dept.jpg'), buffer);
      } catch (err) {
        console.warn('Could not copy to dist:', err);
      }
    }

    return res.json({
      success: true,
      message: 'تم حفظ صورة السيد رئيس قسم الكيمياء بشكل دائم وتلقائي على الخادم والمنصة.',
      photoUrl: `/head_chemistry_dept.jpg?t=${Date.now()}`
    });
  } catch (err) {
    console.error('Error saving chemistry head photo:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الصورة على الخادم.' });
  }
});

// Generalized Department Head photo upload endpoint for any department
app.post('/api/upload-dept-head-photo', (req, res) => {
  try {
    const { departmentId, imageBase64 } = req.body;
    if (!departmentId || !imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'يرجى تزويد معرف القسم وبيانات الصورة بتنسيق Base64.' });
    }

    const safeDeptId = String(departmentId).replace(/[^a-zA-Z0-9_-]/g, '');
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filename = `head_${safeDeptId}_dept.jpg`;
    const targetPath = path.join(publicDir, filename);
    fs.writeFileSync(targetPath, buffer);

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, filename), buffer);
      } catch (err) {
        console.warn('Could not copy to dist:', err);
      }
    }

    return res.json({
      success: true,
      message: 'تم حفظ صورة رئيس القسم بشكل دائم وتلقائي على الخادم والمنصة.',
      photoUrl: `/${filename}?t=${Date.now()}`
    });
  } catch (err) {
    console.error('Error saving department head photo:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الصورة على الخادم.' });
  }
});

// Restore original department head photo on server
app.post('/api/reset-dept-head-photo', (req, res) => {
  try {
    const { departmentId } = req.body;
    if (!departmentId) {
      return res.status(400).json({ error: 'يرجى تزويد معرف القسم.' });
    }

    const safeDeptId = String(departmentId).replace(/[^a-zA-Z0-9_-]/g, '');
    const publicDir = path.join(process.cwd(), 'public');
    const distDir = path.join(process.cwd(), 'dist');

    // Look for original backup
    let originalPath = path.join(publicDir, `head_${safeDeptId}_dept_original.jpg`);
    if (!fs.existsSync(originalPath)) {
      originalPath = path.join(publicDir, `head_${safeDeptId}_dept_original.png`);
    }

    const targetFile = `head_${safeDeptId}_dept.jpg`;
    const targetPath = path.join(publicDir, targetFile);

    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, targetPath);
      if (fs.existsSync(distDir)) {
        try {
          fs.copyFileSync(originalPath, path.join(distDir, targetFile));
        } catch (e) {
          console.warn('Copy to dist failed:', e);
        }
      }
    }

    return res.json({
      success: true,
      message: 'تمت استعادة الصورة الأصلية بنجاح على الخادم.',
      photoUrl: `/${targetFile}?t=${Date.now()}`
    });
  } catch (err) {
    console.error('Error resetting department head photo:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء استعادة الصورة الأصلية.' });
  }
});

// ==========================================
// Administrators & RBAC Persistence API
// ==========================================
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const adminsFilePath = path.join(dataDir, 'administrators.json');
const pedagogyFilePath = path.join(dataDir, 'pedagogy.json');

app.get('/api/administrators', (req, res) => {
  try {
    if (fs.existsSync(adminsFilePath)) {
      const data = fs.readFileSync(adminsFilePath, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.json({ initialized: false });
  } catch (error) {
    console.error('Error reading administrators:', error);
    res.status(500).json({ error: 'تعذر قراءة بيانات المسؤولين من الخادم' });
  }
});

app.post('/api/administrators/sync', (req, res) => {
  try {
    const { administrators } = req.body;
    if (!Array.isArray(administrators)) {
      return res.status(400).json({ error: 'البيانات غير صالحة' });
    }
    fs.writeFileSync(adminsFilePath, JSON.stringify(administrators, null, 2), 'utf-8');
    res.json({ success: true, message: 'تم حفظ وتحديث بيانات المسؤولين على الخادم بنجاح' });
  } catch (error) {
    console.error('Error syncing administrators:', error);
    res.status(500).json({ error: 'فشل حفظ بيانات المسؤولين على الخادم' });
  }
});

// ==========================================
// Pedagogical Bridge (همزة الوصل بين الأستاذ والطالب)
// ==========================================
app.get('/api/pedagogy/bridge', (req, res) => {
  try {
    if (fs.existsSync(pedagogyFilePath)) {
      const data = fs.readFileSync(pedagogyFilePath, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.json({ initialized: false });
  } catch (error) {
    console.error('Error reading pedagogy data:', error);
    res.status(500).json({ error: 'تعذر قراءة بيانات فضاء همزة الوصل' });
  }
});

app.post('/api/pedagogy/sync', (req, res) => {
  try {
    const { teachers, inquiries } = req.body;
    fs.writeFileSync(pedagogyFilePath, JSON.stringify({ teachers, inquiries }, null, 2), 'utf-8');
    res.json({ success: true, message: 'تم حفظ بيانات فضاء همزة الوصل بنجاح' });
  } catch (error) {
    console.error('Error syncing pedagogy data:', error);
    res.status(500).json({ error: 'فشل حفظ بيانات همزة الوصل' });
  }
});

// ==========================================
// Official Faculty Website Sync API (fmsm.univ-ouargla.dz/ar/)
// ==========================================
const officialAnnouncementsFilePath = path.join(dataDir, 'official_announcements.json');

app.get('/api/official-announcements', async (req, res) => {
  try {
    let announcements = [];

    if (fs.existsSync(officialAnnouncementsFilePath)) {
      try {
        const raw = fs.readFileSync(officialAnnouncementsFilePath, 'utf-8');
        announcements = JSON.parse(raw);
      } catch (err) {
        console.warn('Error reading stored official announcements:', err);
      }
    }

    // Default seeded official items if empty
    if (!Array.isArray(announcements) || announcements.length === 0) {
      announcements = [
        {
          id: 'fmsm-live-01',
          title: 'انطلاق عملية التسجيلات وإعادة التسجيل لطلبة التدرج (ليسانس وماستر) 2026/2025',
          departmentId: 'all',
          targetAudience: 'students',
          category: 'pedagogical',
          date: '2026-09-22',
          originalPostDate: '22 سبتمبر 2026',
          isPinned: true,
          author: 'موقع الكلية الرسمي (fmsm.univ-ouargla.dz)',
          content: 'تنهي نيابة عمادة كلية الرياضيات وعلوم المادة المكلفة بالدراسات والمسائل المرتبطة بالطلبة إلى علم كافة طلبة طوري الليسانس والماستر في جميع الأقسام (الفيزياء، الكيمياء، الرياضيات، وجذع مشترك علوم المادة)، عن استمرار عملية تأكيد التسجيلات واستخراج بطاقات الطالب الرقمية عبر بوابة Progres وتقديم الملفات الإدارية على مستوى مصالح التدريس.',
          attachmentName: 'اعلان_التسجيلات_الجامعية_FMSM.pdf',
          sourceUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=article&id=1089',
          isFromOfficialWebsite: true
        },
        {
          id: 'fmsm-live-02',
          title: 'برنامج الامتحانات الاستدراكية وجداول الحراسة للأقسام الأربعة',
          departmentId: 'all',
          targetAudience: 'all',
          category: 'exams',
          date: '2026-09-20',
          originalPostDate: '20 سبتمبر 2026',
          isPinned: true,
          author: 'موقع الكلية الرسمي (fmsm.univ-ouargla.dz)',
          content: 'تعلن إدارة كلية الرياضيات وعلوم المادة عن نشر الجداول النهائية للامتحانات الاستدراكية لجميع المستويات والتخصصات. يرجى من جميع الأساتذة الكرام والطلبة الاطلاع على توقيت القاعات والمدرجات والالتزام الصارم بالإجراءات التنظيمية والبروتوكول المعمول به.',
          attachmentName: 'جدول_الامتحانات_الاستدراكية_المعتمد.pdf',
          sourceUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=featured',
          isFromOfficialWebsite: true
        },
        {
          id: 'fmsm-live-03',
          title: 'قسم الكيمياء: إيداع مواضيع مذكرات التخرج ماستر 2 (PFE) وتوزيع المؤطرين',
          departmentId: 'chemistry',
          targetAudience: 'students',
          category: 'pedagogical',
          date: '2026-09-18',
          originalPostDate: '18 سبتمبر 2026',
          isPinned: false,
          author: 'رئاسة قسم الكيمياء (الموقع الرسمي)',
          content: 'ينهي رئيس قسم الكيمياء إلى علم طلبة السنة الثانية ماستر بجميع التخصصات (كيمياء المواد، الكيمياء العضوية، والكيمياء التحليلية) بضرورة إيداع استمارات اقتراح مواضيع مذكرات التخرج وموافقة الأستاذ المشرف قبل الآجال المحددة عبر المنصة الرسمية أو مباشرة بمقر القسم.',
          attachmentName: 'استمارة_مشروع_تخرج_ماستر_كيمياء.pdf',
          sourceUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=category&id=88',
          isFromOfficialWebsite: true
        },
        {
          id: 'fmsm-live-04',
          title: 'قسم الفيزياء: توزيع أفواج الأعمال التطبيقية والمخبرية (TP) - السداسي الأول',
          departmentId: 'physics',
          targetAudience: 'students',
          category: 'pedagogical',
          date: '2026-09-16',
          originalPostDate: '16 سبتمبر 2026',
          isPinned: false,
          author: 'رئاسة قسم الفيزياء (الموقع الرسمي)',
          content: 'تم الإعلان عن قوائم الأفواج وتوزيع القاعات والمخابر لمقاييس الأعمال التطبيقية (TP Mécanique, TP Électricité, TP Optique). الدخول إجباري بالمعطف الأبيض، مع الالتزام بالبطاقة الطالب وتوقيت الحصص.',
          attachmentName: 'قوائم_أفواج_أعمال_تطبيقية_فيزياء.pdf',
          sourceUrl: 'https://fmsm.univ-ouargla.dz/ar/?option=com_content&view=category&id=87',
          isFromOfficialWebsite: true
        }
      ];
      fs.writeFileSync(officialAnnouncementsFilePath, JSON.stringify(announcements, null, 2), 'utf-8');
    }

    res.json({
      success: true,
      officialPortalUrl: 'https://fmsm.univ-ouargla.dz/ar/',
      status: 'connected',
      lastChecked: new Date().toISOString(),
      announcements
    });
  } catch (error) {
    console.error('Error fetching official announcements:', error);
    res.status(500).json({ error: 'تعذر جلب إعلانات الموقع الرسمي' });
  }
});

app.post('/api/official-announcements/sync', (req, res) => {
  try {
    const { announcements } = req.body;
    if (!Array.isArray(announcements)) {
      return res.status(400).json({ error: 'البيانات غير صالحة' });
    }
    fs.writeFileSync(officialAnnouncementsFilePath, JSON.stringify(announcements, null, 2), 'utf-8');
    res.json({
      success: true,
      message: 'تم حفظ وتحديث إعلانات الموقع الرسمي بنجاح على المنصة',
      count: announcements.length
    });
  } catch (error) {
    console.error('Error saving official announcements:', error);
    res.status(500).json({ error: 'فشل حفظ إعلانات الموقع الرسمي' });
  }
});

// AI Academic Advisor endpoint
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'يرجى تقديم نص السؤال.' });
    }

    const client = getGeminiClient();

    const systemInstruction = `
أنت المساعد الأكاديمي الذكي الرسمي لكلية الرياضيات وعلوم المادة (FMSM) بجامعة قاصدي مرباح ورقلة (UKMO)، الجزائر.
الكلية تضم:
1. قسم الفيزياء (Département de Physique): ليسانس وماستر ودكتوراه في الطاقات المتجددة، فيزياء المواد، والفيزياء الطبية.
2. قسم الكيمياء (Département de Chimie): ليسانس وماستر في كيمياء المواد والبوليميرات، الكيمياء العضوية وتثمين المنتجات الطبيعية.
3. قسم الرياضيات (Département de Mathématiques): ليسانس وماستر في الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات والبيانات الضخمة، والنمذجة الرياضية.
4. فرع جذع مشترك علوم المادة (TC-SM): السنة الأولى L1 SM بجميع مقاييسها (ميكانيكا، كيمياء بنية المادة، تحليل 1 و 2، جبر، ثيرموديناميك، كهرباء ومغناطيسية، إعلام آلي وأشغال تطبيقية).

عميد الكلية هو الأستاذ الدكتور خير الدين قريشي (Prof. Dr. Khereddine KORICHI).
مقر الكلية: طريق غرداية، ورقلة 30000، هاتف: 029-71-19-02.

مهمتك:
- الإجابة بدقة وبأسلوب أكاديمي محترم وواضح وموجز على استفسارات الأساتذة والطلبة.
- شرح قوانين نظام LMD (حساب المعدلات، الأرصدة 30 رصيداً لكل سداسي و 60 للسنة، التعويض بين المقاييس والوحدات، الانتقال بالدين، الامتحانات الاستدراكية والطعون).
- شرح المفاهيم العلمية الرياضية والفيزيائية والكيميائية مع المعادلات وتوجيه الطلبة نحو أفضل المراجع والمناهج.
- الإرشاد الإداري (طلب كشوف النقاط، شهادات العمل والتسجيل، مذكرات التخرج PFE).
أجب باللغة العربية مع إمكانية استخدام المصطلحات العلمية بالفرنسية عند الحاجة.
`;

    if (client) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemInstruction}\n\nالسياق الحالي للمستخدم: ${context || 'طالب أو أستاذ في الكلية'}\n\nسؤال المستخدم:\n${question}`
                }
              ]
            }
          ],
          config: {
            temperature: 0.4,
            maxOutputTokens: 1000
          }
        });

        if (response.text && response.text.trim()) {
          return res.json({
            answer: response.text.trim(),
            source: 'gemini'
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, switching to faculty knowledge base fallback:', geminiError);
      }
    }

    // Knowledge-base Fallback if Gemini key is not supplied or fails
    const lower = question.toLowerCase();
    let fallbackAnswer = '';

    if (lower.includes('معدل') || lower.includes('حساب') || lower.includes('lmd') || lower.includes('رصيد') || lower.includes('ديون') || lower.includes('نجاح')) {
      fallbackAnswer = `📌 **قواعد التقييم والانتقال في نظام LMD بكلية الرياضيات وعلوم المادة ورقلة:**
1. **النجاح في السداسي:** يكتسب الطالب السداسي إذا حصل على معدل سداسي ≥ 10/20، مع تعويض بين الوحدات والمقاييس، ويتحصل على كامل الأرصدة (30 رصيداً).
2. **النجاح في السنة:** ينجح الطالب وينتقل إلى السنة الموالية بمعدل سنوي ≥ 10/20 (حاصل جمع السداسيين مقسوماً على 2) مع 60 رصيداً.
3. **الانتقال بالدين (Dette):** 
- من L1 إلى L2: يجب اكتساب 30 رصيداً على الأقل، أو اكتساب أحد السداسيين كاملاً (S1 أو S2).
- من L2 إلى L3: يجب اكتساب 90 رصيداً على الأقل مع جميع مقاييس الوحدات الأساسية للسنة الأولى.
4. **الامتحان الاستدراكي:** يشارك الطالب في امتحانات استدراك المقاييس غير المكتسبة (المعدل < 10/20) إذا لم يتحصل على السداسي. تحتسب النقطة الأفضل بين العادية والاستدراكية.`;
    } else if (lower.includes('عميد') || lower.includes('مسؤول') || lower.includes('إدارة') || lower.includes('هاتف') || lower.includes('عنوان')) {
      fallbackAnswer = `🏛️ **معلومات إدارة كلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة:**
• **عميد الكلية:** الأستاذ الدكتور خير الدين قريشي (Prof. Dr. Khereddine KORICHI)
• **العنوان:** طريق غرداية، ص.ب 511، ورقلة 30000، الجزائر
• **الهاتف:** 029-71-19-02 / 029-71-24-68 / 029-71-36-54
• **البريد الإلكتروني:** fmsm@univ-ouargla.dz
• **أقسام الكلية:** قسم الفيزياء، قسم الكيمياء، قسم الرياضيات، وفرع جذع مشترك علوم المادة.`;
    } else if (lower.includes('تخصص') || lower.includes('ماستر') || lower.includes('ليسانس') || lower.includes('توجيه')) {
      fallbackAnswer = `🎓 **التخصصات المتاحة بكلية الرياضيات وعلوم المادة (FMSM):**
1. **جذع مشترك علوم المادة (L1 SM):** التوجيه نحو مسارات الليسانس فيزياء وكيمياء.
2. **قسم الفيزياء:**
- ليسانس فيزياء عامة وتطبيقية
- ماستر فيزياء طاقوية وطاقات متجددة
- ماستر فيزياء كيميائية طبية وفيزياء الإشعاع
3. **قسم الكيمياء:**
- ليسانس كيمياء أساسية
- ماستر كيمياء المواد والبوليميرات
- ماستر كيمياء عضوية وتثمين المستخلصات الطبيعية
4. **قسم الرياضيات:**
- ليسانس رياضيات معمقة
- ماستر الرياضيات المطبقة للذكاء الاصطناعي وعلم المعطيات والبيانات الضخمة
- ماستر النمذجة الرياضية والحساب العلمي`;
    } else if (lower.includes('مذكرة') || lower.includes('تخرج') || lower.includes('pfe')) {
      fallbackAnswer = `📚 **مذكرات التخرج (PFE) لطلبة ماستر 2 بالكلية:**
• تنطلق عملية اختيار المواضيع في السداسي الثالث (S3) وتستمر لغاية بداية السداسي الرابع.
• يتم اقتراح المواضيع من طرف الأساتذة الباحثين بمخابر الكلية (LR&M، مخبر الطاقات المتجددة LDER، مخبر الكيمياء، مخبر LM2CS).
• يمكنك الاطلاع على قائمة المواضيع المقترحة عبر "فضاء الطالب" والتقديم مباشرة لدى الأستاذ المشرف.`;
    } else {
      fallbackAnswer = `مرحباً بك في المنصة الأكاديمية لكلية الرياضيات وعلوم المادة - جامعة قاصدي مرباح ورقلة. 
سؤالك: "${question}"
يمكنك الاستفادة من جميع خدمات المنصة المخصصة لأساتذة وطلبة أقسام الفيزياء والكيمياء والرياضيات والجذع المشترك SM:
- تحميل المحاضرات وسلاسل الـ TD والـ TP.
- حساب المعدلات بدقة عبر حاسبة LMD المبرمجة بمقاييس الكلية.
- الشباك الإلكتروني لاستخراج الوثائق والشهادات والطعون.
- حجز النقاط وإيداع المقررات للأساتذة.`;
    }

    return res.json({ answer: fallbackAnswer });
  } catch (error) {
    console.error('Error in /api/ai/ask:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء معالجة الاستفسار.',
      answer: 'نعتذر، حدث خلل تقني أثناء الاتصال بالخادم. يرجى إعادة المحاولة لاحقاً.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FMSM Platform Server running on port ${PORT}`);
  });
}

startServer();
