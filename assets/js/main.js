/**
 * ==========================================================================
 * ORQUESTRADOR CENTRAL - main.js (Módulo Entrada)
 * Importa todas as subfunções lógicas e resolve o problema de escopo global.
 * ==========================================================================
 */

// Importações lógicas
import { inicializarTimelineRealTime, handleNewTimelineSubmit, previewTimelineImage, removeTimelinePreview } from './modules/timeline.js';
import { toggleModal, switchLetter, copyPixKey, printCertificate } from './modules/modal.js';
import { openLightbox, closeLightbox } from './utils/lightbox.js';
import { inicializarMuralRealTime, handleLiveSubmit, previewImage, removePreview } from './modules/mural.js';
import { iniciarContadorAmor } from './modules/timer.js';
import { inicializarBucketListRealTime, handleNewBucketSubmit } from './modules/bucket.js';
import { inicializarMapaAmor } from './modules/map.js';

// CONFIGURAÇÃO DO RELACIONAMENTO DO CASAL (DATA DO ANIVERSÁRIO)
const DATA_NAMORO = new Date("2023-06-12T20:00:00"); 

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa o contador de amor em tempo real no cabeçalho
    iniciarContadorAmor(DATA_NAMORO);

    // 2. Conecta ao Firebase e sincroniza a Linha de Tempo em tempo real [2]
    inicializarTimelineRealTime();

    // 3. Conecta ao Firebase e sincroniza o Mural de Homenagens ao Vivo em tempo real [2]
    inicializarMuralRealTime();

    // 4. Conecta ao Firebase e sincroniza a Lista de Desejos (Bucket List) em tempo real [2]
    inicializarBucketListRealTime();

    // 5. Inicializa o Mapa do Amor Leaflet [4]
    inicializarMapaAmor();
});

// Limitador de caracteres visual do formulário de novo marco da linha do tempo
window.updateCharCount = function(textarea) {
    const countLabel = document.getElementById("charCount");
    if (countLabel) {
        countLabel.innerText = `${textarea.value.length}/120`;
    }
};

// RESOLUÇÃO DE ESCOPO: Vincula os módulos à janela global "window" para os cliques do HTML funcionarem [1]
window.toggleModal = toggleModal;
window.switchLetter = switchLetter;
window.copyPixKey = copyPixKey;
window.printCertificate = printCertificate;
window.handleLiveSubmit = handleLiveSubmit;
window.previewImage = previewImage;
window.removePreview = removePreview;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.handleNewTimelineSubmit = handleNewTimelineSubmit;
window.previewTimelineImage = previewTimelineImage;
window.removeTimelinePreview = removeTimelinePreview;
window.handleNewBucketSubmit = handleNewBucketSubmit;