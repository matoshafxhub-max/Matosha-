
import React from 'react';

interface ActionButtonProps {
  // Fix: Update onClick prop to accept a mouse event to match the usage in ProfileCard.
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, className = '', ariaLabel, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
