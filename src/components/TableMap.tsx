import type { BookingTable } from '../types'

type TableMapProps = {
  tables: BookingTable[]
  selectedTableId: string
  onSelect: (tableId: string) => void
}

export function TableMap({ tables, selectedTableId, onSelect }: TableMapProps) {
  return (
    <div className="table-map" aria-label="Venue floor plan preview">
      {tables.map((table) => {
        const isSelected = table.id === selectedTableId

        return (
          <button
            key={table.id}
            type="button"
            className={`table-card ${isSelected ? 'selected' : ''}`}
            data-state={table.status}
            onClick={() => onSelect(table.id)}
          >
            <strong>{table.id}</strong>
            <span>{table.area}</span>
            <div className="table-meta">
              <small>{table.capacity}</small>
              <small>{table.fee}</small>
            </div>
            <div className="fake-club-label">Demo Club</div>
          </button>
        )
      })}
    </div>
  )
}
