import type { Priority } from "../types";

interface Props {
  priority?: Priority;
  size?: 'sm' | 'md';
}

const PriorityBadge = ({ priority = 'Medio', size = 'sm' }: Props) => {
  if (!priority) return null;

  const styles = {
    Alto: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'shadow-[0_0_8px_-2px_rgba(239,68,68,0.5)]',
    },
    Medio: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      glow: 'shadow-[0_0_8px_-2px_rgba(234,179,8,0.5)]',
    },
    Bajo: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/30',
      glow: 'shadow-[0_0_8px_-2px_rgba(34,197,94,0.5)]',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
  };

  const style = styles[priority];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${style.bg} ${style.text} ${style.border} ${style.glow}
        ${sizeStyles[size]}
        border rounded-md font-bold uppercase tracking-widest
        transition-all duration-200
      `}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
