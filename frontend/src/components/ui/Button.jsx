import React from 'react'

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  const sizeClass = `btn-${size}`
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading-spinner"></span>}
      {children}
    </button>
  )
}

export default Button