import { useState } from "react";
import { toast } from "react-toastify";
export default function PaymentForm({
  booking,
  onSuccess,
}) {
  const [method, setMethod] = useState("CASH");
  const [confirmed, setConfirmed] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentAt, setPaymentAt] = useState(null);

  const handleConfirm = async () => {
     try {
    const res =
      await adminBookingService.recordPayment(
        booking.id,
        {
          method,
        }
      );

    setPaid(true);

    setPaymentAt(
      res.data.paymentAt ||
      res.data.updatedAt
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Không thể ghi nhận thanh toán"
    );
  }
        
  };

  const handleMethodChange = (value) => {
  setMethod(value);

  setConfirmed(false);
};

 const formattedPaymentTime = paymentAt
    ? new Date(paymentAt).toLocaleTimeString(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  return (
    <fieldset
    disabled={paid}
    className="border rounded-xl p-4"
  >
      <h3 className="font-semibold mb-3">
        Payment
      </h3>

      <div className="flex gap-4 mb-4">
        <label>
          <input
            type="radio"
            checked={method === "CASH"}
            onChange={() =>handleMethodChange("CASH")}
            disabled={paid}
          />
          Cash
        </label>

        <label>
          <input
            type="radio"
            checked={method === "TRANSFER"}
            onChange={() =>handleMethodChange("TRANSFER")}
            disabled={paid}
          />
          Transfer
        </label>
      </div>

      {method === "CASH" && (
        <label className="flex gap-2 mb-4">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={paid}
            onChange={(e) =>
              setConfirmed(e.target.checked)
            }
          />

          Tôi xác nhận đã thu đủ tiền mặt
        </label>
      )}

      <button
        disabled={
          paid ||
          (method === "CASH" && !confirmed)
        }
        onClick={handleConfirm}
        className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-300"
      >
        {paid ? "Paid" : "Confirm Payment"}
      </button>

       {paid && paymentAt && (
        <p className="mt-3 text-green-600 text-sm">
          Đã thanh toán lúc{" "}
          {formattedPaymentTime}
        </p>
      )}
    </fieldset>
  );
}