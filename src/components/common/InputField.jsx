import { useState } from "react";

/**
 * InputField — reusable form input with label, error, and password toggle.
 *
 * Props:
 *  - label      : string
 *  - name       : string   (used for id & htmlFor)
 *  - type       : 'text' | 'password' | 'tel' | …
 *  - value      : string
 *  - onChange   : (e) => void
 *  - placeholder: string
 *  - error      : string | null
 *  - autoComplete: string (optional)
 *  - disabled   : bool
 */
export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-slate-700 tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={[
            "w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none",
            "bg-white placeholder:text-slate-400",
            "focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500",
            error
              ? "border-red-400 bg-red-50"
              : "border-slate-200 hover:border-slate-300",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            isPassword ? "pr-11" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              /* eye-off */
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* eye */
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
