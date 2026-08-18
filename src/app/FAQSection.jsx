"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "كيف يمكنني حجز موعد مسبق مع الطبيب المختص؟",
      answer: "يمكنك حجز موعدك بسهولة من خلال الضغط على زر 'احجز الآن' في الموقع، أو عبر الاتصال المباشر بمركز الاتصال وخدمة العملاء المتاحين على مدار الساعة.",
    },
    {
      question: "هل يقبل المستشفى بطاقات التأمين الصحي؟",
      answer: "نعم، نتعامل مع معظم شركات وهيئات التأمين الصحي المعتمدة المحلية والإقليمية لتغطية الفحوصات والعمليات والعلاجات.",
    },
    {
      question: "ما هي أوقات عمل قسم الطوارئ والمختبر والأشعة؟",
      answer: "أقسام الطوارئ، العناية المركزة، المختبرات الطبية، والأشعة التشخيصية تعمل على مدار 24 ساعة طوال أيام الأسبوع دون انقطاع.",
    },
    {
      question: "ما هي الإجراءات والوثائق المطلوبة عند التنويم في المستشفى؟",
      answer: "يتطلب التنويم إبراز الهوية الشخصية (أو جواز السفر)، تقرير الطبيب المعالج، وبطاقة التأمين الصحي في حال وجود تغطية تأمينية.",
    },
    {
      question: "هل تتوفر خدمات العناية المنزلية أو الاستشارات الطبية الطارئة؟",
      answer: "نعم، نوفر خدمات التمريض المنزلي المتقدم ونقل الحالات الإسعافية عبر أسطول سيارات إسعاف مجهزة بالكامل بأحدث أجهزة الإنعاش.",
    },
    {
      question: "هل يمكنني استلام نتائج الفحوصات والتحاليل الطبية إلكترونياً؟",
      answer: "نعم، يمكنك استلام نتائج الفحوصات المخبرية وتقارير الأشعة مباشرة عبر رسائل الهاتف أو البوابة الإلكترونية فور اعتمادها من الطبيب.",
    },
    {
      question: "ما هي مواعيد الزيارة للمرضى المنومين في المستشفى؟",
      answer: "أوقات الزيارة اليومية في الأقسام العامة من الساعة 4:00 عصراً حتى 8:00 مساءً، لضمان راحة المرضى وتقديم الرعاية الطبية بأعلى هدوء.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section flex flex-col lg:flex-row gap-12 justify-between items-start">
      {/* Side Title & Contact Prompt */}
      <div className="flex-1 flex flex-col justify-center gap-6 static lg:sticky lg:top-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-relaxed">
          الأسئلة الشائعة
        </h2>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-lg">
          إليك إجابات لأكثر الأسئلة تكراراً حول خدماتنا الطبية، مواعيد العمل، وإجراءات الحجز والتأمين.
        </p>
      </div>

      {/* Accordion Questions List */}
      <div className="flex-1 w-full flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card
              key={index}
              onClick={() => toggleFAQ(index)}
              className="p-6 bg-gray-100 cursor-pointer select-none transition-colors hover:bg-gray-200/70"
            >
              <div className="w-full flex items-center justify-between gap-4 text-right">
                <span className="text-sm lg:text-lg font-bold text-gray-900">
                  {faq.question}
                </span>
                <span className={`size-6 text-gray-600 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}>
                  <ChevronDown className="size-6" />
                </span>
              </div>

              {isOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="pt-4 mt-3 border-t border-gray-200/60 text-gray-600 text-sm md:text-base leading-relaxed cursor-text select-text"
                >
                  {faq.answer}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
