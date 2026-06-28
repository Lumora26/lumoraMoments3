/**
 * ==========================================================================
 * CONFIGURAÇÃO DO FIREBASE (config.js)
 * Centraliza e exporta a inicialização do Firebase e do banco Firestore.
 * ==========================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Credenciais oficiais obtidas diretamente no console do seu Firebase [3]
const firebaseConfig = {
  apiKey: "AIzaSyAKR-i0mngk6DImCTzv7YCE-ubgK7gMj4Y",
  authDomain: "lumoramoments1.firebaseapp.com",
  projectId: "lumoramoments1",
  storageBucket: "lumoramoments1.firebasestorage.app",
  messagingSenderId: "444655488382",
  appId: "1:444655488382:web:991fbad19330cde358b72f",
  measurementId: "G-EGRC5WNG4W"
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o banco de dados em tempo real Firestore e o exporta para os outros módulos
export const db = getFirestore(app);