document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    const timerText = document.querySelector('.timer-text');
    const countdownElement = document.getElementById('countdown');
    const progressElement = document.getElementById('progress');
    const downloadLink = document.getElementById('download-link');
    const errorMessage = document.getElementById('error-message');
    const loadingDots = document.querySelector('.loading-dots');
    const infoBox = document.querySelector('.info-box');

    // 1. Pega o nome do link diretamente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedLinkName = urlParams.get('link');

    // 2. Tenta carregar o links.json
    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                // Se a resposta não for OK, lança um erro para o bloco 'catch'
                throw new Error('Erro ao carregar o arquivo links.json.');
            }
            return response.json();
        })
        .then(links => {
            let finalUrl = links[requestedLinkName];

            // 3. Verifica se o nome do link foi especificado e se ele existe no JSON
            if (!requestedLinkName || !finalUrl) {
                showError("Erro: Nenhum link especificado ou encontrado. Por favor, use um link válido.");
                return;
            }

            let timeLeft = 15; // 15 segundos
            countdownElement.textContent = timeLeft;
            timerText.textContent = `Por favor, aguarde `;
            
            const countdown = setInterval(() => {
                timeLeft--;
                countdownElement.textContent = timeLeft;
                
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
                    timerText.style.display = 'none';
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Erro geral:', error);
            showError("Ocorreu um erro ao carregar os links.");
        });
        
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        titleElement.textContent = 'Ocorreu um erro';
        
        // Esconde elementos de carregamento
        if (loadingDots) loadingDots.style.display = 'none';
        if (infoBox) infoBox.style.display = 'none';
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) loadingContainer.style.display = 'none';
    }
});
