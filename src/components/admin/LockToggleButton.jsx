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
      className={`premium-btn ${isLocked ? 'unlock-btn' : 'lock-btn'}`}
    >
      {loading
        ? 'Đang xử lý...'
        : isLocked
          ? 'Mở khóa'
          : 'Khóa'}
    </button>
  );
}