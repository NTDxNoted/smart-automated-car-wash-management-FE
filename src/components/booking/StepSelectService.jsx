import React from 'react';

export default function StepSelectService({ bookingData, setBookingData, onNext, servicesList }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-heading text-cyan-600 font-semibold mb-4">Bước 1: Chọn dịch vụ chăm sóc xe</h3>
            <div className="grid grid-cols-1 gap-4">
                {servicesList.map((service) => {
                    const isSelected = bookingData.service?.id === service.id;
                    return (
                        <div
                            key={service.id}
                            onClick={() => setBookingData(prev => ({ ...prev, service }))}
                            className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex justify-between items-center ${isSelected
                                    ? 'bg-cyan-50 border-cyan-500 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800">{service.name}</h4>
                                <p className="text-sm text-slate-500 mt-1">Dịch vụ chăm sóc xe chuẩn cao cấp</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-cyan-600">{service.price.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    disabled={!bookingData.service}
                    onClick={onNext}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-md"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}