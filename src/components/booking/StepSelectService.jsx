import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function StepSelectService({ bookingData, setBookingData, onNext, servicesList }) {
  const { t, locale } = useLanguage();

  function formatVND(amount) {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-cyan-700">
        {t('step1Title') || 'Bước 1: Chọn dịch vụ chăm sóc xe'}
      </h2>

      <ul className="flex flex-col gap-3">
        {servicesList.map((service) => {
          const isSelected = bookingData.service?.id === service.id;
          return (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => setBookingData(prev => ({ ...prev, service }))}
                aria-pressed={isSelected}
                className={`flex w-full items-center justify-between gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500 text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-white bg-white/20' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-white font-bold">
                        check
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="text-base font-bold">{service.name}</p>
                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-cyan-50' : 'text-slate-500'}`}>
                      {service.description || (locale === 'en' ? 'Premium car care service' : 'Dịch vụ chăm sóc xe chuẩn cao cấp')}
                    </p>
                  </div>
                </div>
                <span className={`whitespace-nowrap text-lg font-bold ${isSelected ? 'text-white' : 'text-cyan-600'}`}>
                  {formatVND(service.price)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end pt-6">
        <button
          type="button"
          disabled={!bookingData.service}
          onClick={onNext}
          className="rounded-full bg-cyan-500 hover:bg-cyan-600 shadow-sm font-semibold text-white disabled:opacity-50 px-6 py-2.5 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {t('btnContinue')}
        </button>
      </div>
    </section>
  );
}