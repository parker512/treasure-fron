import { Label } from "../../../components/Form/Label";

interface SelectOption {
  id: number;
  name: string;
}

interface SelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  value: number | null;
  onChange: (value: number) => void;
}

export const GenreSelect: React.FC<SelectProps> = ({
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Оберіть варіант</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};
