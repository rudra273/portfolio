import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: 'primary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = "button", variant = 'ghost' }) => {
  const baseStyles = `
    px-6 py-2.5 rounded-lg font-space font-medium text-sm tracking-wide
    transition-all duration-400 relative overflow-hidden
    focus:outline-none active:scale-[0.97]
  `;

  const variants = {
    primary: `
      border border-accent-cyan/40 text-accent-cyan
      hover:bg-accent-cyan/10 hover:border-accent-cyan/70 hover:shadow-[0_0_20px_rgba(102,252,241,0.15)]
      backdrop-blur-sm
    `,
    ghost: `
      border border-white/15 text-white/80
      hover:border-white/30 hover:text-white hover:bg-white/5
      backdrop-blur-sm
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;