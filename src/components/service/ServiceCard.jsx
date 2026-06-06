import React from 'react';
import { useNavigate } from 'react-router-dom';
// Adjust path nếu project dùng alias: import { formatVND } from '@/services/serviceService';
import { formatVND } from '../../services/serviceService';

/**
 * ServiceCard — Hiển thị thông tin 1 dịch vụ
 * BR-36: Label giá ghi rõ "Giá đã bao gồm VAT"
 *
 * @param {{ service: { serviceId, serviceName, serviceCategory, description, price, duration } }} props
 */
export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { serviceId, serviceName, serviceCategory, description, price, duration } = service;

  const handleBook = () => {
    navigate(`/booking?serviceId=${serviceId}`);
  };

  return (
    <article className="service-card" aria-label={`Dịch vụ: ${serviceName}`}>
      {/* Category badge */}
      <span className={`service-card__badge service-card__badge--${serviceCategory?.toLowerCase()}`}>
        {serviceCategory}
      </span>

      {/* Content */}
      <div className="service-card__body">
        <h3 className="service-card__name">{serviceName}</h3>
        <p className="service-card__desc">{description}</p>
      </div>

      {/* Meta */}
      <div className="service-card__meta">
        <div className="service-card__duration">
          <span className="service-card__meta-icon" aria-hidden="true">🕐</span>
          <span>{duration} phút</span>
        </div>

        <div className="service-card__price-block">
          <span className="service-card__price">{formatVND(price)}</span>
          {/* BR-36 */}
          <span className="service-card__price-note">Giá đã bao gồm VAT</span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="service-card__cta"
        onClick={handleBook}
        aria-label={`Đặt lịch dịch vụ ${serviceName}`}
      >
        Đặt lịch ngay
      </button>
    </article>
  );
}
