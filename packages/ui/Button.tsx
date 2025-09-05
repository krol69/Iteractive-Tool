import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export const Button: React.FC<Props> = ({ variant='primary', className='', ...props }) => {
  const base = 'px-4 py-2 rounded-2xl font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles = variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    : 'bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-500';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

export default Button;
