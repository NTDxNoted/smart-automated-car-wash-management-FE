import { useState } from "react";

export default function PaymentForm({
  booking,
  onSuccess,
}) {
  const [method, setMethod] = useState("CASH");
  const [confirmed, setConfirmed] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleConfirm = async () => {
    // call api payment

    setPaid(true);

    onSuccess?.();
  };

  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold mb-3">
        Payment
      </h3>

      <div className="flex gap-4 mb-4">
        <label>
          <input
            type="radio"
            checked={method === "CASH"}
            onChange={() => setMethod("CASH")}
            disabled={paid}
          />
          Cash
        </label>

        <label>
          <input
            type="radio"
            checked={method === "TRANSFER"}
            onChange={() => setMethod("TRANSFER")}
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
    </div>
  );
}