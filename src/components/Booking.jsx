import { useState } from "react";

const initialForm = {
  fullName: "", phone: "", plate: "",
  vehicleType: "", service: "", date: "", time: "",
};

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())   e.fullName    = "Vui lòng nhập họ tên";
    if (!form.phone.trim())      e.phone       = "Vui lòng nhập số điện thoại";
    if (!form.plate.trim())      e.plate       = "Vui lòng nhập biển số xe";
    if (!form.vehicleType)       e.vehicleType = "Vui lòng chọn loại xe";
    if (!form.service)           e.service     = "Vui lòng chọn dịch vụ";
    if (!form.date)              e.date        = "Vui lòng chọn ngày";
    if (!form.time)              e.time        = "Vui lòng chọn giờ";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(initialForm); }, 4000);
  };

  return (
    <section className="booking" id="booking">
      <div className="section-header">
        <p className="section-tag">— Đặt lịch</p>
        <h2>Đặt lịch <span className="gradient-text">nhanh chóng</span></h2>
        <p className="section-desc">Điền thông tin bên dưới — chúng tôi xác nhận trong 15 phút</p>
      </div>

      <div className="booking-wrapper">
        <div className="booking-info">
          <h3>Tại sao đặt lịch trước?</h3>
          {[
            { icon: "◈", title: "Ưu tiên theo hạng",    desc: "Gold & Platinum được đặt trước 12–14 ngày" },
            { icon: "◉", title: "Không chờ đợi",         desc: "Xe bạn được phục vụ đúng giờ đã hẹn" },
            { icon: "◍", title: "Tích điểm tự động",     desc: "Mỗi lần rửa cộng điểm ngay vào tài khoản" },
            { icon: "◎", title: "LPR nhận diện tự động", desc: "Hệ thống nhận ra xe bạn ngay khi vào trạm" },
          ].map((b) => (
            <div className="booking-benefit" key={b.title}>
              <span className="benefit-icon">{b.icon}</span>
              <div>
                <strong>{b.title}</strong>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          {submitted && (
            <div className="toast-success">
              ✓ Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận sớm.
            </div>
          )}

          <div className="form-row">
            <div className={`form-group ${errors.fullName ? "error" : ""}`}>
              <label>Họ và tên</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="Nguyễn Văn A" />
              {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
            </div>
            <div className={`form-group ${errors.phone ? "error" : ""}`}>
              <label>Số điện thoại</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="0901 234 567" />
              {errors.phone && <span className="err-msg">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${errors.plate ? "error" : ""}`}>
              <label>Biển số xe</label>
              <input name="plate" value={form.plate} onChange={handleChange}
                placeholder="51A-123.45" />
              {errors.plate && <span className="err-msg">{errors.plate}</span>}
            </div>
            <div className={`form-group ${errors.vehicleType ? "error" : ""}`}>
              <label>Loại xe</label>
              <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                <option value="">-- Chọn loại xe --</option>
                <option value="Scooter">Scooter (Xe tay ga)</option>
                <option value="Manual">Manual (Xe số)</option>
                <option value="Underbone">Underbone (Xe côn tay)</option>
                <option value="Car">Car (Ô tô)</option>
              </select>
              {errors.vehicleType && <span className="err-msg">{errors.vehicleType}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.service ? "error" : ""}`}>
            <label>Dịch vụ</label>
            <select name="service" value={form.service} onChange={handleChange}>
              <option value="">-- Chọn dịch vụ --</option>
              <option value="basic">Rửa xe cơ bản — 30,000đ (20 phút)</option>
              <option value="premium">Rửa xe cao cấp — 60,000đ (35 phút)</option>
              <option value="vacuum">Rửa + Hút bụi nội thất — 90,000đ (50 phút)</option>
              <option value="detail">Rửa chi tiết toàn bộ — 150,000đ (90 phút)</option>
              <option value="tire">Đánh bóng lốp — 40,000đ (25 phút)</option>
            </select>
            {errors.service && <span className="err-msg">{errors.service}</span>}
          </div>

          <div className="form-row">
            <div className={`form-group ${errors.date ? "error" : ""}`}>
              <label>Ngày đặt lịch</label>
              <input name="date" type="date" value={form.date} onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} />
              {errors.date && <span className="err-msg">{errors.date}</span>}
            </div>
            <div className={`form-group ${errors.time ? "error" : ""}`}>
              <label>Giờ đặt lịch</label>
              <input name="time" type="time" value={form.time} onChange={handleChange}
                min="07:00" max="19:00" />
              {errors.time && <span className="err-msg">{errors.time}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <span>Xác nhận đặt lịch</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
