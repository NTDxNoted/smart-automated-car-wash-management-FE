import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";

export default function PaymentForm({
  booking,
  onSuccess,
}) {
  const [method, setMethod] = useState("CASH");
  const [confirmed, setConfirmed] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentAt, setPaymentAt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      const isBookingPaid = booking.paymentStatus === "Paid" || booking.isPaid || booking.paymentAt || false;
      setPaid(isBookingPaid);
      setConfirmed(isBookingPaid);
      if (booking.paymentMethod) {
        setMethod(booking.paymentMethod.toUpperCase());
      } else {
        setMethod("CASH");
      }
      setPaymentAt(booking.paymentAt || null);
    }
  }, [booking]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await adminBookingService.payment(booking.id, {
        paymentMethod: method,
        confirmed: true,
      });

      setPaid(true);
      setPaymentAt(res.data?.paymentAt || res.data?.updatedAt || new Date().toISOString());
      toast.success("Ghi nhận thanh toán thành công!");
      onSuccess?.(method);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể ghi nhận thanh toán"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (value) => {
    setMethod(value);
    setConfirmed(false);
  };

  const formattedPaymentTime = paymentAt
    ? new Date(paymentAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <fieldset
      disabled={paid || loading}
      className="border border-white/10 rounded-2xl p-4 bg-white/[0.01] space-y-4"
    >
      <legend className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-2">
        Thanh toán tại quầy
      </legend>

      <div className="flex gap-6 mt-1">
        <label className="flex items-center gap-2 text-sm text-slate-350 cursor-pointer">
          <input
            type="radio"
            checked={method === "CASH"}
            onChange={() => handleMethodChange("CASH")}
            disabled={paid}
            className="accent-cyan-500"
          />
          Tiền mặt (Cash)
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-350 cursor-pointer">
          <input
            type="radio"
            checked={method === "TRANSFER"}
            onChange={() => handleMethodChange("TRANSFER")}
            disabled={paid}
            className="accent-cyan-500"
          />
          Chuyển khoản (Transfer)
        </label>
      </div>

      {method === "CASH" && (
        <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer bg-white/[0.02] border border-white/5 p-3 rounded-xl">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={paid}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="accent-cyan-500 mt-0.5 shrink-0"
          />
          <span>Tôi xác nhận đã thu đủ tiền mặt từ khách hàng</span>
        </label>
      )}

      <button
        disabled={paid || (method === "CASH" && !confirmed) || loading}
        onClick={handleConfirm}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-2.5 rounded-xl text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-slate-600 border-t-white rounded-full animate-spin"></span>
            <span>Đang ghi nhận...</span>
          </>
        ) : paid ? (
          "Đã thanh toán (Paid)"
        ) : (
          "Xác nhận thanh toán"
        )}
      </button>

      {paid && paymentAt && (
        <p className="text-emerald-400 text-xs text-center mt-2">
          ✓ Ghi nhận thanh toán bằng {method === "CASH" ? "Tiền mặt" : "Chuyển khoản"} lúc {formattedPaymentTime}
        </p>
      )}
    </fieldset>
  );
}