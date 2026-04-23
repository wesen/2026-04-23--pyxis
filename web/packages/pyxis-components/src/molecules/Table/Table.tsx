import React from 'react';
export type Column<T> = { key: keyof T & string; label?: string; render?: (row: T) => React.ReactNode; width?: string };
export type TableProps<T> = { columns: Column<T>[]; rows: T[]; onRowClick?: (row: T) => void };
export function Table<T>({ columns, rows, onRowClick }: TableProps<T>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            {columns.map(col => <th key={col.key} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', width: col.width }}>{col.label ?? col.key}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} onClick={onRowClick ? () => onRowClick(row) : undefined} style={{ borderBottom: '1px solid var(--color-border-subtle)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background var(--duration-fast)' }}>
              {columns.map(col => <td key={col.key} style={{ padding: '10px 12px', color: 'var(--color-text-primary)' }}>{col.render ? col.render(row) : String(row[col.key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
