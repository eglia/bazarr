import { usePageSize } from "@/utilities/storage";
import { Skeleton, Table } from "@mantine/core";
import { ReactNode, useMemo } from "react";
import {
  HeaderGroup,
  Row,
  TableBodyProps,
  TableOptions,
  TableProps,
} from "react-table";

export interface BaseTableProps<T extends object> extends TableStyleProps<T> {
  // Table Options
  headers: HeaderGroup<T>[];
  rows: Row<T>[];
  headersRenderer?: (headers: HeaderGroup<T>[]) => JSX.Element[];
  rowRenderer?: (row: Row<T>) => Nullable<JSX.Element>;
  prepareRow: (row: Row<T>) => void;
  tableProps: TableProps;
  tableBodyProps: TableBodyProps;
}

export interface TableStyleProps<T extends object> {
  emptyText?: string;
  striped?: boolean;
  placeholder?: boolean;
  hideHeader?: boolean;
  headersRenderer?: (headers: HeaderGroup<T>[]) => JSX.Element[];
  rowRenderer?: (row: Row<T>) => Nullable<JSX.Element>;
}

interface ExtractResult<T extends object> {
  style: TableStyleProps<T>;
  options: TableOptions<T>;
}

export function useStyleAndOptions<T extends object>(
  props: TableStyleProps<T> & TableOptions<T>
): ExtractResult<T> {
  const {
    emptyText,
    striped,
    hideHeader,
    headersRenderer,
    rowRenderer,
    placeholder,
    ...options
  } = props;
  return {
    style: {
      emptyText,
      placeholder,
      striped,
      hideHeader,
      headersRenderer,
      rowRenderer,
    },
    options,
  };
}

function DefaultHeaderRenderer<T extends object>(
  headers: HeaderGroup<T>[]
): JSX.Element[] {
  return headers.map((col) => (
    <th {...col.getHeaderProps()}>{col.render("Header")}</th>
  ));
}

function DefaultRowRenderer<T extends object>(row: Row<T>): JSX.Element | null {
  return (
    <tr {...row.getRowProps()}>
      {row.cells.map((cell) => (
        <td className={cell.column.className} {...cell.getCellProps()}>
          {cell.render("Cell")}
        </td>
      ))}
    </tr>
  );
}

export default function BaseTable<T extends object>(props: BaseTableProps<T>) {
  const {
    emptyText,
    striped = true,
    placeholder = false,
    hideHeader,
    headers,
    rows,
    headersRenderer = DefaultHeaderRenderer,
    rowRenderer = DefaultRowRenderer,
    prepareRow,
    tableProps,
    tableBodyProps,
  } = props;

  const colCount = useMemo(() => {
    return headers.reduce(
      (prev, curr) => (curr.headers.length > prev ? curr.headers.length : prev),
      0
    );
  }, [headers]);

  const empty = rows.length === 0;

  const [pageSize] = usePageSize();

  let body: ReactNode;
  if (placeholder) {
    body = Array(pageSize)
      .fill(0)
      .map((_, i) => (
        <tr>
          <td colSpan={colCount}>
            <Skeleton height={24}></Skeleton>
          </td>
        </tr>
      ));
  } else if (empty && emptyText) {
    body = (
      <tr>
        <td colSpan={colCount} className="text-center">
          {emptyText}
        </td>
      </tr>
    );
  } else {
    body = rows.map((row) => {
      prepareRow(row);
      return rowRenderer(row);
    });
  }

  return (
    <Table striped={striped} {...tableProps}>
      <thead hidden={hideHeader}>
        {headers.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headersRenderer(headerGroup.headers)}
          </tr>
        ))}
      </thead>
      <tbody {...tableBodyProps}>{body}</tbody>
    </Table>
  );
}
