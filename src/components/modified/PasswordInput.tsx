import React, { useState } from "react";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";

interface PasswordInputProps {
  register: UseFormRegister<any>;
  name: string;
  errors?: FieldError | undefined;
  validationRules?: Record<string, any>;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  name,
  errors ,
  validationRules = {},
  placeholder = "Password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {/* Input Field */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...register(name, validationRules)}
        className={`border ${
          errors ? "border-red-500" : "border-gray-300"
        } p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 text-sm top-3 text-gray-600 hover:text-gray-800"
      >
        {showPassword ? "Hide" : "Show"}
      </button>

      {/* Error Message */}
      {errors && (
        <span className="text-red-500 text-sm">{errors?.message}</span>
      )}
    </div>
  );
};

export default PasswordInput;
