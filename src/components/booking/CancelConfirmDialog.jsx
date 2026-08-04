import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function CancelConfirmDialog({ booking, onConfirm, onClose, isLoading }) {
  const { t, locale } = useLanguage();
  if (!booking) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon Container */}
        <div
          style={{
            marginBottom: '16px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '#ef4444',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
            warning
          </span>
        </div>

        {/* Title */}
        <h2
          id="cancel-dialog-title"
          style={{
            marginBottom: '8px',
            fontSize: '20px',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 8px 0',
            lineHeight: 1.3,
          }}
        >
          {t('confirmCancelTitle') || 'Xác nhận hủy lịch hẹn'}
        </h2>

        {/* Subtitle Warning */}
        <p
          style={{
            marginBottom: '20px',
            fontSize: '13px',
            color: '#64748b',
            margin: '0 0 20px 0',
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {t('confirmCancelWarning') || 'Hành động này không thể hoàn tác sau khi xác nhận.'}
        </p>

        {/* Booking Card Preview Section */}
        <div
          style={{
            marginBottom: '16px',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            textAlign: 'left',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 900,
                fontFamily: 'monospace',
                backgroundColor: '#ecfeff',
                color: '#0891b2',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #c5f2f7',
                letterSpacing: '0.05em',
              }}
            >
              {booking.vehiclePlate || booking.licensePlate || 'N/A'}
            </span>
            <div style={{ marginLeft: 'auto' }}>
              <BookingStatusBadge status={booking.status || "Pending"} size="sm" />
            </div>
          </div>

          <h4
            style={{
              marginBottom: '8px',
              fontSize: '15px',
              fontWeight: 800,
              color: '#1e293b',
              margin: '0 0 8px 0',
              lineHeight: 1.4,
            }}
          >
            {booking.serviceName || booking.service?.name || 'Dịch vụ rửa xe'}
          </h4>

          <div
            style={{
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: 600,
            }}
          >
            <span>Mã đơn: #{booking.bookingId || booking.id}</span>
            <span style={{ marginLeft: 'auto' }}>{booking.scheduledTime?.replace('T', ' ') || ''}</span>
          </div>
        </div>

        {/* Notice Info Banner */}
        <div
          style={{
            marginBottom: '24px',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'left',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px', color: '#d97706', flexShrink: 0 }}
          >
            info
          </span>
          <p
            style={{
              fontSize: '12px',
              color: '#92400e',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {locale === 'en'
              ? 'Cancellation is final and cannot be undone once confirmed.'
              : 'Khi xác nhận hủy, lịch hẹn này sẽ bị hủy bỏ vĩnh viễn.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {t('btnKeepAppointment') || 'Giữ lịch'}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(booking.bookingId || booking.id)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxSizing: 'border-box',
            }}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>
                  progress_activity
                </span>
                <span>{t('btnCancelling') || 'Đang hủy...'}</span>
              </>
            ) : (
              <span>{t('btnConfirmCancel') || 'Xác nhận hủy'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
