import React from 'react';

interface WireframeIconProps {
  className?: string;
  color?: string;
}

const WireframeIcon: React.FC<WireframeIconProps> = ({ className, color = 'white' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zm0 2.18l6.82 3.41L12 11 5.18 7.59 12 4.18zM2 17l10 5 10-5-10-5-10 5zm10 2.82l-6.82-3.41L12 13l6.82 3.41L12 19.82z" />
  </svg>
);

export default WireframeIcon;