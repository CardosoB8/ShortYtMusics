document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    const timerText = document.querySelector('.timer-text');
    const countdownElement = document.getElementById('countdown');
    const progressElement = document.getElementById('progress');
    const downloadLink = document.getElementById('download-link');
    const errorMessage = document.getElementById('error-message');
    const loadingDots = document.querySelector('.loading-dots');
    const infoBox = document.querySelector('.info-box');

    // Link fixo. Você precisa alterar esta linha para cada link que quiser compartilhar.
    const requestedLinkName = 'video_viral';

    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo links.json. Verifique a sua localização.');
            }
            return response.json();
        })
        .then(links => {
            const finalUrl = links[requestedLinkName];
            if (finalUrl) {
                let timeLeft = 15;
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
                        
                        // Esconde os elementos de carregamento
                        loadingDots.style.display = 'none';
                        infoBox.style.display = 'none';
                        timerText.style.display = 'none';
                    }
                }, 1000);
            } else {
                showError("Erro: Link não encontrado. Verifique se o nome no JSON está correto.");
            }
        })
        .catch(error => {
            console.error('Erro geral:', error);
            showError("Erro ao carregar os links.");
        });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        titleElement.textContent = 'Ocorreu um erro';
        
        // Esconde todos os elementos de carregamento e contagem
        if (loadingDots) loadingDots.style.display = 'none';
        if (infoBox) infoBox.style.display = 'none';
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) loadingContainer.style.display = 'none';
    }
});
