export default function showToast(msg, type = '') {
  const toastEl = document.createElement('div');
  toastEl.className = 'toast ' + type;
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.textContent = msg;

  document.body.appendChild(toastEl);

  void toastEl.offsetWidth;
  toastEl.classList.add('show');

  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 300);
  }, 2000);
}
