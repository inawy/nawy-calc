# Nawy Calc

حاسبة عربية RTL تعمل كتطبيق ويب تقدمي قابل للتثبيت. النسخة الأولى تركز على تجربة الحاسبة الأساسية، لوحة المفاتيح، سجل محلي اختياري، والوضعين الفاتح والداكن.

## المراجع

تمت دراسة السلوك العام من ثلاثة مشاريع مفتوحة المصدر، مع كتابة كود Nawy Calc مستقل وعدم نسخ الأصول أو الواجهات حرفيًا:

- [Microsoft Calculator](https://github.com/microsoft/calculator): مصدر مرجعي لسلوك النسبة المئوية، سجل العمليات، والاختبارات.
- [OpenCalc](https://github.com/clementwzk/OpenCalc): مرجع لتجربة Android واللمس والوضع الداكن.
- [GNOME Calculator](https://gitlab.gnome.org/GNOME/gnome-calculator): مرجع لفصل الأوضاع وإمكانية التوسع إلى العلمي والبرمجي.

## التشغيل

```bash
npm install
npm run dev
```

## التحقق

```bash
npm run typecheck
npm test
npm run build
```

البيانات المحفوظة في السجل والثيم تبقى في `localStorage` على جهاز المستخدم فقط. لا يوجد خادم أو قاعدة بيانات في النسخة الأولى.
