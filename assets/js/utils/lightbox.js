/**
 * ==========================================================================
 * UTILITÁRIO: Visualizador de Imagens (Lightbox)
 * ==========================================================================
 */

export function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imgSrc;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
}