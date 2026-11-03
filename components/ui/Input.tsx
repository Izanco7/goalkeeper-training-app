import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-black/40 border rounded-xl text-white placeholder-white/25 focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/60 outline-none transition-all ${
          error ? 'border-red-500/60' : 'border-white/10'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
}
