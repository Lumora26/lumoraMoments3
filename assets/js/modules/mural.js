/**
 * ==========================================================================
 * MÓDULO: Mural de Notas ao Vivo (mural.js)
 * Sincroniza em tempo real as fotos e reações sentimentais do casal [1, 2].
 * ==========================================================================
 */

import { db } from '../firebase/config.js';
import { collection, addDoc, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { openLightbox } from '../utils/lightbox.js';

let selectedImageBase64 = "";
const EVENTO_ID = "pedro-gabriela"; // Identificador exclusivo do casal

export function inicializarMuralRealTime() {
    const q = query(
        collection(db, "mensagens"),
        where("eventoId", "==", EVENTO_ID),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        const mural = document.getElementById("muralFeed");
        if (!mural) return;

        mural.innerHTML = "";

        snapshot.forEach((doc) => {
            const msg = doc.data();
            const docId = doc.id;
            let layoutFoto = "";

            if (msg.photo) {
                layoutFoto = `
                    <div class="mural-media" id="media-${docId}">
                        <img src="${msg.photo}" alt="Foto">
                    </div>
                `;
            }

            // Atribuição de Emojis para as reações estendidas românticas
            let emoji = "❤️";
            if (msg.relation === "Saudade") emoji = "🥺";
            if (msg.relation === "Gratidão") emoji = "✨";
            if (msg.relation === "Divertido") emoji = "😂";
            if (msg.relation === "Cumplicidade") emoji = "🤝";
            if (msg.relation === "Aventura") emoji = "✈️";
            if (msg.relation === "Romance") emoji = "🌹";

            mural.innerHTML += `
                <div class="mural-card">
                    <div class="mural-card-header">
                        <div class="mural-author-container">
                            <span class="mural-author">${msg.author}</span>
                            <span class="mural-relation-badge">${msg.relation} ${emoji}</span>
                        </div>
                        <span class="mural-time">Agora</span>
                    </div>
                    ${msg.text ? `<p class="mural-text">${msg.text}</p>` : ''}
                    ${layoutFoto}
                </div>
            `;

            if (msg.photo) {
                setTimeout(() => {
                    const imgEl = document.getElementById(`media-${docId}`);
                    if (imgEl) imgEl.onclick = () => openLightbox(msg.photo);
                }, 50);
            }
        });
    });
}

export function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImageBase64 = e.target.result;
            document.getElementById('image_preview').src = selectedImageBase64;
            document.getElementById('preview_container').classList.remove('hidden');
            document.getElementById('photo_placeholder').innerHTML = "<span>✓</span> Foto Carregada";
        };
        reader.readAsDataURL(file);
    }
}

export function removePreview() {
    selectedImageBase64 = "";
    document.getElementById('form_photo').value = "";
    document.getElementById('preview_container').classList.add('hidden');
    document.getElementById('photo_placeholder').innerHTML = "<span>📸</span> Tirar Foto ou Anexar";
}

export async function handleLiveSubmit(event) {
    event.preventDefault();

    const nome = document.getElementById('form_name').value;
    const relacao = document.getElementById('form_relation').value;
    const texto = document.getElementById('form_text').value;

    if (!texto.trim() && !selectedImageBase64) {
        alert("Por favor, digite um recadinho ou tire uma foto para anexar à nota!");
        return;
    }

    try {
        await addDoc(collection(db, "mensagens"), {
            eventoId: EVENTO_ID,
            author: nome,
            relation: relacao,
            text: texto,
            photo: selectedImageBase64,
            createdAt: new Date().toISOString()
        });

        document.getElementById('form_name').value = "";
        document.getElementById('form_text').value = "";
        removePreview();
        
        alert("Nota de amor fixada com sucesso! 💖");
    } catch (e) {
        console.error("Erro ao enviar mural no Firebase:", e);
        alert("Erro de conexão ao enviar.");
    }
}