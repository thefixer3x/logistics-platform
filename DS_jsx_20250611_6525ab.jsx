// components/shared/StatusBadge.jsx
const STATUS_VARIANTS = {
  active: 'bg-green-100 text-green-800',
  idle: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-blue-100 text-blue-800',
  delayed: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_VARIANTS[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}