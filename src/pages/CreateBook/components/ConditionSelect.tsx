import { FC } from "react";
import { Label } from "../../../components/Form/Label";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  name: string;
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export const ConditionSelect: FC<Props> = ({
  name,
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-xl font-bold text-gray-700">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Оберіть варіант</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
