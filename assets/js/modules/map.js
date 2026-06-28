/**
 * ==========================================================================
 * MÓDULO: Mapa do Amor Interativo (map.js)
 * Renderiza o mapa Leaflet com pins personalizados do casal [4].
 * ==========================================================================
 */

export let loveMap; // Exporta a variável global do mapa para redimensionamento seguro

export function inicializarMapaAmor() {
    // Inicializa o mapa centralizado em São Paulo com zoom travado na rolagem de tela do celular
    loveMap = L.map('loveMap', {
        scrollWheelZoom: false 
    }).setView([-23.55052, -46.633308], 11);

    // Carrega a camada de mapa elegante e leve do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(loveMap);

    // Customiza o marcador clássico do mapa para um emoji de coração com sombra sutil [4]
    const heartIcon = L.divIcon({
        html: `<div style="font-size: 24px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.25));">❤️</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -10],
        className: 'custom-heart-marker'
    });

    // Coordenadas marcantes do casal com link direto para o Google Maps [4]
    const pontosAmor = [
        {
            coords: [-23.55052, -46.633308],
            popup: "<b>O Primeiro Olhar ☕</b><br>Cafeteria do Centro. Onde tudo começou.<br><a href='https://www.google.com/maps/search/?api=1&query=-23.55052,-46.633308' target='_blank' class='map-link'>📍 Ver no Google Maps</a>"
        },
        {
            coords: [-23.5714, -46.6437],
            popup: "<b>O Pedido de Namoro 💍</b><br>Parque do Ibirapuera. Nosso 'Sim' sob as estrelas.<br><a href='https://www.google.com/maps/search/?api=1&query=-23.5714,-46.6437' target='_blank' class='map-link'>📍 Ver no Google Maps</a>"
        },
        {
            coords: [-23.5855, -46.6786],
            popup: "<b>Nosso Restaurante Favorito 🍝</b><br>Onde comemoramos todas as datas especiais.<br><a href='https://www.google.com/maps/search/?api=1&query=-23.5855,-46.6786' target='_blank' class='map-link'>📍 Ver no Google Maps</a>"
        }
    ];

    // Desenha cada marcador no mapa
    pontosAmor.forEach(ponto => {
        L.marker(ponto.coords, { icon: heartIcon })
            .addTo(loveMap)
            .bindPopup(ponto.popup);
    });
}