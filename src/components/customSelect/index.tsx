import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-md flex justify-between items-center"
      >
        <span>
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
        </span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
