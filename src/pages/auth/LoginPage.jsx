import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import bg from "../../assets/img/bg-car.png";

// ─── Validators ─────────────────────────────────────────────────────────────
function validate({ phone, password }) {
  const errors = {};
  if (!phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^0\d{9}$/.test(phone.trim())) {
    errors.phone = "Số điện thoại phải đúng 10 chữ số";
  }
  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }
  return errors;
}

// ─── InputRow ────────────────────────────────────────────────────────────────
function InputRow({ label, name, type = "text", value, onChange, placeholder, error, icon, autoComplete, disabled, rightSlot }) {
  return (
    <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant px-1 block">
        {label}
      </label>
      <div className="relative group">
        <span
          className={[
            "absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined transition-colors",
            error ? "text-error" : "text-outline group-focus-within:text-primary",
          ].join(" ")}
          style={{ fontSize: "20px" }}
        >
          {icon}
        </span>
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
            "w-full bg-surface-container-low border rounded-lg py-3 pl-12 text-on-surface",
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

// ─── PasswordInput ───────────────────────────────────────────────────────────
function PasswordInput(props) {
  const [show, setShow] = useState(false);
  return (
    <InputRow
      {...props}
      type={show ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className="text-outline hover:text-primary transition-colors"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      }
    />
  );
}

// ─── LoginPage ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [form, setForm] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await login({ phone: form.phone.trim(), password: form.password });

      // Persist token (no password stored — BR-06)
      localStorage.setItem("aw_token", data.token);
      localStorage.setItem("aw_user", JSON.stringify({
        customerId: data.customerId,
        fullName: data.fullName,
        tier: data.tier,
        suspendedUntil: data.suspendedUntil ?? null,
        role: data.role ?? "MEMBER",
      }));

      setAuth({
        token: data.token,
        customerId: data.customerId,
        fullName: data.fullName,
        tier: data.tier,
        suspendedUntil: data.suspendedUntil ?? null,
        role: data.role ?? "MEMBER",
      });

      toast.success(`Chào mừng, ${data.fullName}!`);

      // Redirect: Admin → /admin/dashboard, Member → /
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      // BR-13: ACCOUNT_LOCKED → toast dài
      if (err.code === "ACCOUNT_LOCKED") {
        toast.error("Tài khoản bị khóa, liên hệ Admin", { duration: 5000 });
        setErrors({ password: "Tài khoản bị khóa, liên hệ Admin" });
      } else if (err.code === "INVALID_CREDENTIALS") {
        setErrors({ password: "Sai mật khẩu hoặc tài khoản bị khóa" });
      } else {
        toast.error("Không thể kết nối máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
            src="https://lh3.googleusercontent.com/aida/AP1WRLvEKpT-h0m5Bc--YsvKG9KNRVhL34DUUfcJg29gx6VBIGy4N3CkQD9xJpKGZHq8o-yXwbtseovLOBfB_whN-PvrsY0m5W8audJBcYZIxShtnCYTVwZj2YbaATyyxTFF3lHaA0Tm8YzO9GaIF2n5yQ4Ly0CVv8EsplaeqY1a5okNvKqaQhykcYsATjKs5pa5xXhra0dc6VEKAingaHpR0TSNrweLeP9IM1vFExmGJ683USgff3Plr0Bakteu"
            alt="AutoWash Pro Background"
            className="w-full h-full object-cover opacity-60"
            style={{ filter: "grayscale(0.3)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-[rgba(3,20,39,0.4)]" />
        </div>

        {/* ── Card ── */}
        <main className="relative z-10 w-full max-w-md px-lg py-8">
          <div
            className="rounded-xl flex flex-col p-lg"
            style={{
              background: "rgba(3,20,39,0.45)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              border: "1px solid rgba(161,234,255,0.1)",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.8)",
            }}
          >
            {/* ── Brand — inline layout (icon + title side by side) ── */}
            <div className="flex flex-col items-center gap-xs mb-lg">
              <div className="flex items-center gap-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{
                    fontSize: "32px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  diamond
                </span>
                <h1 className="font-h2 text-h2 text-primary tracking-tighter uppercase">
                  AutoWash Pro
                </h1>
              </div>
              <p className="font-body-md text-on-surface-variant text-sm">
                Chào mừng bạn quay lại
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-md">

              {/* Số điện thoại — BR-03 */}
              <InputRow
                label="Số điện thoại"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số điện thoại (dùng để đăng nhập)"
                error={errors.phone}
                icon="call"
                autoComplete="tel"
                disabled={loading}
              />

              {/* Mật khẩu */}
              <PasswordInput
                label="Mật khẩu"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
                icon="lock"
                autoComplete="current-password"
                disabled={loading}
              />

              {/* Primary CTA */}
              <div className="pt-xs">
                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    "w-full bg-primary-container text-on-primary font-h3",
                    "py-4 rounded-xl flex items-center justify-center gap-sm",
                    "hover:brightness-110 active:scale-95 transition-all",
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
                      <span>Đang đăng nhập…</span>
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-sm">
                <div className="h-[1px] flex-1 bg-outline/30" />
                <span className="font-body-md text-on-surface-variant text-sm">hoặc</span>
                <div className="h-[1px] flex-1 bg-outline/30" />
              </div>

              {/* Secondary — Register */}
              <Link
                to="/register"
                className={[
                  "w-full flex items-center justify-center gap-xs py-3.5 rounded-xl",
                  "border border-outline/30 bg-surface-container-low",
                  "font-body-md text-on-surface-variant text-sm",
                  "hover:border-primary/40 hover:text-on-surface transition-all",
                ].join(" ")}
              >
                Chưa có tài khoản?&nbsp;
                <span className="text-primary font-semibold">Đăng ký ngay</span>
              </Link>
            </form>

            {/* ── Back to home ── */}
            <div className="flex justify-center mt-lg">
              <Link
                to="/"
                className="flex items-center gap-xs font-body-md text-on-surface-variant text-sm hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  arrow_back
                </span>
                Quay lại Trang chủ
              </Link>
            </div>
          </div>

          {/* Scanning line decoration */}
          <div
            className="relative mt-1 w-full h-[2px] overflow-hidden"
            style={{ background: "rgba(161,234,255,0.2)", filter: "blur(1px)" }}
          >
            <div
              className="h-full w-24 bg-primary"
              style={{ animation: "scan 3s linear infinite" }}
            />
          </div>
        </main>
      </div>

      <style>{`
        @keyframes scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
    </>
  );
}
