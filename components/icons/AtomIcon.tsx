
import React from 'react';

const AtomIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L12 22" />
    <path d="M20.24 7.76L3.76 16.24" />
    <path d="M20.24 16.24L3.76 7.76" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="5.88" cy="9.12" r="1.5" fill="currentColor" />
    <circle cx="18.12" cy="14.88" r="1.5" fill="currentColor" />
    <circle cx="18.12" cy="9.12" r="1.5" fill="currentColor" />
    <circle cx="5.88" cy="14.88" r="1.5" fill="currentColor" />
  </svg>
);

export default AtomIcon;
