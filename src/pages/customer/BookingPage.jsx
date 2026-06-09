import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import BookingStepper from '../../components/booking/BookingStepper';
import StepSelectService from '../../components/booking/StepSelectService';
import StepVehicleTime from '../../components/booking/StepVehicleTime';
import StepConfirm from '../../components/booking/StepConfirm';

const MOCK_SERVICES = [
  { id: 's1', name: 'Premium Car Wash & Detailing', price: 500000 },
  { id: 's2', name: 'Ceramic Coating Protection', price: 2500000 },
  { id: 's3', name: 'Interior Deep Cleaning', price: 800000 }
];

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: null,
    customerType: user ? 'MEMBER' : 'GUEST',
    phone: user?.phone || '',
    licensePlate: '',
    selectedVehicleId: '',
    scheduledTime: '',
  });

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    if (serviceId) {
      const selectedService = MOCK_SERVICES.find(s => s.id === serviceId);
      if (selectedService) {
        setBookingData(prev => ({ ...prev, service: selectedService }));
      }
    }
  }, [searchParams]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    // 1. Thêm "justify-center" vào thẻ cha để ép nội dung con căn giữa theo chiều dọc
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">

      {/* 2. Đổi "mt-6" thành "my-8" (khoảng cách đều cả trên lẫn dưới để hộp không bị dính biên) */}
      <div className="w-full max-w-4xl bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-xl my-8">

        <h1 className="text-2xl md:text-3xl font-bold font-syne text-center mb-10 bg-gradient-to-r from-slate-800 via-slate-600 to-cyan-600 bg-clip-text text-transparent tracking-wide uppercase">
          ĐẶT LỊCH DỊCH VỤ LUXURY
        </h1>

        {/* Cụm hiển thị các bước */}
        <div className="w-full mb-10">
          <BookingStepper currentStep={currentStep} />
        </div>

        {/* Khung chứa các Step Component nội dung bên dưới */}
        <div className="w-full border-t border-slate-200 pt-8">
          {currentStep === 1 && (
            <StepSelectService
              bookingData={bookingData}
              setBookingData={setBookingData}
              onNext={nextStep}
              servicesList={MOCK_SERVICES}
            />
          )}

          {currentStep === 2 && (
            <StepVehicleTime
              bookingData={bookingData}
              setBookingData={setBookingData}
              onNext={nextStep}
              onBack={prevStep}
              user={user}
            />
          )}

          {currentStep === 3 && (
            <StepConfirm
              bookingData={bookingData}
              onBack={prevStep}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}