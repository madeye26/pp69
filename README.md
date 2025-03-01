# نظام الرواتب والموارد البشرية (Payroll & HR System)

## نظرة عامة (Overview)
نظام متكامل لإدارة الرواتب والموارد البشرية، مصمم خصيصاً للشركات العربية. يدعم اللغة العربية بشكل كامل ويوفر واجهة مستخدم سهلة الاستخدام.

## المميزات (Features)
- إدارة بيانات الموظفين
- حساب الرواتب والحوافز
- إدارة السلف والخصومات
- تتبع الحضور والغياب
- إنشاء التقارير
- تصدير البيانات إلى Excel
- واجهة مستخدم عربية
- دعم العمل بدون اتصال بالإنترنت

## المتطلبات (Requirements)
- متصفح حديث يدعم JavaScript
- اتصال بالإنترنت (للمزامنة فقط)
- حساب Firebase (للتخزين السحابي)

## التثبيت (Installation)

1. قم بتنزيل المشروع:
```bash
git clone https://github.com/yourusername/badr-payroll-hr.git
cd badr-payroll-hr
```

2. قم بتثبيت Firebase CLI:
```bash
npm install -g firebase-tools
```

3. قم بتسجيل الدخول إلى Firebase:
```bash
firebase login
```

4. قم بتهيئة المشروع:
```bash
firebase init
```

5. اختر الخدمات التالية:
   - Firestore
   - Hosting
   - Authentication

6. قم بتحديث ملف التكوين `firebase-config.js` بمعلومات مشروعك:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

## التشغيل المحلي (Local Development)

1. قم بتشغيل الخادم المحلي:
```bash
npm start
```

2. افتح المتصفح على العنوان:
```
http://localhost:8000
```

## النشر (Deployment)

1. قم ببناء المشروع:
```bash
npm run build
```

2. قم بنشر المشروع على Firebase:
```bash
npm run deploy
```

## هيكل المشروع (Project Structure)

```
pp69/
├── js/
│   ├── firebase-config.js    # تكوين Firebase
│   ├── firebase-operations.js # عمليات قاعدة البيانات
│   ├── main.js              # الكود الرئيسي
│   ├── employees.js         # إدارة الموظفين
│   ├── payroll.js          # حسابات الرواتب
│   └── reports.js          # إنشاء التقارير
├── styles/
│   ├── main.css            # الأنماط الرئيسية
│   └── arabic-typography.css # أنماط الخط العربي
├── index.html              # الصفحة الرئيسية
├── firebase.json           # تكوين Firebase
└── firestore.rules         # قواعد قاعدة البيانات
```

## قواعد البيانات (Database Rules)

يجب تحديث قواعد Firestore لضمان أمان البيانات:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## المساهمة (Contributing)
نرحب بمساهماتكم! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) للحصول على التفاصيل.

## الترخيص (License)
هذا المشروع مرخص تحت [MIT License](LICENSE).

## الدعم (Support)
إذا واجهت أي مشكلة، يرجى فتح issue في GitHub أو التواصل معنا عبر [البريد الإلكتروني](mailto:support@example.com).
