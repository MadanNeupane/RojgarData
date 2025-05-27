export const Spinner = ({ className = "w-4 h-4" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent border-gray-500 ${className}`}
      role="status"
    />
  );
};
