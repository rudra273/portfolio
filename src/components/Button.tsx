import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6  
        py-1
        border 
        border-gray-600
        bg-transparent
        backdrop-blur-sm
        hover:border-white 
        hover:text-white
        hover:bg-gray-900/30
        transition-all 
        duration-500 
        font-poppins 
        relative 
        overflow-hidden
        before:absolute
        before:inset-0
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/5
        before:to-transparent
        before:translate-x-[-200%]
        hover:before:translate-x-[200%]
        before:transition-transform
        before:duration-1000
        focus:outline-none
        focus:ring-2
        focus:ring-white/20
        active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;