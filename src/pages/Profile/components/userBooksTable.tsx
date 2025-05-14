import { FC, useEffect } from "react";
import useBookStore from "../../../store/auth-books";
import { getTableItems, USER_BOOKS_TABLE_COLUMN } from "./constants";
import { Row } from "../../../@types/table";
import { Table } from "../../../components/Table/Table";
import { TableHeader } from "../../../components/Table/TableHeader";
import { TableBody } from "../../../components/Table/TableBody";

interface Props {
  id: string;
}

export const UserBooksTable: FC<Props> = ({ id }) => {
  const getAllBooksUserListing = useBookStore(
    (state) => state.getAllBooksUserListing
  );
  const userBooksListing = useBookStore((state) => state.userBooksListing);
  const books = userBooksListing?.listings;
  const items = getTableItems(books) as unknown as Row[];

  useEffect(() => {
    getAllBooksUserListing(id);
  }, [getAllBooksUserListing, id]);

  console.log(userBooksListing);

  return (
    <div>
      <Table>
        <TableHeader columns={USER_BOOKS_TABLE_COLUMN} />
        <TableBody items={items} columns={USER_BOOKS_TABLE_COLUMN} />
      </Table>
    </div>
  );
};
