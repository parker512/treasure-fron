import { ReactNode } from "react";

export const TableCell: React.FC<{ children: ReactNode }> = ({ children }) => (
  <td className="!border-b-[1px]  border-[#1B1A1A1A] py-6 text-sm font-[300]">
    {children}
  </td>
);
