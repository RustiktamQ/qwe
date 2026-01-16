export default function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';

    const decoded = atob(b64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
