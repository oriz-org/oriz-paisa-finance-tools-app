/**
 * FinSuite OS - QR Code Generator
 */
import { generateQRCode } from '@/services/utility';

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">📱 QR Code</h1>
      <p class="page-subtitle">Generate QR codes instantly</p>
    </header>
    <div class="calculator-layout">
      <div class="glass-card" style="padding: var(--space-6);" id="input-section">
        <h3 style="margin-bottom: var(--space-4);">Enter Content</h3>
        <div class="input-group mb-4">
          <label class="input-label" for="qr-text">Text or URL</label>
          <textarea class="input" id="qr-text" rows="4" placeholder="Enter text, URL, or any data...">https://fin.chirag127.in</textarea>
        </div>
        <button class="btn btn--primary" id="generate-btn" style="width: 100%;">Generate QR Code</button>
      </div>
      <div id="qr-result">
        <div class="glass-card" style="padding: var(--space-8); text-align: center;">
          <img id="qr-image" src="${generateQRCode('https://fin.chirag127.in', 256)}" alt="QR Code" style="max-width: 100%; border-radius: var(--radius-md);">
        </div>
        <button class="btn btn--secondary mt-4" id="download-btn" style="width: 100%;">⬇️ Download QR</button>
      </div>
    </div>
  `;

  const textInput = container.querySelector('#qr-text') as HTMLTextAreaElement;
  const generateBtn = container.querySelector('#generate-btn') as HTMLButtonElement;
  const qrImage = container.querySelector('#qr-image') as HTMLImageElement;
  const downloadBtn = container.querySelector('#download-btn') as HTMLButtonElement;

  function generate(): void {
    const text = textInput.value.trim();
    if (text) {
      qrImage.src = generateQRCode(text, 256);
    }
  }

  generateBtn.addEventListener('click', generate);
  textInput.addEventListener('keyup', generate);

  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = qrImage.src;
    link.download = 'qr-code.png';
    link.click();
  });

  return container;
}
