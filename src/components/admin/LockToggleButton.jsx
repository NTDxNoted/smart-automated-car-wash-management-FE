export default function LockToggleButton({
  isLocked,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        isLocked
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {isLocked ? 'Mở khóa' : 'Khóa'}
    </button>
  );
}