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
          className="text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer flex items-center justify-center"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <span className="material-symbols-outlined text-xl">
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

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
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
            <div className="flex flex-col items-center gap-2 mb-8 text-center">
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
              <p className="text-sm font-semibold text-slate-400">
                Chào mừng bạn quay lại
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="w-full">

              {/* Số điện thoại */}
              <InputRow
                label="Số điện thoại"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại đăng nhập"
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
                placeholder="Nhập mật khẩu"
                error={errors.password}
                icon="lock"
                autoComplete="current-password"
                disabled={loading}
              />

              {/* Primary CTA */}
              <div style={{ marginTop: "12px", marginBottom: "24px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    "w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold",
                    "py-4 rounded-2xl flex items-center justify-center gap-2",
                    "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer",
                    loading ? "opacity-70 cursor-not-allowed" : "",
                  ].join(" ")}
                  style={{ padding: "16px 24px" }}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <span className="material-symbols-outlined text-lg">login</span>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3" style={{ marginTop: "24px", marginBottom: "24px" }}>
                <div className="h-[1px] flex-1 bg-slate-200" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">hoặc</span>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </div>

              {/* Secondary — Register */}
              <Link
                to="/register"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-slate-655 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                style={{ display: "flex", marginTop: "24px", padding: "16px 24px" }}
              >
                Chưa có tài khoản?&nbsp;
                <span className="text-cyan-600 font-extrabold hover:text-cyan-500 transition-colors">Đăng ký ngay</span>
              </Link>
            </form>

            {/* ── Back to home ── */}
            <div className="flex justify-center mt-6">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-cyan-600 transition-colors duration-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Quay lại Trang chủ
              </Link>
            </div>
          </div>
          {/* No scanning line decoration */}
        </main>
      </div>
    </>
  );
}
