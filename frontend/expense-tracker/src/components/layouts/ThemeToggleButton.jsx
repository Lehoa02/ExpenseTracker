import React, { useRef } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggleButton = ({ className = '', iconClassName = '' }) => {
  const buttonRef = useRef(null);
  const { isDark, isTransitioning, toggleTheme } = useTheme();

  const handleClick = () => {
    if (isTransitioning || !buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <button
      ref={buttonRef}
      type='button'
      onClick={handleClick}
      className={className}
      aria-label='Toggle theme'
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      disabled={isTransitioning}
    >
      {isDark ? <LuSun className={iconClassName} /> : <LuMoon className={iconClassName} />}
    </button>
  );
};

export default ThemeToggleButton;