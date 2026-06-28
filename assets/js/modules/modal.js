/**
 * ==========================================================================
 * MÓDULO: Modais, Votos do Casal, Certificado e Cópia Pix (modal.js) [1]
 * ==========================================================================
 */

export function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (show) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

export function switchLetter(idLetter) {
    document.querySelectorAll('.letter-text').forEach(el => el.classList.add('hidden'));
    
    for (let i = 1; i <= 2; i++) {
        const tab = document.getElementById(`tab-c${i}`);
        if (!tab) continue;
        
        if (i === idLetter) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    }

    document.getElementById(`letter-content-${idLetter}`).classList.remove('hidden');
}

export function copyPixKey() {
    const pixKeyText = document.getElementById("pixKeyValue").innerText;
    const btnCopy = document.getElementById("btnCopyPix");

    navigator.clipboard.writeText(pixKeyText).then(() => {
        btnCopy.innerText = "Copiado! ✓";
        btnCopy.style.backgroundColor = "#22c55e";

        setTimeout(() => {
            btnCopy.innerText = "Copiar Chave Pix";
            btnCopy.style.backgroundColor = "";
        }, 2500);
    }).catch(err => {
        console.error("Erro ao copiar Pix: ", err);
        alert("Chave Pix: " + pixKeyText);
    });
}

export function printCertificate() {
    window.print(); // Dispara o print nativo do navegador baseado no @media print [1]
}