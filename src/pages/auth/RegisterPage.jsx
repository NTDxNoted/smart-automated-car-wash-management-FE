import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { register } from "../../services/authService";
import bg from "../../assets/img/bg-car.png";

/* ─── Tailwind config injection (matches DESIGN.md) ──────────────────────
   The host app must load:
   - Google Fonts: Syne (400–800) + DM Sans (300–700)
   - Google Material Symbols Outlined
   and configure the Tailwind theme exactly as in code.html.
   This component uses only the design-token class names.
──────────────────────────────────────────────────────────────────────── */

// ─── Validators ────────────────────────────────────────────────────────────
function validate({ fullName, phone, password, confirmPassword }) {
  const errors = {};
  if (!fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên";
  if (!phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^0\d{9}$/.test(phone.trim())) {
    errors.phone = "Số điện thoại phải đúng 10 chữ số (bắt đầu bằng 0)";
  }
  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }
  return errors;
}

// ─── InputRow — matches the design system input style ──────────────────────
function InputRow({ label, name, type = "text", value, onChange, placeholder, error, icon, autoComplete, disabled, rightSlot }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <label 
        htmlFor={name} 
        className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider px-1"
        style={{ marginBottom: "10px", display: "block" }}
      >
        {label}
      </label>
      
      <div 
        className={[
          "group flex items-center gap-3 rounded-2xl border-2 bg-slate-50 px-4 py-3.5 transition-all duration-300",
          error 
            ? "border-red-200 bg-red-50/30 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100" 
            : "border-slate-200/80 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100/50 focus-within:shadow-sm"
        ].join(" ")}
        style={{ padding: "14px 16px" }}
      >
        {/* Icon inside wrapper */}
        <span
          className={[
            "material-symbols-outlined transition-colors shrink-0 text-xl",
            error ? "text-red-500" : "text-slate-400 group-focus-within:text-cyan-500"
          ].join(" ")}
        >
          {icon}
        </span>

        {/* Input */}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
        />

        {rightSlot && (
          <div className="shrink-0 flex items-center">{rightSlot}</div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-xs px-1" style={{ marginTop: "8px" }}>
          <span
            className="material-symbols-outlined shrink-0 text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── PasswordInput ─────────────────────────────────────────────────────────
function PasswordInput({ label, name, value, onChange, placeholder, error, icon = "lock", autoComplete, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <InputRow
      label={label}
      name={name}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      icon={icon}
      autoComplete={autoComplete}
      disabled={disabled}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className="text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer flex items-center justify-center"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <span
            className="material-symbols-outlined text-xl"
          >
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      }
    />
  );
}

// ─── RegisterPage ──────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (!form.terms) validationErrors.terms = "Bạn cần đồng ý với điều khoản dịch vụ";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      if (err.code === "PHONE_ALREADY_EXISTS") {
        setErrors({ phone: "Số điện thoại này đã được đăng ký" });
        toast.error("Số điện thoại đã tồn tại trong hệ thống");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Full-screen layout ── */}
      <div className="bg-slate-50 text-slate-800 min-h-screen font-sans overflow-hidden flex items-center justify-center relative p-4">

        {/* Grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(6,182,212,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Hero background */}
        <div className="fixed inset-0 z-0">
          <img
            src={bg}
            alt="AutoWash Pro Background"
            className="w-full h-full object-cover opacity-90"
            style={{ filter: "contrast(1.02) brightness(0.95)" }}
          />
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px]" />
        </div>


        {/* ── Card ── */}
        <main className="relative z-20 w-full max-w-md my-8">
          <div 
            className="rounded-3xl border border-white/40 shadow-xl shadow-slate-900/15 flex flex-col relative overflow-hidden"
            style={{ 
              padding: "40px",
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)"
            }}
          >
            
            {/* Ambient Glow Dot */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

            {/* ── Brand ── */}
            <div className="flex flex-col items-center gap-2 mb-8 text-center w-full">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm shadow-cyan-100/30 mb-4">
                <span 
                  className="material-symbols-outlined text-[32px]" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  diamond
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2">
                AutoWash <span className="text-cyan-600">Pro</span>
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Xác lập tiêu chuẩn vệ sinh xe cao cấp
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="w-full">
              {/* Họ và tên */}
              <InputRow
                label="Họ và tên"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                error={errors.fullName}
                icon="person"
                autoComplete="name"
                disabled={loading}
              />

              {/* Số điện thoại */}
              <InputRow
                label="Số điện thoại"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại đăng ký"
                error={errors.phone}
                icon="phone_iphone"
                autoComplete="tel"
                disabled={loading}
              />

              {/* Mật khẩu */}
              <PasswordInput
                label="Mật khẩu"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                error={errors.password}
                icon="lock"
                autoComplete="new-password"
                disabled={loading}
              />

              {/* Xác nhận mật khẩu */}
              <PasswordInput
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                error={errors.confirmPassword}
                icon="shield_lock"
                autoComplete="new-password"
                disabled={loading}
              />

              {/* Terms */}
              <div className="flex flex-col gap-1.5" style={{ marginTop: "12px", marginBottom: "24px" }}>
                <div className="flex items-center gap-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={form.terms}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-4.5 h-4.5 rounded bg-slate-50 border-slate-300 text-cyan-600 focus:ring-cyan-500/30 accent-cyan-600 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm font-medium text-slate-500 cursor-pointer select-none">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-cyan-600 hover:text-cyan-500 font-bold underline underline-offset-4">
                      Điều khoản dịch vụ
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="flex items-center gap-1.5 text-red-500 text-xs px-1" style={{ marginTop: "8px" }}>
                    <span
                      className="material-symbols-outlined shrink-0 text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      error
                    </span>
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div style={{ marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    "w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold",
                    "py-4 rounded-2xl flex items-center justify-center gap-2 group",
                    "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer",
                    loading ? "opacity-70 cursor-not-allowed" : "",
                  ].join(" ")}
                  style={{ padding: "16px 24px" }}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      <span>Đang đăng ký...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng ký ngay</span>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ── Footer ── */}
            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="h-[1px] flex-1 bg-slate-200" />
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold whitespace-nowrap">
                  Đã có tài khoản?
                </span>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </div>
              <Link
                to="/login"
                className="text-sm font-bold text-cyan-600 hover:text-cyan-500 flex items-center gap-1.5 group transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span className="underline underline-offset-4">Quay lại Đăng nhập</span>
              </Link>
            </div>
          </div>
          {/* No scanning line decoration */}
        </main>
      </div>
    </>
  );
}
