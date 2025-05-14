import React from "react";

export const TableColumn: React.FC<{ label: string }> = ({ label }) => {
  return <th>{label}</th>;
};
