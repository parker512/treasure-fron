import React, { FC } from "react";

import { Column, Row } from "../../@types/table";
import { TableRow } from "./TableRow";

interface Props {
  rowClassname?: string;
  items: Row[];
  columns: Column[];
  emptyLabel?: string;
  isLoading?: boolean;
  refForInfinityScroll?: React.RefObject<HTMLDivElement>;
}

export const TableBody: FC<Props> = ({
  rowClassname,
  items,
  columns,
  emptyLabel = "No data available",
  isLoading,
  refForInfinityScroll,
}) => (
  <tbody>
    {isLoading ? (
      <tr>
        <td colSpan={columns.length}>
          Loadin...
          {/* <Loader className="pt-8" size={Sizes.XXL} /> */}
        </td>
      </tr>
    ) : items?.length > 0 ? (
      items.map((item) => (
        <TableRow
          className={rowClassname}
          key={item.id}
          rowData={item}
          columns={columns}
        />
      ))
    ) : (
      <tr>
        <td
          colSpan={columns.length}
          className="pt-8 text-center text-sm font-medium text-gray-regular"
        >
          {emptyLabel}
        </td>
      </tr>
    )}
    <tr>
      <td colSpan={columns.length}>
        <div ref={refForInfinityScroll} style={{ height: "1px" }} />
      </td>
    </tr>
  </tbody>
);
