function escapeCell(cell: string): string {
  if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: string[][]
): void {
  const headerLine = headers.map(escapeCell).join(",");
  const dataLines = rows.map((row) => row.map(escapeCell).join(","));
  const csv = "\uFEFF" + [headerLine, ...dataLines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
