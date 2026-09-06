import { Attachment } from './types';

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

export function getFileType(file: File): 'image' | 'video' | 'audio' | 'document' {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name)) {
    return 'image';
  }
  if (mime.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(name)) {
    return 'video';
  }
  if (mime.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac)$/i.test(name)) {
    return 'audio';
  }
  return 'document';
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

export function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a GIF or SVG, don't compress through canvas to preserve animation/vector
    if (file.type.includes('gif') || file.type.includes('svg')) {
      readFileAsDataUrl(file).then(resolve).catch(reject);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        readFileAsDataUrl(file).then(resolve).catch(reject);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, quality);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      readFileAsDataUrl(file).then(resolve).catch(reject);
    };
    img.src = url;
  });
}

export async function processUploadedFile(file: File): Promise<Attachment> {
  const type = getFileType(file);
  let url: string;

  if (type === 'image') {
    // Compress image if larger than 150KB, or read as data URL
    if (file.size > 150 * 1024) {
      url = await compressImage(file, 1200, 1200, 0.82);
    } else {
      url = await readFileAsDataUrl(file);
    }
  } else {
    // For other files, read directly
    url = await readFileAsDataUrl(file);
  }

  return {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name: file.name,
    url,
    type,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    formattedSize: formatFileSize(file.size),
  };
}

export function downloadAttachment(attachment: Attachment) {
  const a = document.createElement('a');
  a.href = attachment.url;
  a.download = attachment.name || `anexo_${attachment.id}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
