type CsvValue = string | number | boolean | null | undefined

function escapeCsvValue(value: CsvValue) {
  const normalized = value == null ? '' : String(value)

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }

  return normalized
}

export function downloadCsv(
  fileName: string,
  headers: string[],
  rows: CsvValue[][],
) {
  if (typeof window === 'undefined') {
    return
  }

  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')

  link.href = url
  link.download = fileName
  link.style.display = 'none'

  window.document.body.appendChild(link)
  link.click()
  window.document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}