import React from 'react';

export default function StepSelectService({ bookingData, setBookingData, onNext, servicesList }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-syne text-cyan-400 font-semibold mb-4">Bước 1: Chọn dịch vụ chăm sóc xe</h3>
            <div className="grid grid-cols-1 gap-4">
                {servicesList.map((service) => {
                    const isSelected = bookingData.service?.id === service.id;
                    return (
                        <div
                            key={service.id}
                            onClick={() => setBookingData(prev => ({ ...prev, service }))}
                            className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex justify-between items-center ${isSelected
                                    ? 'bg-cyan-950/40 border-cyan-500 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]'
                                    : 'bg-neutral-900/60 border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div>
                                <h4 className="font-semibold text-lg text-white">{service.name}</h4>
                                <p className="text-sm text-neutral-400 mt-1">Dịch vụ chăm sóc xe chuẩn cao cấp</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-cyan-400">{service.price.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    disabled={!bookingData.service}
                    onClick={onNext}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}