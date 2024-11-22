import React from 'react'

interface ButtonProps {
	label?: string
	className?: string
	type?: 'button' | 'submit' | undefined
	loading?: boolean
	disabled?: boolean
	onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  disabled = false,
  className = 'primary',
  label = 'default',
  loading = false,
  onClick
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`btn btn-${className} ${loading ? 'btn-loading' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="btn-text">{label}</span>
    </button>
  )
}

export default Button
