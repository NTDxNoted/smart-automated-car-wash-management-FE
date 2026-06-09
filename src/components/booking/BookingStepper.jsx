import React from 'react';

export default function BookingStepper({ currentStep }) {
    const steps = [
        { id: 1, title: 'Chọn Dịch Vụ' },
        { id: 2, title: 'Thông Tin Đặt Lịch' },
        { id: 3, title: 'Xác Nhận & Hoá Đơn' }
    ];

    return (
        <div className="flex items-center justify-between relative max-w-xl mx-auto mb-12">
            {/* Line background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 z-0"></div>
            {/* Active Line Progress */}
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-cyan-500 transition-all duration-300 ease-in-out z-0"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border ${currentStep >= step.id
                            ? 'bg-cyan-500 border-cyan-500 text-white shadow-md'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                        {step.id}
                    </div>
                    <span className={`text-xs mt-2 font-medium tracking-wide ${currentStep >= step.id ? 'text-cyan-600' : 'text-slate-500'
                        }`}>
                        {step.title}
                    </span>
                </div>
            ))}
        </div>
    );
}