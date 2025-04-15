import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CustomInput = forwardRef(({
  label = "Label",
  placeholder = "Enter value",
  type = "text",
  className = "",
  name = "",
  id = "",
  error = "",
  ...rest
}, ref) => {
  const getInputClasses = () => {
    const baseClasses = 'rounded border px-3 py-2 w-full focus:outline-none focus:ring-2';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';
    const textareaClasses = type === 'textarea' ? 'h-32 resize-none' : '';
    
    return `${baseClasses} ${errorClasses} ${textareaClasses} ${className}`;
  };

  return (
    <div className="mt-2">
      <label 
        htmlFor={id} 
        className="block text-sm font-semibold mb-1 text-gray-700"
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          ref={ref}
          className={getInputClasses()}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          ref={ref}
          className={getInputClasses()}
          {...rest}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

CustomInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
};

CustomInput.displayName = 'CustomInput';

export default CustomInput;
