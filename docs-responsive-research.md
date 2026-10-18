# Responsive calculator research

## القرار

سنستخدم OpenCalc كمرجع لسلوك واجهة الحاسبة على Android: الثيمات، الوضع العلمي، السجل، portrait/landscape، وتجربة الشاشات الصغيرة. لن ننسخ كوده أو أصوله؛ مستودعه GPLv3 ويُستخدم هنا كمرجع دراسة فقط.

سنستخدم Android Adaptive App Samples كمرجع معماري للتكيف مع المساحات: تقسيم compact/standard/expanded، إعادة ترتيب اللوحات بدل تكبير كل شيء، ودعم split-screen والتابلت وسطح المكتب.

## ملاحظات مهمة

OpenCalc لديه issue مفتوح عن مشكلة التخطيط في split-screen والشاشات الصغيرة، مع اقتراح إخفاء الوظائف المتقدمة عندما تضيق المساحة. هذا يؤكد أن responsive ليس مجرد تصغير الخط والأزرار؛ يجب أن تتغير كثافة الواجهة ومحتواها حسب المساحة المتاحة.

## قواعد Nawy Calc المقترحة

- Compact: عرض أقل من 360px أو ارتفاع قصير؛ أزرار دائرية أصغر، شاشة نتيجة أقصر، وإخفاء أي وظائف متقدمة.
- Standard phone: عرض 360–430px؛ تخطيط 4 أعمدة، مساحة نتيجة مرنة، وأحجام لمس لا تقل عن 56px تقريبًا.
- Large phone/tablet: عرض أكبر من 430px؛ تحديد max-width للحاسبة بدل تمديد الأزرار، مع إبقاء الأزرار مريحة.
- Landscape/short viewport: استخدام `100dvh` و`env(safe-area-inset-*)`، تقليل مساحة العرض، وعدم فرض ارتفاع ثابت يسبب قصًا.
- Desktop/split view: وضع السجل بجانب الحاسبة فقط عند توفر مساحة، وإعادته أسفلها عند الضيق.
- الأرقام الطويلة: تحجيم ديناميكي مستقل عن قياسات الأزرار، مع منع القص والـellipsis.

## المصادر

- OpenCalc: https://github.com/clementwzk/OpenCalc
- OpenCalc small-screen issue: https://github.com/clementwzk/OpenCalc/issues/418
- Android Adaptive App Samples: https://github.com/android/adaptive-apps-samples
- Fossify Calculator: https://github.com/FossifyOrg/Calculator
- Calculator UI discussion: https://stackoverflow.com/questions/45095460/calculator-ui-for-different-screen-sizes
