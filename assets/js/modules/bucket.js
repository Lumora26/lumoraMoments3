/**
 * ==========================================================================
 * MÓDULO: Lista de Desejos Sincronizada (bucket.js)
 * Sincroniza e gerencia a criação/exclusão de desejos do casal [1, 2].
 * ==========================================================================
 */

import { db } from '../firebase/config.js';
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const CASAL_DOC_ID = "pedro-gabriela"; // Identificador exclusivo do casal na nuvem

/**
 * Escuta as atualizações da Lista de Desejos em tempo real diretamente na nuvem [2].
 */
export function inicializarBucketListRealTime() {
    const docRef = doc(db, "casais", CASAL_DOC_ID);

    onSnapshot(docRef, (docSnap) => {
        if (!docSnap.exists()) return; // Ignora se o documento ainda estiver inicializando

        const data = docSnap.data();
        const desejos = data.desejos || [];

        // Armazena no cache local temporário para a função de escrita
        localStorage.setItem("lumora_love_desejos_cache", JSON.stringify(desejos));

        const container = document.getElementById("bucketListContainer");
        if (!container) return;
        container.innerHTML = ""; // Limpa a lista na tela

        desejos.forEach((item, index) => {
            container.innerHTML += `
                <div class="bucket-item ${item.completed ? 'completed' : ''}" id="bucket-item-${index}">
                    <div class="bucket-checkbox-wrapper">
                        <input type="checkbox" ${item.completed ? 'checked' : ''} class="bucket-checkbox" id="check-bucket-${index}">
                        <span class="bucket-text">${item.text}</span>
                    </div>
                    <button class="btn-delete-bucket" id="btn-delete-bucket-${index}">&times;</button>
                </div>
            `;
        });

        // Vincula dinamicamente as escutas de clique de marcar feito e deletar
        desejos.forEach((item, index) => {
            const checkbox = document.getElementById(`check-bucket-${index}`);
            const deleteBtn = document.getElementById(`btn-delete-bucket-${index}`);

            if (checkbox) {
                checkbox.onchange = () => toggleBucketItem(index, checkbox.checked, desejos);
            }
            if (deleteBtn) {
                deleteBtn.onclick = () => deleteBucketItem(index, desejos);
            }
        });
    });
}

/**
 * Salva a alteração de status do desejo na nuvem do Firebase [2].
 */
async function toggleBucketItem(index, completedStatus, desejosArray) {
    const docRef = doc(db, "casais", CASAL_DOC_ID);
    desejosArray[index].completed = completedStatus;

    try {
        await setDoc(docRef, { desejos: desejosArray }, { merge: true });
    } catch (e) {
        console.error("Erro ao atualizar desejo:", e);
    }
}

/**
 * Exclui de forma definitiva o desejo do array do casal na nuvem [2].
 */
async function deleteBucketItem(index, desejosArray) {
    if (!confirm("Tem certeza que deseja excluir esse sonho da lista?")) return;
    
    const docRef = doc(db, "casais", CASAL_DOC_ID);
    desejosArray.splice(index, 1); // Remove o item do array físico pelo índice

    try {
        await setDoc(docRef, { desejos: desejosArray }, { merge: true });
        alert("Desejo excluído com sucesso! ✨");
    } catch (e) {
        console.error("Erro ao deletar desejo:", e);
    }
}

/**
 * Cadastra e anexa um novo desejo ao array do casal na nuvem [2].
 */
export async function handleNewBucketSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("bucket_new_input");
    if (!input || !input.value.trim()) return;

    const novoDesejo = {
        completed: false,
        text: input.value.trim()
    };

    try {
        const docRef = doc(db, "casais", CASAL_DOC_ID);
        
        // Pega os desejos atuais diretamente do cache local do onSnapshot
        const itensAtuais = JSON.parse(localStorage.getItem("lumora_love_desejos_cache")) || [];
        itensAtuais.push(novoDesejo);

        await setDoc(docRef, { desejos: itensAtuais }, { merge: true });
        
        input.value = ""; // Limpa campo de entrada
        alert("Mais um sonho adicionado à nossa lista de desejos! ✈️💖");
    } catch (e) {
        console.error("Erro ao salvar desejo:", e);
    }
}