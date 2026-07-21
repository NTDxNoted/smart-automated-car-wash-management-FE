import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BookingStepper from '../../components/booking/BookingStepper';
import StepSelectService from '../../components/booking/StepSelectService';
import StepVehicleTime from '../../components/booking/StepVehicleTime';
import StepConfirm from '../../components/booking/StepConfirm';
import { bookingService } from '../../services/bookingService';
import { profileService } from '../../services/profileService';

export default function BookingPage() {
  const { auth } = useContext(AuthContext);
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);

  const [bookingData, setBookingData] = useState({
    service: null,
    customerType: auth?.token ? 'MEMBER' : 'GUEST',
    phone: '',
    licensePlate: '',
    selectedVehicleId: '',
    scheduledTime: '',
  });

  useEffect(() => {
    async function loadMemberProfile() {
      if (auth?.token) {
        try {
          const profile = await profileService.getProfile();
          const normalizedProfile = {
            ...profile,
            points: profile.loyaltyPoints ?? profile.points ?? 0
          };
          setMemberProfile(normalizedProfile);
          setBookingData(prev => ({
            ...prev,
            customerType: 'MEMBER',
            phone: profile.phone || '',
          }));
        } catch (err) {
          console.error("Failed to load member profile:", err);
        }
      } else {
        setMemberProfile(null);
        setBookingData(prev => ({
          ...prev,
          customerType: 'GUEST',
          phone: '',
        }));
      }
    }
    loadMemberProfile();
  }, [auth]);

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
        setError(err.message || t('emptyServices'));
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, [t]);

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
    <div className="booking-page-container w-full min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800 font-sans p-[15px] flex flex-col justify-center items-center">

      <div className="booking-card-wrapper w-full max-w-7xl bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-2xl">

        <h1 className="text-2xl md:text-3xl font-bold font-heading text-center mb-10 bg-gradient-to-r from-slate-800 via-slate-600 to-cyan-600 bg-clip-text text-transparent tracking-wide uppercase">
          {t('bookingTitle')}
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
                <p className="text-sm text-slate-500 font-medium">{t('loadingServices')}</p>
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
              user={memberProfile}
            />
          )}

          {currentStep === 3 && (
            <StepConfirm
              bookingData={bookingData}
              onBack={prevStep}
              user={memberProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}