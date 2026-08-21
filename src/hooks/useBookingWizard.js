import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { bookingService } from "@/services/bookingService";
import { useToast } from "@/components/ui/Toast";

export function useBookingWizard({ initialSpecialties = [], initialDoctors = [] }) {
  const searchParams = useSearchParams();
  const doctorIdParam = searchParams?.get("doctor_id") || searchParams?.get("doctorId");
  const specialtyIdParam = searchParams?.get("specialty_id") || searchParams?.get("specialtyId");

  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Form states
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [preferredPeriod, setPreferredPeriod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("on_arrival");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Handle URL query parameters (e.g. ?doctor_id=... or ?specialty_id=...)
  useEffect(() => {
    if (!initialDoctors?.length || !initialSpecialties?.length) return;

    if (doctorIdParam) {
      const doc = initialDoctors.find(
        (d) => String(d.doctor_id) === String(doctorIdParam) || String(d.id) === String(doctorIdParam)
      );
      if (doc) {
        const spec = initialSpecialties.find(
          (s) => String(s.specialty_id) === String(doc.specialty_id) || String(s.id) === String(doc.specialty_id)
        );
        if (spec) {
          setSelectedSpecialty(spec);
        }
        setSelectedDoctor(doc);
        setCurrentStep(3);
        return;
      }
    }

    if (specialtyIdParam) {
      const spec = initialSpecialties.find(
        (s) => String(s.specialty_id) === String(specialtyIdParam) || String(s.id) === String(specialtyIdParam)
      );
      if (spec) {
        setSelectedSpecialty(spec);
        const docs = initialDoctors.filter(
          (d) => String(d.specialty_id) === String(spec.specialty_id)
        );
        if (docs.length === 1) {
          setSelectedDoctor(docs[0]);
          setCurrentStep(3);
        } else {
          setCurrentStep(2);
        }
      }
    }
  }, [doctorIdParam, specialtyIdParam, initialDoctors, initialSpecialties]);

  // Filter specialties by query (Arabic or English)
  const filteredSpecialties = useMemo(() => {
    if (!searchQuery.trim()) return initialSpecialties;
    const q = searchQuery.toLowerCase().trim();
    return initialSpecialties.filter(
      (spec) =>
        (spec.name_ar && spec.name_ar.toLowerCase().includes(q)) ||
        (spec.name_en && spec.name_en.toLowerCase().includes(q))
    );
  }, [initialSpecialties, searchQuery]);

  // Filter doctors by selected specialty ID
  const availableDoctors = useMemo(() => {
    if (!selectedSpecialty) return initialDoctors;
    const specId = String(selectedSpecialty.specialty_id || selectedSpecialty.id || "");
    return initialDoctors.filter(
      (doc) =>
        String(doc.specialty_id) === specId ||
        String(doc.specialtyId) === specId
    );
  }, [initialDoctors, selectedSpecialty]);

  // Automatically select doctor if there is only one doctor in the department
  useEffect(() => {
    if (selectedSpecialty && availableDoctors.length === 1) {
      setSelectedDoctor(availableDoctors[0]);
    }
  }, [selectedSpecialty, availableDoctors]);

  // Check whether current step allows navigation
  const canProceed = useMemo(() => {
    if (currentStep === 1) return !!selectedSpecialty;
    if (currentStep === 2) return !!selectedDoctor;
    if (currentStep === 3) {
      return (
        !!patientName.trim() &&
        !!whatsappPhone.trim() &&
        !!selectedDate &&
        !!preferredPeriod &&
        !isSubmitting
      );
    }
    return false;
  }, [currentStep, selectedSpecialty, selectedDoctor, patientName, whatsappPhone, selectedDate, preferredPeriod, isSubmitting]);

  const selectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
    const specId = String(specialty.specialty_id || specialty.id || "");
    const docs = initialDoctors.filter(
      (doc) =>
        String(doc.specialty_id) === specId ||
        String(doc.specialtyId) === specId
    );
    if (docs.length === 1) {
      setSelectedDoctor(docs[0]);
    } else {
      setSelectedDoctor(null);
    }
  };

  const nextStep = () => {
    if (canProceed && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && !isSubmitting) {
      setCurrentStep((prev) => prev - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setPatientName("");
    setPatientAge("");
    setWhatsappPhone("");
    setSelectedDate("");
    setPreferredPeriod("");
    setPaymentMethod("on_arrival");
    setNotes("");
    setBookingResult(null);
    setSearchQuery("");
  };

  const toast = useToast();
  const [bookingError, setBookingError] = useState("");

  const handleSubmitBooking = async () => {
    if (!selectedDoctor?.doctor_id || !selectedDate || !preferredPeriod || isSubmitting) {
      if (!selectedDoctor?.doctor_id) toast.warning("يرجى اختيار الطبيب", "حدد الطبيب للمتابعة");
      else if (!selectedDate) toast.warning("يرجى تحديد التاريخ", "اختر تاريخ الموعد");
      else if (!preferredPeriod) toast.warning("يرجى تحديد الفترة", "اختر الفترة الصباحية أو المسائية");
      return;
    }

    setIsSubmitting(true);
    setBookingError("");

    const payload = {
      doctor_id: selectedDoctor.doctor_id,
      date: selectedDate,
      period: preferredPeriod, // "morning" or "evening"
    };

    try {
      const createdAppointment = await bookingService.createAppointment(payload);

      if (createdAppointment && (createdAppointment.appointment_id || createdAppointment.status)) {
        toast.success(
          "تم تأكيد الحجز بنجاح!",
          `تم تسجيل موعدك برقم ${createdAppointment.appointment_id || ""}`
        );

        setBookingResult({
          appointmentId: createdAppointment.appointment_id,
          appointmentNumber: createdAppointment.appointment_number,
          doctor: selectedDoctor,
          specialty: selectedSpecialty,
          date: selectedDate,
          period: preferredPeriod === "morning" ? "الفترة الصباحية (8:30 ص - 1:30 م)" : "الفترة المسائية (4:30 م - 9:30 م)",
          patientName: createdAppointment.patient_name || patientName,
          whatsappPhone: createdAppointment.patient_phone || whatsappPhone,
          paymentMethod: paymentMethod === "on_arrival" ? "الدفع عند الحضور" : "دفع إلكتروني",
        });
      } else {
        const errorMsg = "تعذر إتمام الحجز. يرجى التأكد من تسجيل الدخول والاتصال بالإنترنت.";
        setBookingError(errorMsg);
        toast.error("فشل إتمام الحجز", errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "حدث خطأ أثناء إتمام الحجز. يرجى المحاولة مرة أخرى.";
      setBookingError(errorMsg);
      toast.error("فشل إتمام الحجز", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Navigation
    currentStep,
    nextStep,
    prevStep,
    canProceed,
    resetBooking,

    // Step 1: Specialties
    searchQuery,
    setSearchQuery,
    filteredSpecialties,
    selectedSpecialty,
    selectSpecialty,

    // Step 2: Doctors
    availableDoctors,
    selectedDoctor,
    setSelectedDoctor,

    // Step 3: Form Inputs & Submission
    patientName,
    setPatientName,
    patientAge,
    setPatientAge,
    whatsappPhone,
    setWhatsappPhone,
    selectedDate,
    setSelectedDate,
    preferredPeriod,
    setPreferredPeriod,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    isSubmitting,
    bookingResult,
    bookingError,
    handleSubmitBooking,
  };
}
