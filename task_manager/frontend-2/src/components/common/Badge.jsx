import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/helpers';

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span className={`badge ${config.badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`badge ${config.badgeClass}`}>
      {config.label}
    </span>
  );
};
