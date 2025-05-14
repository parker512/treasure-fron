import React, { FC } from "react";
import cn from "classnames";
import { Column, Row } from "../../@types/table";
import { TableCell } from "./TableCell";
import { getKeyValue } from "./constants";

interface Props {
  className?: string;
  rowData: Row;
  columns: Column[];
}

export const TableRow: FC<Props> = ({ className, rowData, columns }) => (
  <tr className={cn("text-center", className)}>
    {columns.map((column) => (
      <TableCell key={column.key}>{getKeyValue(rowData, column.key)}</TableCell>
    ))}
  </tr>
);
