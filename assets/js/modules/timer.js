/**
 * ==========================================================================
 * MÓDULO: Contador do Amor (timer.js)
 * Atualiza o cronômetro do casal de segundo em segundo de forma exata.
 * ==========================================================================
 */

/**
 * Inicializa a contagem progressiva a partir da data de aniversário de namoro do casal.
 * @param {Date} dataInicio - Data do início do namoro (Pedro & Gabriela)
 */
export function iniciarContadorAmor(dataInicio) {
    function updateCounter() {
        const agora = new Date();
        let diff = agora - dataInicio;

        if (diff < 0) {
            document.querySelectorAll('.counter-number').forEach(el => el.innerText = "0");
            return;
        }

        // Cálculos precisos de tempo decorrido (Anos, meses, dias, horas, minutos e segundos)
        let anos = agora.getFullYear() - dataInicio.getFullYear();
        let meses = agora.getMonth() - dataInicio.getMonth();
        let dias = agora.getDate() - dataInicio.getDate();

        if (dias < 0) {
            meses--;
            const ultimoDiaMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
            dias += ultimoDiaMesAnterior;
        }

        if (meses < 0) {
            anos--;
            meses += 12;
        }

        let horas = agora.getHours() - dataInicio.getHours();
        let minutos = agora.getMinutes() - dataInicio.getMinutes();
        let segundos = agora.getSeconds() - dataInicio.getSeconds();

        if (segundos < 0) {
            minutos--;
            segundos += 60;
        }

        if (minutos < 0) {
            horas--;
            minutos += 60;
        }

        if (horas < 0) {
            dias--;
            horas += 24;
        }

        // Injeta os valores calculados diretamente no HTML do portal
        document.getElementById('years').innerText = anos;
        document.getElementById('months').innerText = meses;
        document.getElementById('days').innerText = dias;
        document.getElementById('hours').innerText = horas;
        document.getElementById('minutes').innerText = minutos;
        document.getElementById('seconds').innerText = segundos;
    }

    // Executa em loop contínuo a cada 1 segundo
    setInterval(updateCounter, 1000);
    updateCounter();
}