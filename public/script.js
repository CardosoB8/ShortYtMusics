document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timer-text');
    const countdownElement = document.getElementById('countdown');
    const progressElement = document.getElementById('progress');
    const downloadLink = document.getElementById('download-link');
    const titleElement = document.getElementById('title');
    const errorMessage = document.getElementById('error-message');
    const loadingDots = document.querySelector('.loading-dots');
    const infoBox = document.querySelector('.info-box');

    // 1. Pega o nome do link da URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedLinkName = urlParams.get('link');

    // 2. Tenta carregar o links.json
    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo links.json.');
            }
            return response.json();
        })
        .then(links => {
            let finalUrl = links[requestedLinkName];

            // Adiciona o comportamento padrão (fallback)
            if (!requestedLinkName || !finalUrl) {
                showError("Erro: Nenhum link especificado ou encontrado. Por favor, use um link válido do canal.");
                return;
            }

            let timeLeft = 15; // 15 segundos
            countdownElement.textContent = timeLeft;
            timerText.textContent = `Por favor, aguarde ${timeLeft} segundos`;
            
            const countdown = setInterval(() => {
                timeLeft--;
                countdownElement.textContent = timeLeft;
                timerText.textContent = `Por favor, aguarde ${timeLeft} segundos`;
                
                // Atualiza a barra de progresso
                progressElement.style.width = ((15 - timeLeft) / 15 * 100) + '%';
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    titleElement.textContent = 'Seu download está pronto!';
                    downloadLink.href = finalUrl;
                    downloadLink.classList.add('show');
                    
                    // Esconde elementos de carregamento
                    loadingDots.style.display = 'none';
                    infoBox.style.display = 'none';
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Erro geral:', error);
            showError("Erro ao carregar os links.");
        });
        
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        titleElement.textContent = 'Ocorreu um erro';
        
        // Esconde elementos de carregamento
        if (loadingDots) loadingDots.style.display = 'none';
        if (infoBox) infoBox.style.display = 'none';
        if (countdownElement && countdownElement.parentElement) {
            countdownElement.parentElement.style.display = 'none';
        }
    }
});
