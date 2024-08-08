/* eslint-disable indent */
import React from 'react';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  label: string;
  type?: 'button' | 'submit' | undefined
  className?: string,
  loading?: boolean,
  onClick?: () => void;
  props?: { [key: string]: string },
  backgroundColor?: { [key: string]: string },
  primary?: boolean
}

export const Button = ({
  type = 'submit',
  label,
  className = 'primary',
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`btn btn-${className} ${loading ? 'btn-loading' : ''}`}
      {...props}
    >
      <span className="btn-text">
        {label}
      </span>
    </button>
  );
};