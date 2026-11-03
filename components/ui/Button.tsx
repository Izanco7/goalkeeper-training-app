import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-full font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.2)]',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    outline: 'border-2 border-white/20 text-white/80 hover:border-lime-400/60 hover:text-lime-300',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
