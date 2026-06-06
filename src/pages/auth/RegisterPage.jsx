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
    <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
        {label}
      </label>
      <div className="flex items-center gap-sm group">
        {/* Icon nằm NGOÀI, TRƯỚC input */}
        <span
          className={[
            "material-symbols-outlined transition-colors shrink-0",
            error ? "text-error" : "text-outline group-focus-within:text-primary",
          ].join(" ")}
          style={{ fontSize: "20px" }}
        >
          {icon}
        </span>

        {/* Input */}
        <div className="relative flex-1">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            className={[
              "w-full bg-surface-container-low border rounded-lg py-3 px-4 text-on-surface",
              "placeholder:text-outline outline-none transition-all duration-300 focus:ring-1",
              rightSlot ? "pr-12" : "pr-4",
              error
                ? "border-error/60 focus:border-error focus:ring-error/40"
                : "border-outline/30 focus:border-primary focus:ring-primary/30",
              disabled ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          />
          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
          )}
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-xs text-error text-xs px-1 mt-0.5">
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
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
          className="text-outline hover:text-primary transition-colors"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
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
      {/*
        ── Host app must inject these globally (e.g. in index.html / App.jsx) ──
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      */}

      {/* ── Full-screen layout ── */}
      <div className="bg-background text-on-background min-h-screen font-body-md overflow-hidden flex items-center justify-center relative">

        {/* Grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(161,234,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(161,234,255,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Hero background */}
        <div className="fixed inset-0 z-0">
          <img
            src={bg}
            alt="AutoWash Pro Background"
            className="w-full h-full object-cover opacity-60"
            style={{ filter: "grayscale(0.3)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-[rgba(3,20,39,0.4)]" />
        </div>

        {/* ── Card ── */}
        <main className="relative z-10 w-full max-w-md px-lg py-8">
          <div
            className="rounded-xl flex flex-col items-center p-lg"
            style={{
              background: "rgba(3,20,39,0.45)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              border: "1px solid rgba(161,234,255,0.1)",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.8)",
            }}
          >
            {/* ── Brand ── */}
            <div className="flex flex-col items-center gap-sm mb-lg">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border animate-pulse"
                style={{
                  background: "rgba(161,234,255,0.1)",
                  borderColor: "rgba(161,234,255,0.3)",
                  boxShadow: "0 0 20px rgba(0,217,255,0.3)",
                }}
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{
                    fontSize: "36px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  diamond
                </span>
              </div>
              <h1 className="font-h2 text-h2 text-primary tracking-tighter uppercase">
                AutoWash Pro
              </h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant/70">
                Xác lập tiêu chuẩn vệ sinh xe cao cấp
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="w-full space-y-md">
              {/* Họ và tên */}
              <InputRow
                label="Họ và tên"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder=" Nguyễn Văn A"
                error={errors.fullName}
                icon="person"
                autoComplete="name"
                disabled={loading}
              />

              {/* Số điện thoại — BR-03 */}
              <InputRow
                label="Số điện thoại"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder=" Số điện thoại (dùng để đăng nhập)"
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
                placeholder=" ••••••••"
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
                placeholder=" ••••••••"
                error={errors.confirmPassword}
                icon="shield_lock"
                autoComplete="new-password"
                disabled={loading}
              />

              {/* Terms */}
              <div className="flex flex-col gap-xs pt-xs">
                <div className="flex items-center gap-sm">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={form.terms}
                    onChange={handleChange}
                    disabled={loading}
                    className="rounded bg-surface-container-low border-outline text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="font-body-md text-on-surface-variant text-sm">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-primary hover:underline underline-offset-4">
                      Điều khoản dịch vụ
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="flex items-center gap-xs text-error text-xs px-1">
                    <span
                      className="material-symbols-outlined shrink-0"
                      style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
                    >
                      error
                    </span>
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-md">
                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    "w-full bg-primary-container text-on-primary font-h3",
                    "py-4 rounded-xl flex items-center justify-center gap-sm",
                    "hover:brightness-110 active:scale-95 transition-all group",
                    loading ? "opacity-70 cursor-not-allowed" : "",
                  ].join(" ")}
                  style={{ boxShadow: "0 0 20px rgba(0,217,255,0.3)" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Đang đăng ký…</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng ký ngay</span>
                      <span
                        className="material-symbols-outlined group-hover:translate-x-1 transition-transform"
                        style={{ fontSize: "20px" }}
                      >
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ── Footer ── */}
            <div className="mt-lg flex flex-col items-center gap-md w-full">
              <div className="flex items-center gap-sm w-full">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-outline/30" />
                <span className="text-outline text-xs uppercase tracking-widest font-label-caps whitespace-nowrap">
                  Đã có tài khoản?
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-outline/30" />
              </div>
              <Link
                to="/login"
                className="font-label-caps text-primary hover:text-white flex items-center gap-xs group transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>login</span>
                <span className="underline underline-offset-4">Quay lại Đăng nhập</span>
              </Link>
            </div>
          </div>

          {/* Scanning line decoration */}
          <div className="relative mt-1 w-full h-[2px] overflow-hidden" style={{ background: "rgba(161,234,255,0.2)", filter: "blur(1px)" }}>
            <div
              className="h-full w-24 bg-primary"
              style={{ animation: "scan 3s linear infinite" }}
            />
          </div>
        </main>
      </div>

      {/* Keyframe injection — drop this into global CSS if preferred */}
      <style>{`
        @keyframes scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
    </>
  );
}
