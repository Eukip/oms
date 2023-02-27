import React from 'react'

const ErrorIndicator = () => (
    <div style={{height: '100vh', position: 'relative'}}>
        <div className="error-indicator">
            <span className="boom">BOOM!</span>
            <span>
    Что то пошло не так
      </span>
            <span>
        (Мы уже решаем эту проблему)
      </span>
        </div>
    </div>
)

export default ErrorIndicator