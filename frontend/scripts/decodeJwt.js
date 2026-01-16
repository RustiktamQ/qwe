export default function decodeJwt(token) {
  try {
    const parts = token.split('.');
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const str = atob(b64);

    const decoded = decodeURIComponent(
      Array.prototype.map
        .call(
          str,
          (ch) => '%' + ('00' + ch.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    );
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}
