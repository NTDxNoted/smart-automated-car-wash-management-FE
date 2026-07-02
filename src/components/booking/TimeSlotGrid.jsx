import React from 'react';
import TimeSlotItem from './TimeSlotItem';

export default function TimeSlotGrid({ slots, selectedTime, onSelectSlot, dateStr }) {
  
  // Get local today date string (YYYY-MM-DD)
  const getLocalTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateVal = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${dateVal}`;
  };

  // Check if slot violates the 60-minute advance booking rule
  const isSlotViolatingAdvanceRule = (timeStr) => {
    if (!timeStr || !dateStr) return false;
    const todayStr = getLocalTodayDateStr();
    if (dateStr !== todayStr) return false;

    const now = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Create Date object in local time
    const slotDate = new Date(year, month - 1, day, hours, minutes, 0);
    const diffMins = (slotDate.getTime() - now.getTime()) / (1000 * 60);

    return diffMins < 60;
  };

  if (!slots || slots.length === 0) {
    return (
      <div className="col-span-full text-center py-6 text-slate-400 text-sm italic">
        Không có khung giờ nào khả dụng cho ngày này.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {slots.map((slot, idx) => {
        const isViolatingRule = isSlotViolatingAdvanceRule(slot.time);
        
        return (
          <TimeSlotItem
            key={`${dateStr}-${slot.time}-${idx}`}
            time={slot.time}
            availableCount={slot.availableCount}
            isUnavailable={isViolatingRule}
            isSelected={selectedTime === slot.time}
            onSelect={onSelectSlot}
          />
        );
      })}
    </div>
  );
}
