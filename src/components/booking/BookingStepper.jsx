import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function BookingStepper({ currentStep = 1 }) {
  const { t } = useLanguage();
  const steps = [
    { id: 1, label: t('bookingStep1') },
    { id: 2, label: t('bookingStep2') },
    { id: 3, label: t('bookingStep3') },
  ];

  return (
    <nav aria-label="Tiến trình đặt lịch" className="px-2 pb-6">
      <ol className="flex items-start w-full">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive    = step.id === currentStep;
          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center">
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-5 h-0.5 w-full ${isCompleted ? 'bg-cyan-500' : 'bg-slate-200'}`}
                />
              )}

              {/* Circle */}
              <span
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  isCompleted
                    ? 'border-cyan-500 bg-cyan-500 text-white'
                    : isActive
                    ? 'border-cyan-500 bg-cyan-500 text-white ring-4 ring-cyan-100'
                    : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[20px] font-extrabold">check</span>
                ) : (
                  step.id
                )}
              </span>

              {/* Label */}
              <span
                className={`mt-2 text-center text-xs font-semibold sm:text-sm ${
                  isActive || isCompleted ? 'text-cyan-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}