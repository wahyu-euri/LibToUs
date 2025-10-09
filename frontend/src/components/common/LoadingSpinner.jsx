import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner loading-spinner-${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner