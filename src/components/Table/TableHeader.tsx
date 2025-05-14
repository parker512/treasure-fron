import { Column } from "../../@types/table";

interface Props {
  className?: string;
  columns: Column[];
}

export const TableHeader: React.FC<Props> = ({ className, columns }) => (
  <thead className={className}>
    <tr>
      {columns.map((column) => {
        return (
          <th
            key={column.key}
            onClick={() => column.key}
            className="cursor-pointer select-none px-4 pb-4 text-sm text-[#1B1A1A80] text-center !font-inter !font-normal !text-[14px] !leading-[150%] !tracking-normal !min-h-[250px]"
          >
            <div className="flex items-center justify-center gap-1 !w-full">
              <span className="whitespace-nowrap">{column.label}</span>
            </div>
          </th>
        );
      })}
    </tr>
  </thead>
);
