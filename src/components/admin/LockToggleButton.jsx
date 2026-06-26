export default function LockToggleButton({
  isLocked,
  onClick,
  loading = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
        isLocked
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {loading
        ? 'Đang xử lý...'
        : isLocked
          ? 'Mở khóa'
          : 'Khóa'}
    </button>
  );
}