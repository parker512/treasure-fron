import { ChevronDown } from "lucide-react";
import { FC, useState } from "react";

interface SortButtonProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const SortButton: React.FC<SortButtonProps> = ({
  options,
  onChange,
  defaultValue,
}) => {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none font-inter font-normal text-[19px] leading-[22.99px] tracking-normal text-center"
      >
        Сортувати за: {options.find((opt) => opt.value === selected)?.label}
        <ChevronDown className="ml-2 w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border shadow-md rounded-2xl z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
