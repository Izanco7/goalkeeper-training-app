import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>
      {children}
    </div>
  );
}
