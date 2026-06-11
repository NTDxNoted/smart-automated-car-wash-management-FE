import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import BookingStepper from '../../components/booking/BookingStepper';
import StepSelectService from '../../components/booking/StepSelectService';
import StepVehicleTime from '../../components/booking/StepVehicleTime';
import StepConfirm from '../../components/booking/StepConfirm';
import { bookingService } from '../../services/bookingService';

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState(null);

  const [bookingData, setBookingData] = useState({
    service: null,
    customerType: user ? 'MEMBER' : 'GUEST',
    phone: user?.phone || '',
    licensePlate: '',
    selectedVehicleId: '',
    scheduledTime: '',
  });

  useEffect(() => {
    async function loadServices() {
      try {
        setLoadingServices(true);
        setError(null);
        const data = await bookingService.getServices();
        const normalized = data.map(s => ({
          id: s.serviceId || s.ServiceID || s.id,
          name: s.serviceName || s.ServiceName || s.name,
          price: s.price || s.Price,
          description: s.description || s.Description || 'Dịch vụ chăm sóc xe chuẩn cao cấp'
        }));
        setServices(normalized);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách dịch vụ.');
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    if (serviceId && services.length > 0) {
      const selectedService = services.find(s => String(s.id) === String(serviceId));
      if (selectedService) {
        setBookingData(prev => ({ ...prev, service: selectedService }));
      }
    }
  }, [searchParams, services]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    // 1. Thêm "justify-center" vào thẻ cha để ép nội dung con căn giữa theo chiều dọc
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">

      {/* 2. Đổi "mt-6" thành "my-8" (khoảng cách đều cả trên lẫn dưới để hộp không bị dính biên) */}
      <div className="w-full max-w-4xl bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-xl my-8">

        <h1 className="text-2xl md:text-3xl font-bold font-heading text-center mb-10 bg-gradient-to-r from-slate-800 via-slate-600 to-cyan-600 bg-clip-text text-transparent tracking-wide uppercase">
          ĐẶT LỊCH DỊCH VỤ LUXURY
        </h1>

        {/* Cụm hiển thị các bước */}
        <div className="w-full mb-10">
          <BookingStepper currentStep={currentStep} />
        </div>

        {/* Khung chứa các Step Component nội dung bên dưới */}
        <div className="w-full border-t border-slate-200 pt-8">
          {currentStep === 1 && (
            loadingServices ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Đang tải danh sách dịch vụ...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm">
                ⚠️ {error}
              </div>
            ) : (
              <StepSelectService
                bookingData={bookingData}
                setBookingData={setBookingData}
                onNext={nextStep}
                servicesList={services}
              />
            )
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