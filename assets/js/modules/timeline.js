/**
 * ==========================================================================
 * MÓDULO: Linha do Tempo Infinita (timeline.js)
 * Sincroniza em tempo real, lida com uploads em Base64 e auto-inicializa
 * o banco com as fotos e marcos originais do casal se estiver vazio [1, 2, 3].
 * ==========================================================================
 */

import { db } from '../firebase/config.js';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { openLightbox } from '../utils/lightbox.js';

const CASAL_DOC_ID = "pedro-gabriela"; // Identificador exclusivo do casal na nuvem
let timelineInterval; // Guarda o loop do temporizador de 10s
let currentTimelineIndex = 0; // Índice ativo da timeline
let selectedTimelineImageBase64 = ""; // Guarda o Base64 da foto do novo marco

/**
 * Escuta o documento do casal no Firestore em tempo real [2].
 * Auto-inicializa o banco de dados com as 5 fotos reais originais se estiver vazio [3].
 */
export function inicializarTimelineRealTime() {
    const docRef = doc(db, "casais", CASAL_DOC_ID);

    onSnapshot(docRef, async (docSnap) => {
        // Se o documento na nuvem ainda não existir, inicializa as 5 fotos reais de forma automática [3]
        if (!docSnap.exists()) {
            console.log("[Lumora] Inicializando banco de dados pela primeira vez...");
            const marcosIniciais = [
                { date: "1. O Primeiro Olhar (2023)", title: "O Começo de Tudo", desc: "O esbarrão na cafeteria e a conversa que mudou nossos destinos para sempre.", photo: "./../img/momentos/m1.jpg" },
                { date: "2. O Início do Namoro (2023)", title: "O Início do Namoro", desc: "Sob as luzes da cidade e o frio da noite, dissemos nosso primeiro eu te amo.", photo: "./../img/momentos/m2.jpg" },
                { date: "3. A Primeira Viagem (2024)", title: "A Primeira Viagem", desc: "Nossos pés na areia e a maravilhosa certeza de que o mundo é pequeno perto de nós.", photo: "./../img/momentos/m3.jpg" },
                { date: "4. O Noivado (2025)", title: "O Noivado", desc: "A decisão de dar o passo mais importante de nossas vidas.", photo: "./../img/momentos/m4.jpg" },
                { date: "5. O Casamento (2026)", title: "O Casamento", desc: "O dia em que nos tornamos um só perante Deus e todos que amamos.", photo: "./../img/momentos/m5.jpg" }
            ];
            const desejosIniciais = [
                { completed: true, text: "Ver o pôr do sol na praia 🌅" },
                { completed: false, text: "Fazer uma viagem internacional ✈️" },
                { completed: false, text: "Adotar um gatinho juntos 🐾" },
                { completed: false, text: "Aprender a cozinhar um prato difícil 🍝" }
            ];
            
            // setDoc com merge cria com segurança o documento em branco caso ele não exista [3]
            await setDoc(docRef, { linhaDoTempo: marcosIniciais, desejos: desejosIniciais }, { merge: true });
            return;
        }

        const data = docSnap.data();
        const momentos = data.linhaDoTempo || [];

        // Armazena no cache local temporário para a função de escrita consumir sem conflitos
        localStorage.setItem("lumora_timeline_cache", JSON.stringify(momentos));

        const wrapper = document.getElementById("timelineNodesWrapper");
        if (!wrapper) return;
        wrapper.innerHTML = ""; // Limpa a timeline física

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

        // Reinicia com segurança a animação deslizante adaptada ao novo tamanho
        if (timelineInterval) clearInterval(timelineInterval);
        currentTimelineIndex = 0;
        iniciarAnimacaoLinhaDoTempo(momentos.length);
    }, (error) => {
        alert("Não foi possível conectar. Verifique seu console do Firebase ou ative as Regras de Teste no Firestore Database.");
        console.error("Erro no Firestore:", error);
    });
}

/**
 * Orquestra o loop de 10 segundos da placa branca.
 */
function iniciarAnimacaoLinhaDoTempo(totalItens) {
    if (totalItens === 0) return;
    
    atualizarPosicaoCard(currentTimelineIndex);
    
    timelineInterval = setInterval(() => {
        const nosTimeline = document.querySelectorAll('#timelineNodesWrapper .timeline-node');
        if (nosTimeline.length === 0) return;

        currentTimelineIndex = (currentTimelineIndex + 1) % nosTimeline.length;
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
            if (bullet) bullet.className = "bullet active";
            if (label) label.classList.add("active");
            if (title) title.classList.add("active");
            if (desc) desc.classList.add("active");
        } else {
            if (bullet) bullet.className = "bullet";
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
 * Envia e anexa o novo marco de relacionamento ao array na nuvem do Firebase [2].
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
        
        // Puxa os momentos atuais armazenados no cache local seguro
        const momentosAtuais = JSON.parse(localStorage.getItem("lumora_timeline_cache")) || [];
        momentosAtuais.push(novoMarco);

        // setDoc com merge garante a escrita bem-sucedida mesmo sem documento existente [3]
        await setDoc(docRef, { linhaDoTempo: momentosAtuais }, { merge: true });

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
        alert("Erro ao enviar para o Firebase. Verifique se seu Firestore Database está ativo em modo de teste.");
    }
}