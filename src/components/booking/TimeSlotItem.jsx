import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function TimeSlotItem({ time, availableCount, isUnavailable, isSelected, onSelect }) {
  const { t } = useLanguage();

  // If availableCount is not specified, fall back to default behavior (available/full)
  const isFull = availableCount === 0;
  
  // Decide status
  let status = 'available'; // 'available' | 'nearly-full' | 'full'
  if (isFull) {
    status = 'full';
  } else if (availableCount === 1) {
    status = 'nearly-full';
  }

  // Visual classes based on status and selection
  let cardClass = '';
  let dotClass = '';
  let statusText = '';

  if (isUnavailable || status === 'full') {
    cardClass = 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 pointer-events-none';
    dotClass = 'bg-slate-300';
    statusText = isUnavailable && !isFull ? t('slotExpired') : t('slotFull');
  } else {
    // Normal available or nearly-full state
    if (isSelected) {
      cardClass = 'border-cyan-500 bg-cyan-50/70 text-cyan-800 shadow-md shadow-cyan-100/50 scale-[1.02] ring-2 ring-cyan-200/20';
    } else {
      cardClass = 'border-slate-200 bg-white text-slate-800 hover:border-cyan-400 hover:bg-slate-50/50 hover:shadow-md hover:scale-[1.01]';
    }

    if (status === 'nearly-full') {
      dotClass = 'bg-amber-500 animate-pulse';
      statusText = t('only1SlotLeft');
    } else {
      dotClass = 'bg-emerald-500';
      statusText = t('slotsLeft').replace('{count}', availableCount !== undefined ? availableCount : '2');
    }
  }

  return (
    <button
      type="button"
      disabled={isUnavailable || status === 'full'}
      onClick={() => onSelect(time)}
      className={`relative w-full rounded-2xl border-2 p-4 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[90px] ${cardClass}`}
    >
      {/* Time display */}
      <span className="text-lg font-black tracking-tight font-sans">
        {time}
      </span>
      
      {/* Status indicator (dot + text) */}
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <span className={isSelected && !isUnavailable ? 'text-cyan-700' : 'text-slate-500'}>
          {statusText}
        </span>
      </span>
    </button>
  );
}
