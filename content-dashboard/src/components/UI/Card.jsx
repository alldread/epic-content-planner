import React from 'react';

const Card = ({
  children,
  elevated = false,
  shadow = 'm',
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'card',
    elevated && 'card-elevated',
    `shadow-${shadow}`,
    onClick && 'clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;