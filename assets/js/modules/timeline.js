/**
 * ==========================================================================
 * MÓDULO: Linha do Tempo Infinita (timeline.js)
 * Sincroniza em tempo real, lida com uploads em Base64 e controla
 * o card deslizante vertical de 10 segundos de forma automatizada [1, 2].
 * ==========================================================================
 */

import { db } from '../firebase/config.js';
import { doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { openLightbox } from '../utils/lightbox.js';

const CASAL_DOC_ID = "pedro-gabriela"; // Identificador exclusivo do casal na nuvem
let timelineInterval; // Armazena o intervalo da animação de 10 segundos
let currentTimelineIndex = 0; // Índice ativo da timeline
let selectedTimelineImageBase64 = ""; // Guarda a string Base64 da imagem selecionada

/**
 * Escuta o documento do casal no Firestore em tempo real [2].
 * Sempre que um marco novo é adicionado, reconstrói o HTML e reinicia o loop deslizante.
 */
export function inicializarTimelineRealTime() {
    const docRef = doc(db, "casais", CASAL_DOC_ID);

    onSnapshot(docRef, (docSnap) => {
        const wrapper = document.getElementById("timelineNodesWrapper");
        if (!wrapper || !docSnap.exists()) return;

        const data = docSnap.data();
        const momentos = data.linhaDoTempo || [];

        // Armazena no cache local temporário para a função de envio consumir de forma rápida
        localStorage.setItem("lumora_timeline_cache", JSON.stringify(momentos));

        wrapper.innerHTML = ""; // Limpa a timeline para evitar repetições

        momentos.forEach((moment, index) => {
            let layoutFoto = "";
            if (moment.photo) {
                layoutFoto = `
                    <div class="node-media" id="media-timeline-${index}">
                        <img src="${moment.photo}" class="node-img" alt="Foto do Marco">
                    </div>
                `;
            }

            wrapper.innerHTML += `
                <div id="item-${index}" class="timeline-node">
                    <div class="bullet"></div>
                    <div class="node-content">
                        <span class="label-text">${moment.date}</span>
                        <h4 class="node-title">${moment.title}</h4>
                        <p class="node-desc">${moment.desc}</p>
                        ${layoutFoto}
                    </div>
                </div>
            `;

            // Vincula dinamicamente a abertura do lightbox em tela cheia na foto do marco
            if (moment.photo) {
                setTimeout(() => {
                    const imgEl = document.getElementById(`media-timeline-${index}`);
                    if (imgEl) imgEl.onclick = () => openLightbox(moment.photo);
                }, 50);
            }
        });

        // Limpa e reinicia o temporizador de 10s ajustado ao novo tamanho do mural
        if (timelineInterval) clearInterval(timelineInterval);
        currentTimelineIndex = 0;
        iniciarAnimacaoLinhaDoTempo(momentos.length);
    }, (error) => {
        console.error("Erro ao escutar timeline do Firebase:", error);
    });
}

/**
 * Controla o temporizador de 10 segundos da placa branca.
 */
function iniciarAnimacaoLinhaDoTempo(totalItens) {
    if (totalItens === 0) return;
    
    atualizarPosicaoCard(currentTimelineIndex);
    
    timelineInterval = setInterval(() => {
        currentTimelineIndex = (currentTimelineIndex + 1) % totalItens;
        atualizarPosicaoCard(currentTimelineIndex);
    }, 10000);
}

function atualizarPosicaoCard(index) {
    const activeNode = document.getElementById(`item-${index}`);
    const slidingCard = document.getElementById('sliding-card');
    
    if (!activeNode || !slidingCard) return;

    // Medição física da altura e posição top do item ativo na tela
    const topPos = activeNode.offsetTop;
    const heightPos = activeNode.offsetHeight;

    slidingCard.style.top = `${topPos}px`;
    slidingCard.style.height = `${heightPos}px`;

    const nosTimeline = document.querySelectorAll('#timelineNodesWrapper .timeline-node');
    nosTimeline.forEach((node, i) => {
        const bullet = node.querySelector(".bullet");
        const label = node.querySelector(".label-text");
        const title = node.querySelector(".node-title");
        const desc = node.querySelector(".node-desc");

        if (i === index) {
            if (bullet) bullet.classList.add("active");
            if (label) label.classList.add("active");
            if (title) title.classList.add("active");
            if (desc) desc.classList.add("active");
        } else {
            if (bullet) bullet.classList.remove("active");
            if (label) label.classList.remove("active");
            if (title) title.classList.remove("active");
            if (desc) desc.classList.remove("active");
        }
    });
}

/**
 * Preview do uploader de foto do marco do casal
 */
export function previewTimelineImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedTimelineImageBase64 = e.target.result;
            document.getElementById('image_timeline_preview').src = selectedTimelineImageBase64;
            document.getElementById('preview_timeline_container').classList.remove('hidden');
            document.getElementById('photo_timeline_placeholder').innerHTML = "<span>✓</span> Foto Carregada";
        };
        reader.readAsDataURL(file);
    }
}

export function removeTimelinePreview() {
    selectedTimelineImageBase64 = "";
    document.getElementById('form_timeline_photo').value = "";
    document.getElementById('preview_timeline_container').classList.add('hidden');
    document.getElementById('photo_timeline_placeholder').innerHTML = "<span>📸</span> Tirar Foto ou Anexar";
}

/**
 * Envia e anexa o novo marco de relacionamento ao array na nuvem do Firebase [1, 2].
 */
export async function handleNewTimelineSubmit(event) {
    event.preventDefault();

    const date = document.getElementById("time_date").value;
    const title = document.getElementById("time_title").value;
    const desc = document.getElementById("time_desc").value;

    const novoMarco = {
        date,
        title,
        desc,
        photo: selectedTimelineImageBase64
    };

    try {
        const docRef = doc(db, "casais", CASAL_DOC_ID);
        
        // Puxa o array atual de marcos do cache local do onSnapshot
        const momentosAtuais = JSON.parse(localStorage.getItem("lumora_timeline_cache")) || [];
        momentosAtuais.push(novoMarco);

        // Gravação limpa e otimizada (Custo de Gravação = 1) [1]
        await updateDoc(docRef, {
            linhaDoTempo: momentosAtuais
        });

        // Limpa formulário
        document.getElementById("time_date").value = "";
        document.getElementById("time_title").value = "";
        document.getElementById("time_desc").value = "";
        document.getElementById("charCount").innerText = "0/120";
        removeTimelinePreview();
        
        // Fecha o modal
        window.toggleModal("addTimelineModal", false);
        alert("Novo marco de amor adicionado e sincronizado com sucesso! 💖");
    } catch (e) {
        console.error("Erro ao salvar timeline no Firebase:", e);
        alert("Não foi possível conectar. Verifique seu console do Firebase.");
    }
}