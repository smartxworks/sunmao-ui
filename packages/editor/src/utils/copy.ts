export function copyToClipboard(text: string) {
  const textarea = document.createElement('textarea');

  textarea.textContent = text;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch (ex) {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
