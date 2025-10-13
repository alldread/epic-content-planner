import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    small: 'btn-small',
    medium: '',
    large: 'btn-large'
  };

  const classes = [
    'button',
    variant,
    sizeClasses[size],
    disabled && 'disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;