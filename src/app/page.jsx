import Image from "next/image";
import { Button, Card } from "@/components/ui";
import Footer from "@/components/layout/Footer";
import FAQSection from "./FAQSection";
import Header from "@/components/layout/LandingPageHeader";

export function HeroSection() {
  return (
    <section id="hero" className="section flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-28">
      {/* Text & Action Column */}
      <div className="flex-1 flex flex-col justify-center lg:gap-12 gap-6 w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-bold leading-tight">
          رعاية صحية متكاملة <br /> بأحدث المعايير الطبية
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" arrowIcon={false} link="#departments">
            تعرف على خدماتنا
          </Button>
          <Button link="/app/booking">
            احجز الآن
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 lg:mt-12">
          {[
            { value: "+25K", label: "عملية جراحية ناجحة" },
            { value: "+150", label: "طبيب واستشاري" },
            { value: "+50K", label: "مريض تمت خدمتهم" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span dir="ltr" className="text-2xl sm:text-3xl md:text-4xl xl:text-4xl font-bold leading-relaxed text-right">{stat.value}</span>
              <span className="text-sm sm:text-base text-gray-600 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Card Column */}
      <Card className="flex-1 relative w-full min-h-[350px] sm:min-h-[420px] lg:min-h-full self-stretch">
        <Image
          src="/images/hero_doctor_patient.png"
          alt="doctor"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </Card>
    </section>
  );
}


export function AboutSection() {
  return (
    <section id="about" className="section flex flex-col-reverse lg:flex-row">
      <Card className="flex-1 relative min-h-[320px] lg:min-h-full w-full overflow-hidden">
        <Image
          src="/images/surgery.jpg"
          alt="doctor"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </Card>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center gap-4 lg:gap-6 lg:p-12 p-2">
          <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-bold leading-relaxed">
            من نحن
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            يُعد مستشفى حضرموت الحديث صرحاً طبياً متكاملاً يقدم رعاية صحية شاملة وفق أعلى المعايير العالمية، عبر نخبة من الكفاءات الطبية وأحدث التقنيات التشخيصية والعلاجية، لضمان بيئة علاجية آمنة ومتميزة على مدار الساعة.
          </p>
          <div className="pt-2">
            <Button variant="outline" arrowIcon={false} link="/about">
              تعرف علينا
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DepartmentsSection() {
  const departments = [
    {
      title: "قسم الطوارئ والحوادث",
      desc: "استجابة فورية على مدار 24 ساعة بأعلى درجات الجاهزية والإنعاش الطبي.",
      image: "/images/emergency.jpg",
    },
    {
      title: "قسم الجراحة والمناظير",
      desc: "غرف عمليات متطورة مجهزة لإجراء أدق العمليات الجراحية والتدخلات المجهرية.",
      image: "/images/surgery.jpg",
    },
    {
      title: "قسم أمراض القلب والباطنية",
      desc: "تشخيص وعلاج أمراض القلب والأوعية الدموية بإشراف استشاريين متميزين.",
      image: "/images/cardiology.jpg",
    },
  ];

  return (
    <section id="departments" className="section grid  grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <div className="col-span-2 flex flex-col justify-center gap-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-bold leading-relaxed">
          أقسامنا الطبية
        </h2>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          نقدم منظومة متكاملة من العيادات التخصصية المجهزة بأحدث التقنيات التشخيصية، تحت إشراف نخبة من كبار الاستشاريين لضمان رعاية شاملة لك ولعائلتك.
        </p>
      </div>
      <Card className="col-span-2 row-span-2" link="/app/departments">
        <Image
          src="/images/surgery.jpg"
          alt="doctor"
          fill
          className="object-cover"
        />
      </Card>
      <Card link="/app/departments">
        <Image
          src="/images/image.png"
          alt="doctor"
          fill
          className="object-cover"
        />
      </Card>
      <Card link="/app/departments">
        <Image
          src="/images/image2.png"
          alt="doctor"
          fill
          className="object-cover"
        />
      </Card>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="flex flex-col gap-6 lg:gap-12">
      <Header />
      <HeroSection />
      <AboutSection />
      <DepartmentsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
