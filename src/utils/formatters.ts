/**
 * Converts an array of objects to a CSV formatted string.
 * @param data Array of objects.
 * @returns A string in CSV format.
 */
export function arrayToCsv(data: Record<string, any>[]): string {
  if (!data || data.length === 0) {
    return "";
  }
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => JSON.stringify(obj[header])).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}
