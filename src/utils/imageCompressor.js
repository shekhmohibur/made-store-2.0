/**
 * Ultra-Lightweight Client-Side Image Compressor for Kaizer Commerce
 * Resizes large camera photos (3MB-10MB) down to 20KB-50KB using HTML5 Canvas.
 */

/**
 * Compresses an image file or blob to an ultra-lightweight web-optimized data URL.
 * @param {File|Blob|string} fileOrDataUrl - The image file, Blob, or existing Data URL
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} maxHeight - Maximum height in pixels (default: 800)
 * @param {number} quality - JPEG compression quality 0.1 to 1.0 (default: 0.65)
 * @returns {Promise<{ dataUrl: string, originalSizeKb: number, compressedSizeKb: number, ratio: number }>}
 */
export const compressImage = (fileOrDataUrl, maxWidth = 800, maxHeight = 800, quality = 0.65) => {
    return new Promise((resolve, reject) => {
        const originalSize = typeof fileOrDataUrl === 'object' && fileOrDataUrl.size ? fileOrDataUrl.size : 0;
        const originalSizeKb = Math.round(originalSize / 1024);

        const processImage = (src) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                let { width, height } = img;

                // Scale down keeping aspect ratio
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
                    resolve({
                        dataUrl: src,
                        originalSizeKb,
                        compressedSizeKb: originalSizeKb,
                        ratio: 0,
                    });
                    return;
                }

                // Render with smooth bicubic interpolation
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Export as compressed WebP or JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                const compressedSize = Math.round((dataUrl.length * 3) / 4); // Approximate base64 size in bytes
                const compressedSizeKb = Math.round(compressedSize / 1024);
                const ratio = originalSizeKb > 0 ? Math.max(0, Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100)) : 0;

                resolve({
                    dataUrl,
                    originalSizeKb: originalSizeKb || compressedSizeKb,
                    compressedSizeKb,
                    ratio,
                });
            };

            img.onerror = (err) => {
                console.warn('Canvas compression fallback due to error:', err);
                resolve({
                    dataUrl: src,
                    originalSizeKb: originalSizeKb || 50,
                    compressedSizeKb: originalSizeKb || 50,
                    ratio: 0,
                });
            };

            img.src = src;
        };

        if (typeof fileOrDataUrl === 'string') {
            processImage(fileOrDataUrl);
        } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    processImage(e.target.result);
                } else {
                    reject(new Error('Failed to read image file'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(fileOrDataUrl);
        } else {
            reject(new Error('Unsupported image input format'));
        }
    });
};
