export const UNSAFE_HEADERS = [
    'Accept-Charset', 'Accept-Encoding', 'Access-Control-Request-Headers',
    'Access-Control-Request-Method', 'Connection', 'Content-Length', 'Cookie',
    'Cookie2', 'Date', 'DNT', 'Expect', 'Host', 'Keep-Alive', 'Origin', 'Referer',
    'TE', 'Trailer',
    'Transfer-Encoding', 'Upgrade', 'Via', 'User-Agent',
];

export const getMethodColor = (method: string): string => {
  switch (method?.toUpperCase()) {
    case 'GET': return 'success';
    case 'POST': return 'warning';
    case 'PUT': return 'info';
    case 'DELETE': return 'danger';
    default: return 'secondary';
  }
};

export const formatTimestamp = (timestamp: Date): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export const formatJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    console.error("Invalid JSON for formatting:", e);
    return jsonString; // Return original string if invalid
  }
};